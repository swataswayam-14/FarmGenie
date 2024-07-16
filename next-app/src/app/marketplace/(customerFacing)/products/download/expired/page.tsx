import Link from "next/link";

export default function Expired() {
    return <>
        <h1 className="text-4xl mb-4">Download link expired</h1>
        <button className="p-3 bg-white rounded-md text-black">
            <Link href={"/marketplace/orders"}>Get New Link</Link>
        </button>
    </>
}