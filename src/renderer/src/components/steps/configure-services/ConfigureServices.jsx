'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ConfigureServices.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, TRANSPARENT } from '@platformatic/ui-components/src/components/constants'
import { Button } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import Title from '~/components/ui/Title'
import '~/components/component.animation.css'
import ConfigureEnvVarsTemplateAndPlugins from './ConfigureEnvVarsTemplateAndPlugins'
import { generateForm } from '../../../utils'

const ConfigureServices = React.forwardRef(({ onNext, onBack }, ref) => {
  const globalState = useStackablesStore()
  const { formData, addFormData, services } = globalState
  const [disabled, setDisabled] = useState(true)
  const [configuredServices, setConfiguredServices] = useState([])

  useEffect(() => {
    if (services.length > 0) {
      setConfiguredServices(generateForm(services))
    }
  }, [services])

  useEffect(() => {
    if (configuredServices) {
      setDisabled(configuredServices.find(configuredService => configuredService.validForm === false) !== undefined)
    }
  }, [configuredServices])

  function onClickConfigureApplication () {
    const services = configuredServices.map(({ name, template, form }) => ({
      name,
      template,
      fields: Object.keys(form).map(k => {
        const { label, ...rest } = form[k]
        return { ...rest }
      })
    }))
    addFormData({
      configuredServices: { services }
    })
    onNext()
  }

  function handleChangeTemplateForm (event, templateName, serviceName) {
    const fieldName = event.target.name
    const fieldValue = event.target.value
    const { form: newForm, validations: newValidations } = configuredServices.find(configuredService => configuredService.name === serviceName && configuredService.template === templateName)

    newForm[fieldName].value = fieldValue

    let tmpValid = newValidations[`${fieldName}Valid`]
    const formErrors = { ...newValidations.formErrors }
    switch (fieldName) {
      default:
        tmpValid = fieldValue.length > 0 && /^\S+$/g.test(fieldValue)
        formErrors[fieldName] = fieldValue.length > 0 ? (tmpValid ? '' : 'The field is not valid, make sure you are using regular characters') : ''
        break
    }
    const nextValidation = { ...newValidations, formErrors }
    nextValidation[`${fieldName}Valid`] = tmpValid

    const newFormValid = Object.keys(nextValidation).findIndex(element => nextValidation[element] === false) === -1

    setConfiguredServices(configuredServices => {
      return [...configuredServices.map(configuredService => {
        if (configuredService.name === serviceName && configuredService.template === templateName) {
          const { form, validations, validForm, ...rest } = configuredService
          const newObject = {
            form: newForm,
            updatedAt: new Date().toISOString(),
            validations: nextValidation,
            validForm: newFormValid,
            ...rest
          }
          return newObject
        } else {
          return configuredService
        }
      })]
    })
  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={commonStyles.largeFlexBlock}>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.halfWidth}`}>
          <Title
            title={formData.createApplication.application}
            iconName='AppIcon'
            dataAttrName='cy'
            dataAttrValue='step-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template and plugins for your service from our Stackables Marketplace. Once you have chosen a template you can add another Service.</p>
        </div>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.content}`}>
          <ConfigureEnvVarsTemplateAndPlugins
            configuredServices={configuredServices}
            handleChangeTemplateForm={handleChangeTemplateForm}
          />
        </div>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          type='button'
          label='Back'
          onClick={() => onBack()}
          color={WHITE}
          backgroundColor={TRANSPARENT}
          classes={`${commonStyles.buttonPadding} cy-action-back`}
        />
        <Button
          disabled={disabled}
          label='Next - Configure Application'
          onClick={() => onClickConfigureApplication()}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          classes={`${commonStyles.buttonPadding} cy-action-next`}
        />
      </div>
    </div>
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
