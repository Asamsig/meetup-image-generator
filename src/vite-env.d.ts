/// <reference types="vite/client" />

declare module "harfbuzzjs/hb.js" {
  const createHarfBuzz: (options: { locateFile: (file: string) => string }) => Promise<unknown>
  export default createHarfBuzz
}

declare module "harfbuzzjs/hbjs.js" {
  const hbjs: (instance: unknown) => unknown
  export default hbjs
}
