"use client"
import { useTransition } from "react";
import { deleteUser } from "../../_actions/users";
import { useRouter } from "next/navigation";

export function DeleteDropdownItem({
    id
}:{
    id:string
}) {
    const [isPending , startTransition] = useTransition()
    const router = useRouter()
    
    return <button className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-2" disabled={isPending} onClick={()=>{
        startTransition(async()=>{
            await deleteUser(id)
            router.refresh()
        })

    }}>Delete</button>
}