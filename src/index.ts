// @ts-ignore
import { Environment, napi } from 'napi-wasm'

const url = new URL('index.wasm', import.meta.url)

let instance

if (typeof fetch === 'undefined') {
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
