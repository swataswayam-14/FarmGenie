"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { FarmIcon } from "./FarmIcon";

export function Appbar() {
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
        <Link href="/community/chat/" className="hover:underline" prefetch={false}>
          Chatbot
        </Link>
        <Link href="/community/" className="hover:underline" prefetch={false}>
          Community Forum
        </Link>
        <Link href="/marketplace/" className="hover:underline" prefetch={false}>
          Marketplace
        </Link>
        <Link href="/admin/" className="hover:underline" prefetch={false}>
          Admin Login
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/sign-in"><Button>Login</Button></Link>
      </div>
    </header>
  );
}