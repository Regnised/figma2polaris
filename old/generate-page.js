const fs = require("fs");

const schema = require("./clean-ui.json");

function generatePage(schema) {
  return `
import {
  Page,
  Layout,
  Card,
  IndexTable,
  Text,
  TextField,
  Button,
  FormLayout
} from '@shopify/polaris';
import {useLoaderData} from '@remix-run/react';

export default function GeneratedPage() {
  const data = useLoaderData();

  return (
    <Page title="Generated page">
      <Layout>
        <Layout.Section>
          ${renderNode(schema)}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
`;
}

//
// ================= RENDER =================
//

function renderNode(node) {
  if (!node) return "";

  switch (node.type) {
    case "frame":
      return `
<Card>
  ${node.children.map(renderNode).join("\n")}
</Card>
`;

    case "table":
      return renderTable(node);

    case "form":
      return renderForm(node);

    case "button":
      return `<Button variant="${node.variant || "primary"}">${node.label}</Button>`;

    case "text":
      return `<Text>${node.value}</Text>`;

    default:
      return "";
  }
}

//
// ================= TABLE =================
//

function renderTable(node) {
  const columns = JSON.stringify(node.columns.map((c) => ({ title: c })));

  const rows = node.rows
    .map(
      (row, i) => `
<IndexTable.Row id="${i}" key="${i}" position={${i}}>
  ${row
    .map(
      (cell) => `
  <IndexTable.Cell>${cell}</IndexTable.Cell>
`
    )
    .join("")}
</IndexTable.Row>`
    )
    .join("\n");

  return `
<IndexTable
  resourceName={{ singular: 'item', plural: 'items' }}
  itemCount={${node.rows.length}}
  headings={${columns}}
  selectable
>
  ${rows}
</IndexTable>
`;
}

//
// ================= FORM =================
//

function renderForm(node) {
  return `
<FormLayout>
  ${node.fields.map(renderField).join("\n")}
  <Button variant="primary">Submit</Button>
</FormLayout>
`;
}

function renderField(field) {
  switch (field.input) {
    case "email":
      return `<TextField label="${field.label}" type="email" autoComplete="email" />`;

    case "select":
      return `<TextField label="${field.label}" />`; // можна замінити на Select

    case "checkbox":
      return `<Checkbox label="${field.label}" />`;

    default:
      return `<TextField label="${field.label}" />`;
  }
}

//
// ================= RUN =================
//

const code = generatePage(schema);

fs.writeFileSync("./GeneratedPage.tsx", code);

console.log("✅ Polaris page generated");
