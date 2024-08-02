import Groq from "groq-sdk/index.mjs";
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import mongoose from "mongoose";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/edgechain-sample", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("DB connection successful");
});

const userSchema = new mongoose.Schema({
    name :String,
    email:String,
    password:String
  
}) 

const User = new mongoose.model("User",userSchema)

//Routes 

app.post("/login", async(req, res) => {
    const {email,password } = req.body;
    try{
        const existingUser = await User.findOne({email:email});
        if(existingUser){
          if(password===existingUser.password){
            res.send({message:"Login Successfully",existingUser:existingUser})
          }
          else{
            res.send({message:"Incorrect Possword"})
          }
        }
        else{
          res.send({message:"user not registered"})

        }
    }
    catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send({ message: "Internal server error" });
  }
//   res.send("MY API login");
});
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).send({ message: "User already registered" });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();
        res.status(201).send({ message: "User registered successfully,Please Login Now" });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});


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
