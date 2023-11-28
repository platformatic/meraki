'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Forms from '@platformatic/ui-components/src/components/forms'
import styles from './CreateApplication.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, TRANSPARENT } from '@platformatic/ui-components/src/components/constants'
import { Button } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import Title from '~/components/ui/Title'

const CreateApplication = React.forwardRef(({ onNext }, ref) => {
  const [form, setForm] = useState({ application: '', service: '', folder: '' })
  const [validations, setValidations] = useState({ applicationValid: false, serviceValid: false, folderValid: false, formErrors: { application: '', service: '', folder: '' } })
  const [validForm, setValidForm] = useState(false)
  const [inputOnServiceField, setInputOnServiceField] = useState(false)
  const globalState = useStackablesStore()
  const { addFormData, addService } = globalState
  const mockUse = import.meta.env.RENDERER_VITE_USE_MOCKS === 'true'

  function handleSubmit (event) {
    event.preventDefault()
    addFormData({
      createApplication: {
        application: form.application,
        service: form.service,
        path: form.folder
      }
    })
    addService()
    onNext()
  }

  function handleChangeApplication (event) {
    if (inputOnServiceField) {
      handleChange(event)
    } else {
      handleChangeBoth(event)
    }
  }

  function handleChangeBoth (event) {
    const value = event.target.value
    validateBothField(value, setForm(form => ({ ...form, application: value, service: value })))
  }

  function validateBothField (fieldValue, callback = () => {}) {
    let applicationValid = validations.applicationValid
    const formErrors = { ...validations.formErrors }
    applicationValid = fieldValue.length > 0 && /^[\w-]+$/g.test(fieldValue)
    formErrors.application = fieldValue.length > 0 ? (applicationValid ? '' : 'The field is not valid, make sure you are using regular characters') : ''
    formErrors.service = fieldValue.length > 0 ? (applicationValid ? '' : 'The field is not valid, make sure you are using regular characters') : ''
    const nextValidation = { ...validations, formErrors }
    nextValidation.applicationValid = applicationValid
    nextValidation.serviceValid = applicationValid
    setValidations(nextValidation)
    validateForm(nextValidation, callback())
  }

  function handleChangeService (event) {
    if (event.target.value !== '' && inputOnServiceField === false) {
      setInputOnServiceField(true)
    }
    if (event.target.value === '' && inputOnServiceField === true) {
      setInputOnServiceField(false)
    }
    handleChange(event)
  }

  function handleChange (event) {
    const value = event.target.value
    validateField(event.target.name, value, setForm(form => ({ ...form, [event.target.name]: value })))
  }

  function validateField (fieldName, fieldValue, callback = () => {}) {
    let tmpValid = validations[`${fieldName}Valid`]
    const formErrors = { ...validations.formErrors }
    tmpValid = fieldName === 'folder' ? fieldValue.length > 0 && /^\S+$/g.test(fieldValue) : fieldValue.length > 0 && /^[\w-]+$/g.test(fieldValue)
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

  async function handleOpenFolder () {
    const dir = await window.dialog.showDialog()
    if (dir !== null) {
      validateField('folder', dir, setForm(form => ({ ...form, folder: dir })))
    }
  }

  return (
    <form className={styles.container} onSubmit={handleSubmit} ref={ref}>
      <div className={styles.imageContainer} />
      <div className={`${commonStyles.largeFlexBlock} ${commonStyles.halfWidth}`}>
        <div className={commonStyles.mediumFlexBlock}>
          <Title
            title='Create Application'
            iconName='AppIcon'
            dataAttrName='cy'
            dataAttrValue='step-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Start by entering the name of your Application and the name of your service.</p>
        </div>
        <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
          <Forms.Field title='Application name' titleColor={WHITE} required>
            <Forms.Input
              placeholder='Enter the name of your application'
              name='application'
              borderColor={WHITE}
              value={form.application}
              onChange={handleChangeApplication}
              errorMessage={validations.formErrors.application}
              backgroundTransparent
            />
          </Forms.Field>
          <Forms.Field title='Service name' titleColor={WHITE} required>
            <Forms.Input
              placeholder='Enter the name of your service'
              name='service'
              borderColor={WHITE}
              value={form.service}
              onChange={handleChangeService}
              errorMessage={validations.formErrors.service}
              backgroundTransparent
            />
          </Forms.Field>
          <Forms.Field title='Select destination folder' titleColor={WHITE} required>
            <Button
              type='button'
              platformaticIcon={{ iconName: 'FolderIcon', color: WHITE }}
              label='Select folder'
              onClick={async () => handleOpenFolder()}
              color={WHITE}
              backgroundColor={TRANSPARENT}
              classes={`${commonStyles.buttonPadding} cy-action-open-folder`}
            />
            <Forms.Input
              placeholder='Select the destination folder of your application using the Button'
              name='folder'
              borderColor={WHITE}
              value={form.folder}
              onChange={mockUse ? handleChange : () => {}}
              errorMessage={validations.formErrors.folder}
              backgroundTransparent
              readOnly={!mockUse}
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
          classes={`${commonStyles.buttonPadding} cy-action-next`}
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
