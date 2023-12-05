'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { BorderedBox, Forms } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { OPACITY_30, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'

function TemplateEnvVarsForm ({
  configuredServices,
  onChange,
  templateName,
  serviceName
}) {
  const configuredServiceFound = configuredServices.find(configuredService => configuredService.template === templateName && configuredService.name === serviceName)

  function renderForm () {
    if (Object.keys(configuredServiceFound.form).length === 0) {
      return <></>
    }
    return Object.keys(configuredServiceFound.form).map((element) => (
      <Forms.Field
        title={configuredServiceFound.form[element].label}
        titleColor={WHITE}
        key={element}
      >
        <Forms.Input
          placeholder=''
          name={element}
          borderColor={WHITE}
          value={configuredServiceFound.form[element].value}
          onChange={onChange}
          errorMessage={configuredServiceFound.validations.formErrors[element]}
          backgroundTransparent
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
      return <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}> This template has no configurable variables. </span>
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
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        {configuredServiceFound && renderForm()}
      </div>
    </BorderedBox>
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
