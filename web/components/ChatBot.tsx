"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Debug: Log messages when they change
  useEffect(() => {
    console.log("Current messages:", messages);
  }, [messages]);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Create a new user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input
    }

    // Update messages with the new user message
    setMessages((prev) => [...prev, userMessage])
    setInput("") // Clear input
    setIsLoading(true)

    try {
      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`)
      }

      // Parse the response
      const responseData = await response.json()
      console.log("Chat finished with message:", responseData);

      // Add the assistant's response to the messages
      setMessages((prev) => [...prev, {
        id: responseData.id || crypto.randomUUID(),
        role: responseData.role || 'assistant',
        content: responseData.content
      }])
    } catch (err) {
      console.error("Chat error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const chatBotStyles = {
    container: {
      position: "fixed" as const,
      bottom: "20px",
      right: "20px",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "flex-end",
    },
    chatButton: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      backgroundColor: "#0070f3",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      fontSize: "24px",
      border: "none",
    },
    chatWindow: {
      width: "350px",
      height: "500px",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      marginBottom: "16px",
      display: isOpen ? "flex" : "none",
      flexDirection: "column" as const,
      overflow: "hidden",
    },
    header: {
      padding: "15px",
      backgroundColor: "#0070f3",
      color: "white",
      fontWeight: "bold",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
    },
    messagesContainer: {
      flex: 1,
      padding: "15px",
      overflowY: "auto" as const,
      display: "flex",
      flexDirection: "column" as const,
      gap: "10px",
    },
    message: {
      padding: "10px 15px",
      borderRadius: "18px",
      maxWidth: "80%",
      wordBreak: "break-word" as const,
    },
    userMessage: {
      backgroundColor: "#e6f2ff",
      alignSelf: "flex-end",
      marginLeft: "auto",
    },
    botMessage: {
      backgroundColor: "#f1f1f1",
      alignSelf: "flex-start",
      marginRight: "auto",
    },
    inputContainer: {
      display: "flex",
      padding: "10px",
      borderTop: "1px solid #eaeaea",
    },
    input: {
      flex: 1,
      padding: "10px 15px",
      border: "1px solid #ddd",
      borderRadius: "20px",
      outline: "none",
    },
    sendButton: {
      marginLeft: "10px",
      padding: "10px 15px",
      backgroundColor: "#0070f3",
      color: "white",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
    },
  }

  return (
    <div style={chatBotStyles.container}>
      {isOpen && (
        <div style={chatBotStyles.chatWindow}>
          <div style={chatBotStyles.header}>Chat Assistant</div>
          <div style={chatBotStyles.messagesContainer}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "#666", margin: "20px 0" }}>How can I help you today?</div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...chatBotStyles.message,
                  ...(message.role === "user" ? chatBotStyles.userMessage : chatBotStyles.botMessage),
                }}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div style={{ textAlign: "center", color: "#666", margin: "10px 0" }}>
                AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} style={chatBotStyles.inputContainer}>
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              style={chatBotStyles.input}
            />
            <button type="submit" style={chatBotStyles.sendButton}>
              Send
            </button>
          </form>
        </div>
      )}
      <button onClick={toggleChat} style={chatBotStyles.chatButton} aria-label={isOpen ? "Close chat" : "Open chat"}>
        {isOpen ? "×" : "💬"}
      </button>
    </div>
  )
}