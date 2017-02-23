const mocha = require('mocha')
const path = require('path')
const expect = require('chai').expect

const lib = require('../lib')
const parseFile = lib.parseFile

const describe = mocha.describe
const it = mocha.it

const validFile = path.resolve(__dirname, './fixture/sample.xml')
const invalidFile = path.resolve(__dirname, './fixture/invalid-sample.xml')

describe('#parseFile(xmlString[, options], callback)', () => {
  it('should parse a valid xml file and return a JSON', (done) => {
    parseFile(validFile, (err, res) => {
      expect(err).to.be.null
      expect(res.slice(0, 10)).to.equal('{"CATALOG"')
      done()
    })
  })

  it('should parse a valid xml file and return a object', (done) => {
    parseFile(validFile, { object: true }, (err, res) => {
      expect(err).to.be.null
      expect(res.CATALOG.PLANT[0]).to.eql({
        AVAILABILITY: 31599,
        BOTANICAL: 'Sanguinaria canadensis',
        COMMON: 'Bloodroot',
        LIGHT: 'Mostly Shady',
        PRICE: '$2.44',
        ZONE: 4
      })
      done()
    })
  })

  it('should try to parse an invalid xml file and return an error', (done) => {
    parseFile(invalidFile, { object: true }, (err, res) => {
      expect(err).to.be.an('error')
      done()
    })
  })
})
