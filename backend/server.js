import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pythonAIUrl = process.env.AI_HANDLER_URL;

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    try {
        const { data } = await axios.post(pythonAIUrl, { message });
        if (data.error) throw new Error(data.error);
        res.json({ response: data.response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));