//@ts-nocheck

"use client"
import { emailOrderHistory } from "@/actions/orders"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Label } from "@/app/components/ui/label"
import { useFormState, useFormStatus } from "react-dom"
export default function MyOrdersPage(){

    const [data , action] = useFormState(emailOrderHistory, {})

    return (
        <form action={action} className="max-2-xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>
                        Enter your email and we will email you your order history and download links
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xl">Email</Label>
                        <input type="email" className="p-2 rounded-md ml-2 bg-gray-700" required name="email" id="email" />
                        {data.error && <div className="text-red-400">{data.error}</div>}
                    </div>
                </CardContent>
                <CardFooter>
                    {data.message ? <p>{data.message}</p> :  <SubmitButton/> }
                </CardFooter>
            </Card>
        </form>
    )
} 

function SubmitButton(){
    const {pending} = useFormStatus()

    return <button className="bg-white border-b-2 w-full border-gray-400 text-black p-3 rounded-md" disabled={pending} type="submit">
        {pending ? "Sending...": "Send"}
    </button>
}