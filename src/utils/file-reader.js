const fs = require('fs')

const Reader = () => {}

Reader.read = (filepath) => {
  return fs.readFileSync(filepath)
}

module.exports = Reader
