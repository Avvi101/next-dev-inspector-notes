import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DevNote, DevNotesProvider, createVSCodeHref } from '../src/index';

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe('createVSCodeHref', () => {
  it('encodes a vscode deep link with line and column', () => {
    expect(createVSCodeHref('/tmp/my folder/file.tsx', 2, 3)).toBe(
      'vscode://file/tmp/my%20folder/file.tsx:2:3'
    );
  });
});

describe('DevNote', () => {
  it('renders only children outside development mode', () => {
    vi.stubEnv('NODE_ENV', 'production');

    render(
      <DevNote title="Chart" note="Details">
        <div>Revenue chart</div>
      </DevNote>
    );

    expect(screen.getByText('Revenue chart')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /open dev note/i })).toBeNull();
  });

  it('opens a note and resolves editor links in development mode', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const user = userEvent.setup();

    render(
      <DevNotesProvider workspaceRoot="/workspace/root/">
        <DevNote
          title="Revenue Chart"
          note="Uses analytics data."
          file="app/dashboard/revenue-chart.tsx"
          endpoint="/api/analytics/revenue"
          owner="@frontend"
        >
          <div>Revenue chart</div>
        </DevNote>
      </DevNotesProvider>
    );

    await user.click(screen.getByRole('button', { name: /open dev note for revenue chart/i }));

    expect(screen.getByText('Uses analytics data.')).toBeTruthy();
    expect(screen.getByText(/Endpoint:/)).toBeTruthy();
    expect(screen.getByText(/Owner:/)).toBeTruthy();

    const link = screen.getByRole('link', { name: /open app\/dashboard\/revenue-chart\.tsx/i });
    expect(link.getAttribute('href')).toBe(
      'vscode://file/workspace/root/app/dashboard/revenue-chart.tsx:1:1'
    );
  });
});
