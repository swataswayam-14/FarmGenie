import {Body, Container, Head, Html, Preview, Tailwind} from "@react-email/components"
import { OrderInfomation } from "./components/OrderInformation"

type PurchaseReceiptEmailProps = {
    product:{
        name: string,
        imagePath:string
        description:string  
    },
    order: {id:string, createdAt: Date, pricePaidInCents: number},
    downloadVerificationId: string
}

PurchaseReceiptEmail.PreviewProps = {
    product:{
        name: "Product name",
        imagePath:"/public/products/0a52dc66-a4fc-4b2c-941f-e48682e87aba-Screenshot (15669).png",
        description:"This is a demo description"
    },
    order:{
        id:crypto.randomUUID(),
        createdAt:new Date(),
        pricePaidInCents: 10000
    },
    downloadVerificationId: crypto.randomUUID(),
} satisfies PurchaseReceiptEmailProps



export default function PurchaseReceiptEmail({product, order,downloadVerificationId}: PurchaseReceiptEmailProps) {
    return (
        <Html>
            <Preview>Download {product.name} and view receipt</Preview>
            <Tailwind>
                <Head/>
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <OrderInfomation order={order} product={product} downloadVerificationId={downloadVerificationId}/>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}