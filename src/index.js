import { Environment, napi } from 'napi-wasm'

const url = new URL('../dist/index.wasm', import.meta.url)
let instance

if (typeof WebAssembly.instantiateStreaming === 'function') {
  const imports = await WebAssembly.instantiateStreaming(fetch(url), { env: napi })
  instance = imports.instance
} else {
  const fs = await import('node:fs')
  const module = await WebAssembly.compile(fs.readFileSync(url))
  instance = await WebAssembly.instantiate(module, { env: napi })
}

const { exports } = new Environment(instance)

export function test() {
  return exports.test()
}

console.log(test())
