"use client"


import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"

export default function Bottombar(){
    const pathname = usePathname();
    return (
        <section className="bg-dark-1">
            <div className="bottombar_container">
                {sidebarLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
                        >
                            <Image
                                src={link.imgURL}
                                alt={link.label}
                                width={24}
                                height={24}
                            />
                            <p className="text-light-1 max-sm:hidden text-subtle-medium">{link.label.split(/\s+/)[0]}</p>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}