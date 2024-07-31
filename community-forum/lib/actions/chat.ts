"use server"
import axios from 'axios';


export async function makeRequest(question: string, translate: boolean) {
  try {
    const options = {
      method: 'GET',
      url: 'https://singular-muskox-certainly.ngrok-free.app/searchQuery',
      params: { userQuery: question },
      headers: { Accept: '*/*', 'User-Agent': 'Thunder Client (https://www.thunderclient.com)' },
    };

    const response = await axios.request(options);
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