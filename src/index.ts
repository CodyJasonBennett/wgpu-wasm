// @ts-ignore
import { Environment, napi } from 'napi-wasm'

const url = new URL('index.wasm', import.meta.url)

let instance

// nodejs/undici fetch (global in Node 18) does not support the file: protocol,
// so fallback to Node-specific FS read
if (typeof process !== 'undefined' && process.release.name === 'node') {
  const fs = await import('node:fs')
  const module = await WebAssembly.compile(fs.readFileSync(url))
  instance = await WebAssembly.instantiate(module, { env: napi })
} else {
  if (typeof WebAssembly.instantiateStreaming === 'undefined') {
    WebAssembly.instantiateStreaming = async (res, importObject) => {
      const source = await (await res).arrayBuffer()
      return await WebAssembly.instantiate(source, importObject)
    }
  }

  const imports = await WebAssembly.instantiateStreaming(fetch(url), { env: napi })
  instance = imports.instance
}

const { exports } = new Environment(instance)

export function test(): boolean {
  return exports.test()
}

console.log(test())
