"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * AnakManjaHighlighter
 *
 * Automatically inspects the rendered DOM for the phrase "Dheeraj Carpenter"
 * (case-insensitive) and applies the "Anak Manja" custom font with high contrast
 * text-foreground styling so it is clearly visible in both light and dark mode.
 */
export function AnakManjaHighlighter() {
  const pathname = usePathname();

  useEffect(() => {
    // Avoid running on admin dashboard
    if (pathname?.startsWith("/dc")) return;

    const highlightTextNodes = () => {
      const root = document.querySelector("#main") || document.body;
      if (!root) return;

      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            // Ignore script, style, code, pre, textarea, input, and existing anak-manja tags
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            if (
              ["script", "style", "code", "pre", "textarea", "input", "p", "a", "li", "label", "button", "blockquote"].includes(tag) ||
              parent.classList.contains("font-anak-manja") ||
              parent.closest(".font-anak-manja")
            ) {
              return NodeFilter.FILTER_REJECT;
            }
            if (/dheeraj\s+carpenter/i.test(node.nodeValue || "")) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          },
        }
      );

      const nodesToReplace: Text[] = [];
      let currentNode = walker.nextNode();
      while (currentNode) {
        nodesToReplace.push(currentNode as Text);
        currentNode = walker.nextNode();
      }

      for (const textNode of nodesToReplace) {
        const val = textNode.nodeValue;
        if (!val) continue;

        const regex = /(dheeraj\s+carpenter)/gi;
        const parts = val.split(regex);
        if (parts.length <= 1) continue;

        const fragment = document.createDocumentFragment();
        parts.forEach((part) => {
          if (/^dheeraj\s+carpenter$/i.test(part)) {
            const span = document.createElement("span");
            span.className = "font-anak-manja text-foreground inline-block";
            span.textContent = part;
            fragment.appendChild(span);
          } else if (part.length > 0) {
            fragment.appendChild(document.createTextNode(part));
          }
        });

        try {
          if (textNode.parentNode) {
            textNode.parentNode.replaceChild(fragment, textNode);
          }
        } catch {
          // Ignore DOM detachment during React route transitions
        }
      }
    };

    // Run after DOM paint
    const timer = setTimeout(highlightTextNodes, 60);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
