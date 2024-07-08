import { db } from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {Resend} from "resend"
import { formatCurrency } from "@/app/lib/formatter";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function POST(req: NextRequest) {
    const event = stripe.webhooks.constructEvent(
        await req.text(),
        req.headers.get("stripe-signature") as string,
        process.env.STRIPE_WEBHOOK_SECRET as string
    )

    if (event.type === "charge.succeeded") {
        const charge = event.data.object
        const productId = charge.metadata.productId
        const email = charge.billing_details.email
        const pricePaidInCents = charge.amount

        const product = await db.product.findUnique({
            where:{
                id:productId
            }
        })
        if (product == null || email == null) {
            return new NextResponse("Bad Request", {
                status:400
            })
        }
        const userFields = {
            email,
            orders:{
                create:{
                    productId,
                    pricePaidInCents
                }
            }
        }
        const {orders:[order]} = await db.user.upsert({
            where:{
                email
            },
            create:userFields,
            update:userFields,
            select:{
                orders:{
                    orderBy:{
                        createdAt:"desc"
                    },
                    take:1
                }
            }
        })
        const downloadVerification = await db.downloadVerification.create({
            data:{
                productId,
                expiresAt:new Date(Date.now() + 1000 * 60 * 60 * 24)
            }
        })

        await resend.emails.send({
            from:`Support <${process.env.SENDER_EMAIL}>`,
            to:email,
            subject:"Order Confirmation",
            react: (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <div className="flex justify-center mb-6">
                    <img src="https://example.com/logo.png" alt="Company Logo" className="h-12" />
                  </div>
                  <h1 className="text-2xl font-bold mb-4">Order Confirmation</h1>
                  <p className="mb-6">
                    Dear Customer,
                    <br />
                    Thank you for your recent order with us. We're excited to start processing your request and will keep you updated on the status of your order: {product.name}.
                  </p>
                  <div className="bg-gray-100 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-bold mb-2">{product.description}</h2>
                    <p className="mb-2">Order Number: {product.id}</p>
                    <p className="mb-2">Order Date: {Date.now().toString()}</p>
                    <p className="mb-2">Total: {formatCurrency(pricePaidInCents)}</p>
                  </div>
                  <p className="mb-6">
                    If you have any questions or concerns, please don't hesitate to contact our support team at <a href="mailto:support@farmgenie.com" className="text-blue-500 hover:underline">support@farmgenie.com</a>.
                  </p>
                  <p>Best regards,</p>
                  <p className="font-bold">The Farm Genie Team</p>
                </div>
            ),
        })

        return new NextResponse()
    }
}