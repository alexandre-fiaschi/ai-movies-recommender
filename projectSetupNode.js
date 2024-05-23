import {
  createAssistant,
  uploadAndPollVector,
  updateAssistant,
  createVectorStore,
  createThread,
} from "./assistantHelpers.js";
import fs from "fs";

const files = ["movies.txt"];
const vStoreName = "Movies";

//Create and store the file to the vector store in the BackEnd with node and FS
async function setupProject() {
  const assistant = await createAssistant();
  const vectorStore = await createVectorStore(vStoreName);
  const fileStreams = files.map((filePath) => fs.createReadStream(filePath));
  await uploadAndPollVector(vectorStore, fileStreams);
  await updateAssistant(assistant, vectorStore); //to use the new updated vector store
  const thread = await createThread();
  console.log("assistant id:", assistant.id);
  console.log("thread id:", thread.id);
  return { assistant, thread };
}
setupProject();
