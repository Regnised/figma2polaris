const fs = require("fs");
const path = require("path");

function parseEnv(content) {
  const result = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) continue;

    const equalIndex = line.indexOf("=");
    if (equalIndex === -1) continue;

    const key = line.slice(0, equalIndex).trim();
    let value = line.slice(equalIndex + 1).trim();

    if (!key) continue;

    const isQuoted =
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"));

    if (isQuoted) value = value.slice(1, -1);

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }

    result[key] = value;
  }

  return result;
}

function loadEnv() {
  const envCandidates = [
    path.resolve(__dirname, "../.env"),
    path.resolve(__dirname, ".env")
  ];

  for (const envPath of envCandidates) {
    if (!fs.existsSync(envPath)) continue;
    parseEnv(fs.readFileSync(envPath, "utf8"));
  }
}

module.exports = { loadEnv };
