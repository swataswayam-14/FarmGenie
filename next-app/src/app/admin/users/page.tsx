import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { db } from "@/app/db";

import { formatCurrency, formatNumber } from "@/app/lib/formatter";
import { PageHeader } from "../_components/PageHeader";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { DeleteDropdownItem } from "./_components/UserActions";


async function getUsers(){
    return await db.user.findMany({
        select:{
            id:true,
            email:true,
            orders:{
                select:{
                    pricePaidInCents:true
                }
            }
        },
        orderBy:{
            createdAt:"desc"
        }
    })
}

export default function UserPage() {
    return (
        <>
            <PageHeader>Customers</PageHeader>
            <UserTable/>
        </>
    )
}

async function UserTable(){
    const users = await getUsers()

    if(users.length === 0) return <p>No Customers found</p>

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(user => (
                    <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatNumber(user.orders.length)}</TableCell>
                        <TableCell>{formatCurrency(
                            user.orders.reduce((sum, o) => o.pricePaidInCents + sum , 0) / 100)}
                        </TableCell>
                        <TableCell className="text-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical/>
                                    <span className="sr-only">Actions</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DeleteDropdownItem id={user.id}/>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
