'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ERROR_RED, MAIN_GREEN, MEDIUM, SMALL, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './TemplateAndPluginTreeSelector.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { BorderedBox, PlatformaticIcon } from '@platformatic/ui-components'

function TemplateSelector ({ onTemplateSelected, service, serviceSelected }) {
  let className = `${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite} ${styles.ellipsisTemplate}`
  if (serviceSelected?.template !== service.template) {
    className += ` ${typographyStyles.opacity70}`
  }
  return (
    <div
      className={`${commonStyles.tinyFlexRow} ${styles.cursorPointer} ${styles.overflowHidden}`}
      onClick={() => onTemplateSelected(service)}
      data-cy='template-selector'
    >
      <Icons.ServiceIcon color={WHITE} size={MEDIUM} />
      <h5 className={className}>{service.name}</h5>
      {service.validForm ? <Icons.CircleCheckMarkIcon color={MAIN_GREEN} size={SMALL} /> : <Icons.AlertIcon color={ERROR_RED} size={SMALL} />}
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
            <div className={`${commonStyles.tinyFlexRow} ${commonStyles.fullWidth} ${styles.cursorPointer}`} onClick={() => togglePlugins()}>
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
      className={`${commonStyles.tinyFlexRow} ${commonStyles.fullWidth} ${styles.cursorPointer} ${styles.overflowHidden}`}
      onClick={() => onPluginSelected(service, plugin)}
      data-cy='plugin-selector'
    >
      <Icons.StackablesPluginIcon color={WHITE} size={SMALL} />
      <span className={className} title={plugin.name}>{plugin.name}</span>
      {plugin.validForm ? <Icons.CircleCheckMarkIcon color={MAIN_GREEN} size={SMALL} /> : <Icons.AlertIcon color={ERROR_RED} size={SMALL} />}

    </div>
  )
}

function TemplateAndPluginTreeSelector ({ configuredServices, onTemplateSelected, onPluginSelected, serviceSelected, pluginSelected }) {
  function handlePluginSelected (service, plugin) {
    onPluginSelected(service, plugin)
  }

  return (
    <BorderedBox color={WHITE} borderColorOpacity={30} backgroundColor={TRANSPARENT} classes={`${commonStyles.fullWidth} ${styles.container}`}>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        {configuredServices.map(configuredService => (
          <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${commonStyles.overflowHidden}`} key={configuredService.name}>
            <TemplateSelector onTemplateSelected={onTemplateSelected} service={{ ...configuredService }} serviceSelected={serviceSelected} />
            {configuredService.plugins.length > 0 && <PluginsContainer service={configuredService} onPluginSelected={handlePluginSelected} pluginSelected={pluginSelected} />}
          </div>
        ))}
      </div>
    </BorderedBox>
  )
}

TemplateAndPluginTreeSelector.propTypes = {
  /**
   * configuredServices
    */
  configuredServices: PropTypes.array.isRequired,
  /**
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
