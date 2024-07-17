import { db } from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises"
import { downloadMetrics } from "@/actions/metrics";

export async function GET(req:NextRequest,{
    params :{downloadVerificationId}
}:{
    params:{
        downloadVerificationId:string
    }
}){
    const startTime = Date.now();
    const data = await db.downloadVerification.findUnique({
        where:{
            id:downloadVerificationId,
            expiresAt:{
                gt:new Date()
            } 
        },
        select:{
            product:{
                select:{
                    filePath:true,
                    name:true
                }
            }
        }
    })

    if(data == null) {
        return NextResponse.redirect(new URL("/marketplace/products/download/expired", req.url))
    }

    const {size} = await fs.stat(data.product.filePath)
    const file = await fs.readFile(data.product.filePath)
    const extension = data.product.filePath.split(".").pop()
    const endTime = Date.now();
    const duration = endTime - startTime;
    downloadMetrics(duration);
    return new NextResponse(file , {
        headers:{
            "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
            "Content-Length": size.toString(),
        }
    })
}