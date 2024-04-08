'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { BorderedBox, Forms } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { OPACITY_30, RICH_BLACK, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'

function PluginEnvVarsForm ({
  configuredServices,
  onChange,
  templateName,
  serviceName,
  pluginName
}) {
  const configuredServiceFound = configuredServices.find(configuredService => configuredService.template === templateName && configuredService.name === serviceName)
  const pluginFound = configuredServiceFound.plugins.find(plugin => plugin.name === pluginName) || {}

  function renderForm () {
    if (Object.keys(pluginFound.form).length === 0) {
      return <></>
    }
    return Object.keys(pluginFound.form).map((element) => (
      <Forms.Field
        title={pluginFound.form[element].path}
        key={element}
        helper={pluginFound.form[element].description || ''}
        titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
        helperClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
      >
        <Forms.Input
          placeholder=''
          name={element}
          borderColor={WHITE}
          value={pluginFound.form[element].value}
          onChange={onChange}
          errorMessage={pluginFound.validations.formErrors[element]}
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
    if (Object.keys(pluginFound.form).length === 0) {
      return (<><br /><br /><span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>This plugin has no configurable variables. </span></>)
    }
    return <span>Variables</span>
  }

  function renderFormContainer () {
    if (Object.keys(pluginFound.form).length === 0) {
      return <></>
    }
    return (
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        {renderForm()}
      </div>
    )
  }

  return (
    <BorderedBox
      color={WHITE}
      borderColorOpacity={OPACITY_30}
      backgroundColor={TRANSPARENT}
      classes={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}
    >
      <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${commonStyles.fullWidth}`}>{pluginName} {renderVariablesText()}</p>
      {pluginFound && renderFormContainer()}
    </BorderedBox>
  )
}

PluginEnvVarsForm.propTypes = {
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
  onChange: PropTypes.func,
  /**
   * pluginName
   */
  pluginName: PropTypes.string

}

PluginEnvVarsForm.defaultProps = {
  templateName: '',
  serviceName: '',
  onChange: () => {},
  pluginName: ''
}

export default PluginEnvVarsForm
