"use client"

import { formatCurrency } from "@/app/lib/formatter";
import { useState } from "react";
import { addProduct, updateProduct } from "../../_actions/products";
import { useFormState, useFormStatus } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

export function ProductForm({product}: {product?:Product | null}) {
    const [error , action] = useFormState(product == null ? addProduct: updateProduct.bind(null, product.id), {})
    const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents);
    return (
      <form action={action} className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="text-gray-200 font-medium block mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="bg-gray-700 text-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={product?.name}
            />
            {error?.name && <div className="text-destructive text-red-600">{error.name}</div>}
          </div>
          <div>
            <label htmlFor="priceInCents" className="text-gray-200 font-medium block mb-2">
              Price In Cents
            </label>
            <input
              type="text"
              id="priceInCents"
              name="priceInCents"
              required
              className="bg-gray-700 text-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={priceInCents}
              onChange={(e)=>{
                setPriceInCents(Number(e.target.value) || undefined)
              }}
            />
            {error?.priceInCents && <div className="text-destructive text-red-600">{error.priceInCents}</div>}
          </div>
          <div className="text-muted-foreground">
              {formatCurrency((priceInCents || 0 )/ 100)}
          </div>

          <div>
            <label htmlFor="description" className="text-gray-200 font-medium block mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              className="bg-gray-700 text-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              defaultValue={product?.description}
            />
            {error?.description && <div className="text-destructive text-red-600">{error.description}</div>}
          </div>

          <div>
            <label htmlFor="file" className="text-gray-200 font-medium block mb-2">
              File
            </label>
            <input
              type="file"
              id="file"
              name="file"
              required = {product == null}
              className="bg-gray-700 text-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {product != null && (<div className="text-muted-foreground">{product.filePath}</div>)}
            {error?.file && <div className="text-destructive text-red-600">{error.file}</div>}
          </div>

          <div>
            <label htmlFor="image" className="text-gray-200 font-medium block mb-2">
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              required = {product == null}
              className="bg-gray-700 text-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            {product != null && (
              <Image
                src={product.imagePath}
                height="400"
                width="400"
                alt="Product Image"
              />
            )}
             {error?.image && <div className="text-destructive text-red-600">{error.image}</div>}
          </div>
        <SubmitButton/>
        </div>
      </form>
    );
  }

  function SubmitButton(){
    const {pending} = useFormStatus();
    return <button className="bg-black hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300" type="submit" disabled={pending}>{pending ? "Saving...": "Save"}</button>
  }