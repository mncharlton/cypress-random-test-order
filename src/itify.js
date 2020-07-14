'use strict'

const debug = require('debug')('cypress-select-tests')
const through = require('through')
const specParser = require('./spec-parser')

function process(config, source) {

  const random = config.env.random

  debug('Cypress config %O', config)

  const foundTests = specParser.findTests(source)
  if (!foundTests.length || !random) {
    return source
  }

  const processed = specParser.randomiseTests(source)

  return processed
}

// good example of a simple Browserify transform is
// https://github.com/thlorenz/varify
module.exports = function itify(config) {
  return function itifyTransform(filename) {
    debug('file %s', filename)

    let data = ''

    function ondata(buf) {
      data += buf
    }

    function onend() {
      this.queue(process(config, data))
      this.emit('end')
    }

    return through(ondata, onend)
  }
}
