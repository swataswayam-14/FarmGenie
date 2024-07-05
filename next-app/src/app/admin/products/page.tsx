import { Button } from "@/app/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { Table, TableHead, TableHeader, TableRow } from "@/app/components/Table";


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

function ProductsTable(){
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <span className="sr-only">Available For purchase</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
        </Table>
    )
}