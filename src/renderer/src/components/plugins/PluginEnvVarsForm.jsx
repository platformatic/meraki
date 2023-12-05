'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { BorderedBox, Forms } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { OPACITY_30, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'

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
        titleColor={WHITE}
        key={element}
        helper={pluginFound.form[element].description || ''}
      >
        <Forms.Input
          placeholder=''
          name={element}
          borderColor={WHITE}
          value={pluginFound.form[element].value}
          onChange={onChange}
          errorMessage={pluginFound.validations.formErrors[element]}
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
    if (Object.keys(pluginFound.form).length === 0) {
      return <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>This plugin has no configurable variables. </span>
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
      <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${commonStyles.fullWidth}`}>{pluginName} {renderVariablesText()}</p>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        {pluginFound && renderForm()}
      </div>
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
