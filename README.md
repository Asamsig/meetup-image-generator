# Meetup Image Generator

Generates 1920×1080 promo images for javaBin and BartJS meetups in Trondheim.

```sh
pnpm install
pnpm dev
```

## How it works

- `src/components/Poster.tsx` is the layout, written as JSX with flexbox. [Satori](https://github.com/vercel/satori) renders it to an SVG with text converted to paths, so the output doesn't depend on which fonts the browser has. Only [the CSS Satori supports](https://github.com/vercel/satori#css) works here.
- `src/lib/render.tsx` runs Satori and converts the SVG to a JPEG through a canvas when you download.
- `src/templates/index.ts` lists the built-in templates: colors, logos with their positions and an optional footer.

## Adding a built-in template

Put the logo in `src/assets/logos/` and add an entry to `builtInTemplates`. Import logos with `?inline` so they're embedded as data URLs.

