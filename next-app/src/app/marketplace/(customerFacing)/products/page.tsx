import { getProductsMetrics } from "@/actions/metrics";
import { ProductCard, ProductCardSkeleton } from "@/app/components/ProductCard";
import { db } from "@/app/db";
import { cache } from "@/app/lib/cache";
import { Suspense } from "react";
import ChatPopup from "../../__components/MarketChat";

const getProducts = cache(async()=> {
    const startTime = Date.now();
    const products = await db.product.findMany({
      where: {
        isAvailableForPurchase: true,
      },
      orderBy:{
          name:"asc"
      }
    });
    const endTime = Date.now()
    const duration = endTime - startTime
    getProductsMetrics(duration)
  return products
},["/marketplace/products","getProducts"])

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        }
      >
        <ProductsSuspense />
      </Suspense>
    </div>
  );
}

const ProductsSuspense = async () => {
  const products = await getProducts();

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
      <ChatPopup/>
    </>
  );
};