"use server"

import { db } from "@/app/db";
import {z} from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";

const fileSchema = z.instanceof(File, {
    message:"Required"
}) 
const imageSchema = fileSchema.refine(
    file => file.size === 0 || file.type.startsWith("image/")
)

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    file: fileSchema.refine(file => file.size > 0, "Required"),
    image: imageSchema.refine(file => file.size > 0, "Required")
})

export async function addProduct(formData: FormData) {
    const result = formSchema.safeParse(Object.fromEntries(formData.entries()))
    if(result.success === false){
        return result.error.formErrors.fieldErrors
    }
    const data = result.data;

    await fs.mkdir("products", {recursive:true});
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

    await fs.mkdir("public/products", {recursive:true});
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));


    try {
        const product = await db.product.create({
            data:{
                name: data.name,
                description:data.description,
                priceInCents:data.priceInCents,
                filePath,
                imagePath
            }
        })
        redirect("/admin/products")
    } catch (error) {
        console.log(error);
    }
    
}