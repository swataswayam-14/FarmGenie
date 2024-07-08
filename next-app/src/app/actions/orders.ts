"use server"

import { db } from "../db"

export async function userOrderExists(email:string , productId:string) {
    return (await db.order.findFirst({
        where:{
            user:{
                email
            }
        },
        select:{
            id:true
        }
    }) != null)
}