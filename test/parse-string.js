const mocha = require('mocha')
const fs = require('fs')
const path = require('path')
const expect = require('chai').expect

const lib = require('../lib')
const parseString = lib.parseString

const describe = mocha.describe
const it = mocha.it
const before = mocha.before

describe('#parseString(xmlString[, options], callback)', () => {
  let validXmlContent, invalidXmlContent

  before((done) => {
    fs.readFile(path.resolve(__dirname, './fixture/sample.xml'), 'utf8', (err, content) => {
      if (err) {
        return done(err)
      }
      validXmlContent = content

      fs.readFile(path.resolve(__dirname, './fixture/invalid-sample.xml'), 'utf8', (err, content) => {
        if (err) {
          return done(err)
        }
        invalidXmlContent = content
      })

      done()
    })
  })

  it('should parse a valid xml string and return a JSON', (done) => {
    parseString(validXmlContent, (err, res) => {
      expect(err).to.be.null
      expect(res.slice(0, 10)).to.equal('{"CATALOG"')
      done()
    })
  })

  it('should parse a valid xml string and return a object', (done) => {
    parseString(validXmlContent, { object: true }, (err, res) => {
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

  it('should try to parse an invalid xml string and return an error', (done) => {
    parseString(invalidXmlContent, { object: true }, (err, res) => {
      expect(err).to.be.an('error')
      done()
    })
  })
})
