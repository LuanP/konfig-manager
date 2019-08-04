const R = require('ramda')

const Data = () => {}

Data.merge = (dataList) => {
  const mergedData = dataList[0]

  for (let i = 1; i < dataList.length; i++) {
    const currentData = dataList[i]
    for (const collectionKey in currentData) {
      // collectionKey e.g.: plugins, consumers, services, routes, ...
      const currentIds = R.map(obj => obj.id, currentData[collectionKey])
      const filteredData = R.filter(obj => !currentIds.includes(obj.id), mergedData[collectionKey])
      mergedData[collectionKey] = R.concat(filteredData, currentData[collectionKey])
    }
  }

  return mergedData
}

module.exports = Data
