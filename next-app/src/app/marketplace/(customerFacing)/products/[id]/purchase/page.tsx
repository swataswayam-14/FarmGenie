import { db } from "@/app/db"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import { CheckoutForm } from "./_components/CheckoutForm"
import { createPaymentMetrics } from "@/actions/metrics"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function PurchasePage({
    params :{id},
}:{
    params:{id:string}
}) {
   const startTime = Date.now();
   const product = await db.product.findUnique({
        where:{
            id 
        }
    }) 
    if(product == null) {
        return notFound()
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount:product.priceInCents,
        currency:"USD",
        metadata:{
            productId: product.id
        }
    })
    const EndTime = Date.now()
    const duration = EndTime - startTime
    createPaymentMetrics(duration)
    if(paymentIntent.client_secret == null) {
        throw Error("Stripe failed to create payment intent")
    }

    return <div>
        <CheckoutForm product={product} clientSecret={paymentIntent.client_secret}/>
    </div>
}