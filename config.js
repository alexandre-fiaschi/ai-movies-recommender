import OpenAI from "openai/index.mjs";
import dotenv from "dotenv";

dotenv.config();

//OpenAI config
if (!process.env.OPENAI_API_KEY)
  throw new Error("OpenAI API key is missing or invalid.");
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});
