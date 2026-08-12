"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function HiddenAdminTrigger() {
  const router = useRouter();
  const keySequence = useRef<string[]>([]);
  const targetSequence = "admin";

  interface WindowWithEsc extends Window {
    __lastEscapeTime?: number;
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        router.push("/admin");
        return;
      }

      // 2. Double-tap Escape Trigger
      if (e.key === "Escape") {
        const now = Date.now();
        const lastEsc = (window as WindowWithEsc).__lastEscapeTime ?? 0;
        if (now - lastEsc < 300) {
          router.push("/admin");
          return;
        }
        (window as WindowWithEsc).__lastEscapeTime = now;
      }

      if (e.key.length === 1) {
        keySequence.current.push(e.key.toLowerCase());
        if (keySequence.current.length > targetSequence.length) {
          keySequence.current.shift();
        }
        if (keySequence.current.join("") === targetSequence) {
          router.push("/admin");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
