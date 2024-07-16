"use client"
import { PageHeader } from "../../_components/PageHeader";
import { ProductForm } from "../_components/ProductForm";

export default function NewProductPage(){
    return <div>
        <PageHeader> Add Product</PageHeader>
        <ProductForm/>
    </div>
}