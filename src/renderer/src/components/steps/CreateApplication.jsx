'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Forms from '@platformatic/ui-components/src/components/forms'
import styles from './CreateApplication.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, TRANSPARENT, BOX_SHADOW, OPACITY_30, MAIN_GREEN, MEDIUM, MARGIN_0, ERROR_RED } from '@platformatic/ui-components/src/components/constants'
import { BorderedBox, Button, HorizontalSeparator, Icons, LoadingSpinnerV2 } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import Title from '~/components/ui/Title'
import { getApiTemplates } from '~/api'
import { RUNNING, SUCCESS, ERROR } from '~/ui-constants'

const CreateApplication = React.forwardRef(({ onNext }, ref) => {
  const globalState = useStackablesStore()
  const { addFormData, addService, formData } = globalState
  const [form, setForm] = useState({ application: '', folder: '' })
  const [validations, setValidations] = useState({ applicationValid: false, folderValid: false, formErrors: { application: '', folder: '' } })
  const [validForm, setValidForm] = useState(false)
  const [callAddService, setCallAddService] = useState(true)
  const mockUse = import.meta.env.RENDERER_VITE_USE_MOCKS === 'true'
  const searchParams = new URLSearchParams(document.location.search)
  const [useTemplateId] = useState(searchParams.get('templateId'))
  const [useTemplate, setUseTemplate] = useState(undefined)
  const [statusLoadingTemplate, setStatusLoadingTemplate] = useState(RUNNING)

  useEffect(() => {
    if (formData?.createApplication) {
      validateField('application', formData.createApplication.application, setForm(form => ({ ...form, application: formData.createApplication.application })))
      validateField('folder', formData.createApplication.path, setForm(form => ({ ...form, folder: formData.createApplication.path })))
      setValidForm(true)
      setCallAddService(false)
    }
  }, [formData])

  useEffect(() => {
    if (useTemplateId) {
      async function preloadTemplate () {
        try {
          const templates = await getApiTemplates()
          const found = templates.find(template => template.id === useTemplateId)
          if (found) {
            setUseTemplate(found)
            setStatusLoadingTemplate(SUCCESS)
          } else {
            setStatusLoadingTemplate(ERROR)
          }
        } catch (error) {
          console.error(`Error on preloadTemplate: ${error}`)
          setStatusLoadingTemplate(ERROR)
        }
      }
      preloadTemplate()
    }
  }, [useTemplateId])

  async function handleSubmit (event) {
    event.preventDefault()
    addFormData({
      createApplication: {
        application: form.application,
        path: form.folder
      }
    })
    if (callAddService) {
      const serviceName = await window.api.getServiceName()
      addService(serviceName, useTemplate)
    }
    onNext()
  }

  function handleChangeApplication (event) {
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

  function renderTemplateIdDefault () {
    if (statusLoadingTemplate === RUNNING) {
      return (
        <LoadingSpinnerV2
          loading
          applySentences={{
            sentences: []
          }}
          containerClassName={styles.loadingSpinner}
        />
      )
    }
    return (
      <>
        <p className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite}`}>
          The following Template will be added to you App:
        </p>
        <BorderedBox color={statusLoadingTemplate === ERROR ? ERROR_RED : WHITE} borderColorOpacity={OPACITY_30} backgroundColor={RICH_BLACK} classes={`${commonStyles.buttonPadding} ${styles.borderedBox}`}>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            {statusLoadingTemplate === ERROR
              ? (
                <>
                  <Icons.AlertIcon color={ERROR_RED} size={MEDIUM} />
                  <p className={`${typographyStyles.desktopBody} ${typographyStyles.textErrorRed} ${typographyStyles.opacity70}`}>Requested template not available, please check if your template is public or if you are logged in on Meraki</p>
                </>
                )
              : (
                <>
                  <Icons.StackablesTemplateIcon color={MAIN_GREEN} size={MEDIUM} />
                  <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{useTemplate.name}</p>
                </>
                )}
          </div>
        </BorderedBox>
        <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
      </>
    )
  }

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit} ref={ref}>
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
          {useTemplateId &&
            <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.useTemplateIdContainer}`}>
              {renderTemplateIdDefault()}
            </div>}
          <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
            <Forms.Field title='Application name' titleColor={WHITE} required>
              <Forms.Input
                placeholder='Enter the name of your application'
                name='application'
                borderColor={WHITE}
                value={form.application}
                onChange={handleChangeApplication}
                errorMessage={validations.formErrors.application}
                backgroundColor={RICH_BLACK}
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
                paddingClass={`${commonStyles.buttonPaddingBordered} cy-action-open-folder`}
                textClass={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}
              />
              <Forms.Input
                placeholder='Select the destination folder of your application using the Button'
                name='folder'
                borderColor={WHITE}
                value={form.folder}
                onChange={mockUse ? handleChange : () => {}}
                errorMessage={validations.formErrors.folder}
                backgroundColor={RICH_BLACK}
                readOnly={!mockUse}
              />
            </Forms.Field>
          </div>
        </div>
        <div className={styles.imageContainer} />
      </form>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          disabled={!validForm}
          label='Next'
          onClick={(event) => handleSubmit(event)}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          hoverEffect={BOX_SHADOW}
          paddingClass={`${commonStyles.buttonPadding} cy-action-next`}
        />
      </div>
    </>
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
