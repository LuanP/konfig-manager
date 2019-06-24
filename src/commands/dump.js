const fs = require('fs')

const R = require('ramda')

const { flags } = require('@oclif/command')

const Command = require('../base')
const { getAllData } = require('../utils/get-data')

class DumpCommand extends Command {
  async run () {
    const { flags } = this.parse(DumpCommand)

    const outputData = await getAllData(flags.url)
    const data = this.applySubstitutions(outputData, this.cmdConfig)

    const file = fs.createWriteStream(flags.file)
    file.write(
      Buffer.from(
        JSON.stringify(data, null, 4)
      )
    )
  }

  applySubstitutions (data, config) {
    if (!config || !config.substitutions) {
      return data
    }

    const keys = Object.keys(config.substitutions)
    for (let key of keys) {
      if (!data[key] || !data[key].length) {
        continue
      }

      let currentExceptions = []
      if (config.exceptions && config.exceptions[key]) {
        currentExceptions = config.exceptions[key]
      }

      for (let i = 0; i < data[key].length; i++) {
        let exceptionFound = false
        for (let exceptionIndex = 0; exceptionIndex < currentExceptions.length; exceptionIndex++) {
          const currentException = currentExceptions[exceptionIndex]

          if (data[key][i][currentException.key] && data[key][i][currentException.key] === currentException.value) {
            exceptionFound = true
            break
          }
        }

        if (exceptionFound) {
          continue
        }

        data[key][i] = R.mergeDeepRight(data[key][i], config.substitutions[key])
      }
    }

    return data
  }
}

DumpCommand.description = `Dump available Kong data in a file

It requests data from Kong API endpoints and save the results in a file.
`

DumpCommand.flags = {
  file: flags.string({ default: 'konfig.json', description: 'name of file to be created as output' }),
  url: flags.string({ default: 'http://localhost:8001', description: 'URL of the Kong Admin API' })
  // TODO: endpoints:
}

module.exports = DumpCommand
