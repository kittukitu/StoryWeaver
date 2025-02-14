const fetch = require('node-fetch');
require('dotenv').config();

const chatController = async (req, res) => {
    const { degree, interests, learningMode, careerGoal } = req.body;

    if (!degree || !interests || !learningMode || !careerGoal) {
        return res.render('index', {
            response: '❌ Please fill in all fields.',
        });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
        return res.render('index', {
            response: '🚨 Server configuration issue. Please try again later.',
        });
    }

    const url = 'https://chatgpt4-ai-chatbot.p.rapidapi.com/ask';
    const query = `I have completed my ${degree}. My interests are in ${interests}. I prefer ${learningMode} for learning. My career goal is to become a ${careerGoal}. Provide a structured course roadmap with a detailed schedule.`;

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
                response: '⚠️ Failed to get a response from the AI. Please try again later.',
            });
        }

        const result = await response.json();
        console.log("🔹 API Response:", result);

        const roadmap = result.response || result.result || "⚠️ No response from the AI.";

        res.render('result', { roadmap });

    } catch (error) {
        console.error("❌ Fetch Error:", error);
        res.render('index', {
            response: '🚨 Error processing your request. Please try again later.',
        });
    }
};

module.exports = { chatController };
