"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number; 
  reviews: number; 
  description: string;
  imagePath: string;
}

interface RecommendedProductsProps {
  products: Product[];
}

export default function RecommendedProducts({ products }: RecommendedProductsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleModal} className="btn btn-primary text-black font-semibold">
        Show Recommended Products
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-4xl w-full h-full sm:h-auto overflow-hidden">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-black">Recommended Products</h2>
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <RProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    reviews={product.reviews}
                    description={product.description}
                    imagePath={product.imagePath}
                  />
                ))}
              </div>
            </div>
            <button onClick={toggleModal} className="mt-4 btn btn-secondary text-red-600 w-full">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function RProductCard({
  id,
  name,
  price,
  rating,
  reviews,
  description,
  imagePath,
}: Product) {
  return (
    <Card className="flex overflow-hidden flex-col shadow-md rounded-lg">
      <div className="relative w-full h-48 sm:h-56">
        <Image src={imagePath} fill alt={name} className="object-cover" />
      </div>
      <CardHeader className="p-2 bg-gray-100">
        <CardTitle className="text-sm sm:text-base font-bold text-green-600">{name}</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-900">
          {price} | Rating: {rating > 0 ? rating : 'N/A'} ({reviews > 0 ? reviews : 'N/A'} reviews)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-2">
        <p className="line-clamp-4 text-xs sm:text-sm text-gray-700">{description}</p>
      </CardContent>
      <CardFooter className="p-2 bg-gray-100">
        <button className="w-full bg-blue-500 hover:bg-blue-600 rounded-full p-2 text-white font-semibold text-sm">
          <Link href={`/marketplace/products/${id}/purchase`}>Purchase</Link>
        </button>
      </CardFooter>
    </Card>
  );
}