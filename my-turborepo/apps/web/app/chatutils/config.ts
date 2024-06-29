// config.ts

import { createChatBotMessage } from 'react-chatbot-kit'; // Corrected import

// Define types (you can adjust these based on your package)
type ChatConfig = {
  initialMessages: any[]; // Adjust the type based on your package
};

const config: ChatConfig = {
  initialMessages: [
    // Define initial chatbot messages
    createChatBotMessage('Welcome! How can I assist you today?', {
      /* Additional options (if needed) */
      loading: false,
      widget: undefined,
      delay: 0,
      payload: undefined,
    }),
  ],
};

export default config;
