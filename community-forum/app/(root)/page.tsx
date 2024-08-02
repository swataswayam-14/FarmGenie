import ChatPopup from "@/components/cards/MarketChat";
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
      {/* <Link href="/chat"><Button className="bg-dark-4 mr-2 mt-2 p-2 hover:bg-slate-700">Chat with farmgenie chatbot</Button></Link>
      <Link href="/marketchat"><Button className="bg-dark-4 ml-2 mt-2 p-2 hover:bg-slate-700">Chat with Marketbot</Button></Link> */}

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
