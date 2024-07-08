"use client"

import {loadStripe} from "@stripe/stripe-js"
import {Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js"
import Image from "next/image"
import { formatCurrency } from "@/app/lib/formatter"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { FormEvent, useState } from "react"
import { userOrderExists } from "@/app/actions/orders"

type CheckoutFormProps = {
    product: {
        imagePath:string
        name:string
        priceInCents: number 
        description: string
        id:string
    }
    clientSecret: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)

export function CheckoutForm ({product , clientSecret}: CheckoutFormProps) {

    return <div className="max-w-full w-full mx-auto space-y-8">
        <div className="flex gap-4 items-center">
            <div className="aspect-video flex-shrink-0 w-1/3 relative">
                <Image className="object-cover" src={product.imagePath} fill alt={product.name}/>
            </div>
            <div>
                <div className="text-lg">
                    {formatCurrency(product.priceInCents / 100)}
                </div>
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <div className="line-clamp-3 text-muted-foreground">
                    {product.description}
                </div>
            </div>
        </div>
    <Elements
    options={{
      clientSecret,
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary: '#7c3aed',
          colorBackground: '#1a1a1a',
          colorText: '#ffffff',
          colorDanger: '#ff6b6b',
          fontFamily: 'Poppins, sans-serif',
        },
        rules: {
          '.Label': {
            color: '#a0a0a0',
          },
          '.Input': {
            backgroundColor: '#2a2a2a',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
          '.Button': {
            backgroundColor: '#7c3aed',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: 'bold',
          },
        },
      },
    }}
    stripe={stripePromise}
  >
    <Form priceInCents={product.priceInCents} productId={product.id}/>
  </Elements>
  </div>
}

function Form({priceInCents, productId}:{priceInCents: number, productId:string}) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage , setErrorMessage] = useState<string | undefined>("")
    const [email , setEmail] = useState<string>()


    async function handleSubmit(e:FormEvent) {
        e.preventDefault()
    
        if (stripe == null || elements == null || email == null) return

        const orderExists = await userOrderExists(email, productId)

        if(orderExists) {
            setErrorMessage("You have already purchased this product. Try downloading the description from the My Orders page , your order will be shipped soon!!")
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        stripe.confirmPayment({elements, confirmParams:{
            return_url:`${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`
        }}).then(({error}) => {
            if(error.type === "card_error" || error.type === "validation_error") {
                setErrorMessage(error.message)
            }else {
                setErrorMessage("An Unexpected error occurred")
            }
        }).finally(()=>{
            setIsLoading(false)
        })
    }
    

    return <form onSubmit={handleSubmit}>
        <Card>
            <CardHeader>
                <CardTitle>Checkout</CardTitle>
                {errorMessage && (<CardDescription className="text-destructive text-red-400">{errorMessage}</CardDescription>)}
            </CardHeader>
            <CardContent>
                <PaymentElement/>
                <div className="mt-4">
                    <LinkAuthenticationElement onChange={(e)=>{
                        setEmail(e.value.email)
                    }}/>
                </div>
            </CardContent>
            <CardFooter>
            <button disabled={stripe == null || elements == null || isLoading} className="w-full p-2 rounded-lg bg-gray-200 text-black">
            {isLoading ? "Processing..." : `Purchase - ${formatCurrency(priceInCents/100)}`}
            </button>
            </CardFooter>
        </Card>
    </form>
}