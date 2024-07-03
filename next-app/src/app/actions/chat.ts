"use server"

import { db } from "../db";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export async function createChat(question:string, response:string) {
    console.log('create chat hit');
    
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
        console.log(chat);
        
        return true;   
    } catch (error) {
        console.log(error);
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