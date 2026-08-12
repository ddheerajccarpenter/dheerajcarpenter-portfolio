"use client";

import { useEffect } from "react";

/**
 * Silent content-protection guard.
 * – Blocks right-click context menu
 * – Blocks all common DevTools keyboard shortcuts
 * – Detects DevTools open via window size delta and blanks the page
 * – No visible notification to the user
 */
export function ContentGuard() {
  useEffect(() => {
    // ── 1. Block right-click ────────────────────────────────────────────────
    const blockContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", blockContext);

    // ── 2. Block copy / cut / paste ─────────────────────────────────────────
    const blockCopy = (e: ClipboardEvent) => e.preventDefault();
    document.addEventListener("copy", blockCopy);
    document.addEventListener("cut", blockCopy);

    // ── 3. Block keyboard shortcuts ─────────────────────────────────────────
    const blockKeys = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // F12
      if (k === "f12") { e.preventDefault(); e.stopImmediatePropagation(); return; }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C — DevTools panels
      if (ctrl && shift && (k === "i" || k === "j" || k === "c")) {
        e.preventDefault(); e.stopImmediatePropagation(); return;
      }
      // Ctrl+U — view source
      if (ctrl && k === "u") { e.preventDefault(); e.stopImmediatePropagation(); return; }
      // Ctrl+S — save page
      if (ctrl && k === "s") { e.preventDefault(); e.stopImmediatePropagation(); return; }
      // Ctrl+A — select all
      if (ctrl && k === "a") { e.preventDefault(); e.stopImmediatePropagation(); return; }
      // Ctrl+P — print
      if (ctrl && k === "p") { e.preventDefault(); e.stopImmediatePropagation(); return; }
    };
    document.addEventListener("keydown", blockKeys, true);

    // ── 4. DevTools size-delta detection ────────────────────────────────────
    // When DevTools docks to the side/bottom, window inner size drops.
    // Threshold: 160px difference = DevTools is likely open.
    const THRESHOLD = 160;
    let devtoolsOpen = false;

    const checkDevTools = () => {
      const widthDiff  = window.outerWidth  - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const isOpen = widthDiff > THRESHOLD || heightDiff > THRESHOLD;

      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true;
        // Silently blank the document body
        document.body.innerHTML = "";
        document.body.style.background = "var(--background, #fff)";
      } else if (!isOpen && devtoolsOpen) {
        // Reload cleanly when DevTools is closed
        devtoolsOpen = false;
        window.location.reload();
      }
    };

    const intervalId = setInterval(checkDevTools, 800);

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      document.removeEventListener("contextmenu", blockContext);
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("cut", blockCopy);
      document.removeEventListener("keydown", blockKeys, true);
      clearInterval(intervalId);
    };
  }, []);

  return null;
}
