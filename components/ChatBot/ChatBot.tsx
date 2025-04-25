"use client";

import { useRef, useEffect, useReducer } from "react";
import { usePathname } from "next/navigation";
import styles from "./ChatBot.module.css";

const API_ENDPOINT = '/api/chatbot';
const INITIAL_MESSAGE = 'How can I help you today?';
const THINKING_MESSAGE = 'Craig is thinking...';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatState {
  isOpen: boolean;
  input: string;
  isLoading: boolean;
  messages: Message[];
  error: string | null;
}

type ChatAction =
  | { type: 'TOGGLE_CHAT' }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_MESSAGES'; payload: Message[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_OPEN'; payload: boolean };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'TOGGLE_CHAT':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOAD_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_OPEN':
      return { ...state, isOpen: action.payload };
    default:
      return state;
  }
};

export function ChatBot() {
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialState: ChatState = {
    isOpen: false,
    input: "",
    isLoading: false,
    messages: [],
    error: null
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { isOpen, input, isLoading, messages, error } = state;

  // Initialize and restore messages from localStorage
  useEffect(() => {
    // Auto-open chat on homepage
    dispatch({ type: 'SET_OPEN', payload: pathname === "/" });

    // Restore chat history from localStorage
    try {
      const storedMessages = localStorage.getItem("chatMessages");
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        dispatch({ type: 'LOAD_MESSAGES', payload: parsedMessages });
      }
    } catch (err) {
      console.error("Error accessing or parsing stored messages:", err);
      // Safe fallback - clear potentially corrupted data
      localStorage.removeItem("chatMessages");
    }
  }, [pathname]);

  // Persist chat history to localStorage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Auto-dismiss error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_ERROR', payload: null });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Event handlers
  const toggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_INPUT', payload: e.target.value });
  };

  const addMessage = (message: Message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Create user message
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      content: input,
    };

    addMessage(userMessage);
    dispatch({ type: 'SET_INPUT', payload: '' });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Send message history to API to maintain context
      const response = await fetch(API_ENDPOINT, {
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

      // Display AI response
      addMessage({
        id: responseData.id || crypto.randomUUID(),
        role: "assistant",
        content: responseData.content,
      });
    } catch (err) {
      console.error("Chat error:", err);
      dispatch({
        type: 'SET_ERROR',
        payload: "Failed to send message. Please try again."
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className={styles.container}>
      {isOpen && (
        <div className={styles.chatWindow} role="dialog" aria-labelledby="chat-header">
          <div id="chat-header" className={styles.header} onClick={toggleChat}>
            Craig
          </div>
          <div className={styles.messagesContainer} aria-live="polite">
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "#666", margin: "20px 0" }}>
                {INITIAL_MESSAGE}
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
                {THINKING_MESSAGE}
              </div>
            )}
            {error && (
              <div style={{ textAlign: "center", color: "#ff5555", margin: "10px 0" }}>
                {error}
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
              aria-label="Type a message"
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={isLoading || !input.trim()}
            >
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
