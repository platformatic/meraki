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
  handleChangeTemplateForm,
  handleChangePluginForm
}) {
  const [serviceSelected, setServiceSelected] = useState(null)
  const [pluginSelected, setPluginSelected] = useState(null)
  const [currentComponent, setCurrentComponent] = useState(<></>)

  useEffect(() => {
    if (configuredServices !== null && !serviceSelected) {
      setServiceSelected(configuredServices[0])
    }
  }, [configuredServices, !serviceSelected])

  function handleChangeTemplateEnvVars (event) {
    return handleChangeTemplateForm(event, serviceSelected.template, serviceSelected.name)
  }

  function handleChangePluginEnvVars (event) {
    return handleChangePluginForm(event, serviceSelected.template, serviceSelected.name, pluginSelected.name)
  }

  useEffect(() => {
    if (serviceSelected) {
      if (pluginSelected) {
        setCurrentComponent(
          <PluginEnvVarsForm
            key={`${serviceSelected.name}-${serviceSelected.template}-${serviceSelected.updatedAt}-${pluginSelected.name}-${pluginSelected.updatedAt}`}
            configuredServices={configuredServices}
            serviceName={serviceSelected.name}
            templateName={serviceSelected.template}
            onChange={handleChangePluginEnvVars}
            pluginName={pluginSelected.name}
          />)
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
    <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsStart} ${styles.scrollableSection}`}>
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

ConfigureEnvVarsTemplateAndPlugins.propTypes = {
  /**
     * configuredServices
     */
  configuredServices: PropTypes.array,
  /**
   * handleChangeTemplateForm
  */
  handleChangeTemplateForm: PropTypes.func,
  /**
   * handleChangeTemplateForm
  */
  handleChangePluginForm: PropTypes.func

}

ConfigureEnvVarsTemplateAndPlugins.defaultProps = {
  configuredServices: [],
  handleChangeTemplateForm: () => {},
  handleChangePluginForm: () => {}
}

export default ConfigureEnvVarsTemplateAndPlugins
