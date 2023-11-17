'use strict'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Forms, Icons } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, LARGE } from '@platformatic/ui-components/src/components/constants'

function ConfigureService ({ service }) {
  const [form, setForm] = useState(null)
  const [validations, setValidations] = useState({ })
  // eslint-disable-next-line no-unused-vars
  const [validForm, setValidForm] = useState(false)
  const fakeConfigurationList = [
    'DATABASE_URL',
    'PLT_PORT',
    'LOGGER_LEVEL',
    'NODE_ENV',
    'API_KEY',
    'API_URL',
    'STANDALONE'
  ]

  useEffect(() => {
    if (service) {
      const randomNumber = Math.floor(Math.random() * fakeConfigurationList.length)
      const tmp = {}
      const validations = {}
      const formErrors = {}
      Array.from(new Array(randomNumber).keys()).forEach(e => {
        const rnd = Math.floor(Math.random() * fakeConfigurationList.length)
        const label = fakeConfigurationList[rnd]
        tmp[label] = ''
        validations[`${label}Valid`] = false
        formErrors[label] = ''
      })
      setForm({ ...tmp })
      setValidations({ ...validations, formErrors })
    }
  }, [service])

  function handleChange (event) {
    const value = event.target.value
    validateField(event.target.name, value, setForm(form => ({ ...form, [event.target.name]: value })))
  }

  function validateField (fieldName, fieldValue, callback = () => {}) {
    let tmpValid = validations[`${fieldName}Valid`]
    const formErrors = { ...validations.formErrors }
    switch (fieldName) {
      case 'sameConfigurationPRMain':
        break
      default:
        tmpValid = fieldValue.length > 0 && /^\S+$/g.test(fieldValue)
        formErrors[fieldName] = fieldValue.length > 0 ? (tmpValid ? '' : 'The field is not valid, make sure you are using regular characters') : ''
        break
    }
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

  function renderForm () {
    return Object.keys(form).map((element) => (
      <Forms.Field title={`Configure ${element}`} titleColor={WHITE} key={element}>
        <Forms.Input
          placeholder='Env variable example'
          name={element}
          borderColor={WHITE}
          value={form[element]}
          onChange={handleChange}
          errorMessage={validations.formErrors[element]}
          backgroundTransparent
          inputTextClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}
          verticalPaddingClassName={commonStyles.noVerticalPadding}
        />
      </Forms.Field>
    ))
  }

  return (
    <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
      <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth}`}>
        <Icons.ServiceIcon color={WHITE} size={LARGE} />
        <h4 className={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}>{service.name}</h4>
      </div>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        {form && renderForm()}
      </div>
    </div>
  )
}

ConfigureService.propTypes = {
  /**
   * service
   */
  service: PropTypes.object.isRequired
}

// ConfigureService.defaultProps = {}

export default ConfigureService
