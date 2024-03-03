'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { RICH_BLACK, WHITE, MARGIN_0, OPACITY_30, TRANSPARENT, DULLS_BACKGROUND_COLOR, ANTI_FLASH_WHITE, MODAL_POPUP_V2 } from '@platformatic/ui-components/src/components/constants'
import styles from './ImportApplicationFlow.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { Button, HorizontalSeparator, LoadingSpinnerV2, Modal } from '@platformatic/ui-components'
import Forms from '@platformatic/ui-components/src/components/forms'
import { LOADING, SUCCESS, NONE, ERROR } from '~/ui-constants'
import { callImportApp } from '~/api'
import ErrorComponent from '~/components/screens/ErrorComponent'
import SuccessComponent from '~/components/screens/SuccessComponent'

function ImportApplicationFlow ({ onCloseModal, onClickConfirm }) {
  const [form, setForm] = useState({ folder: '', name: '' })
  const [validations, setValidations] = useState({ folderValid: false, formErrors: { folder: '' } })
  const [validForm, setValidForm] = useState(false)
  const [innerStatus, setInnerStatus] = useState(NONE)
  const [error, setError] = useState('')

  function validateField (fieldName, fieldValue, callback = () => {}) {
    let tmpValid = validations[`${fieldName}Valid`]
    const formErrors = { ...validations.formErrors }
    tmpValid = fieldValue.length > 0
    formErrors[fieldName] = tmpValid ? '' : 'The field is not a directory'
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

  async function handleSubmit (event) {
    event.preventDefault()
    try {
      setInnerStatus(LOADING)
      await callImportApp(form.folder, form.name)
      setInnerStatus(SUCCESS)
      setTimeout(() => onClickConfirm(), 3000)
    } catch (error) {
      console.error(`Error on callImportApp ${error}`)
      setError(error.message)
      setInnerStatus(ERROR)
    }
  }

  async function handleOpenFolder () {
    const dir = await window.dialog.showDialog()
    if (dir !== null) {
      validateField('folder', dir, setForm(form => ({ ...form, folder: dir, name: dir.substring(dir.lastIndexOf('/') + 1) })))
    }
  }

  function renderContent () {
    if (innerStatus === LOADING) {
      return (
        <LoadingSpinnerV2
          loading
          applySentences={{
            containerClassName: `${commonStyles.mediumFlexBlock} ${commonStyles.itemsCenter}`,
            sentences: [{
              style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`,
              text: 'We are importing your Application'
            }, {
              style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`,
              text: 'This process will just take a few seconds.'
            }]
          }}
          containerClassName={styles.loadingSpinner}
        />
      )
    }
    if (innerStatus === ERROR) {
      return <ErrorComponent message={error} onClickDismiss={() => onCloseModal()} />
    }
    if (innerStatus === SUCCESS) {
      return (
        <SuccessComponent
          title='Your Application has been created successfully'
          subtitle='You are now able to view the imported application into your Meraki app list.'
        />
      )
    }

    return (
      <Modal
        key='importApplicationName'
        setIsOpen={() => onCloseModal()}
        title='Import Application'
        titleClassName={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}
        layout={MODAL_POPUP_V2}
      >
        <form onSubmit={handleSubmit}>
          <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
            <Forms.Field
              title='Application Folder'
              titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
              helper='Select the folder containing your application'
              helperClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
              required
            >
              <Button
                type='button'
                platformaticIcon={{ iconName: 'FolderIcon', color: WHITE }}
                label='Change folder'
                onClick={async () => handleOpenFolder()}
                color={WHITE}
                backgroundColor={TRANSPARENT}
                paddingClass={`${commonStyles.buttonPaddingBordered} cy-action-open-folder`}
                textClass={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}
              />
              <Forms.Input
                placeholder='Select the destination folder of your application using the Button'
                name='folder'
                borderColor={WHITE}
                value={form.folder}
                readOnly
                errorMessage={validations.formErrors.folder}
                backgroundColor={RICH_BLACK}
                inputTextClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite}`}
                verticalPaddingClassName={commonStyles.noVerticalPadding}
              />
            </Forms.Field>
            <Forms.Field
              title='Application name'
              titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
              helper='The name of your application will be the same of your selected directory'
              helperClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
              required
            >
              <Forms.Input
                placeholder='Select the folder of your application...'
                name='name'
                borderColor={WHITE}
                value={form.name}
                inputTextClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite}`}
                verticalPaddingClassName={commonStyles.noVerticalPadding}
                backgroundColor={RICH_BLACK}
                readOnly
              />
            </Forms.Field>

            <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
            <div className={`${commonStyles.mediumFlexRow} ${commonStyles.justifyBetween}`}>
              <Button
                type='button'
                paddingClass={commonStyles.buttonPadding}
                label='Cancel'
                onClick={() => onCloseModal()}
                color={WHITE}
                backgroundColor={TRANSPARENT}
              />
              <Button
                disabled={!validForm}
                type='button'
                paddingClass={commonStyles.buttonPadding}
                label='Import App'
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
      </Modal>
    )
  }

  return (
    <div className={`${styles.container} ${innerStatus === NONE ? '' : styles.containerDulls}`}>
      {renderContent()}
    </div>
  )
}

ImportApplicationFlow.propTypes = {
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * onClickEdit
   */
  onCloseModal: PropTypes.func,
  /**
   * onClickRemove
   */
  onClickConfirm: PropTypes.func
}

ImportApplicationFlow.defaultProps = {
  onCloseModal: () => {},
  onClickConfirm: () => {}
}

export default ImportApplicationFlow
