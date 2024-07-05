import React from "react";
import { NavAdmin, NavAdminLink } from "../components/NavAdmin";

export const dynamic = "force-dynamic" //admin pages need not need to be cached (as we want to show them the most upto date information) and generally admin computers have a good internet connection

export default function AdminLayout ({
    children,
}:Readonly<{
    children: React.ReactNode
}>){
    return <div>
        <NavAdmin>
            <NavAdminLink href="/admin">Dashboard</NavAdminLink>
            <NavAdminLink href="/admin/products">Products</NavAdminLink>
            <NavAdminLink href="/admin/users">Customers</NavAdminLink>
            <NavAdminLink href="/admin/orders">Sales</NavAdminLink>
        </NavAdmin>
        <div className="container my-6">{children}</div>
    </div>
}