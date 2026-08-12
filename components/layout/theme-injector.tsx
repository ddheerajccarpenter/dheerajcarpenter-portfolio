"use client";

import { useEffect } from "react";

export function ThemeInjector({ uiDesign }: { uiDesign: string }) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-ui-design", uiDesign);
      document.body.setAttribute("data-ui-design", uiDesign);
    }
  }, [uiDesign]);

  return null;
}
