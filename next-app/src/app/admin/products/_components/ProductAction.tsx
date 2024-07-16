"use client"
import { useTransition } from "react";
import { deleteProduct, toggleProductAvailability } from "../../_actions/products";
import { useRouter } from "next/navigation";

export function ActiveToggleDropdownItem({
    id,
    isAvailableForPurchase,
}:{
    id:string,
    isAvailableForPurchase: boolean
}) {
    const [isPending , startTransition] = useTransition()
    const router = useRouter()
    return <button className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-2" disabled={isPending} onClick={()=>{
        startTransition(async()=>{
            await toggleProductAvailability(id , !isAvailableForPurchase)
            router.refresh()
        })
    }}>{isAvailableForPurchase? "Deactivate": "Activate"}</button>
}

export function DeleteDropdownItem({
    id,
    disabled,
}:{
    id:string,
    disabled: boolean
}) {
    const [isPending , startTransition] = useTransition()
    const router = useRouter()
    
    return <button className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-2" disabled={disabled || isPending} onClick={()=>{
        startTransition(async()=>{
            await deleteProduct(id)
            router.refresh()
        })

    }}>Delete</button>
}