// @ts-ignore
import { Environment, napi } from 'napi-wasm'
// @ts-ignore
import wasm from '../target/wasm32-unknown-unknown/release/wgpu.wasm?init'

const exports = /*#__PURE__*/ new Promise<any>(async (res) => {
  const instance = await wasm({ env: napi })
  const env = new Environment(instance)
  res(env.exports)
})

export async function test(): Promise<boolean> {
  return (await exports).test()
}

test().then(console.log)
