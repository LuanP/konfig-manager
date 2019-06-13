const axios = require('axios')
const R = require('ramda')

const Data = () => {}

Data.hasJWTPlugin = (plugins) => {
  if (!plugins || !plugins.length) {
    return false
  }

  return R.find((plugin) => plugin.name === 'jwt')(plugins) !== undefined
}

Data.hasConsumers = (consumers) => {
  return (consumers && consumers.length)
}

Data.getConsumerIDs = (consumers) => {
  return R.map((consumer) => consumer.id, consumers)
}

Data.getAllConsumersJWTs = (url, consumerIDs) => {
  return Promise.all(
    R.map(
      (consumerID) => Data.getDataFromResource(url, `consumers/${consumerID}/jwt`),
      consumerIDs
    )
  )
}

Data.getAllData = async (url) => {
  const result = {
    plugins: await Data.getDataFromResource(url, 'plugins'),
    consumers: await Data.getDataFromResource(url, 'consumers'),
    services: await Data.getDataFromResource(url, 'services'),
    routes: await Data.getDataFromResource(url, 'routes'),
    upstreams: await Data.getDataFromResource(url, 'upstreams'),
    certificates: await Data.getDataFromResource(url, 'certificates'),
    snis: await Data.getDataFromResource(url, 'snis')
  }

  if (Data.hasJWTPlugin(result.plugins) && Data.hasConsumers(result.consumers)) {
    const consumerIDs = Data.getConsumerIDs(result.consumers)
    result.consumersJWTs = [].concat(...(await Data.getAllConsumersJWTs(url, consumerIDs)))
  }

  return result
}

Data.getDataFromResource = async (url, resource) => {
  const omitKeys = ['created_at', 'updated_at']
  const response = await axios.get(`${url}/${resource}`)
  return R.map(R.omit(omitKeys), response.data.data)
}

module.exports = Data
