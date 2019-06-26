const fs = require('fs')

const R = require('ramda')
const axios = require('axios')

const { flags } = require('@oclif/command')

const Command = require('../base')

const mergeData = (dataList) => {
  const mergedData = dataList[0]

  for (let i = 1; i < dataList.length; i++) {
    const currentData = dataList[i]
    for (const collectionKey in currentData) {
      // collectionKey e.g.: plugins, consumers, services, routes, ...
      mergedData[collectionKey] = R.unionWith(
        R.eqBy(R.prop('id')),
        mergedData[collectionKey],
        currentData[collectionKey]
      )
    }
  }

  return mergedData
}

class LoadCommand extends Command {
  async run () {
    const { flags } = this.parse(LoadCommand)

    let unparsedData
    if (typeof flags.file === 'string') {
      const unparsedBufferData = LoadCommand.readConfigFile(flags.file)
      unparsedData = unparsedBufferData.toString('utf-8')
    } else {
      const dataList = []
      for (const filepath of flags.file) {
        const unparsedBufferData = LoadCommand.readConfigFile(filepath)
        dataList.push(JSON.parse(unparsedBufferData.toString('utf-8')))
      }

      const mergedData = mergeData(dataList)
      unparsedData = JSON.stringify(mergedData)
    }

    const updatedUnparsedData = this.applyEnvironmentVariablesSubstitutions(unparsedData, this.cmdConfig)
    const data = JSON.parse(updatedUnparsedData)

    await this.loadServices(flags.url, data.services)
    await this.loadRoutes(flags.url, data.routes)
    await this.loadPlugins(flags.url, data.plugins)
    await this.loadConsumers(flags.url, data.consumers)
    await this.loadCertificates(flags.url, data.certificates)
    await this.loadSnis(flags.url, data.snis)

    if (data.consumersJWTs) {
      await this.loadConsumersJWTs(flags.url, data.consumersJWTs)
    }

    this.log('All loaded. You\'re ready to go!')
  }

  applyEnvironmentVariablesSubstitutions (data, config) {
    if (!config || !config.substitutions || !config.substitutions.environment_variables || !config.substitutions.environment_variables.enabled) {
      return data
    }

    // allow everything if white_list is not present and substitute environment variables is enabled
    const whiteListEnvironmentVariables = config.substitutions.environment_variables.white_list || Object.keys(process.env)
    const objToUpdate = R.pick(whiteListEnvironmentVariables, process.env)

    let modifiedData = data
    for (const key in objToUpdate) {
      modifiedData = R.replace(new RegExp('\\${' + key + '}', 'g'), objToUpdate[key], modifiedData)
    }

    return modifiedData
  }

  async loadServices (url, services) {
    return this.loadDefault(url, services, 'services')
  }

  async loadRoutes (url, routes) {
    return this.loadDefault(url, routes, 'routes')
  }

  async loadPlugins (url, plugins) {
    return this.loadDefault(url, plugins, 'plugins')
  }

  async loadConsumers (url, consumers) {
    return this.loadDefault(url, consumers, 'consumers')
  }

  async loadCertificates (url, certificates) {
    return this.loadDefault(url, certificates, 'certificates')
  }

  async loadSnis (url, snis) {
    return this.loadDefault(url, snis, 'snis')
  }

  async loadConsumersJWTs (url, consumersJWTs) {
    return Promise.all(
      R.map(
        (consumerJWT) => this.loadDefault(url, [consumerJWT], `consumers/${consumerJWT.consumer.id}/jwt`),
        consumersJWTs
      )
    )
  }

  async loadDefault (url, data, resource) {
    const fn = async (body) => {
      const urlToRequest = `${url}/${resource}`

      try {
        await axios.post(urlToRequest, body)
      } catch (err) {
        if (err.response.status === 400) {
          this.log(`400 requesting ${urlToRequest}`)
          this.log(`Response data: ${JSON.stringify(err.response.data, null, 4)}`)
          // this.log(`Request body: ${JSON.stringify(body, null, 4)}`)
          this.log(`Request body: ${JSON.stringify(err.request.data, null, 4)}`)
        } else {
          this.log(err.message)
          this.log(err.response)
        }
      }
    }

    return Promise.all(R.map(fn, data))
  }
}

LoadCommand.readConfigFile = (filepath) => {
  return fs.readFileSync(filepath)
}

LoadCommand.description = `Load available Kong data from a file

It gets data from a file and loads in Kong Admin API endpoints.
`

LoadCommand.flags = {
  file: flags.string({ default: 'konfig.json', description: 'name of file to be loaded', multiple: true }),
  url: flags.string({ default: 'http://localhost:8001', description: 'URL of the Kong Admin API' })
}

module.exports = LoadCommand
