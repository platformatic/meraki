'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ConfigureServices.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, TRANSPARENT, ANTI_FLASH_WHITE, DULLS_BACKGROUND_COLOR, SMALL } from '@platformatic/ui-components/src/components/constants'
import { Button } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import Title from '~/components/ui/Title'
import '~/components/component.animation.css'
import ConfigureEnvVarsTemplateAndPlugins from './ConfigureEnvVarsTemplateAndPlugins'
import { generateForm, prepareFormForCreateApplication, generateFormForEditEnvironmentVariable } from '../../../utils'

const ConfigureServices = React.forwardRef(({ onNext, onBack }, ref) => {
  const globalState = useStackablesStore()
  const { formData, addFormData, services } = globalState
  const [disabled, setDisabled] = useState(true)
  const [configuredServices, setConfiguredServices] = useState([])

  useEffect(() => {
    if (services.length > 0) {
      const newServices = generateForm(services.filter(service => service.newService))
      const editedService = generateFormForEditEnvironmentVariable(services.filter(service => !service.newService))
      setConfiguredServices([...newServices, ...editedService])
    }
  }, [services])

  useEffect(() => {
    if (configuredServices) {
      setDisabled(configuredServices.find(configuredService => configuredService.validForm === false) !== undefined)
    }
  }, [configuredServices])

  function onClickConfigureApplication () {
    addFormData({
      configuredServices: { services: prepareFormForCreateApplication(configuredServices) }
    })
    onNext()
  }

  function handleChangeTemplateForm (event, templateName, serviceName) {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    const { form: newForm, validations: newValidations } = configuredServices.find(configuredService => configuredService.name === serviceName && configuredService.template === templateName)
    let tmpValid
    newForm[fieldName].value = fieldValue
    switch (fieldName) {
      default:
        tmpValid = fieldValue.length > 0 && /^\S+$/g.test(fieldValue)
        newValidations[`${fieldName}Valid`] = tmpValid
        newValidations.formErrors[fieldName] = tmpValid ? '' : 'The field is not valid, make sure you are using regular characters'
        break
    }
    setConfiguredServices(configuredServices => {
      return [...configuredServices.map(configuredService => {
        if (configuredService.name === serviceName && configuredService.template === templateName) {
          const { form, validations, validForm, ...rest } = configuredService
          const newObject = {
            ...rest,
            form: newForm,
            updatedAt: new Date().toISOString(),
            validations: newValidations,
            validForm: Object.keys(newValidations).findIndex(element => newValidations[element] === false) === -1
          }
          return newObject
        } else {
          return configuredService
        }
      })]
    })
  }

  function handleChangePluginForm (event, templateName, serviceName, pluginName) {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    const configuredServiceFound = configuredServices.find(configuredService => configuredService.name === serviceName && configuredService.template === templateName)
    const { form: newForm, validations: newValidations } = configuredServiceFound.plugins.find(plugin => plugin.name === pluginName)

    newForm[fieldName].value = fieldValue

    const tmpValid = fieldValue.length > 0 && /^\S+$/g.test(fieldValue)
    newValidations[`${fieldName}Valid`] = tmpValid
    newValidations.formErrors[fieldName] = tmpValid ? '' : 'The field is not valid, make sure you are using regular characters'

    const newFormValid = Object.keys(newValidations).findIndex(element => newValidations[element] === false) === -1

    setConfiguredServices(configuredServices => {
      return [...configuredServices.map(configuredService => {
        if (configuredService.name === serviceName && configuredService.template === templateName) {
          const { plugins, ...rest } = configuredService
          const newPlugins = plugins.map(plugin => {
            if (plugin.name === pluginName) {
              return {
                name: pluginName,
                form: newForm,
                updatedAt: new Date().toISOString(),
                validations: newValidations,
                validForm: newFormValid
              }
            } else {
              return plugin
            }
          })
          const newObject = {
            ...rest,
            plugins: newPlugins
          }
          return newObject
        } else {
          return configuredService
        }
      })]
    })
  }

  return (
    <>
      <div className={styles.container} ref={ref}>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
          <Title
            title={formData.createApplication.application}
            iconName='AppIcon'
            dataAttrName='cy'
            dataAttrValue='step-title'
          />
          <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template and plugins for your service from our Stackables Marketplace. <br />Once you have chosen a template you can add another Service.</p>
        </div>
        <ConfigureEnvVarsTemplateAndPlugins
          configuredServices={configuredServices}
          handleChangeTemplateForm={handleChangeTemplateForm}
          handleChangePluginForm={handleChangePluginForm}
        />
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          type='button'
          label='Back'
          onClick={() => onBack()}
          color={WHITE}
          backgroundColor={TRANSPARENT}
          paddingClass={`${commonStyles.buttonPadding} cy-action-back`}
          textClass={typographyStyles.desktopBody}
          platformaticIcon={{ iconName: 'ArrowLeftIcon', size: SMALL, color: WHITE }}
        />
        <Button
          disabled={disabled}
          label='Next - Configure Application'
          onClick={() => onClickConfigureApplication()}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          hoverEffect={DULLS_BACKGROUND_COLOR}
          hoverEffectProperties={{ changeBackgroundColor: ANTI_FLASH_WHITE }}
          paddingClass={`${commonStyles.buttonPadding} cy-action-next`}
          textClass={typographyStyles.desktopBody}
          platformaticIconAfter={{ iconName: 'ArrowRightIcon', size: SMALL, color: RICH_BLACK }}
        />
      </div>
    </>
  )
})

ConfigureServices.propTypes = {
  /**
     * onNext
     */
  onNext: PropTypes.func,
  /**
     * onBack
     */
  onBack: PropTypes.func
}

ConfigureServices.defaultProps = {
  onNext: () => {},
  onBack: () => {}
}

export default ConfigureServices
