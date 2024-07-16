"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { FarmIcon } from "./FarmIcon";
import { ModeToggle } from "./ModeToggle";
export function Appbar() {
  const { data: session, status: sessionStatus } = useSession();
  const isLoading = sessionStatus === "loading";

  return (
    <header className="bg-gray-900 text-white px-4 md:px-6 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <FarmIcon className="h-6 w-6" />
        <span className="text-lg font-bold">FarmGenie</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className="hover:underline" prefetch={false}>
          Home
        </Link>
        <Link href="/chat/123/" className="hover:underline" prefetch={false}>
          Chatbot
        </Link>
        <Link href="https://farmgenie-rho.vercel.app/" className="hover:underline" prefetch={false}>
        Community Forum
        </Link>
        <Link href="/marketplace/" className="hover:underline" prefetch={false}>
        Marketplace
        </Link>
        <Link href="/admin/" className="hover:underline" prefetch={false}>
        Admin Login
        </Link>
      </nav>
      {!isLoading && session?.user && (
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button onClick={() => signOut()}>Logout</Button>
        </div>
      )}
      {!isLoading && !session?.user && (
        <div className="flex items-center gap-4">
        <ModeToggle />
        <Button onClick={() => signIn()}>Sign in</Button>
        </div>
      )}

      {isLoading && <div className="flex items-center gap-4"></div>}
    </header>
  );
}
