# next-dev-inspector-notes

Add development-only sticky notes directly to your Next.js UI so teammates can see implementation context where it matters.

## Install

```bash
npm install next-dev-inspector-notes
```

## Why

Design systems, dashboards, and feature-heavy apps often make it hard to answer simple questions like:

- Which file owns this section?
- What endpoint powers this card?
- Who should I ask before editing this widget?

This package lets you leave those notes in the UI during development without shipping them to production.

## Example

```tsx
'use client';

import { DevNote, DevNotesProvider } from 'next-dev-inspector-notes';

export function DashboardPage() {
  return (
    <DevNotesProvider workspaceRoot="/Users/you/my-app">
      <DevNote
        title="Revenue Chart"
        note="Uses quarterly summary data from the analytics route."
        file="app/dashboard/_components/revenue-chart.tsx"
        endpoint="/api/analytics/revenue"
        owner="@frontend"
      >
        <section>{/* chart UI */}</section>
      </DevNote>
    </DevNotesProvider>
  );
}
```

## API

### `DevNotesProvider`

Optional provider for a shared `workspaceRoot` and note color.

### `DevNote`

Wrap a UI region and show a floating `NOTE` badge in development only.

Props:

- `title`: short headline
- `note`: description or implementation hint
- `file`: relative or absolute file path
- `line` and `column`: editor jump target
- `endpoint`: API or data source reference
- `owner`: ownership hint
- `placement`: one of `top-left`, `top-right`, `bottom-left`, `bottom-right`

### `createVSCodeHref`

Build a `vscode://file/...` deep link manually if you want to render your own button.

