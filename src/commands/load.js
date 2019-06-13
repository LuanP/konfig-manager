const fs = require('fs')

const R = require('ramda')
const axios = require('axios')

const { Command, flags } = require('@oclif/command')

class LoadCommand extends Command {
  async run () {
    const { flags } = this.parse(LoadCommand)
    const data = JSON.parse(fs.readFileSync(flags.file))

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

LoadCommand.description = `Load available Kong data from a file

It gets data from a file and loads in Kong Admin API endpoints.
`

LoadCommand.flags = {
  file: flags.string({ default: 'konfig.json', description: 'name of file to be loaded' }),
  url: flags.string({ default: 'http://localhost:8001', description: 'URL of the Kong Admin API' })
}

module.exports = LoadCommand
