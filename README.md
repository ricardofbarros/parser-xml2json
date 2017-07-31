# Parser XML 2 JSON

Blazing fast XML parser to JSON written in Rust ([node2object](https://github.com/vorot93/node2object)).

## Requirements

- `rust`
- `cargo`
- [`node-gyp requirements`](https://github.com/nodejs/node-gyp#installation)

## Usage

```js
const parser = require('parser-xml2json')

const xml = `
  <population>
    <entry>
      <name>Alex</name>
      <height>173.5</height>
    </entry>
    <entry>
      <name>Mel</name>
      <height>180.4</height>
    </entry>
  </population>
`

const json = await parser.parseString(xml, false)

const object = await parser.parseFile('/a/xml/file/somewhere.xml')

```

## API

### `async parseString(xmlString[, parse])`
 - `xmlString` - A string that represents an XML
 - `parse` - Parse JSON string to Object. default `true`
 Returns `Object` or `String` dependently on the `parse` argument value.

### `async parseFile(filePath[, parse])`
 - `filePath` - Relative or absolute path to an `.xml` file
 - `parse` - Parse JSON string to Object. default `true`
 Returns `Object` or `String` dependently on the `parse` argument value.


## Benchmark (TO BE CLARIFIED)
Results from a i7 2.2 Ghz

```
Package                 Time taken
----------------------  ----------
parser-xml2json (rust)  0.0468 s
xml2js (js)             0.1286 s
xml2json (js and c++)   0.1329 s
```

### How to run the benchmark script on your machine

```
npm i
npm i benchmark/
node benchmark/index.js
```

## License

MIT
