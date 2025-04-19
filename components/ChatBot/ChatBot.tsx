"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { usePathname } from "next/navigation";
import styles from "./ChatBot.module.css";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(usePathname() === "/"); // Open by default on the home page
  const { messages, addMessage } = useChat();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: input,
    };

    addMessage(userMessage);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const responseData = await response.json();

      addMessage({
        id: responseData.id || crypto.randomUUID(),
        role: "assistant",
        content: responseData.content,
      });
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header} onClick={toggleChat}>
            Craig
          </div>
          <div className={styles.messagesContainer}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "#666", margin: "20px 0" }}>
                How can I help you today?
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${message.role === "user" ? styles.userMessage : styles.botMessage
                  }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ textAlign: "center", color: "#666", margin: "10px 0" }}>
                Craig is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className={styles.inputContainer}>
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className={styles.input}
            />
            <button type="submit" className={styles.sendButton}>
              Send
            </button>
          </form>
        </div>
      )}
      <button
        onClick={toggleChat}
        className={styles.chatButton}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  );
}