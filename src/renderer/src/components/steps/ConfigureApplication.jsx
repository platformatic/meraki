'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ConfigureApplication.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, TRANSPARENT/* , OPACITY_30 */ } from '@platformatic/ui-components/src/components/constants'
import { Button/* , BorderedBox, VerticalSeparator */ } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import Title from '~/components/ui/Title'
import '~/components/component.animation.css'
import Forms from '@platformatic/ui-components/src/components/forms'
import { TYPESCRIPT, JAVASCRIPT } from '~/ui-constants'

const ConfigureApplication = React.forwardRef(({ onNext, onBack }, ref) => {
  const globalState = useStackablesStore()
  const { formData, services, addFormData } = globalState
  const logLevels = ['trace', 'info', 'debug', 'warn', 'error']
  const [form, setForm] = useState({
    entryPoint: services[0].name,
    port: 3042,
    logLevel: 'info',
    language: TYPESCRIPT,
    createGitHubRepository: true,
    installGitHubActions: true
  })
  const [validations, setValidations] = useState({ portValid: false, formErrors: { port: '' } })
  // eslint-disable-next-line no-unused-vars
  const [validForm, setValidForm] = useState(false)

  function onClickGenerateApp () {
    addFormData({
      configureApplication: {
        entrypoint: form.entryPoint,
        port: form.port,
        logLevel: form.logLevel,
        typescript: form.language === TYPESCRIPT,
        createGitHubRepository: form.createGitHubRepository,
        installGitHubActions: form.installGitHubActions
      }
    })
    onNext()
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
      <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.halfWidth}`}>
          <Title
            title={formData.createApplication.application}
            iconName='AppIcon'
            dataAttrName='cy'
            dataAttrValue='step-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template and plugins for your service from our Stackables Marketplace. Once you have chosen a template you can add another Service.</p>
        </div>
        <div className={`${styles.customFlexBlock} ${commonStyles.halfWidth}`}>
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
                  key={service.name}
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
            title='Language'
            helper='Select a language for your Application'
            titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
            helperClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
            required
          >
            <div className={commonStyles.smallFlexRow}>
              {[TYPESCRIPT, JAVASCRIPT].map(language => (
                <Button
                  key={language}
                  type='button'
                  label={language.charAt(0).toUpperCase() + language.slice(1)}
                  onClick={() => setForm(form => ({ ...form, language }))}
                  color={WHITE}
                  backgroundColor={TRANSPARENT}
                  selected={language === form.language}
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

          {/* <BorderedBox color={WHITE} borderColorOpacity={30} backgroundColor={TRANSPARENT} classes={`${commonStyles.largeFlexRow}`}>

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

            <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} />

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
          </BorderedBox> */}
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
          type='button'
          disabled={!validForm}
          label='Generate App'
          onClick={() => onClickGenerateApp()}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          classes={`${commonStyles.buttonPadding} cy-action-next`}
          data-posthog='configure_application_done'
        />
      </div>
    </div>
  )
})

ConfigureApplication.propTypes = {
  /**
     * onNext
     */
  onNext: PropTypes.func,
  /**
     * onBack
     */
  onBack: PropTypes.func
}

ConfigureApplication.defaultProps = {
  onNext: () => {},
  onBack: () => {}
}

export default ConfigureApplication
