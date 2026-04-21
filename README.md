# readFigma

Utilities and experiments for converting Figma exports into UI code.

This repository currently contains:

- A hand-built Shopify Polaris page: `WorkflowsPage.tsx`
- Figma export artifacts in `design/`
- Node scripts in `old/` for fetching Figma data and generating intermediate files

## Project Structure

- `old/index.js` - fetches a target Figma node payload into `old/design/<NODE_ID>/data.json`
- `old/getVariables.js` - fetches Figma styles/variables into `design/variables.json`
- `old/cleanJSON.js` - normalization helpers used by scripts
- `WorkflowsPage.tsx` - Polaris React page implementation

## Prerequisites

- Node.js 18+ (recommended)
- A Figma Personal Access Token

## Environment Variables

Create a `.env` file in the project root (or copy from `.env.example`):

```bash
FIGMA_TOKEN=your_figma_personal_access_token
FIGMA_FILE_KEY=your_figma_file_key
FIGMA_NODE_ID=3439-38862
```

> `.env` is ignored by git via `.gitignore`.

## Install Dependencies

Install dependencies for scripts inside `old/`:

```bash
cd old
npm install
```

## Usage

From the project root:

### Fetch a Figma node payload

```bash
node old/index.js
```

Writes output to:

- `old/design/<FIGMA_NODE_ID>/data.json`

### Fetch Figma styles/variables

```bash
node old/getVariables.js
```

Writes output to:

- `design/variables.json`

### Generated designs

https://codesandbox.io/p/devbox/headless-pond-hqdqpq?workspaceId=ws_NFhxF2iqNxg4McAjLAZX8X

https://codesandbox.io/p/devbox/gifted-feather-xqk9lv?workspaceId=ws_NFhxF2iqNxg4McAjLAZX8X


## Security Notes

- Do not hardcode tokens in source files.
- Keep real credentials only in `.env`.
- If a token was previously committed or shared, rotate it in Figma and update `.env`.
