'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { MEDIUM, SMALL, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './TemplateAndPluginTreeSelector.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { BorderedBox, PlatformaticIcon } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'

function TemplateSelector ({ onTemplateSelected, service, serviceSelected }) {
  let className = `${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite} ${styles.ellipsisTemplate}`
  if (serviceSelected?.template !== service.template.name) {
    className += ` ${typographyStyles.opacity70}`
  }
  return (
    <div className={`${commonStyles.smallFlexRow} ${styles.cursorPointer} ${styles.overflowHidden}`} onClick={() => onTemplateSelected(service)}>
      <Icons.ServiceIcon color={WHITE} size={MEDIUM} />
      <h5 className={className}>{service.name}</h5>
    </div>
  )
}

function PluginsContainer ({ service, isTemplateSelected, pluginSelected, onPluginSelected }) {
  const [hidePlugins, setHidePlugins] = useState(isTemplateSelected)

  function togglePlugins () {
    setHidePlugins(!hidePlugins)
  }

  return (
    <div className={`${commonStyles.smallFlexBlock} ${styles.pluginContainer}`}>
      {service?.plugins.length === 1
        ? (<PluginSelector key={service.plugins[0].name} plugin={{ ...service.plugins[0] }} service={{ ...service }} onPluginSelected={onPluginSelected} pluginSelected={pluginSelected} />)
        : (
          <>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${styles.cursorPointer}`} onClick={() => togglePlugins()}>
              <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
                {hidePlugins ? 'Show' : 'Hide'} Plugins ({service.plugins.length})
              </span>
              <PlatformaticIcon iconName={hidePlugins ? 'ArrowDownIcon' : 'ArrowUpIcon'} color={WHITE} size={SMALL} onClick={() => {}} />
            </div>
            {!hidePlugins && service.plugins.map(plugin => (<PluginSelector key={plugin.name} plugin={{ ...plugin }} onPluginSelected={onPluginSelected} service={service} pluginSelected={pluginSelected} />))}
          </>
          )}
    </div>
  )
}

function PluginSelector ({ onPluginSelected, service, plugin, pluginSelected }) {
  let className = `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${styles.ellipsisPlugin}`
  if (pluginSelected?.name !== plugin.name) {
    className += ` ${typographyStyles.opacity70}`
  }

  return (
    <div
      className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${styles.cursorPointer} ${styles.overflowHidden}`}
      onClick={() => onPluginSelected(service, plugin)}
    >
      <Icons.StackablesPluginIcon color={WHITE} size={SMALL} />
      <span className={className} title={plugin.name}>{plugin.name}</span>
    </div>
  )
}

function TemplateAndPluginTreeSelector ({ onTemplateSelected, onPluginSelected, serviceSelected, pluginSelected }) {
  const globalState = useStackablesStore()
  const { services } = globalState

  function handlePluginSelected (service, plugin) {
    onPluginSelected(service, plugin)
  }

  return (
    <BorderedBox color={WHITE} borderColorOpacity={30} backgroundColor={TRANSPARENT} classes={`${commonStyles.fullWidth} ${styles.container}`}>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        {services.map(service => (
          <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${commonStyles.overflowHidden}`} key={service.name}>
            <TemplateSelector onTemplateSelected={onTemplateSelected} service={{ ...service }} serviceSelected={serviceSelected} />
            {service.plugins.length > 0 && <PluginsContainer service={service} onPluginSelected={handlePluginSelected} pluginSelected={pluginSelected} />}
          </div>
        ))}
      </div>
    </BorderedBox>
  )
}

TemplateAndPluginTreeSelector.propTypes = {
  /**
   * onTemplateSelected
    */
  onTemplateSelected: PropTypes.func,
  /**
   * onPluginSelected
    */
  onPluginSelected: PropTypes.func,
  /**
   * onPluginSelected
    */
  pluginSelected: PropTypes.object,
  /**
   * onPluginSelected
    */
  serviceSelected: PropTypes.object
}

TemplateAndPluginTreeSelector.defaultProps = {
  setSelectedTemplate: () => {},
  onPluginSelected: () => {},
  pluginSelected: {},
  serviceSelected: {}
}

export default TemplateAndPluginTreeSelector
