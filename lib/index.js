const ffi = require('ffi')
const path = require('path')
const fs = require('fs')

// Import rust lib
const rustEmbedLocation = path.join(__dirname, '../target/release/libembed')
const rustLib = ffi.Library(rustEmbedLocation, {
  parser: ['void', ['string', 'pointer']]
})

function parseString (content, options, done) {
  if (typeof options === 'function') {
    done = options
    options = {}
  }

  let callback = ffi.Callback('void', ['int', 'string'], (err, res) => {
    if (err) {
      return done(new Error(res))
    }

    if (options.object) {
      try {
        res = JSON.parse(res)
      } catch (e) {
        return done(e)
      }
    }

    done(null, res)
  })

  rustLib.parser(content, callback)
}

function parseFile (filePath, options, done) {
  fs.readFile(path.resolve(filePath), 'utf8', (err, content) => {
    if (err) {
      return done(err)
    }

    parseString(content, options, done)
  })
}

module.exports = {
  parseString,
  parseFile
}
