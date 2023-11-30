'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ConfigureEnvVarsTemplateAndPlugins.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import TemplateAndPluginTreeSelector from '~/components/template-and-plugins/TemplateAndPluginTreeSelector'
import { CSSTransition } from 'react-transition-group'
import TemplateEnvVarsForm from '~/components/templates/TemplateEnvVarsForm'
import PluginEnvVarsForm from '~/components/plugins/PluginEnvVarsForm'
import '~/components/component.animation.css'

function ConfigureEnvVarsTemplateAndPlugins ({
  configuredServices,
  handleChangeTemplateForm
}) {
  const [serviceSelected, setServiceSelected] = useState(null)
  const [pluginSelected, setPluginSelected] = useState(null)
  const [currentComponent, setCurrentComponent] = useState(<></>)

  useEffect(() => {
    if (configuredServices !== null) {
      setServiceSelected(configuredServices[0])
    }
  }, [configuredServices])

  function handleChangeTemplateEnvVars (event) {
    return handleChangeTemplateForm(event, serviceSelected.template, serviceSelected.name)
  }

  useEffect(() => {
    if (serviceSelected) {
      if (pluginSelected) {
        setCurrentComponent(<PluginEnvVarsForm service={{ ...serviceSelected }} plugin={{ ...pluginSelected }} key={pluginSelected.name} />)
      } else {
        setCurrentComponent(
          <TemplateEnvVarsForm
            key={`${serviceSelected.name}-${serviceSelected.template}-${serviceSelected.updatedAt}`}
            configuredServices={configuredServices}
            serviceName={serviceSelected.name}
            templateName={serviceSelected.template}
            onChange={handleChangeTemplateEnvVars}
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
    <div className={`${commonStyles.mediumFlexRow} ${commonStyles.itemsStart} ${styles.scrollableSection}`}>
      <TemplateAndPluginTreeSelector
        pluginSelected={pluginSelected}
        serviceSelected={serviceSelected}
        onTemplateSelected={onServiceSelected}
        onPluginSelected={onPluginSelected}
      />
      <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsStart} ${styles.scrollableSection}`}>
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

ConfigureEnvVarsTemplateAndPlugins.propTypes = {
  /**
     * configuredServices
     */
  configuredServices: PropTypes.array,
  /**
   * handleChangeTemplateForm
  */
  handleChangeTemplateForm: PropTypes.func

}

ConfigureEnvVarsTemplateAndPlugins.defaultProps = {
  configuredServices: [],
  handleChangeTemplateForm: () => {}
}

export default ConfigureEnvVarsTemplateAndPlugins
