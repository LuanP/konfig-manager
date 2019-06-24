const { Command } = require('@oclif/command')

const rc = require('rc')

class CustomCommand extends Command {
  async init () {
    const { flags } = this.parse(this.constructor)
    this.flags = flags

    const appConfig = rc('konfig', {})
    if (appConfig && appConfig._.length && Object.keys(appConfig).includes(appConfig._[0])) {
      this.cmdConfig = appConfig[appConfig._[0]]
    }
  }
}

module.exports = CustomCommand
