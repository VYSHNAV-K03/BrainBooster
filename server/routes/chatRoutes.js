const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
// const Chat = require("../modelschemas/chatSchema");
// const Authenticate = require("../middleware/authenticate");
const axios = require("axios");

// Fetch chat messages between influencer and brand
// router.post("/:sender/:reciever", async (req, res) => {
//   try {
//     const { sender, reciever } = req.params; // Extract influencerId and brandId from URL

//     console.log(req.params);

//     const chats = await Chat.find({
//       $or: [
//         { senderId: sender, RecieverId: reciever },
//         { senderId: reciever, RecieverId: sender },
//       ],
//     }).sort({ createdAt: 1 }); // Sort by creation time if needed

//     res.json(chats);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching chats" });
//   }
// });

// Send a new message
// router.post("/send", async (req, res) => {
//   try {
//     const { RecieverId, senderId, text } = req.body;

//     const message = new Chat({ senderId, RecieverId, text });
//     await message.save();
//     res.json(message);
//   } catch (error) {
//     res.status(500).json({ error: "Error sending message" });
//   }
// });

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY; // Store API key in .env file
console.log(HF_API_KEY);

// Chatbot API Endpoint
router.post("/", async (req, res) => {
  const userMessage = req.body.message; // Get user input

  console.log(userMessage);
  console.log(HF_API_KEY);

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      { inputs: userMessage },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    console.log(response.data[0].generated_text);

    // Get AI response
    const botReply = response.data[0].generated_text || "I don't understand.";
    res.json({ reply: botReply }); // Send response to frontend
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

module.exports = router;
