const selectTests = require('./src')
const { itify } = require('./src/itify')

const allTests = config => selectTests(config, itify)

module.exports = allTests
