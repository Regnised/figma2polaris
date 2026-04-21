---
name: figma-to-polaris
description: Convert a Figma design (JSON + SVG/PNG exports in design/) into a Shopify Polaris React page. Use when the user asks to translate a Figma file, frame, or screen into Polaris components, mentions design/data.json, wants a .tsx generated from the Figma export, or says things like "build this design", "make a Polaris page from Figma", or "turn this Figma into React".
---

# Figma → Shopify Polaris Page

Convert Figma exports in `design/` into a production-ready `.tsx` file using `@shopify/polaris`.

## Workflow

Copy this checklist:

```
- [ ] Step 1: Understand the visual intent (PNG first, never JSON first)
- [ ] Step 2: Enumerate the UI zones and pick Polaris components
- [ ] Step 3: Pull targeted data from design/data.json (grep, never full read)
- [ ] Step 4: Emit a single .tsx file
- [ ] Step 5: Validate imports against the deprecated list
- [ ] Step 6: Run ReadLints
```

### Step 1 — Visual understanding first

Read the PNG (`design/Frame *.png`) as an image before touching the JSON. The PNG answers "what does this screen look like" in one round-trip; the JSON answers "what are the exact tokens" and is expensive.

If no PNG is available, read the SVG.

### Step 2 — Zone → Polaris component mapping

Break the screen into zones (top bar, filters, content, footer/pagination). For each zone, pick from this table (extend as needed):

| Visual pattern | Polaris |
|---|---|
| Segmented tab switcher | `ButtonGroup variant="segmented"` + `<Button pressed>` |
| Top-level page tabs | `Tabs` (only if full page-level nav) |
| Filter row (tabs + search/filter/sort) | `IndexFilters` + `useSetIndexFiltersMode` |
| Record table | `IndexTable` in `LegacyCard` + `useIndexResourceState` |
| Status pill | `Badge` with `tone` (`attention`/`success`/`warning`/`critical`/`info`) |
| Disclosure button | `<Button disclosure>` + `Popover` + `ActionList` |
| Pagination | `Pagination` inside `<InlineStack align="end">` |
| Layout/spacing | `Page` → `BlockStack` → `InlineStack` |
| Card surface | `Card` (new) or `LegacyCard` (old styling) |
| Form fields | `TextField`, `Select`, `Checkbox`, `ChoiceList` |

### Step 3 — Pull data from JSON surgically

`design/data.json` is ~58k lines. Never full-read. Use:

```bash
# count node types
rg '"type": "(FRAME|TEXT|INSTANCE|VECTOR)"' design/data.json -c

# find a named component
rg -B 1 -A 20 '"name": "Switcher"' design/data.json

# find all text strings in the design
rg '"characters":' design/data.json
```

Use `Read` with `offset`/`limit` only when `Grep` isn't enough.

### Step 4 — Emit the `.tsx`

Template:

```tsx
import React, { useState } from 'react';
import {
  Page, LegacyCard, IndexTable, IndexFilters,
  useSetIndexFiltersMode, useIndexResourceState,
  Text, Badge, Button, ButtonGroup,
  InlineStack, BlockStack, Pagination,
} from '@shopify/polaris';

type Item = { id: string; /* ...fields from design... */ };

const ITEMS: Item[] = [/* from design rows */];

export default function GeneratedPage() {
  // state hooks
  // useIndexResourceState, useSetIndexFiltersMode
  // rowMarkup from ITEMS.map(...)

  return (
    <Page>
      <BlockStack gap="400">
        {/* top bar: InlineStack with segmented ButtonGroup + disclosure Button */}
        {/* card: LegacyCard with IndexFilters + IndexTable */}
        {/* footer: InlineStack align="end" with Pagination */}
      </BlockStack>
    </Page>
  );
}
```

### Step 5 — Validate imports

Reject these (deprecated or wrong choice):

- `Stack` → use `BlockStack`
- `Inline` → use `InlineStack`
- `Heading`, `DisplayText`, `Subheading`, `Caption`, `TextStyle` → use `Text` with `variant`/`tone`
- `Tabs` for inline filter pills → use `ButtonGroup variant="segmented"` or `IndexFilters`
- Raw `<div style={{color: 'rgba(...)'}}>` copied from Figma fills → use Polaris `tone` prop instead

### Step 6 — Lint

After writing the file, call `ReadLints` on it and fix any errors before declaring done.

## Subagent delegation

For broad exploration of an unfamiliar Figma file (multiple frames, finding token usage, counting node types), delegate to the built-in `explore` subagent with `thoroughness: "medium"`. Don't try to read the whole JSON yourself.

For autonomous multi-step translation of a large screen, delegate to `generalPurpose` with a detailed prompt that includes this skill's workflow.

## Reference

- Polaris component catalog: https://polaris-react.shopify.com/components
- App design guidelines: https://shopify.dev/docs/apps/design
- Working example in this repo: `WorkflowsPage.tsx`
- Parser plan (HTML/CSS track): `figma_json_to_html_css_parser_b62a3654.plan.md`
