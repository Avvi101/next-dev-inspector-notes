'use client';

import * as React from 'react';

type Placement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface DevNotesProviderProps {
  children: React.ReactNode;
  workspaceRoot?: string;
  accentColor?: string;
}

export interface DevNoteProps {
  children: React.ReactNode;
  title: string;
  note: string;
  file?: string;
  line?: number;
  column?: number;
  endpoint?: string;
  owner?: string;
  placement?: Placement;
  display?: React.CSSProperties['display'];
}

interface DevNotesContextValue {
  workspaceRoot?: string;
  accentColor: string;
}

const DevNotesContext = React.createContext<DevNotesContextValue>({
  accentColor: '#f97316'
});

const isDev = process.env.NODE_ENV === 'development';

export function DevNotesProvider({
  children,
  workspaceRoot,
  accentColor = '#f97316'
}: DevNotesProviderProps): React.ReactElement {
  return (
    <DevNotesContext.Provider
      value={{
        workspaceRoot,
        accentColor
      }}
    >
      {children}
    </DevNotesContext.Provider>
  );
}

export function createVSCodeHref(filePath: string, line = 1, column = 1): string {
  const normalizedFilePath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `vscode://file${encodeURI(normalizedFilePath)}:${line}:${column}`;
}

export function DevNote({
  children,
  title,
  note,
  file,
  line = 1,
  column = 1,
  endpoint,
  owner,
  placement = 'top-right',
  display = 'block'
}: DevNoteProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const { workspaceRoot, accentColor } = React.useContext(DevNotesContext);

  if (!isDev) {
    return <>{children}</>;
  }

  const resolvedFilePath =
    file && workspaceRoot && !file.startsWith('/') ? `${workspaceRoot}/${file}` : file;

  const placementStyle = getPlacementStyle(placement);

  return (
    <div
      style={{
        position: 'relative',
        display
      }}
    >
      {children}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Open dev note for ${title}`}
        style={{
          position: 'absolute',
          zIndex: 40,
          border: 0,
          borderRadius: 999,
          padding: '0.3rem 0.5rem',
          fontSize: 11,
          fontWeight: 700,
          lineHeight: 1,
          background: accentColor,
          color: '#111827',
          boxShadow: '0 8px 20px rgba(15, 23, 42, 0.18)',
          cursor: 'pointer',
          ...placementStyle.button
        }}
      >
        NOTE
      </button>
      {open ? (
        <aside
          style={{
            position: 'absolute',
            zIndex: 50,
            width: 280,
            padding: '0.9rem',
            borderRadius: 14,
            border: `1px solid ${accentColor}`,
            background: 'rgba(17, 24, 39, 0.96)',
            color: '#f9fafb',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(10px)',
            ...placementStyle.panel
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
          <p style={{ margin: '0.55rem 0', fontSize: 13, lineHeight: 1.5 }}>{note}</p>
          {endpoint ? (
            <div style={{ marginTop: '0.35rem', fontSize: 12, opacity: 0.85 }}>
              Endpoint: <code>{endpoint}</code>
            </div>
          ) : null}
          {owner ? (
            <div style={{ marginTop: '0.35rem', fontSize: 12, opacity: 0.85 }}>
              Owner: <code>{owner}</code>
            </div>
          ) : null}
          {resolvedFilePath ? (
            <a
              href={createVSCodeHref(resolvedFilePath, line, column)}
              style={{
                display: 'inline-flex',
                marginTop: '0.75rem',
                color: '#fde68a',
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Open {trimFilePath(resolvedFilePath)}
            </a>
          ) : null}
        </aside>
      ) : null}
    </div>
  );
}

function getPlacementStyle(
  placement: Placement
): {
  button: React.CSSProperties;
  panel: React.CSSProperties;
} {
  switch (placement) {
    case 'top-left':
      return {
        button: { top: 8, left: 8 },
        panel: { top: 40, left: 8 }
      };
    case 'bottom-left':
      return {
        button: { bottom: 8, left: 8 },
        panel: { bottom: 40, left: 8 }
      };
    case 'bottom-right':
      return {
        button: { bottom: 8, right: 8 },
        panel: { bottom: 40, right: 8 }
      };
    case 'top-right':
    default:
      return {
        button: { top: 8, right: 8 },
        panel: { top: 40, right: 8 }
      };
  }
}

function trimFilePath(filePath: string): string {
  const parts = filePath.split('/');
  return parts.slice(Math.max(0, parts.length - 3)).join('/');
}

