import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { openai } from "../index.js";

dotenv.config();
const router = express.Router();

router.post("/recommend-property", async (req, res) => {
  try {
    const { criteria, propertiesList } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a real estate assistant that helps users find the best property based on given criteria and a list of properties. Analyze the list and recommend the most suitable property.",
        },
        {
          role: "user",
          content: `Here are the user's criteria: ${criteria}. Here is a list of properties: ${JSON.stringify(propertiesList)}`,
        },
      ],
    });

    // Parse the AI's response to get the recommended property
    const recommendedProperty = response.data.choices[0].message.content;

    // Optionally, you can save this recommendation to a database or send it to a chat system
    await axios.post(
      `https://api.chatengine.io/chats/${req.body.activeChatId}/messages/`,
      { text: recommendedProperty },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );

    res.status(200).json({ recommendation: recommendedProperty });
  } catch (error) {
    console.error("error", error.response ? error.response.data.error : error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/analyze-property", async (req, res) => {
  try {
    const { propertyDetails } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a real estate assistant that provides detailed analysis of a given property.",
        },
        {
          role: "user",
          content: `Please analyze the following property: ${JSON.stringify(propertyDetails)}`,
        },
      ],
    });

    const analysis = response.data.choices[0].message.content;

    res.status(200).json({ analysis });
  } catch (error) {
    console.error("error", error.response ? error.response.data.error : error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
