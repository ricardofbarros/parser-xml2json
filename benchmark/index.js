const RUNS = 30

const fs = require('fs')
const async = require('async')
const path = require('path')
const Table = require('easy-table')

const table = new Table()

const xmlPath = path.resolve(__dirname, '../test/fixture/sample.xml')
const xmlString = fs.readFileSync(xmlPath, 'utf-8')

// Contestants
const parserXmlToJson = require('../lib').parseString
const xml2js = require('xml2js').parseString
const xml2json = require('xml2json').toJson

const parseFloat = (num) => num.toFixed(4) + ' s'

function runAsync (fn, opts, done) {
  let i = RUNS
  let timeTaken = 0
  let startTime
  let diff

  async.until(
    () => i === 0,
    (next) => {
      startTime = process.hrtime()

      fn(xmlString, (err, res) => {
        diff = process.hrtime(startTime)

        if (err) {
          return next(err)
        }

        timeTaken = timeTaken + diff[0] * 1e9 + diff[1]
        i--
        next()
      })
    },
    (err) => {
      if (err) throw err

      done(parseFloat(timeTaken / 1000000000))
    }
  )
}

function runSync (fn, opts) {
  let i = RUNS
  let timeTaken = 0
  let startTime
  let diff

  for (; i !== 0; i--) {
    startTime = process.hrtime()
    fn(xmlString, opts)
    diff = process.hrtime(startTime)

    timeTaken = timeTaken + diff[0] * 1e9 + diff[1]
  }

  return parseFloat(timeTaken / 1000000000)
}

async.series([
  (next) => {
    const timeTaken = runSync(
      async(opts) => {await parserXmlToJson(opts)},
      {}
    )

    table.cell('Package', 'parser-xml2json (rust)')
    table.cell('Time taken', timeTaken)
    table.newRow()
    next()
  },
  (next) => runAsync(xml2js, {}, (timeTaken) => {
    table.cell('Package', 'xml2js (js)')
    table.cell('Time taken', timeTaken)
    table.newRow()
    next()
  }),
  (next) => {
    const timeTaken = runSync(
      xml2json,
      { object: true }
    )

    table.cell('Package', 'xml2json (js and c++)')
    table.cell('Time taken', timeTaken)
    table.newRow()
    next()
  }
], () => console.log(table.toString()))
