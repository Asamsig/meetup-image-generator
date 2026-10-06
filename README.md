# Meetup Image Generator

Generates 1920×1080 promo images for javaBin, BartJS and NNUG meetups in Trondheim, plus a shared template for events across all three groups.

```sh
pnpm install
pnpm dev
```

## How it works

- `src/components/Poster.tsx` is the layout, written as JSX with flexbox. [Satori](https://github.com/vercel/satori) renders it to an SVG with text converted to paths, so the output doesn't depend on which fonts the browser has. Only [the CSS Satori supports](https://github.com/vercel/satori#css) works here.
- `src/lib/render.tsx` runs Satori and converts the SVG to a JPEG through a canvas when you download.
- `src/templates/index.ts` lists the built-in templates: colors, logos with their positions, an optional footer and colored stripes along the bottom edge.

## Adding a built-in template

Put the logo in `src/assets/logos/` and add an entry to `builtInTemplates`. Import logos with `?inline` so they're embedded as data URLs.

## Stored in the browser

These are saved in local storage, so they stay in that browser and don't sync between computers:

- The last selected template.
- A default subtitle per template, e.g. "Habitat 17.00". It fills in when you pick the template, unless you've already written your own subtitle.
- Custom templates. Use the + button next to the template picker (or "Create new template" in the list) to start from scratch, or the copy button to start from the selected template. Then change its name, colors, footer and logo.

