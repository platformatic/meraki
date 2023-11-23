'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { BorderedBox } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { OPACITY_30, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import PluginEnvVarsForm from './PluginEnvVarsForm'

function PluginEnvVarsForms ({ service }) {
  return (
    <BorderedBox
      color={WHITE}
      borderColorOpacity={OPACITY_30}
      backgroundColor={TRANSPARENT}
      classes={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}
    >
      <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}>Plugin Environment</p>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        {service.plugins.map(plugin => (
          <PluginEnvVarsForm key={plugin.name} plugin={{ ...plugin }} />
        ))}
      </div>
    </BorderedBox>
  )
}

PluginEnvVarsForms.propTypes = {
  /**
   * service
   */
  service: PropTypes.object.isRequired
}

// PluginEnvVarsForms.defaultProps = {}

export default PluginEnvVarsForms
