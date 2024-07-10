// pages/index.js

import Link from 'next/link';
import React from 'react';

const Highlights = () => {
  return (
    <div className="bg-gray-900 p-8">
      <h2 className="text-2xl text-center mt-6 font-semibold mb-6">Highlights Section</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-200 p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2 text-black">Chatbot Feature</h3>
          <p className="text-black mb-4">
          The FarmGenie chatbot is your personal farming assistant - a friendly, AI-powered companion that's always available to answer your agricultural questions, provide expert advice, and help you overcome any farming challenges. With its deep knowledge base spanning soil, plant diseases, irrigation, and more, the chatbot can engage in real conversations, break down complex topics, and offer tailored solutions in multiple languages, empowering you to make informed decisions and improve your farming practices, just like having a knowledgeable farming expert in your pocket.
          </p>
          <button className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300">
          <Link href="/chat/123">Start Chatbot</Link>
          </button>
        </div>
        <div className="bg-gray-200 p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2  text-black">Community Forum</h3>
          <p className="text-black mb-4">
          The community forum is a vital part of the agritech solution, providing a platform for farmers to connect with their peers, share local knowledge, seek advice, and learn from each other's experiences. It fosters a supportive environment where farmers, especially beginners, can collectively discuss challenges, advocate for their needs, and build a network to succeed in their agricultural endeavors, complementing the conversational AI chatbot by allowing them to tap into the collective wisdom of their community.
          </p>
          <button className="mt-6 mb-1 inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300">
          <Link href="http://localhost:3000">Join Forum</Link>
          </button>
        </div>
        <div className="bg-gray-200 p-4 rounded shadow">
          <h3 className="text-lg font-medium mb-2  text-black">Marketplace</h3>
          <p className="text-black mb-4">
          The FarmGenie marketplace is a digital platform that connects farmers, buyers, and stakeholders in the agricultural value chain, leveraging technologies like blockchain, IoT, and data analytics to enhance transparency, traceability, and efficiency, while empowering smallholder farmers, improving food security, and driving sustainability in the farming sector by digitizing agricultural trade, providing real-time market information, facilitating secure transactions, offering value-added services, and cutting out intermediaries to ensure better prices for farmers.
          </p>
          <button className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300">
          <Link href="/marketplace">Visit Marketplace</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Highlights;
