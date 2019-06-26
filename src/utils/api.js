const axios = require('axios')

const Api = () => {}

Api.delete = async (log, url, resource, obj) => {
  const urlToRequest = `${url}/${resource}/${obj.id}`
  try {
    return await axios.delete(urlToRequest)
  } catch (err) {
    if (err.response.status === 400) {
      log(`400 requesting ${urlToRequest}`)
      log(`Response data: ${JSON.stringify(err.response.data, null, 4)}`)
    } else {
      log(err.message)
      log(err.response)
    }
  }
}

Api.create = async (log, url, resource, obj) => {
  const urlToRequest = `${url}/${resource}`

  try {
    return await axios.post(urlToRequest, obj)
  } catch (err) {
    if (err.response.status === 400) {
      log(`400 requesting ${urlToRequest}`)
      log(`Response data: ${JSON.stringify(err.response.data, null, 4)}`)
    } else {
      log(err.message)
      log(err.response)
    }
  }
}

Api.update = async (log, url, resource, obj) => {
  const urlToRequest = `${url}/${resource}/${obj.id}`

  try {
    return await axios.put(urlToRequest, obj)
  } catch (err) {
    if (err.response.status === 400) {
      log(`400 requesting ${urlToRequest}`)
      log(`Response data: ${JSON.stringify(err.response.data, null, 4)}`)
    } else {
      log(err.message)
      log(err.response)
    }
  }
}

module.exports = Api
