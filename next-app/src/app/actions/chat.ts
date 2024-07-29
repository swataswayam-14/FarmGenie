"use server"
import axios from 'axios';
import { db } from "../db";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export async function createChat(question:string, response:string) {
    try {
        const session = await getServerSession(authOptions);
        if(!session?.user){
            return false;
        }
        const farmerId = session.user.id;
        const chat = await db.chat.create({
            data:{
                userId: farmerId,
                question:question,
                response:response
            }
        })
        return true;   
    } catch (error) {
        return false;
    }
}

export async function getAllChats() {
    try {
        const session = await getServerSession(authOptions);
        if(!session?.user){
            return [];
        }
        const farmerId = session.user.id;
        const allChats = await db.chat.findMany({
            where:{
                userId:farmerId
            }
        })
        if(allChats.length > 0){
            console.log(allChats);
            
            return allChats;
        }else{
            return [];
        }
    } catch (error) {
        console.log(error);
        return []
    }
}

export async function makeRequest(question: string, translate: boolean) {
  try {
    const options = {
      method: 'GET',
      url: 'https://singular-muskox-certainly.ngrok-free.app/searchQuery',
      params: { userQuery: question },
      headers: { Accept: '*/*', 'User-Agent': 'Thunder Client (https://www.thunderclient.com)' },
    };

    const response = await axios.request(options);
    if(response){
        if(translate){
            await createChat(question , response?.data?.eh_translated_result);
        } else {
            await createChat(question , response?.data?.answer);
        }
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function chatMarketRequest(question: string) {
    try {
        const options = {
            method: 'GET',
            url: 'https://singular-muskox-certainly.ngrok-free.app/chatShop/searchQuery',
            params: {userQuery: question},
            headers: {Accept: '*/*', 'User-Agent': 'Thunder Client (https://www.thunderclient.com)'}
        }
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        return {content: ""};
    }
}

export async function logError(error: any){
    console.log(error);
}