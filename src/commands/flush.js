const axios = require('axios')

const { Command, flags } = require('@oclif/command')

const { getAllData } = require('../utils/get-data')

class FlushCommand extends Command {
  async run () {
    const { flags } = this.parse(FlushCommand)

    const data = await getAllData(flags.url)

    await this.deleteAll(flags.url, data)

    this.log('Done.')
  }

  async deleteAll (url, data) {
    // delete order: snis, certificates, plugins, upstreams, consumers, routes, services
    await this.deleteResourceObjects(url, 'snis', data.snis)
    await this.deleteResourceObjects(url, 'certificates', data.certificates)
    await this.deleteResourceObjects(url, 'plugins', data.plugins)
    await this.deleteResourceObjects(url, 'upstreams', data.upstreams)
    await this.deleteResourceObjects(url, 'consumers', data.consumers)
    await this.deleteResourceObjects(url, 'routes', data.routes)
    await this.deleteResourceObjects(url, 'services', data.services)
  }

  async deleteResourceObjects (url, resource, objects) {
    const requests = []
    for (let i = 0; i < objects.length; i++) {
      requests.push(this.delete(url, resource, objects[i]))
    }

    return Promise.all(requests)
  }

  async delete (url, resource, obj) {
    const urlToRequest = `${url}/${resource}/${obj.id}`
    try {
      return await axios.delete(urlToRequest)
    } catch (err) {
      if (err.response.status === 400) {
        this.log(`400 requesting ${urlToRequest}`)
        this.log(`Response data: ${JSON.stringify(err.response.data, null, 4)}`)
      } else {
        this.log(err.message)
        this.log(err.response)
      }
    }
  }
}

FlushCommand.description = `Flush available Kong data

It requests the endpoints getting the available data and calls the DELETE endpoints.
`

FlushCommand.flags = {
  url: flags.string({ default: 'http://localhost:8001', description: 'URL of the Kong Admin API' })
}

module.exports = FlushCommand
