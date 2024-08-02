import { ThreadCard } from "@/components/cards/ThreadCard";
import { Button } from "@/components/ui/button";
import { fetchPosts } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {

  const result = await fetchPosts(1,30);
  const user = await currentUser()

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <Link href="http://64.227.135.219:3000/">
          <Button className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold mt-2 py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
              FarmGenie Official
          </Button>
      </Link>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (<p className="no-result">No Threads found</p>):(
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>      
  );
}
