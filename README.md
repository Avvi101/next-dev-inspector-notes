# next-dev-inspector-notes

[![npm version](https://img.shields.io/npm/v/next-dev-inspector-notes?color=cb3837&label=npm)](https://www.npmjs.com/package/next-dev-inspector-notes)
[![CI](https://github.com/Avvi101/next-dev-inspector-notes/actions/workflows/ci.yml/badge.svg)](https://github.com/Avvi101/next-dev-inspector-notes/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Avvi101/next-dev-inspector-notes/actions/workflows/codeql.yml/badge.svg)](https://github.com/Avvi101/next-dev-inspector-notes/actions/workflows/codeql.yml)

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

## Features

- Renders only in development by default
- Adds lightweight notes directly on top of real UI
- Links notes to source files through `vscode://file`
- Supports owners, endpoints, and team context for handoffs

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

## Compatibility

- Node.js `>=18`
- Next.js `14`, `15`, and `16`
- React `18` and `19`

## Reliability

- Unit-tested rendering and linking behavior
- CI runs on every push and pull request
- CodeQL and Dependabot configs are included for ongoing maintenance
- Releases are prepared for npm trusted publishing with provenance

## Security

Please report security issues through GitHub private vulnerability reporting when enabled, or by following [SECURITY.md](SECURITY.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local development and release notes.

## License

MIT

