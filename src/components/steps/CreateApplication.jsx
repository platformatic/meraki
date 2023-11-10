'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Forms from '@platformatic/ui-components/src/components/forms'
import styles from './CreateApplication.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, LARGE, RICH_BLACK } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import { Button } from '@platformatic/ui-components'

const CreateApplication = React.forwardRef(({ onNext }, ref) => {
  const [form, setForm] = useState({ application: '', service: '' })
  const [validations, setValidations] = useState({ applicationValid: false, serviceValid: false, formErrors: { application: '', service: '' } })
  const [validForm, setValidForm] = useState(false)

  function handleSubmit (event) {
    console.log('handleSubmit')
    event.preventDefault()
    /* addFormDataWizard({
      configureApplication: {
        name: form.name,
        workspaceTypeDynamic: form.workspaceTypeDynamic,
        language: form.language
      }
    }) */
    onNext()
  }

  function handleChange (event) {
    const value = event.target.value
    validateField(event.target.name, value, setForm(form => ({ ...form, [event.target.name]: value })))
  }

  function validateField (fieldName, fieldValue, callback = () => {}) {
    let tmpValid = validations[`${fieldName}Valid`]
    const formErrors = { ...validations.formErrors }
    tmpValid = fieldValue.length > 0 && /^[\w-]+$/g.test(fieldValue)
    formErrors[fieldName] = fieldValue.length > 0 ? (tmpValid ? '' : 'The field is not valid, make sure you are using regular characters') : ''
    const nextValidation = { ...validations, formErrors }
    nextValidation[`${fieldName}Valid`] = tmpValid
    setValidations(nextValidation)
    validateForm(nextValidation, callback())
  }

  function validateForm (validations, callback = () => {}) {
    // eslint-disable-next-line no-unused-vars
    const { _formErrors, ...restValidations } = validations
    const valid = Object.keys(restValidations).findIndex(element => restValidations[element] === false) === -1
    setValidForm(valid)
    return callback
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit} ref={ref}>
      <div className={`${commonStyles.extraLargeFlexBlock} ${commonStyles.halfWidth}`}>
        <div className={commonStyles.mediumFlexBlock}>
          <div className={commonStyles.mediumFlexRow}>
            <Icons.AppIcon color={WHITE} size={LARGE} />
            <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>Create Application</h2>
          </div>
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Start by entering the name of your Application and the name of your service.</p>
        </div>
        <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
          <Forms.Field title='Application name*' titleColor={WHITE}>
            <Forms.Input
              placeholder='Enter the name of your application'
              name='application'
              borderColor={WHITE}
              value={form.application}
              onChange={handleChange}
              errorMessage={validations.formErrors.application}
              backgroundTransparent
            />
          </Forms.Field>
          <Forms.Field title='Service name*' titleColor={WHITE}>
            <Forms.Input
              placeholder='Enter the name of your service'
              name='service'
              borderColor={WHITE}
              value={form.service}
              onChange={handleChange}
              errorMessage={validations.formErrors.service}
              backgroundTransparent
            />
          </Forms.Field>
        </div>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          disabled={!validForm}
          label='Next'
          onClick={() => handleSubmit}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
        />
      </div>
    </form>
  )
})

CreateApplication.propTypes = {
  /**
     * onNext
     */
  onNext: PropTypes.func
}

CreateApplication.defaultProps = {
  onNext: () => {}
}

export default CreateApplication
