'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import PluginHandler from '~/components/plugins/PluginHandler'
import TemplateHandler from '~/components/templates/TemplateHandler'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './Service.module.css'

function Service ({ onClickAddPlugin, onClickTemplate, onClickViewAll, service }) {
  return (
    <div
      className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${styles.containerPuzzle}`}
    >
      <PluginHandler onClickAddPlugin={() => { onClickAddPlugin(service) }} serviceName={service.name} />
      <TemplateHandler
        onClickTemplate={() => { onClickTemplate(service) }}
        onClickViewAll={() => { onClickViewAll(service) }}
        serviceName={service.name}
      />
    </div>
  )
}

Service.propTypes = {
  onClickAddPlugin: PropTypes.func,
  onClickTemplate: PropTypes.func,
  onClickViewAll: PropTypes.func,
  service: PropTypes.object
}

Service.defaultProps = {
  onClickAddPlugin: () => {},
  onClickTemplate: () => {},
  onClickViewAll: () => {},
  service: {}
}

export default Service
