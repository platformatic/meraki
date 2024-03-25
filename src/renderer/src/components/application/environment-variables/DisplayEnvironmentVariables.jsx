'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './DisplayEnvironmentVariables.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import TemplateAndPluginTreeSelector from '~/components/template-and-plugins/TemplateAndPluginTreeSelector'
import { CSSTransition } from 'react-transition-group'
import TemplateEnvVarsViewOnly from '~/components/templates/TemplateEnvVarsViewOnly'
import PluginEnvVarsViewOnly from '~/components/plugins/PluginEnvVarsViewOnly'
import '~/components/component.animation.css'

function DisplayEnvironmentVariables ({ configuredServices }) {
  const [serviceSelected, setServiceSelected] = useState(null)
  const [pluginSelected, setPluginSelected] = useState(null)
  const [currentComponent, setCurrentComponent] = useState(<></>)

  useEffect(() => {
    if (configuredServices !== null && !serviceSelected) {
      setServiceSelected(configuredServices[0])
    }
  }, [configuredServices, !serviceSelected])

  useEffect(() => {
    if (serviceSelected) {
      if (pluginSelected) {
        setCurrentComponent(
          <PluginEnvVarsViewOnly
            key={`${serviceSelected.name}-${serviceSelected.template}-${serviceSelected.updatedAt}-${pluginSelected.name}-${pluginSelected.updatedAt}`}
            configuredServices={configuredServices}
            serviceName={serviceSelected.name}
            templateName={serviceSelected.template}
            pluginName={pluginSelected.name}
          />)
      } else {
        setCurrentComponent(
          <TemplateEnvVarsViewOnly
            key={`${serviceSelected.name}-${serviceSelected.template}-${serviceSelected.updatedAt}`}
            configuredServices={configuredServices}
            serviceName={serviceSelected.name}
            templateName={serviceSelected.template}
          />)
      }
    }
  }, [serviceSelected, pluginSelected])

  function onServiceSelected (service) {
    setPluginSelected(null)
    setServiceSelected(service)
  }

  function onPluginSelected (service, plugin) {
    setServiceSelected(service)
    setPluginSelected(plugin)
  }

  return (
    <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsStart} ${styles.scrollableSection}`}>
      <TemplateAndPluginTreeSelector
        configuredServices={configuredServices}
        pluginSelected={pluginSelected}
        serviceSelected={serviceSelected}
        onTemplateSelected={onServiceSelected}
        onPluginSelected={onPluginSelected}
      />
      <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsStart} ${styles.scrollableSection}`}>
        <CSSTransition
          key={currentComponent.key}
          timeout={300}
          classNames='fade-vertical'
        >
          {currentComponent}
        </CSSTransition>
      </div>
    </div>
  )
}

DisplayEnvironmentVariables.propTypes = {
  /**
     * configuredServices
     */
  configuredServices: PropTypes.array

}

DisplayEnvironmentVariables.defaultProps = {
  configuredServices: []
}

export default DisplayEnvironmentVariables
