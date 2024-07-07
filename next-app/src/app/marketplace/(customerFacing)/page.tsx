import { ProductCard } from "@/app/components/ProductCard"
import { db } from "@/app/db"
import { Product } from "@prisma/client"
import Link from "next/link"

async function getMostPopularProducts(){
    return db.product.findMany({
        where:{
            isAvailableForPurchase:true
        },
        orderBy:{
            orders:{
                _count:"desc"
            }
        },
        take:6
    })
}
async function getNewestProducts(){
    return db.product.findMany({
        where:{
            isAvailableForPurchase:true 
        },
        orderBy:{
            createdAt:"desc"
        },
        take:6
    })
}

export default function HomePage(){
    return <main className="space-y-12">
        <ProductGridSection title="Most Popular" productFetcher = {getMostPopularProducts}/>
        <ProductGridSection title="Newest" productFetcher = {getNewestProducts}/>
    </main>
}

type ProductGridSectionProps = {
    productFetcher : ()=> Promise<Product[]>
    title:string
}

async function ProductGridSection({productFetcher, title}:ProductGridSectionProps){
    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <h2 className="text-3xl font-bold">{title}</h2>
                <button><Link href="/products"><span>View All</span></Link></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(await productFetcher()).map(product => (
                    <ProductCard key={product.id} {...product}/>
                ))}
            </div>
        </div>
    )
}