const axios = require('axios')
const R = require('ramda')

const Data = () => {}

Data.getAllData = async (url) => {
  return {
    plugins: await Data.getDataFromResource(url, 'plugins'),
    consumers: await Data.getDataFromResource(url, 'consumers'),
    services: await Data.getDataFromResource(url, 'services'),
    routes: await Data.getDataFromResource(url, 'routes'),
    upstreams: await Data.getDataFromResource(url, 'upstreams'),
    certificates: await Data.getDataFromResource(url, 'certificates'),
    snis: await Data.getDataFromResource(url, 'snis')
  }
}

Data.getDataFromResource = async (url, resource) => {
  const omitKeys = ['created_at', 'updated_at']
  const response = await axios.get(`${url}/${resource}`)
  return R.map(R.omit(omitKeys), response.data.data)
}

module.exports = Data
