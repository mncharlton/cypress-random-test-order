const falafel = require('falafel')
const debug = require('debug')('cypress-select-tests')

const isTestBlock = name => node => {
  return (
    node.type === 'CallExpression' &&
    node.callee &&
    node.callee.type === 'Identifier' &&
    node.callee.name === name
  )
}

const isDescribe = isTestBlock('describe')

const isContext = isTestBlock('context')

const isIt = isTestBlock('it')

const getItsName = node => node.arguments[0].value

/**
 * Given an AST test node, walks up its parent chain
 * to find all "describe" or "context" names
 */
const findSuites = (node, names = []) => {
  if (!node) {
    return
  }

  if (isDescribe(node) || isContext(node)) {
    names.push(getItsName(node))
  }

  return findSuites(node.parent, names)
}

const findTests = source => {
  const foundTestNames = []

  const onNode = node => {

    if (isIt(node)) {
      const names = [getItsName(node)]
      findSuites(node, names)
      // we were searching from inside out, thus need to revert the names
      const testName = names.reverse()
      foundTestNames.push(testName)
    }
  }

  // ignore source output for now
  falafel(source, onNode)

  return foundTestNames
}

const randomiseTests = (source) => {
  const onNode = node => {

    if (isIt(node)) {
      const names = [getItsName(node)]
      findSuites(node, names)
    }
  }

  const testCode = falafel(source, onNode).toString().split(/(?=\sit\()/)//('it(')

  const finalBrackets = testCode[testCode.length - 1].lastIndexOf('});')

  const finalTest = testCode[testCode.length - 1].substr(0, finalBrackets)
  const sourceMap = testCode[testCode.length - 1].substr(finalBrackets + 4)

  const itBlocks = []

  for (let i = 1; i <= testCode.length - 2; i++) {
    itBlocks.push(testCode[i])
  }
  itBlocks.push(finalTest)

  let output = []
  output.push(testCode[0])

  let selection
  while (itBlocks.length > 0) {
    selection = Math.floor(Math.random() * itBlocks.length)
    output.push(itBlocks[selection])
    itBlocks.splice(selection, 1)
  }

  output.push(`});\n${sourceMap}`)

  return output.join('')
}

module.exports = {
  findTests,
  randomiseTests
}
