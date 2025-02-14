const fetch = require('node-fetch');
require('dotenv').config();

const chatController = async (req, res) => {
    const { genre, setting, protagonist, theme, writingStyle } = req.body;

    if (!genre || !setting || !protagonist || !theme || !writingStyle) {
        return res.render('index', {
            response: '❌ Please fill in all fields to create your story.',
        });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
        return res.render('index', {
            response: '🚨 Server configuration issue. Please try again later.',
        });
    }

    const url = 'https://chatgpt4-ai-chatbot.p.rapidapi.com/ask';
    const query = `Generate a ${genre} story set in ${setting}. The protagonist is ${protagonist}, and the story revolves around ${theme}. Write it in a ${writingStyle} style.`;

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'chatgpt4-ai-chatbot.p.rapidapi.com',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            console.error(`🚨 API Error: ${response.status} - ${response.statusText}`);
            return res.render('index', {
                response: '⚠️ Failed to generate the story. Please try again later.',
            });
        }

        const result = await response.json();
        console.log("🔹 API Response:", result);

        const story = result.response || result.result || "⚠️ No response from the AI.";

        res.render('result', { story });

    } catch (error) {
        console.error("❌ Fetch Error:", error);
        res.render('index', {
            response: '🚨 Error processing your request. Please try again later.',
        });
    }
};

module.exports = { chatController };