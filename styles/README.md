# styles/

Global styling supplements.

- `app/globals.css` (Next.js convention) holds the Tailwind import, the
  black & white design tokens, base styles, and the modular type scale.
- This folder is reserved for any additional standalone stylesheets that
  don't belong in the App Router layout chain.

The platform is Tailwind-first; add CSS here only when a token or utility
truly cannot be expressed through `globals.css` or a component.
