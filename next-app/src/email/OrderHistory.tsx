import {Body, Container, Head, Heading, Hr, Html, Preview, Tailwind} from "@react-email/components"
import { OrderInfomation } from "./components/OrderInformation"
import React from "react"

type OrderHistoryEmailProps = {
    orders:{
        id:string
        pricePaidInCents: number
        createdAt:Date
        downloadVerificationId: string
        product:{
            name: string,
            imagePath:string
            description:string  
        }
    }[]
}

OrderHistoryEmail.PreviewProps = {
    orders:[
        {
            id:crypto.randomUUID(),
            createdAt:new Date(),
            pricePaidInCents: 10000,
            downloadVerificationId:crypto.randomUUID(),
            product:{
                name: "Product name",
                imagePath:"/public/products/0a52dc66-a4fc-4b2c-941f-e48682e87aba-Screenshot (15669).png",
                description:"This is a demo description"
            },
        },
        {
            id:crypto.randomUUID(),
            createdAt:new Date(),
            pricePaidInCents: 29000,
            downloadVerificationId:crypto.randomUUID(),
            product:{
                name: "Product name 2",
                imagePath:"/public/products/0a52dc66-a4fc-4b2c-941f-e48682e87aba-Screenshot (15669).png",
                description:"This is a demo description 2"
            },
        }
    ]
} satisfies OrderHistoryEmailProps



export default function OrderHistoryEmail({orders}: OrderHistoryEmailProps) {
    return (
        <Html>
            <Preview>Order History & Downloads</Preview>
            <Tailwind>
                <Head/>
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <Heading>Order History</Heading>
                        {orders.map((order, index) => (
                            <React.Fragment key={order.id}>
                            <OrderInfomation
                                order={order}
                                product={order.product}
                                downloadVerificationId={order.downloadVerificationId}
                            />
                            {index < orders.length - 1 && <Hr/>}
                            </React.Fragment>
                        ))}
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}