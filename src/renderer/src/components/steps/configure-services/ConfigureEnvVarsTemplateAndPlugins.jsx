'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import commonStyles from '~/styles/CommonStyles.module.css'
import '~/components/component.animation.css'
import ConfigureEnvVarsTemplate from './ConfigureEnvVarsTemplate'
import ConfigureEnvVarsPlugins from './ConfigureEnvVarsPlugins'

const ConfigureEnvVarsTemplateAndPlugins = React.forwardRef(({ service }, ref) => {
  return (
    <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth}`} ref={ref}>
      <ConfigureEnvVarsTemplate service={{ ...service }} />
      <ConfigureEnvVarsPlugins service={{ ...service }} />
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
