'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import commonStyles from '~/styles/CommonStyles.module.css'
import '~/components/component.animation.css'
import ConfigureEnvVarsTemplate from '~/components/templates/ConfigureEnvVarsTemplate'
import PluginEnvVarsForms from '~/components/plugins/PluginEnvVarsForms'

const ConfigureEnvVarsTemplateAndPlugins = React.forwardRef(({ service }, ref) => {
  return (
    <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsStart}`} ref={ref}>
      <ConfigureEnvVarsTemplate service={{ ...service }} />
      <PluginEnvVarsForms service={{ ...service }} />
    </div>
  )
})

ConfigureEnvVarsTemplateAndPlugins.propTypes = {
  /**
   * service
   */
  service: PropTypes.object
}

ConfigureEnvVarsTemplateAndPlugins.defaultProps = {
  service: {}
}

export default ConfigureEnvVarsTemplateAndPlugins
