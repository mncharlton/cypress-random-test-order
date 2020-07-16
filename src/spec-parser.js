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

  const contextBlockArray = falafel(source, onNode).toString().split(/(?=\scontext\()/)
  let output = []

  if (contextBlockArray.length !== 2) {
    // We have context blocks
    contextBlockArray.forEach((context, i) => {
      const itBlockArray = context.split(/(?=\sit\()/)

      if (i !== 0) {
        shuffledContext = (i === contextBlockArray.length - 1)
          ? shuffleItBlocks(itBlockArray, true)
          : shuffleItBlocks(itBlockArray)
        shuffledContext.push('});')  //close the context
        output.push(shuffledContext.join(''))
      } else {
        output.push(itBlockArray[0])
      }
    })
  } else {
    // We don't have context blocks
    const itBlockArray = falafel(source, onNode).toString().split(/(?=\sit\()/)//('it(')
    shuffledItBlocks = shuffleItBlocks(itBlockArray)

    output.push(shuffledItBlocks.join(''))
  }

  // close the describe block
  output.push('});')
  console.log(output.join(''))
  return output.join('')
}

const shuffleItBlocks = (arrayOfItBlocks, finalContext = false) => {
  const shuffledItBlocks = []
  const itBlocks = []

  let finalBrackets = arrayOfItBlocks[arrayOfItBlocks.length - 1].lastIndexOf('});')
  let finalItBlock = arrayOfItBlocks[arrayOfItBlocks.length - 1].substr(0, finalBrackets)

  if (finalContext) {
    //In the last context block, handle the describes closing brackets
    finalBrackets = finalItBlock.lastIndexOf('});')
    finalItBlock = finalItBlock.substr(0, finalBrackets)
  }


  for (let i = 1; i <= arrayOfItBlocks.length - 2; i++) {
    itBlocks.push(arrayOfItBlocks[i])
  }
  itBlocks.push(finalItBlock)

  // put it back together
  shuffledItBlocks.push(arrayOfItBlocks[0])
  let selection
  while (itBlocks.length > 0) {
    selection = Math.floor(Math.random() * itBlocks.length)
    shuffledItBlocks.push(itBlocks[selection])
    itBlocks.splice(selection, 1)
  }
  return shuffledItBlocks
}

module.exports = {
  findTests,
  randomiseTests
}
