"use client";
import dynamic from 'next/dynamic';

const SwaggerComponent = dynamic(() => import('../components/SwaggerUI'), { ssr: false });

export default function SwaggerPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto max-w-6xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h1>
        <p className="text-gray-700 mb-6">
          Welcome to the API documentation. Explore the available endpoints and their specifications below.
        </p>
        <div className="prose lg:prose-xl">
          <SwaggerComponent />
        </div>
      </div>
    </div>
  );
}
