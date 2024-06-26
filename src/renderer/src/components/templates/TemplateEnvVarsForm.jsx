'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { BorderedBox, Forms } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { OPACITY_30, RICH_BLACK, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import styles from './TemplateEnvVarsForm.module.css'

function TemplateEnvVarsForm ({
  configuredServices,
  onChange,
  templateName,
  serviceName
}) {
  const configuredServiceFound = configuredServices.find(configuredService => configuredService.template === templateName && configuredService.name === serviceName) || {}

  function renderFormContainer () {
    if (Object.keys(configuredServiceFound.form).length === 0) {
      return <></>
    }
    return (
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        {renderForm()}
      </div>
    )
  }

  function renderForm () {
    return Object.keys(configuredServiceFound.form).map((element) => (
      <Forms.Field
        title={configuredServiceFound.form[element].label}
        key={element}
        titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
      >
        <Forms.Input
          placeholder=''
          name={element}
          borderColor={WHITE}
          value={configuredServiceFound.form[element].value}
          onChange={onChange}
          errorMessage={configuredServiceFound.validations.formErrors[element]}
          errorMessageTextClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textErrorRed}`}
          backgroundColor={RICH_BLACK}
          inputTextClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}
          verticalPaddingClassName={commonStyles.noVerticalPadding}
          dataAttrName='cy'
          dataAttrValue='config-service'
        />
      </Forms.Field>
    ))
  }

  function renderVariablesText () {
    if (Object.keys(configuredServiceFound.form).length === 0) {
      return (<><br /><br /><span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}> This Template has no configurable variables. </span></>)
    }
    return <span>Variables</span>
  }

  return (
    <div className={styles.boxContainer}>
      <BorderedBox
        color={WHITE}
        borderColorOpacity={OPACITY_30}
        backgroundColor={TRANSPARENT}
        classes={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}
      >
        <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}>{templateName} {renderVariablesText()}</p>
        {configuredServiceFound && renderFormContainer()}
      </BorderedBox>
    </div>
  )
}

TemplateEnvVarsForm.propTypes = {
  /**
   * configuredServices
   */
  configuredServices: PropTypes.array.isRequired,
  /**
   * templateName
   */
  templateName: PropTypes.string,
  /**
   * serviceName
   */
  serviceName: PropTypes.string,
  /**
   * onChange
   */
  onChange: PropTypes.func
}

TemplateEnvVarsForm.defaultProps = {
  templateName: '',
  serviceName: '',
  onChange: () => {}
}

export default TemplateEnvVarsForm
