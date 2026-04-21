const { default: normalizeNode } = require("./cleanJSON.js");
const path = require("path");
const fs = require("fs");
const { loadEnv } = require("./env");

loadEnv();

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;
const NODE_ID = process.env.FIGMA_NODE_ID;

if (!FIGMA_TOKEN || !FILE_KEY || !NODE_ID) {
  throw new Error(
    "Missing required env values. Set FIGMA_TOKEN, FIGMA_FILE_KEY, and FIGMA_NODE_ID in .env"
  );
}

async function getFigmaNode() {
  const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${NODE_ID}`;
  // https://www.figma.com/design/ujvHPF3dEkeMStGQ34w4i6/React-Flow--Copy-?node-id=4036-61288&t=rWgaEPl87OsxESmL-4
  // https://www.figma.com/design/ujvHPF3dEkeMStGQ34w4i6/React-Flow--Copy-?node-id=3439-38862&t=JMwJucbmcpqfx8FJ-4
  const res = await fetch(url, {
    headers: {
      "X-Figma-Token": FIGMA_TOKEN
    }
  });

  const data = await res.json();

  if (!fs.existsSync(path.join(__dirname, `design/${NODE_ID}`))) {
    fs.mkdirSync(path.join(__dirname, `design/${NODE_ID}`), { recursive: true });
  }

  fs.writeFileSync(path.join(__dirname, `design/${NODE_ID}/data.json`), JSON.stringify(data, null, 2));

  // const rootNode = data.nodes[Object.keys(data.nodes)[0]].document;

  // const result = normalizeNode(rootNode);

  // fs.writeFileSync("./clean-ui.json", JSON.stringify(result, null, 2));

  console.log("✅ Clean UI schema generated");
}

getFigmaNode();
