import { db } from "@/app/db"
import { formatCurrency } from "@/app/lib/formatter"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KE as string)

export default async function SuccessPage({searchParams}:{searchParams:{payment_intent:string}}) {

    const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent)

    if(paymentIntent.metadata.productId == null) return notFound()

    const product = await db.product.findUnique({
        where:{
            id:paymentIntent.metadata.productId
        }
    })
    if(product == null) {
        return notFound()
    }
    const isSuccess = paymentIntent.status === "succeeded"

    return <div className="max-w-full w-full mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white">{isSuccess ?"Success!" : "Error!"}</h1>
    <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
            <Image className="object-cover" src={product.imagePath} fill alt={product.name}/>
        </div>
        <div>
            <div className="text-lg">
                {formatCurrency(product.priceInCents / 100)}
            </div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="line-clamp-3 text-muted-foreground">
                {product.description}
            </div>
            <button className="mt-4 p-2 rounded-lg bg-gray-200 text-black">{isSuccess? (<a href={`/marketplace/products/download/${await createDownloadVerification(product.id)}`}>Download</a>):(<Link href={`/marketplace/products/${product.id}/purchase`}>Try Again</Link>)}</button>
        </div>
    </div>
    </div>
}

async function createDownloadVerification(productId:string){
    return (await db.downloadVerification.create({
        data:{
            productId,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
        }
    })).id
}