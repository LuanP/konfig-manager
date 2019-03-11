const fs = require('fs')

const R = require('ramda')
const axios = require('axios')

const { Command, flags } = require('@oclif/command')

class DumpCommand extends Command {
  async run () {
    const { flags } = this.parse(DumpCommand)

    const outputData = {}

    outputData.plugins = await this.getData(flags.url, 'plugins')
    outputData.consumers = await this.getData(flags.url, 'consumers')
    outputData.services = await this.getData(flags.url, 'services')
    outputData.routes = await this.getData(flags.url, 'routes')
    outputData.upstreams = await this.getData(flags.url, 'upstreams')
    outputData.certificates = await this.getData(flags.url, 'certificates')
    outputData.snis = await this.getData(flags.url, 'snis')

    const file = fs.createWriteStream(flags.file)
    file.write(
      Buffer.from(
        JSON.stringify(outputData, null, 4)
      )
    )
  }

  async getData (url, route) {
    const omitKeys = ['created_at', 'updated_at']
    const response = await axios.get(`${url}/${route}`)
    return R.map(R.omit(omitKeys), response.data.data)
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
