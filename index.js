import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ⛔️ NEVER expose real key in public repo!
const ELEVEN_API_KEY = "sk_31a5c32717d86039941ff348571628f2d62e4d651df40de8"; // Replace this
const VOICE_ID = "P1tIHB1QH5Dltnyiuz7m"; // Your cloned voice ID

app.post("/api/tts", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send("Missing 'text' in request body");
  }

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.9
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs error:", errorText);
      return res.status(500).send("ElevenLabs API Error");
    }

    const audioStream = await response.buffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audioStream);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Smartie TTS backend running on port ${PORT}`);
});


git init
git add .
git commit -m "Smartie TTS backend"
git branch -M main
git remote add origin https://github.com/akrammakubuya/smartie-tts-backend.git
git push -u origin main