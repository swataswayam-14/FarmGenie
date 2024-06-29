// ActionProvider.ts

import { createChatBotMessage } from 'react-chatbot-kit'; // Corrected import

// Define types (you can adjust these based on your use case)
type BotAction = {
  type: string;
  value?: any;
};

class ActionProvider {
  createChatBotMessage: (message: string) => any; // Adjust the type based on your package

  constructor(createChatBotMessage: (message: string) => any) {
    this.createChatBotMessage = createChatBotMessage;
  }

  // Define actions based on user intent
  // Example: greetUser, showHelp, etc.
  // You can add more methods here.
  greetUser(): BotAction {
    return {
      type: 'bot',
      value: this.createChatBotMessage('Hello! How can I assist you?'),
    };
  }
}

export default ActionProvider;
