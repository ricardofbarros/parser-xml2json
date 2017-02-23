extern crate treexml;
extern crate libc;
extern crate node2object;
extern crate serde_json;

use libc::{c_char};
use std::ffi::{CStr, CString};
use std::error::Error;

#[no_mangle]
pub unsafe extern fn parser(input: *const c_char, callback: extern fn(err: i32, res: std::ffi::CString)) {
    let input_str = CStr::from_ptr(input);
    let rust_str = input_str.to_str().unwrap();
    let tree = treexml::Document::parse(rust_str.as_bytes());

    match tree {
        Ok(v) => {
            let dom_root = v.root.unwrap();
            let json_rep = serde_json::Value::Object(node2object::node2object(&dom_root));
            let s = json_rep.to_string();

            let res = CString::new(s).unwrap();
            callback(0, res)
        },
        Err(e) => {
            let err = CString::new(String::from(e.description())).unwrap();
            callback(1, err)
        }
    };
}
