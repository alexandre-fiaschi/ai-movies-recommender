// import express from "express";

import { openai } from "./config.js";
import {
  createMessagesThread,
  runThread,
  retrieveRun,
  listMessages,
} from "./assistantHelpers.js";
//Node.js if run as server BE

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const app = express();
// const port = process.env.PORT || 3002;

// app.use(express.json());
// //Configura Express per servire il file index.html principale
// app.get("/", (req, res) => {
//   res.sendFile(join(__dirname, "./index.html"));
// });

// // Configura Express per servire l'intera directory "src" come file statici
// app.use(express.static(join(__dirname, "./")));

// app.listen(port, () => {
//   console.log(`App running on port ${port}`);
// });

///////////////////////////////////////////////////////////////APP FLOW

//DOM
export const form = document.querySelector("form");
export const input = document.querySelector("input");
export const reply = document.querySelector(".reply");

//Movie Expert Assistant

// Assistant variables
const asstID = "asst_MVXM0pEQX2GKX74jEAxsKgdW";
const threadID = "thread_Bf4Ad6rjo6eUcPdmiLLuyYN4";

// Main Code
async function main() {
  reply.innerHTML = "Thinking...";

  //Create message
  await createMessagesThread(threadID, input.value);

  //Run
  const run = await runThread(threadID, asstID);

  // Before setting the last message we need polling since the assistant didnt have enough time to process the run, we need to preiodically send request to see if the run is completed
  // Retrieve the current run to check for status update
  let currentRun = await retrieveRun(threadID, run.id);
  // Poll for updates and check if run status is completed ((UPDATES: OpenAI plan to support streaming soon))
  while (currentRun.status !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(currentRun.status);
    currentRun = await retrieveRun(threadID, run.id);
  }

  // Get messages from the thread
  const { data } = await listMessages(threadID);
  console.log(data);

  // Display the last message for the current run
  reply.innerHTML = data[0].content[0].text.value;
}

//Event Handler
form.addEventListener("submit", function (e) {
  e.preventDefault();
  main();
  input.value = "";
});
