"use client"

import { formatCurrency } from "@/app/lib/formatter";
import { useState } from "react";
import { addProduct } from "../../_actions/products";

export function ProductForm() {
    const [priceInCents, setPriceInCents] = useState<number>();
    return (
      <form action={addProduct} className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-8">
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
            />
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
            />
          </div>

          <div>
            <label htmlFor="file" className="text-gray-200 font-medium block mb-2">
              File
            </label>
            <input
              type="file"
              id="file"
              name="file"
              required
              className="bg-gray-700 text-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>

          <div>
            <label htmlFor="image" className="text-gray-200 font-medium block mb-2">
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              required
              className="bg-gray-700 text-gray-200 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
        <button type="submit" className="bg-black hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300">
            Save
        </button>
        </div>
      </form>
    );
  }