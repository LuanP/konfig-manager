const R = require('ramda')

const Substitution = () => {}

Substitution.applyEnvironmentVariables = (data, config) => {
  if (!config || !config.substitutions || !config.substitutions.environment_variables || !config.substitutions.environment_variables.enabled) {
    return data
  }

  // allow everything if white_list is not present and substitute environment variables is enabled
  const whiteListEnvironmentVariables = config.substitutions.environment_variables.white_list || Object.keys(process.env)
  const objToUpdate = R.pick(whiteListEnvironmentVariables, process.env)

  let modifiedData = data
  for (const key in objToUpdate) {
    modifiedData = R.replace(new RegExp('\\${' + key + '}', 'g'), objToUpdate[key], modifiedData)
  }

  return modifiedData
}

module.exports = Substitution
