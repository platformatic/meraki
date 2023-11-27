'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ConfigureEnvVarsTemplateAndPlugins.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import TemplateAndPluginTreeSelector from '~/components/template-and-plugins/TemplateAndPluginTreeSelector'
import { CSSTransition } from 'react-transition-group'
import TemplateEnvVarsForm from '~/components/templates/TemplateEnvVarsForm'
import PluginEnvVarsForm from '~/components/plugins/PluginEnvVarsForm'
import useStackablesStore from '~/useStackablesStore'
import '~/components/component.animation.css'

function ConfigureEnvVarsTemplateAndPlugins ({ service }) {
  const globalState = useStackablesStore()
  const { services } = globalState

  const [serviceSelected, setServiceSelected] = useState(services[0])
  const [pluginSelected, setPluginSelected] = useState(null)
  const [currentComponent, setCurrentComponent] = useState(<></>)

  useEffect(() => {
    if (serviceSelected) {
      if (pluginSelected) {
        setCurrentComponent(<PluginEnvVarsForm service={{ ...serviceSelected }} plugin={{ ...pluginSelected }} key={pluginSelected.name} />)
      } else {
        setCurrentComponent(<TemplateEnvVarsForm key={service.name} service={{ ...serviceSelected }} />)
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
   * service
   */
  service: PropTypes.object
}

ConfigureEnvVarsTemplateAndPlugins.defaultProps = {
  service: {}
}

export default ConfigureEnvVarsTemplateAndPlugins
