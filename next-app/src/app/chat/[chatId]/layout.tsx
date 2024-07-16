import { Appbar } from "@/app/components/AppBar"

export default function chatLayout ({
    children,
}:Readonly<{
    children: React.ReactNode
}>){
    return <div>
        <Appbar/>
        {children}
    </div>
}