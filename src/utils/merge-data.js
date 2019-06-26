const R = require('ramda')

const Data = () => {}

Data.merge = (dataList) => {
  const mergedData = dataList[0]

  for (let i = 1; i < dataList.length; i++) {
    const currentData = dataList[i]
    for (const collectionKey in currentData) {
      // collectionKey e.g.: plugins, consumers, services, routes, ...
      mergedData[collectionKey] = R.unionWith(
        R.eqBy(R.prop('id')),
        currentData[collectionKey],
        mergedData[collectionKey]
      )
    }
  }

  return mergedData
}

module.exports = Data
