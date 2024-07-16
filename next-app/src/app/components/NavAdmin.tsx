import Link from "next/link";
import React, { ComponentProps } from "react";

export function NavAdmin({children}: {children: React.ReactNode}){
    return <nav className="bg-primary text-primary-foreground flex justify-center px-4">{children}</nav>
}

export function NavAdminLink(props: Omit<ComponentProps<typeof Link>, "className">){
    return <Link {...props} className="p-4"/>
}