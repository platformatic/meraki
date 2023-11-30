'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ConfigureEnvVarsTemplateAndPlugins.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import TemplateAndPluginTreeSelector from '~/components/template-and-plugins/TemplateAndPluginTreeSelector'
import { CSSTransition } from 'react-transition-group'
import TemplateEnvVarsForm from '~/components/templates/TemplateEnvVarsForm'
import PluginEnvVarsForm from '~/components/plugins/PluginEnvVarsForm'
import '~/components/component.animation.css'

function ConfigureEnvVarsTemplateAndPlugins ({
  configuredServices,
  handleChangeTemplateForm
}) {
  const [serviceSelected, setServiceSelected] = useState(null)
  const [pluginSelected, setPluginSelected] = useState(null)
  const [currentComponent, setCurrentComponent] = useState(<></>)

  useEffect(() => {
    console.log('useEffect configuredServices', configuredServices)
    if (configuredServices !== null) {
      setServiceSelected(configuredServices[0])
    }
  }, [configuredServices])

  function handleChangeTemplateEnvVars (event) {
    return handleChangeTemplateForm(event, serviceSelected.template, serviceSelected.name)
  }

  useEffect(() => {
    if (serviceSelected) {
      if (pluginSelected) {
        setCurrentComponent(<PluginEnvVarsForm service={{ ...serviceSelected }} plugin={{ ...pluginSelected }} key={pluginSelected.name} />)
      } else {
        setCurrentComponent(
          <TemplateEnvVarsForm
            key={`${serviceSelected.name}-${serviceSelected.template}-${serviceSelected.updatedAt}`}
            configuredServices={configuredServices}
            serviceName={serviceSelected.name}
            templateName={serviceSelected.template}
            onChange={handleChangeTemplateEnvVars}
          />)
      }
    }
  }, [serviceSelected, pluginSelected])

  function onServiceSelected (service) {
    setPluginSelected(null)
    setServiceSelected(service)
  }

  function onPluginSelected (service, plugin) {
    setServiceSelected(service)
    setPluginSelected(plugin)
  }

  /* function handleChange (event) {
    const value = event.target.value
    validateField(event.target.name, value, setAllServices(allServices.map(service => {
      if (service.name === serviceSelected.name) {
        const { form, ...rest } = service
        const { _value, ...restForm } = form[event.target.name]
        const newForm = {}
        newForm[event.target.name] = {
          ...restForm,
          value
        }
        return {
          form: { ...newForm },
          ...rest
        }
      } else {
        return service
      }
    }))
    )
  }

  function validateField (fieldName, fieldValue, callback = () => {}) {
    const validations = allServices.find(service => service.name === serviceSelected.name).validations
    let tmpValid = validations[`${fieldName}Valid`]
    const formErrors = { ...validations.formErrors }
    switch (fieldName) {
      default:
        tmpValid = fieldValue.length > 0 && /^\S+$/g.test(fieldValue)
        formErrors[fieldName] = fieldValue.length > 0 ? (tmpValid ? '' : 'The field is not valid, make sure you are using regular characters') : ''
        break
    }
    const nextValidation = { ...validations, formErrors }
    nextValidation[`${fieldName}Valid`] = tmpValid
    setAllServices(allServices.map(service => {
      if (service.name === serviceSelected.name) {
        const { validations, ...rest } = service
        return {
          validations: nextValidation,
          ...rest
        }
      } else {
        return service
      }
    }))
    validateForm(nextValidation, callback())
  }

  function validateForm (validations, callback = () => {}) {
    // eslint-disable-next-line no-unused-vars
    const { _formErrors, ...restValidations } = validations
    const valid = Object.keys(restValidations).findIndex(element => restValidations[element] === false) === -1
    setAllServices(allServices.map(service => {
      if (service.name === serviceSelected.name) {
        const { validForm, ...rest } = service
        return {
          validations: valid,
          ...rest
        }
      } else {
        return service
      }
    }))
    return callback
  } */

  return (
    <div className={`${commonStyles.mediumFlexRow} ${commonStyles.itemsStart} ${styles.scrollableSection}`}>
      <TemplateAndPluginTreeSelector
        pluginSelected={pluginSelected}
        serviceSelected={serviceSelected}
        onTemplateSelected={onServiceSelected}
        onPluginSelected={onPluginSelected}
      />
      <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsStart} ${styles.scrollableSection}`}>
        <CSSTransition
          key={currentComponent.key}
          timeout={300}
          classNames='fade-vertical'
        >
          {currentComponent}
        </CSSTransition>
      </div>
    </div>
  )
}

ConfigureEnvVarsTemplateAndPlugins.propTypes = {
  /**
     * configuredServices
     */
  configuredServices: PropTypes.array,
  /**
   * handleChangeTemplateForm
  */
  handleChangeTemplateForm: PropTypes.func

}

ConfigureEnvVarsTemplateAndPlugins.defaultProps = {
  configuredServices: [],
  handleChangeTemplateForm: () => {}
}

export default ConfigureEnvVarsTemplateAndPlugins
