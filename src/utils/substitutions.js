const R = require('ramda')

const Substitution = () => {}

class TypeNotImplemented extends Error {
  constructor (message) {
    super(message)
    this.name = 'TypeNotImplemented'
  }
}

Substitution.applyEnvironmentVariables = (data, config) => {
  if (!config || !config.substitutions || !config.substitutions.environment_variables || !config.substitutions.environment_variables.enabled) {
    return data
  }

  // allow everything if white_list is not present and substitute environment variables is enabled
  const environmentVariablesConfig = config.substitutions.environment_variables
  const whiteListEnvironmentVariables = environmentVariablesConfig.white_list || Object.keys(process.env)
  const objToUpdate = R.pick(whiteListEnvironmentVariables, process.env)

  let modifiedData = data
  if (environmentVariablesConfig.types) {
    for (const [environmentVariable, typeDefinition] of Object.entries(environmentVariablesConfig.types)) {
      if (objToUpdate[environmentVariable] === undefined) {
        continue
      }

      if (['list', 'array'].includes(typeDefinition.toLowerCase())) {
        const valueToBeReplaced = R.map(
          obj => {
            if (isNaN(obj)) {
              return `"${obj}"`
            } else {
              return parseInt(obj)
            }
          },
          objToUpdate[environmentVariable].split(',')
        ).join(', ')

        modifiedData = R.replace(
          new RegExp('"\\${' + environmentVariable + '}"', 'g'),
          `[${valueToBeReplaced}]`,
          modifiedData
        )
      } else if (['bool', 'boolean'].includes(typeDefinition.toLowerCase())) {
        modifiedData = R.replace(
          new RegExp('"\\${' + environmentVariable + '}"', 'g'),
          objToUpdate[environmentVariable].toLowerCase(),
          modifiedData
        )
      } else {
        throw new TypeNotImplemented(typeDefinition)
      }
      delete objToUpdate[environmentVariable]
    }
  }

  for (const key in objToUpdate) {
    modifiedData = R.replace(new RegExp('\\${' + key + '}', 'g'), objToUpdate[key], modifiedData)
  }

  return modifiedData
}

module.exports = Substitution
