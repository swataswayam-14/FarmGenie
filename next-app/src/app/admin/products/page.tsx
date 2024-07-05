import { Button } from "@/app/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";


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

function ProductsTable() {
    const data = [
      { available: true, name: 'Product 1', price: '$9.99', orders: 50 },
      { available: false, name: 'Product 2', price: '$14.99', orders: 25 },
      { available: true, name: 'Product 3', price: '$19.99', orders: 75 },
      { available: true, name: 'Product 4', price: '$24.99', orders: 100 },
    ];
  
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
            {data.map((product, index) => (
              <tr
                key={index}
                className={`border-b ${
                  index % 2 === 0 ? 'bg-gray-100 text-gray-800' : 'bg-white text-black'
                }`}
              >
                <td className="px-4 py-2">
                  {product.available ? (
                    <span className="text-green-500">Yes</span>
                  ) : (
                    <span className="text-red-500">No</span>
                  )}
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.price}</td>
                <td className="px-4 py-2">{product.orders}</td>
                <td className="px-4 py-2">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }