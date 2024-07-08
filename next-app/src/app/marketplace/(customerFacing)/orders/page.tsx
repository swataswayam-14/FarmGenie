"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Label } from "@/app/components/ui/label"
import { useFormStatus } from "react-dom"
export default function MyOrdersPage(){
    return (
        <form className="max-2-xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>My Orders</CardTitle>
                    <CardDescription>
                        Enter your email and we will email you your order history and download links
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <input type="email" required name="email" id="email" />
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton/>
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