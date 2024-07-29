"use client"

import { useState } from "react"
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { makeRequest } from "@/app/actions/chat";

export default function ChatInterface({
    params:{chatId},
}:{
    params: {
        chatId: string
    }
}) {
    const [isLoading, setIsloading] = useState(false);
    const session = useSession();
    const [chatHistory, setChatHistory] = useState([]);
    const [question , setQuestion] = useState("");
    const [response , setResponse] = useState("");
    const [translate , setTranslate] = useState<boolean>(false);
    async function submit() {
      setIsloading(true);
    
      try {
        const responseData = await makeRequest(question, translate);
        if(translate){
          setResponse(responseData.eh_translated_result);
        }else{
          setResponse(responseData.answer);
        }
        setChatHistory(responseData.history);
      } catch (error) {
        console.error(error);
      } finally {
        setIsloading(false);
      }
    }

    interface HistoryItem {
      content: string;
      additional_kwargs: {};
      response_metadata: {};
      type: string;
      name: null;
      id: null;
      example: boolean;
    }

    return (
      <div className="min-h-screen bg-gray-900 text-white font-sans flex">
        <div className="w-3/4 p-5">
          <header className="p-5 bg-gray-800 rounded-t-lg">
            <h1 className="text-4xl font-bold">Farm Genie Chatbot</h1>
          </header>
          <main className="flex flex-col items-center justify-center flex-1 px-4 md:px-0">
            <div className="w-full md:w-3/4 lg:w-2/3 bg-gray-800 rounded-lg shadow-lg p-4 mb-6 overflow-y-auto" style={{ maxHeight: '400px' }}>
              Chatbot messages will be displayed here
            </div>
            <div className="mr-20 mb-4">
            <button className="p-1 rounded-lg ml-5 bg-white text-black font-semibold" onClick={()=>{
                  setTranslate(true);
                }}>Hindi</button>
            <button className="p-1 rounded-lg ml-5 bg-white text-black font-semibold" onClick={()=>{
                  setTranslate(false);
            }}>English</button>
            </div>
            <div className="w-full md:w-3/4 lg:w-2/3 flex items-center">
              <textarea
                className="w-full h-16 p-4 rounded-l-lg bg-gray-800 text-white text-lg resize-none shadow-lg"
                placeholder="Enter your question..."
                onChange={(e)=>{
                  setQuestion(e.target.value);
                }}
                value={question}
              />
              <Button
                type="submit"
                className="rounded-r-lg bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4"
                onClick={session.data?.user ? submit : () => signIn()}
              >
                {session.data?.user
                  ? "Submit"
                  : session.data
                    ? "Submit"
                    : "Login to submit"}
              </Button>
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center mt-5">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <div className="w-full md:w-3/4 lg:w-2/3 p-4 mb-5 mt-5 rounded-lg bg-gray-800 text-white shadow-lg">
                {response}
              </div>
            )}
            <p className="text-sm text-gray-500 mt-5">Hint: Click the Submit button to get the answer.</p>
          </main>
        </div>
        <div className="w-1/4 bg-gray-800 p-5 overflow-y-auto rounded-t-lg rounded-b-lg" style={{ maxHeight: '100vh' }}>
        <h2 className="text-2xl font-bold mb-4">Chat History</h2>
          {chatHistory?.length === 0 ? (
            <p>no chats yet</p>
          ) : (
            chatHistory?.map((item: any, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded-lg mb-2">
                  <div>
                    <p className="question">{item.content}</p>
                    {index % 2 !== 0 && <p key={index}>{item}</p>}
                  </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
}