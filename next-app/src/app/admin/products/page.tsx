import { Button } from "@/app/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { db } from "@/app/db";
import { formatCurrency, formatNumber } from "@/app/lib/formatter";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductAction";


export default function AdminProductPage(){
    return <div><div className="flex justify-between items-center gap-4">
        <PageHeader>
            Products
        </PageHeader>
        <Button>
        <Link
            href="/admin/products/new"
            className="bg-gray-500 p-2 rounded-xl"
            >
            Add Product
        </Link>
        </Button>
    </div>
    <ProductsTable/>
    </div>

}

async function ProductsTable() {
    const products = await db.product.findMany({
      select:{
        id:true,
        name:true,
        priceInCents:true,
        isAvailableForPurchase:true,
        _count:{select:{orders:true}}
      },
      orderBy:{
        name:"asc"
      }
    })
    if(products.length === 0) return <p>No products found</p>
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-black bg-gray-200">
              <th className="px-4 py-2 text-left">Available</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Orders</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index % 2 === 0 ? 'bg-gray-100 text-gray-800' : 'bg-white text-black'
                }`}
              >
                <td className="px-4 py-2">
                  {product.isAvailableForPurchase ? (
                    <span className="text-green-500">Yes</span>
                  ) : (
                    <span className="text-red-500">No</span>
                  )}
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{formatCurrency(product.priceInCents)}</td>
                <td className="px-4 py-2">{formatNumber(product._count.orders)}</td>
                <td className="px-4 py-2">
                  <button className="bg-gray-500 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-2">
                    <a download href={`/admin/products/${product.id}/download`}>Download</a>
                  </button>
                  <ActiveToggleDropdownItem
                    id={product.id}
                    isAvailableForPurchase={product.isAvailableForPurchase}
                  />
                  <DeleteDropdownItem
                    id={product.id}
                    disabled={product._count.orders > 0}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }