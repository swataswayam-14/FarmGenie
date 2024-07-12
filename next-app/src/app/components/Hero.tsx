import Link from "next/link";
import Highlights from "./HighlightSection";
import Image from "next/image";

export function Hero() {
  return (
    <section className="bg-white dark:bg-gray-900 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to FarmGenie
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
            FarmGenie is a comprehensive online platform that connects farmers with an on-demand workforce, featuring a chatbot for agricultural questions, a community forum for knowledge sharing, and a marketplace for product comparison
            </p>
            <div className="flex gap-4 pt-16">
              <Link
                href="/chat/123"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-gray-900/90 focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus:ring-gray-300"
                prefetch={false}
              >
                Ask Our chatbot
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-gray-900/90 focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus:ring-gray-300"
                prefetch={false}
              >
                Visit the Marketplace
              </Link>
              <Link
                href="https://farmgenie-rho.vercel.app/"
                className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300"
                prefetch={false}
              >
                Join The Community
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="600" height="400" className="rounded-lg">
            <path d="M19 19H5V9L12 2L19 9V19ZM12 4.5L7 9V17H10V11H14V17H17V9L12 4.5Z" fill="#333333"/>
            <path d="M12 11V17H10V9L12 4.5V11Z" fill="#333333"/>
            <path d="M14 11V17H17V9L12 4.5V11H14Z" fill="#333333"/>
          </svg>
          </div>
        </div>
      </div>
      <Highlights/>
    </section>
  );
}
