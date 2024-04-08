'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { RICH_BLACK, WHITE, MARGIN_0, OPACITY_30, TRANSPARENT, DULLS_BACKGROUND_COLOR, ANTI_FLASH_WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { Button, HorizontalSeparator } from '@platformatic/ui-components'
import Forms from '@platformatic/ui-components/src/components/forms'

function EditApplicationName ({ name, onClickCancel, onClickConfirm }) {
  const [form, setForm] = useState({ application: name })
  const [validations, setValidations] = useState({ applicationValid: true, formErrors: { application: '' } })
  const [validForm, setValidForm] = useState(true)

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

  function handleSubmit (event) {
    event.preventDefault()
    onClickConfirm(form.application)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        <Forms.Field
          title='Application Name'
          titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
        >
          <Forms.Input
            placeholder='Enter the name of your application'
            name='application'
            borderColor={WHITE}
            value={form.application}
            onChange={handleChange}
            errorMessage={validations.formErrors.application}
            errorMessageTextClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textErrorRed}`}
            backgroundColor={RICH_BLACK}
            inputTextClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}
            verticalPaddingClassName={commonStyles.noVerticalPadding}
          />
        </Forms.Field>
        <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyBetween}`}>
          <Button
            type='button'
            textClass={typographyStyles.desktopBody}
            paddingClass={commonStyles.buttonPadding}
            label='Cancel'
            onClick={() => onClickCancel()}
            color={WHITE}
            backgroundColor={TRANSPARENT}
          />
          <Button
            disabled={!validForm}
            type='button'
            textClass={typographyStyles.desktopBody}
            paddingClass={commonStyles.buttonPadding}
            label='Rename Application'
            onClick={(event) => handleSubmit(event)}
            color={RICH_BLACK}
            backgroundColor={WHITE}
            hoverEffect={DULLS_BACKGROUND_COLOR}
            hoverEffectProperties={{ changeBackgroundColor: ANTI_FLASH_WHITE }}
            bordered={false}
          />
        </div>
      </div>
    </form>
  )
}

EditApplicationName.propTypes = {
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * onClickEdit
   */
  onClickCancel: PropTypes.func,
  /**
   * onClickRemove
   */
  onClickConfirm: PropTypes.func
}

EditApplicationName.defaultProps = {
  onClickCancel: () => {},
  onClickConfirm: () => {}
}

export default EditApplicationName
