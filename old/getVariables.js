const { default: normalizeNode } = require("./cleanJSON.js");
const { loadEnv } = require("./env");

loadEnv();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!FIGMA_TOKEN || !FILE_KEY) {
  throw new Error("Missing required env values. Set FIGMA_TOKEN and FIGMA_FILE_KEY in .env");
}

async function getFigmaNode() {
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/styles`;
  // https://www.figma.com/design/ujvHPF3dEkeMStGQ34w4i6/React-Flow--Copy-?node-id=4036-61288&t=rWgaEPl87OsxESmL-4
  const res = await fetch(url, {
    headers: {
      "X-Figma-Token": FIGMA_TOKEN
    }
  });

  const data = await res.json();
  console.log(data);
  // write json to file
  const fs = require("fs");
  fs.writeFileSync("./design/variables.json", JSON.stringify(data, null, 2));

  console.log("✅ Variables fetched");
}

getFigmaNode();
