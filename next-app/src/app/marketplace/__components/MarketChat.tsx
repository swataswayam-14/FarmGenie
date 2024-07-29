"use client"
import { chatMarketRequest, logError } from '@/app/actions/chat';
import { useState } from 'react';

const ChatPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatResponse, setchatResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSend = async () => {
        setLoading(true);
        try {
            setchatResponse("");
            const response = await chatMarketRequest(message);
            if (Array.isArray(response) && response.length > 0) {
                const chatHistory = response[0].chat_history;
                const lastAIResponse = chatHistory.find(item => item.type === 'ai');
                if (lastAIResponse) {
                    setchatResponse(lastAIResponse.content);
                } else {
                    setchatResponse("No AI response available.");
                }
            } else {
                setchatResponse("No data returned from the server.");
            }
            if (message.trim()) {
                setMessage('');
            }
            setLoading(false);
        } catch (error) {
            setchatResponse("There is some problem, please try again later!");
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button 
                onClick={toggleChat} 
                className={!isOpen?"bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition":"bg-black p-3 rounded-full shadow-lg transition font-semibold hover:bg-red-900"}
            >
                {!isOpen? "💬 Wanna Chat and Shop?": "❌"}
            </button>
            {isOpen && (
                <div className="mt-2 w-80 md:w-96 bg-slate-300 shadow-lg rounded-lg p-4 transition-transform transform duration-300 ease-in-out">
                    <h3 className="font-bold text-black text-lg">Chat with Us!</h3>
                    <div className="mt-2">
                        <p className='text-black'>How can we help you today?</p>
                        <div className="h-48 overflow-y-auto border border-gray-300 text-gray-800 rounded p-2 mb-2">
                            {chatResponse}
                        </div>
                        <input 
                            type="text" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..." 
                            className="border rounded w-full p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button 
                            onClick={handleSend}
                            className="bg-blue-500 text-white rounded w-full mt-2 p-2 hover:bg-blue-600 transition"
                        >
                            {!loading?"Send":"loading..."}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPopup;