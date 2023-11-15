'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { LARGE, MEDIUM, RICH_BLACK, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import { Button, Icons, PlatformaticIcon } from '@platformatic/ui-components'
import Forms from '@platformatic/ui-components/src/components/forms'
import styles from './EditableTitle.module.css'

function EditableTitle ({ title, iconName, onClickSubmit }) {
  const [editable, setEditable] = useState(false)
  const icon = React.createElement(Icons[`${iconName}`], {
    color: WHITE,
    size: LARGE
  })
  const [form, setForm] = useState({ application: title })
  const [validations, setValidations] = useState({ applicationValid: true, formErrors: { application: '' } })
  const [validForm, setValidForm] = useState(true)
  const h2ClassName = `${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`
  const [containerClassName, setContainerClassName] = useState(`${styles.container}`)

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

  function handleEditable (value) {
    setEditable(value)
    setContainerClassName(value ? '' : `${styles.container}`)
  }

  function handleSubmit (event) {
    event.preventDefault()
    if (editable) {
      onClickSubmit(form.application)
      handleEditable(false)
    }
  }

  return (
    <div className={containerClassName}>
      <form onSubmit={handleSubmit} className={`${commonStyles.mediumFlexRow}`}>
        {icon}
        {editable
          ? (
            <div className={`${commonStyles.mediumFlexRow} ${`${commonStyles.justifyBetween}`}`}>
              <Forms.Input
                placeholder='Enter the name of your application'
                name='application'
                borderColor={WHITE}
                value={form.application}
                onChange={handleChange}
                errorMessage={validations.formErrors.application}
                backgroundTransparent
                inputTextClassName={h2ClassName}
                verticalPaddingClassName={commonStyles.noVerticalPadding}
              />
              <div className={commonStyles.mediumFlexRow}>
                <Button
                  disabled={!validForm}
                  type='submit'
                  classes={commonStyles.buttonPadding}
                  label='Salve'
                  onClick={() => handleSubmit}
                  color={RICH_BLACK}
                  bordered={false}
                  backgroundColor={WHITE}
                />
                <Button
                  type='button'
                  classes={commonStyles.buttonPadding}
                  label='Cancel'
                  onClick={() => handleEditable(false)}
                  color={WHITE}
                  bordered
                  backgroundColor={TRANSPARENT}
                />
              </div>
            </div>
            )
          : (
            <>
              <h2 className={h2ClassName}>{title}</h2>
              <PlatformaticIcon iconName='EditIcon' color={WHITE} size={MEDIUM} onClick={() => handleEditable(true)} />
            </>
            )}
      </form>
    </div>
  )
}

EditableTitle.propTypes = {
  /**
     * title
     */
  title: PropTypes.string.isRequired,
  /**
     * iconName
     */
  iconName: PropTypes.string.isRequired,
  /**
     * onClickSubmit
     */
  onClickSubmit: PropTypes.func
}

EditableTitle.defaultProps = {
  onClickSubmit: () => {}
}

export default EditableTitle
