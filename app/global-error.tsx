"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Root Layout Crash:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Application Error — Dheeraj Carpenter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg: #ffffff;
            --fg: #0a0a0a;
            --muted: #666666;
            --border: rgba(0, 0, 0, 0.1);
            --surface: #f7f7f7;
            --accent: #0a0a0a;
            --accent-fg: #ffffff;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #000000;
              --fg: #ededed;
              --muted: #888888;
              --border: rgba(255, 255, 255, 0.12);
              --surface: #111111;
              --accent: #ededed;
              --accent-fg: #000000;
            }
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: var(--bg);
            color: var(--fg);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            text-align: center;
          }
          .card {
            max-width: 520px;
            width: 100%;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 40px 32px;
            box-shadow: 0 12px 36px rgba(0,0,0,0.08);
          }
          .badge {
            display: inline-block;
            font-family: ui-monospace, monospace;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 4px 10px;
            border-radius: 9999px;
            background: var(--fg);
            color: var(--bg);
            margin-bottom: 20px;
          }
          h1 {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.02em;
            margin-bottom: 12px;
          }
          p {
            font-size: 15px;
            line-height: 1.6;
            color: var(--muted);
            margin-bottom: 28px;
          }
          .digest {
            font-family: monospace;
            font-size: 12px;
            background: var(--bg);
            border: 1px solid var(--border);
            padding: 6px 12px;
            border-radius: 6px;
            margin-bottom: 24px;
            display: inline-block;
          }
          .btn-group {
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }
          button, a {
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 9999px;
            transition: all 0.15s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .btn-primary {
            background: var(--fg);
            color: var(--bg);
            border: none;
          }
          .btn-primary:hover {
            opacity: 0.88;
            transform: scale(0.98);
          }
          .btn-secondary {
            background: transparent;
            color: var(--fg);
            border: 1px solid var(--border);
          }
          .btn-secondary:hover {
            background: var(--border);
          }
        `}} />
      </head>
      <body>
        <div className="card">
          <span className="badge">System Critical Fallback</span>
          <h1>Application Encountered an Error</h1>
          <p>
            A core rendering exception prevented the page from loading. You can attempt an immediate recovery below.
          </p>
          {error.digest && (
            <div className="digest">Error Digest: {error.digest}</div>
          )}
          <div className="btn-group">
            <button className="btn-primary" onClick={() => reset()}>
              Reload Component
            </button>
            <a className="btn-secondary" href="/">
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
