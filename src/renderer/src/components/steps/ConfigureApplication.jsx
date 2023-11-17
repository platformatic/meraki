'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ConfigureApplication.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, TRANSPARENT } from '@platformatic/ui-components/src/components/constants'
import { Button } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import EditableTitle from '~/components/ui/EditableTitle'
import '~/components/component.animation.css'
import Forms from '@platformatic/ui-components/src/components/forms'

const ConfigureApplication = React.forwardRef(({ onNext }, ref) => {
  const globalState = useStackablesStore()
  const { formData, services, addFormData } = globalState
  const logLevels = ['trace', 'info', 'debug', 'warn', 'error']
  const [form, setForm] = useState({ entryPoint: services[0].name, port: '', logLevel: 'trace', createGitHubRepository: true, installGitHubActions: true })
  const [validations, setValidations] = useState({ portValid: false, formErrors: { port: '' } })
  // eslint-disable-next-line no-unused-vars
  const [validForm, setValidForm] = useState(false)

  function onClickGenerateApp () {
    onNext()
  }

  function handleEditApplicationName (newName) {
    addFormData({
      createApplication: {
        application: newName,
        service: formData.createApplication.service
      }
    })
  }

  function handleChange (event) {
    const isCheckbox = event.target.type === 'checkbox'
    const value = isCheckbox ? event.target.checked : event.target.value
    validateField(event.target.name, value, setForm(form => ({ ...form, [event.target.name]: value })))
  }

  function validateField (fieldName, fieldValue, callback = () => {}) {
    let portValid = validations.portValid
    const formErrors = { ...validations.formErrors }
    switch (fieldName) {
      case 'port':
        portValid = fieldValue.length > 0 && !isNaN(fieldValue) && Number(fieldValue) >= 0 && Number(fieldValue) <= 65536 && /^\S+$/g.test(fieldValue)
        formErrors.port = fieldValue.length > 0 ? (portValid ? '' : 'The field is not valid, make sure you are putting a value between 0 and 65536') : ''
        break
      default:
        break
    }
    const nextValidation = {
      ...validations,
      portValid,
      formErrors
    }
    setValidations(nextValidation)
    validateForm(nextValidation, callback())
  }

  function validateForm (validations, callback = () => {}) {
    setValidForm(validations.portValid)
    return callback
  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={commonStyles.largeFlexBlock}>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.halfWidth}`}>
          <EditableTitle
            title={formData.createApplication.application}
            iconName='AppIcon'
            onClickSubmit={(name) => handleEditApplicationName(name)}
            dataAttrName='cy'
            dataAttrValue='step-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template and plugins for your service from our Stackables Marketplace. Once you have chosen a template you can add another Service.</p>
        </div>
        <div className={`${styles.customFlexBlock} ${commonStyles.fullWidth}`}>
          <Forms.Field
            title='EntryPoint'
            helper='Select a service as entrypoint of your Application'
            required
            titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
            helperClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          >
            <div className={commonStyles.smallFlexRow}>
              {services.map(service => (
                <Button
                  key={service.id}
                  type='button'
                  label={service.name}
                  onClick={() => setForm(form => ({ ...form, entryPoint: service.name }))}
                  color={WHITE}
                  backgroundColor={TRANSPARENT}
                  classes={commonStyles.buttonPadding}
                  selected={service.name === form.entryPoint}
                />
              ))}
            </div>
          </Forms.Field>

          <Forms.Field
            title='Port Number'
            titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
            required
          >
            <Forms.Input
              placeholder='Enter port number'
              name='port'
              borderColor={WHITE}
              value={form.port}
              onChange={handleChange}
              errorMessage={validations.formErrors.port}
              backgroundTransparent
              inputTextClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}
              verticalPaddingClassName={commonStyles.noVerticalPadding}
            />
          </Forms.Field>

          <Forms.Field
            title='Log Level'
            helper='Select a service as entrypoint of your Application'
            titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
            helperClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
            required
          >
            <div className={commonStyles.smallFlexRow}>
              {logLevels.map(logLevel => (
                <Button
                  key={logLevel}
                  type='button'
                  label={logLevel.charAt(0).toUpperCase() + logLevel.slice(1)}
                  onClick={() => setForm(form => ({ ...form, logLevel }))}
                  color={WHITE}
                  backgroundColor={TRANSPARENT}
                  selected={logLevel === form.logLevel}
                  classes={commonStyles.buttonPadding}
                />
              ))}
            </div>
          </Forms.Field>

          <Forms.Field
            title='Create Git Repository'
            helper='Create a Git Repository for you Application'
            titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
            helperClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          >
            <Forms.ToggleSwitch
              label='Toggle on will create a GitHub repository'
              labelClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
              name='createGitHubRepository'
              onChange={handleChange}
              checked={form.createGitHubRepository}
            />
          </Forms.Field>

          <Forms.Field
            title='Install GitHub Actions'
            helper='Install GitHub Actions to your Application'
            titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
            helperClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          >
            <Forms.ToggleSwitch
              label='Toggle on will install the the GitHub actions'
              labelClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
              name='installGitHubActions'
              onChange={handleChange}
              checked={form.installGitHubActions}
            />
          </Forms.Field>

        </div>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          disabled={!validForm}
          label='Generate App'
          onClick={() => onClickGenerateApp()}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          classes={`${commonStyles.buttonPadding} cy-action-next`}
        />
      </div>
    </div>
  )
})

ConfigureApplication.propTypes = {
  /**
     * onNext
     */
  onNext: PropTypes.func
}

ConfigureApplication.defaultProps = {
  onNext: () => {}
}

export default ConfigureApplication
