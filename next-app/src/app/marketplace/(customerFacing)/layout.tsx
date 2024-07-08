import React from "react";
import { NavAdmin, NavAdminLink } from "@/app/components/NavAdmin";

export default function Layout ({
    children,
}:Readonly<{
    children: React.ReactNode
}>){
    return <div>
        <NavAdmin>
            <NavAdminLink href="/">Home</NavAdminLink>
            <NavAdminLink href="/products">Products</NavAdminLink>
            <NavAdminLink href="/orders">My Orders</NavAdminLink>
        </NavAdmin>
        <div className="container my-6">{children}</div>
    </div>
}