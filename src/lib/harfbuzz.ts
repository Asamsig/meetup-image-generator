// Satori shapes text with HarfBuzz. The harfbuzzjs entry point locates hb.wasm relative to the script URL, which breaks
// once Vite bundles it, so vite.config.ts aliases "harfbuzzjs" to this module that hands it the right wasm URL.
import createHarfBuzz from "harfbuzzjs/hb.js"
import hbjs from "harfbuzzjs/hbjs.js"
import wasmUrl from "harfbuzzjs/hb.wasm?url"

export default createHarfBuzz({ locateFile: () => wasmUrl }).then(hbjs)
