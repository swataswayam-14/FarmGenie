import { 
    Card, 
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription, 
} from "./ui/card";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "../lib/formatter";

type ProductCardProps = {
  id:string,
  name:string,
  priceInCents:number,
  description: string,
  imagePath:string
}

export function ProductCard({id, name , priceInCents, description, imagePath}:ProductCardProps){
  return(
    <Card className="flex overflow-hidden flex-col">
        <div className="relative w-full h-auto aspect-video">
            <Image src={imagePath} fill alt={name}/>
        </div>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="line-clamp-4">{description}</p>
        </CardContent>
        <CardFooter>
          <button className="w-full bg-gray-200 rounded-full p-2 text-black font-semibold">
            <Link href={`/products/${id}/purchase`}>Purchase</Link>
          </button>
        </CardFooter>
    </Card>
  )
}
