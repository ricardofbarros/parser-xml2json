#[macro_use]
extern crate neon;
use neon::vm::{Call, JsResult};
use neon::js::JsString;
use neon::mem::Handle;

extern crate treexml;
extern crate node2object;
extern crate serde_json;

use std::error::Error;


fn parser(call: Call) -> JsResult<JsString> {
    let scope = call.scope;
    let string: Handle<JsString> = try!(try!(call.arguments.require(scope, 0)).check::<JsString>());
    let tree = treexml::Document::parse(string.value().as_bytes());

    let result = match tree {
        Ok(v) => {
            let dom_root = v.root.unwrap();
            serde_json::Value::Object(node2object::node2object(&dom_root)).to_string()
        },
        Err(e) => String::from(e.description())
    };

    Ok(JsString::new(scope, &result).unwrap())
}


register_module!(m, {
    try!(m.export("parser", parser));
    Ok(())
});
