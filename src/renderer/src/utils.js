export const generateForm = (services, addUpdatedAt = true) => {
  const tmpServices = []
  let tmpTemplateForms = {}
  let tmpTemplateValidations = {}
  let tmpTemplateValidForm = {}
  let tmpObj = {}

  services.forEach(service => {
    tmpTemplateForms = {}
    tmpTemplateValidations = {}
    tmpTemplateValidForm = {}
    tmpObj = {}

    tmpObj.name = service.name
    tmpObj.template = service.template.name
    let form
    let validations
    let formErrors

    if (service.template.envVars.length > 0) {
      form = {}
      validations = {}
      formErrors = {}
      service.template.envVars.forEach(envVar => {
        const { var: envName, configValue, type, default: envDefault, label } = envVar
        const value = envDefault || ''
        form[envName] = {
          label,
          var: envName,
          value: String(value),
          configValue,
          type
        }
        validations[`${envName}Valid`] = value !== ''
        formErrors[envName] = ''
      })
      tmpTemplateForms = { ...form }
      tmpTemplateValidations = { ...validations, formErrors }
      tmpTemplateValidForm = Object.keys(validations).findIndex(element => validations[element] === false) === -1
    }
    tmpObj.form = { ...tmpTemplateForms }
    tmpObj.validations = { ...tmpTemplateValidations }
    tmpObj.validForm = tmpTemplateValidForm
    if (addUpdatedAt) {
      tmpObj.updatedAt = new Date().toISOString()
    }
    // handling plugins
    tmpObj.plugins = []
    let pluginForm
    let pluginValidations
    let pluginFormErrors
    let tmpPluginObj

    (service?.plugins || []).forEach(plugin => {
      tmpPluginObj = {}
      pluginForm = {}
      pluginValidations = {}
      pluginFormErrors = {}

      if (plugin.envVars.length > 0) {
        plugin.envVars.forEach(envVar => {
          const { name: envName, type, default: envDefault, path } = envVar
          const value = envDefault || ''
          pluginForm[envName] = {
            path,
            value,
            type
          }
          pluginValidations[`${envName}Valid`] = value !== ''
          pluginFormErrors[envName] = ''
        })
      }
      tmpPluginObj = {
        name: plugin.name,
        form: { ...pluginForm },
        validations: { ...pluginValidations, formErrors: { ...pluginFormErrors } },
        validForm: Object.keys(pluginValidations).findIndex(element => pluginValidations[element] === false) === -1
      }
      if (addUpdatedAt) {
        tmpPluginObj.updatedAt = new Date().toISOString()
      }
      tmpObj.plugins.push(tmpPluginObj)
    })
    tmpServices.push(tmpObj)
  })
  return tmpServices
}
