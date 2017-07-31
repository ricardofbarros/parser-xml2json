const {parser} = require('../native')
const path = require('path')
const fs = require('fs')


async function parseString(content, parse = true) {
	const start = new Date()

	const result = parser(content)
	const finish = new Date()
	console.log(`Parsed in ${(finish - start) / 1000}s`)

	if(result[0] !== '{')
		throw new Error(result)
	else
		return parse ? JSON.parse(result) : result
}

async function parseFile (filePath, options) {
	const content = fs.readFileSync(path.resolve(filePath), 'utf8')
	return await parseString(content, options)
}

module.exports = {
	parseString,
	parseFile,
}
