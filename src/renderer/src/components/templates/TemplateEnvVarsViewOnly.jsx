'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { BorderedBox, Forms } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { OPACITY_30, RICH_BLACK, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'

function TemplateEnvVarsViewOnly ({
  configuredServices,
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
          errorMessage={configuredServiceFound.validations.formErrors[element]}
          errorMessageTextClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textErrorRed}`}
          backgroundColor={RICH_BLACK}
          inputTextClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}
          verticalPaddingClassName={commonStyles.noVerticalPadding}
          dataAttrName='cy'
          dataAttrValue='config-service'
          readOnly
        />
      </Forms.Field>
    ))
  }

  function renderVariablesText () {
    if (Object.keys(configuredServiceFound.form).length === 0) {
      return (<><br /><br /><span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}> This template has no configurable variables. </span></>)
    }
    return <span>Variables</span>
  }

  return (
    <BorderedBox
      color={WHITE}
      borderColorOpacity={OPACITY_30}
      backgroundColor={TRANSPARENT}
      classes={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}
    >
      <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}>{templateName} {renderVariablesText()}</p>
      {configuredServiceFound && renderFormContainer()}
    </BorderedBox>
  )
}

TemplateEnvVarsViewOnly.propTypes = {
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
  serviceName: PropTypes.string
}

TemplateEnvVarsViewOnly.defaultProps = {
  templateName: '',
  serviceName: ''
}

export default TemplateEnvVarsViewOnly
