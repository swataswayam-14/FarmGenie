import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Page () {
    const user = await currentUser();

    if(!user) return null;
    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect('/onboarding')

    return <div>
        <h1 className="text-light-2 head-text">Create Thread</h1>
        <PostThread userId={userInfo._id}/>
    </div>
}