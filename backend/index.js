import Groq from "groq-sdk/index.mjs";
import express from 'express';
import cors from 'cors';

const groq = new Groq({ apiKey: "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" });
const app = express();
app.use(express.json());
app.use(cors());

async function getCompletion(prompt) {
    const model = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
    });
    return model.choices[0]?.message?.content || "";
}

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await getCompletion(prompt);
    res.json({ prompt, completion });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating response");
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
