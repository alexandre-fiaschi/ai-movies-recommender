import { openai } from "./config.js";

export async function createAssistant() {
  const myAssistant = await openai.beta.assistants.create({
    instructions:
      "You are great at recommending movies. When asked a question, use the information in the provided file to form a friendly response. If you cannot find the answer in the file, do your best to infer what the answer should be.",
    name: "Movie Expert",
    tools: [{ type: "file_search" }],
    model: "gpt-4-1106-preview",
  });
  return myAssistant;
}

//Creating vector store
export async function createVectorStore(vStoreName) {
  const vectorStore = await openai.beta.vectorStores.create({
    name: vStoreName,
  });
  console.log(vectorStore);
  return vectorStore;
}

//Uploading files and adding them to vector store
export async function uploadAndPollVector(vectorStore, fileStreams) {
  const response = await openai.beta.vectorStores.fileBatches.uploadAndPoll(
    vectorStore.id,
    { files: fileStreams }
  );
  console.log("File batch uploaded and polled:", response);
  return response;
}

export async function updateAssistant(assistantId, vectorStoreId) {
  const response = await openai.beta.assistants.update(assistantId, {
    tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } },
  });
  console.log("Assistant updated:", response);
  return response;
}

export async function listAssistants() {
  const myAssistants = await openai.beta.assistants.list({
    order: "desc",
    limit: "20",
  });

  console.log(myAssistants.data);
}

export async function retrieveAssitant(asstID) {
  const myAssistant = await openai.beta.assistants.retrieve(asstID);

  console.log(myAssistant);
}

export async function createThread() {
  const emptyThread = await openai.beta.threads.create();

  console.log(emptyThread);
}

export async function createMessagesThread(threadID, userContentMessage) {
  const threadMessages = await openai.beta.threads.messages.create(threadID, {
    role: "user",
    content: userContentMessage,
  });

  console.log(threadMessages);
}

export async function runThread(threadID, asstID) {
  const run = await openai.beta.threads.runs.create(threadID, {
    assistant_id: asstID,
    instructions: `Please do not provide annotations in your reply. Only reply about movies in the provided file. If questions are not related to movies, respond with "Sorry, I don't know." Keep your answers short.`,
    //here we can provide additional instruction to the assistance or change the tools the assistance will use in this run
    // which gives more flexibility in running a thread
  });
  return run;
}

export async function retrieveRun(threadID, runID) {
  return await openai.beta.threads.runs.retrieve(threadID, runID);
}

export async function listMessages(threadID) {
  return await openai.beta.threads.messages.list(threadID);
}

export async function deleteMessage(threadID, msgID) {
  const deletedMessage = await openai.beta.threads.messages.del(
    threadID,
    msgID
  );
  console.log(deleteMessage);
}
