const R = require('ramda')

const { flags } = require('@oclif/command')

const Command = require('../base')

const { getAllData } = require('../utils/get-data')
const parser = require('../utils/parse-files')
const api = require('../utils/api')

class SyncCommand extends Command {
  async run () {
    const { flags } = this.parse(SyncCommand)

    const fileData = parser.parse(flags.file, this.cmdConfig)
    const adminApiData = await getAllData(flags.url)

    await Promise.all([
      this.deleteDifferenceBetween(flags.url, fileData, adminApiData),
      this.addDifferenceBetween(flags.url, fileData, adminApiData),
      this.updateDifferenceBetween(flags.url, fileData, adminApiData)
    ])

    this.log('Sync completed.')
  }

  async deleteDifferenceBetween (url, fileData, adminApiData) {
    // deletes what's present in the responses from admin API
    // and it's not contained in the file data running on this sync
    const requests = []
    for (const collectionKey in adminApiData) {
      const currentFileCollection = fileData[collectionKey]
      const currentAdminApiCollection = adminApiData[collectionKey]

      const difference = R.differenceWith(
        R.eqBy(R.prop('id')),
        currentAdminApiCollection,
        currentFileCollection
      )

      R.map(
        (objToDelete) => {
          if (collectionKey === 'consumersJWTs') {
            requests.push(api.delete(this.log, url, `consumers/${objToDelete.consumer.id}/jwt`, objToDelete))
          } else {
            requests.push(api.delete(this.log, url, collectionKey, objToDelete))
          }
        }, difference
      )

      if (difference.length) {
        this.log('[DELETING]', collectionKey)
        this.log(JSON.stringify(difference, null, 2))
      }
    }

    return Promise.all(requests)
  }

  async addDifferenceBetween (url, fileData, adminApiData) {
    // adds what's is in the file data and was not found in the admin API responses
    // order should be respected when adding to avoid constraint violations
    const listOrder = ['services', 'routes', 'plugins', 'consumers', 'certificates', 'snis', 'consumersJWTs']
    for (const collectionKey of listOrder) {
      const requests = []
      const currentFileCollection = fileData[collectionKey]
      const currentAdminApiCollection = adminApiData[collectionKey]

      if (!currentAdminApiCollection && (!Array.isArray(currentFileCollection) || !currentFileCollection.length)) {
        continue
      }

      let difference
      if (!currentAdminApiCollection) {
        difference = currentFileCollection
      } else {
        difference = R.differenceWith(
          R.eqBy(R.prop('id')),
          currentFileCollection,
          currentAdminApiCollection
        )
      }

      R.map(
        (objToAdd) => {
          if (collectionKey === 'consumersJWTs') {
            requests.push(api.create(this.log, url, `consumers/${objToAdd.consumer.id}/jwt`, objToAdd))
          } else {
            requests.push(api.create(this.log, url, collectionKey, objToAdd))
          }
        }, difference
      )

      if (difference.length) {
        this.log('[ADDING]', collectionKey)
        this.log(JSON.stringify(difference, null, 2))
      }

      // finish all the requests before going to the next collection
      await Promise.all(requests)
    }
  }

  async updateDifferenceBetween (url, fileData, adminApiData) {
    // update what's is in the file data and in the admin API responses
    // if there's anything different between the objects
    // keeping the file as the final result
    const requests = []
    for (const collectionKey in fileData) {
      const currentFileCollection = fileData[collectionKey]
      const currentAdminApiCollection = adminApiData[collectionKey]

      if (!currentAdminApiCollection) {
        continue
      }

      const difference = R.differenceWith(
        R.eqBy(R.prop('id')),
        currentFileCollection,
        currentAdminApiCollection
      )

      for (let i = 0; i < currentFileCollection.length; i++) {
        const omitKeys = ['created_at', 'updated_at']

        const currentFileObj = currentFileCollection[i]
        const currentAdminApiObj = R.find(R.propEq('id', currentFileObj.id))(currentAdminApiCollection)

        if (currentAdminApiObj === undefined || R.equals(R.omit(omitKeys)(currentFileObj), currentAdminApiObj)) {
          continue
        }

        if (collectionKey === 'consumersJWTs') {
          requests.push(api.update(this.log, url, `consumers/${currentFileObj.consumer.id}/jwt`, currentFileObj))
        } else {
          requests.push(api.update(this.log, url, collectionKey, currentFileObj))
        }

        this.log('[UPDATING]', collectionKey)
        this.log('[FROM]')
        this.log(JSON.stringify(currentAdminApiObj, null, 2))
        this.log('[TO]')
        this.log(JSON.stringify(currentFileObj, null, 2))
      }
    }

    return Promise.all(requests)
  }
}

SyncCommand.description = `Sync data from file with a Kong Admin API

It gets data from a Kong Admin API and sync based on the files provided.
`

SyncCommand.flags = {
  file: flags.string({ default: 'konfig.json', description: 'name of file to be loaded', multiple: true }),
  url: flags.string({ default: 'http://localhost:8001', description: 'URL of the Kong Admin API' })
}

module.exports = SyncCommand
