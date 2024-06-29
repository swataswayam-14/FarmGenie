"use client"
import React from "react";
import Chatbot from "react-chatbot-kit";
import ActionProvider from "../chatutils/ActionProvider";
import MessageParser from "../chatutils/MessageParser";
import config from "../chatutils/config";
import styles from "./chat.module.css"

export default function ChatComponent(){
    return (
        <div className={styles.App}>
        <header className={styles['App-header']}>
          {/* Your Chatbot component */}
          <Chatbot
            config={config}
            actionProvider={ActionProvider}
            messageParser={MessageParser}
          />
        </header>
      </div>
    )
}