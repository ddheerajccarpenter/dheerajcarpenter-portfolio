"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Content & DevTools Protection Guard.
 * – Blocks right-click context menu
 * – Blocks copy, cut, paste, and drag-and-drop outside form inputs
 * – Blocks F12 and all inspection keyboard shortcuts (Ctrl+Shift+I/J/C, Cmd+Option+I/J/C, Ctrl+U, Ctrl+S)
 * – Allows text selection and pasting inside inputs/textareas (e.g., contact forms)
 * – Automatically bypassed on /admin routes so the administrator can manage content freely
 */
export function ContentGuard() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/dc");

  useEffect(() => {
    if (isAdmin) return;

    // Helper to check if event target is an editable form element
    const isEditable = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toUpperCase();
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable ||
        Boolean(target.closest("input, textarea, select, [contenteditable='true']"))
      );
    };

    // ── 1. Disable Right-Click Context Menu ────────────────────────────────
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // ── 2. Disable Copy, Cut, and Paste outside form inputs ────────────────
    const handleCopy = (e: ClipboardEvent) => {
      if (!isEditable(e.target)) {
        e.preventDefault();
      }
    };

    const handleCut = (e: ClipboardEvent) => {
      if (!isEditable(e.target)) {
        e.preventDefault();
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      if (!isEditable(e.target)) {
        e.preventDefault();
      }
    };

    // ── 3. Disable Text Dragging and Image Dragging ────────────────────────
    const handleDragStart = (e: DragEvent) => {
      if (!isEditable(e.target)) {
        e.preventDefault();
      }
    };

    // ── 4. Disable DevTools and Source Inspection Shortcuts ────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key ? e.key.toLowerCase() : "";
      const keyCode = e.keyCode || e.which;
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // F12 key
      if (key === "f12" || keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I / Cmd+Option+I (Inspect)
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
      if (
        ctrlOrMeta &&
        shift &&
        (key === "i" || key === "j" || key === "c" || keyCode === 73 || keyCode === 74 || keyCode === 67)
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Mac Safari / Chrome Option+Cmd+I / Option+Cmd+C
      if (
        e.altKey &&
        e.metaKey &&
        (key === "i" || key === "c" || key === "j" || keyCode === 73 || keyCode === 67 || keyCode === 74)
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U / Cmd+Option+U (View Source)
      if (ctrlOrMeta && (key === "u" || keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S / Cmd+S (Save Page)
      if (ctrlOrMeta && (key === "s" || keyCode === 83)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+A / Cmd+A (Select All) outside inputs
      if (ctrlOrMeta && (key === "a" || keyCode === 65) && !isEditable(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+P / Cmd+P (Print)
      if (ctrlOrMeta && (key === "p" || keyCode === 80)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Attach event listeners with capture: true for instant interception
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("copy", handleCopy, true);
    document.addEventListener("cut", handleCut, true);
    document.addEventListener("paste", handlePaste, true);
    document.addEventListener("dragstart", handleDragStart, true);
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("copy", handleCopy, true);
      document.removeEventListener("cut", handleCut, true);
      document.removeEventListener("paste", handlePaste, true);
      document.removeEventListener("dragstart", handleDragStart, true);
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isAdmin]);

  return null;
}
