
function normalizeNode(node) {
  if (!node) return null;

  // 🔍 TRY detect table
  if (isTable(node)) {
    return parseTable(node);
  }

  // 🔍 TRY detect form
  if (isForm(node)) {
    return parseForm(node);
  }

  // TEXT
  if (node.type === 'TEXT') {
    return {
      type: 'text',
      value: node.characters,
    };
  }

  // BUTTON
  if (isButton(node)) {
    return {
      type: 'button',
      label: findText(node),
      variant: getVariant(node),
    };
  }

  // FRAME
  if (node.type === 'FRAME') {
    return {
      type: 'frame',
      layout: mapLayout(node.layoutMode),
      children: (node.children || [])
        .map(normalizeNode)
        .filter(Boolean),
    };
  }

  return null;
}

//
// ================= TABLE =================
//

function isTable(node) {
  if (node.type !== 'FRAME') return false;
  if (node.layoutMode !== 'VERTICAL') return false;

  const rows = node.children || [];
  if (rows.length < 2) return false;

  // check rows structure
  const validRows = rows.every(
    (row) =>
      row.layoutMode === 'HORIZONTAL' &&
      (row.children || []).filter(c => c.type === 'TEXT').length >= 2
  );

  return validRows;
}

function parseTable(node) {
  const rows = node.children;

  const header = rows[0];
  const columns = header.children
    .filter(c => c.type === 'TEXT')
    .map(c => c.characters);

  const data = rows.slice(1).map(row =>
    row.children
      .filter(c => c.type === 'TEXT')
      .map(c => c.characters)
  );

  return {
    type: 'table',
    columns,
    rows: data,
  };
}

//
// ================= FORM =================
//

function isForm(node) {
  if (node.type !== 'FRAME') return false;
  if (node.layoutMode !== 'VERTICAL') return false;

  const children = node.children || [];
  if (children.length < 2) return false;

  let fieldCount = 0;

  for (const child of children) {
    if (
      child.layoutMode === 'VERTICAL' &&
      hasLabelAndInput(child)
    ) {
      fieldCount++;
    }
  }

  return fieldCount >= 2;
}

function hasLabelAndInput(node) {
  const hasLabel = (node.children || []).some(c => c.type === 'TEXT');
  const hasInput = (node.children || []).some(
    c => c.type === 'FRAME' || c.type === 'INSTANCE'
  );

  return hasLabel && hasInput;
}

function parseForm(node) {
  const fields = [];

  for (const child of node.children || []) {
    if (!hasLabelAndInput(child)) continue;

    const label = findText(child);
    const inputType = detectInputType(child);

    fields.push({
      type: 'field',
      label,
      input: inputType,
    });
  }

  return {
    type: 'form',
    fields,
  };
}

function detectInputType(node) {
  const name = (node.name || '').toLowerCase();

  if (name.includes('select')) return 'select';
  if (name.includes('checkbox')) return 'checkbox';
  if (name.includes('email')) return 'email';

  return 'text';
}

//
// ================= HELPERS =================
//

function isButton(node) {
  return (
    node.type === 'INSTANCE' &&
    node.name.toLowerCase().includes('button')
  );
}

function findText(node) {
  if (!node.children) return null;

  for (const child of node.children) {
    if (child.type === 'TEXT') return child.characters;

    const deep = findText(child);
    if (deep) return deep;
  }

  return null;
}

function getVariant(node) {
  const props = node.componentProperties || {};

  return props.Variant?.value || 'default';
}

function mapLayout(mode) {
  if (mode === 'HORIZONTAL') return 'horizontal';
  if (mode === 'VERTICAL') return 'vertical';
  return 'none';
}

exports.default = normalizeNode;
