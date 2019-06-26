const reader = require('./file-reader')
const merge = require('./merge-data').merge
const substitutions = require('./substitutions')

const Parser = () => {}

Parser.parse = (file, config) => {
  let unparsedData
  if (typeof file === 'string') {
    unparsedData = Parser.parseSingleFile(file)
  } else {
    unparsedData = Parser.parseMultipleFiles(file)
  }

  const updatedUnparsedData = substitutions.applyEnvironmentVariables(unparsedData, config)
  return JSON.parse(updatedUnparsedData)
}

Parser.parseSingleFile = (filepath) => {
  return reader.read(filepath).toString('utf-8')
}

Parser.parseMultipleFiles = (filepaths) => {
  const parsedUnmergedData = []
  for (const filepath of filepaths) {
    parsedUnmergedData.push(JSON.parse(Parser.parseSingleFile(filepath)))
  }

  const mergedData = merge(parsedUnmergedData)
  return JSON.stringify(mergedData)
}

module.exports = Parser
