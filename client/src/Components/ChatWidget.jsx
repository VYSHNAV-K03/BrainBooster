import React, { useState } from "react";
import axios from "../axios";
import "./ChatWidget.css"; // Import styles for floating button

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const res = await axios.post("/chat", {
        message: input,
      });
      const botMessage = { text: res.data.reply, sender: "bot" };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setInput("");
  };

  return (
    <div>
      {/* Floating Chat Button */}
      <button className="chat-btn" onClick={() => setOpen(!open)}>
        💬
      </button>

      {/* Chat Window */}
      <div className={`chatbox ${open ? "open" : "closed"}`}>
        <div className="chat-header">
          <h4>Chatbot</h4>
          <button onClick={() => setOpen(false)}>✖️</button>
        </div>
        <div className="chat-body">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
