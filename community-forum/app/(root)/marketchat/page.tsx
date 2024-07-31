// app/chat/market/page.tsx
"use client";

import { chatMarketRequest } from '@/lib/actions/chat';
import { useState } from 'react';
import RecommendedProducts from '@/components/cards/RComponent';

const ChatPage = () => {
    const [message, setMessage] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [isView, setIsView] = useState(false);

    const extractProducts = (response: string) => {
        console.log(response);
        
        const productRegex = /(\d+)\.\s+\*\*(.*?)\*\*\s+-\s+\*\*Product Name:\*\*\s+(.*?)\s+-\s+\*\*Price:\*\*\s+₹(\d+\.\d+)\s+-\s+\*\*Rating:\*\*\s+([\d.]+|Not available)\s+-\s+\*\*Reviews:\*\*\s+(Not available|\d+)\s+-\s+!\[Image\]\((.*?)\)/g;
    
        setProducts([]);
    
        let match: RegExpExecArray | null;
        while ((match = productRegex.exec(response)) !== null) {
            const newProduct = {
                id: `product-${match[1]}`, 
                name: match[3], 
                price: parseFloat(match[4]),
                rating: match[5] === "Not available" ? 0 : parseFloat(match[5]), 
                reviews: match[6] === "Not available" ? 0 : parseInt(match[6]), 
                description: "No description available", 
                imagePath: match[7],
            };
            console.log(newProduct);
            setProducts(prevProducts => [...prevProducts, newProduct]);
        }
    };

    const handleSend = async () => {
        setLoading(true);
        try {
            setChatResponse("");
            const response = await chatMarketRequest(message);
            if (Array.isArray(response) && response.length > 0) {
                const chatHistory = response[0].chat_history;
                //@ts-ignore
                const aiResponses = chatHistory.filter(item => item.type === 'ai');
                const lastAIResponse = aiResponses.length > 0 ? aiResponses[aiResponses.length - 1] : null;
                if (lastAIResponse) {
                    extractProducts(lastAIResponse.content);
                    setChatResponse(lastAIResponse.content);
                    setIsView(true);
                } else {
                    setChatResponse("No AI response available.");
                }
            } else {
                setChatResponse("No data returned from the server.");
            }
            if (message.trim()) {
                setMessage('');
            }
        } catch (error) {
            console.error("Error occurred:", error); 
            setChatResponse("There is some problem, please try again later!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-2xl font-bold mb-4">Welcome to Our Chat Service!</h1>
            <div className={`mt-2 ${isView ? "fixed inset-0 bg-gray-800" : "w-80 md:w-96 bg-gray-800"} shadow-lg rounded-lg p-4 transition-transform transform duration-300 ease-in-out`}>
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Chat with Us!</h3>
                </div>
                <div className="mt-2">
                    <p>How can we help you today?</p>
                    <div className="h-48 overflow-y-auto border border-gray-700 text-gray-300 rounded p-2 mb-2">
                        {chatResponse}
                    </div>
                    <input 
                        type="text" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..." 
                        className="border border-gray-600 bg-gray-700 text-white rounded w-full p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        onClick={handleSend}
                        className="bg-blue-600 text-white rounded w-full mt-2 p-2 hover:bg-blue-500 transition"
                        disabled={loading} 
                    >
                        {loading ? "Loading..." : "Send"}
                    </button>
                    {(isView && !loading && chatResponse) && <RecommendedProducts products={products} />}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;