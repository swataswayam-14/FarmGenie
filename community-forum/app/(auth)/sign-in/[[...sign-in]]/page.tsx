"use client"
import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from 'react';

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <SignIn />
      </div>
    </div>
  ) : null;
}