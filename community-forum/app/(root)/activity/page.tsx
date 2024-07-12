import { fetchUser ,getActivity } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) return redirect('/onboarding')
  
  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">
        Activity Page
      </h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          activity.map((act) => (
            <Link key={act._id} href={`/threads/${act.parentId}`}>
              <article className="activity-card flex items-center gap-2">
                <Image
                  src={act.author.image}
                  alt="profile photo"
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
                <p className="text-small-regular text-light-1">
                  <span className="mr-1 text-primary-500">
                    {act.author.name}
                  </span> replied to your thread
                </p>
              </article>
            </Link>
          ))
        ) : (
          <p className="text-base-regular text-light-3"> No Activities yet </p>
        )}
      </section>
    </section>
  )
}