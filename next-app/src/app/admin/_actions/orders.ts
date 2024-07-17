"use server"

import { adminDeleteProductMetrics } from "@/actions/metrics"
import { db } from "@/app/db"
import { notFound } from "next/navigation"

export async function deleteOrder(id:string) {
    const startTime = Date.now()
    const order = await db.order.delete({
        where:{
            id 
        }
    })
    const endTime = Date.now();
    const duration = endTime - startTime;
    adminDeleteProductMetrics(duration);
    if(order == null) return notFound()
    return order
}