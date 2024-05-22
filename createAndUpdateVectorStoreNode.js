import { uploadAndPollVector, createVectorStore } from "./assistantHelpers.js";
import fs from "fs";

const files = ["movies.txt"];
//Create and store the file to the vector store in the BackEnd with node and FS
async function main() {
  const fileStreams = files.map((filePath) => fs.createReadStream(filePath));

  console.log(fileStreams);
}
