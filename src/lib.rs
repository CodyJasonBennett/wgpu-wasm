#[no_mangle]
pub extern "C" fn napi_wasm_malloc(size: usize) -> *mut u8 {
  let align = std::mem::align_of::<usize>();
  if let Ok(layout) = std::alloc::Layout::from_size_align(size, align) {
    unsafe {
      if layout.size() > 0 {
        let ptr = std::alloc::alloc(layout);
        if !ptr.is_null() {
          return ptr;
        }
      } else {
        return align as *mut u8;
      }
    }
  }

  std::process::abort();
}

// https://github.com/rustwasm/wasm-bindgen/issues/1216
#[no_mangle]
pub unsafe extern "C" fn napi_register_wasm_v1(raw_env: napi::sys::napi_env, raw_exports: napi::sys::napi_value) {
  use napi::NapiValue;

  let _env = napi::Env::from_raw(raw_env);
  let mut exports = napi::JsObject::from_raw_unchecked(raw_env, raw_exports);

  exports.create_named_method("test", test);
}

#[napi_derive::js_function(1)]
fn test(ctx: napi::CallContext) -> napi::Result<napi::JsBoolean> {
  ctx.env.get_boolean(true)
}
