import express from 'express';
import fetch from 'node-fetch'; // Use import instead of require
import cors from 'cors';  // Import the cors package

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());app.use(cors({
    origin: 'http://localhost:3000',  // Allow only requests from this origin
    methods: ['GET', 'POST'],        // Allow only specific methods
    allowedHeaders: ['Content-Type'], // Allow Content-Type header
}));
app.use(express.json());

// Cerebras API key
const API_KEY = 'csk-cce49mjh39k6fdcckjyrn9nkvttehdtffrwx35wm8m8n6vv8';

// Basic route for GET /
app.get('/', (req, res) => {
    res.send('Hello, welcome to the text summarizer API!');
});

app.post('/api/summarize', async (req, res) => {
    const { text } = req.body;
    console.log("Received text:", text);  // Log the received text
    try {
        const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama3.1-8b",
                messages: [{ role: "user", content: `Summarize: ${text}` }],
                max_tokens: 100,
            }),
        });

        // Log the raw response for inspection
        const data = await response.json();
        console.log("API Response:", data);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const summary = data.choices[0].message.content;
        res.json({ summary });
    } catch (error) {
        console.error('Error with Cerebras API:', error);
        res.status(500).json({ error: 'Failed to summarize text' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
