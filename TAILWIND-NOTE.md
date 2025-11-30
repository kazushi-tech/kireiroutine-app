# Tailwind v4 Setup Notes

## Package Versions

- **tailwindcss**: `^4.1.17`
- **@tailwindcss/postcss**: `^4.1.17`
- **postcss**: `^8.5.6`

## PostCSS Configuration

`postcss.config.js`:

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**Note**: Autoprefixer is not needed as `@tailwindcss/postcss` includes it automatically in v4.

## CSS Entry Point

`src/index.css`:

```css
/* Tailwind v4 entry point */
@import "tailwindcss";

:root {
  color-scheme: dark;
}

html,
body,
#root {
  height: 100%;
}

body {
  margin: 0;
  background-color: #020617; /* equivalent to bg-slate-950 */
  color: #e5e7eb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI",
    sans-serif;
}
```

**Important Changes from v3 to v4**:

- ❌ Old: `@import "tailwindcss/base"`, `@import "tailwindcss/components"`, `@import "tailwindcss/utilities"`
- ✅ New: `@import "tailwindcss"` (single import)

## Tailwind Config

`tailwind.config.js` works with v4:

```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#050608",
        "neon-cyan": "#00f0ff",
        "neon-orange": "#f97316",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

The config file is still supported in v4 for extending themes and customization.

## Verification

After these changes:

1. Run `npm install` if you modified package.json
2. Run `npm run dev`
3. Open the dev server URL
4. Confirm no Vite CSS errors appear
5. Verify the dark theme and custom colors still work
