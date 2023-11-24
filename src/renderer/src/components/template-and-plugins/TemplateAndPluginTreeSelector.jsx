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

function TemplateSelector ({ onSelectedTemplate, service }) {
  return (
    <div className={`${commonStyles.smallFlexRow} ${styles.cursorPointer} ${styles.overflowHidden}`} onClick={() => onSelectedTemplate(service)}>
      <Icons.ServiceIcon color={WHITE} size={MEDIUM} />
      <h5 className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite} ${styles.ellipsisTemplate}`}>{service.name}</h5>
    </div>
  )
}

function PluginsContainer ({ plugins, isTemplateSelected, onSelectedPlugin }) {
  const [hidePlugins, setHidePlugins] = useState(isTemplateSelected)

  function togglePlugins () {
    setHidePlugins(!hidePlugins)
  }

  return (
    <div className={`${commonStyles.smallFlexBlock} ${styles.pluginContainer}`}>
      {plugins.length === 1
        ? (<PluginSelector key={plugins[0].name} plugin={{ ...plugins[0] }} />)
        : (
          <>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth}`}>
              <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
                Hide Plugins ({plugins.length})
              </span>
              <PlatformaticIcon iconName='ArrowDownIcon' color={WHITE} size={SMALL} onClick={() => togglePlugins()} />
            </div>
            {!hidePlugins && plugins.map(plugin => (<PluginSelector key={plugin.name} plugin={{ ...plugin }} onSelectedPlugin={onSelectedPlugin} />))}
          </>
          )}
    </div>
  )
}

function PluginSelector ({ onSelectedPlugin, plugin }) {
  return (
    <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${styles.cursorPointer} ${styles.overflowHidden}`} onClick={() => onSelectedPlugin(plugin.name)}>
      <Icons.StackablesPluginIcon color={WHITE} size={SMALL} />
      <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70} ${styles.ellipsisPlugin}`} title={plugin.name}>{plugin.name}</span>
    </div>
  )
}

function TemplateAndPluginTreeSelector ({ onSelectedTemplate, onSelectedPlugin }) {
  const globalState = useStackablesStore()
  const { services } = globalState

  return (
    <BorderedBox color={WHITE} borderColorOpacity={30} backgroundColor={TRANSPARENT} classes={`${commonStyles.fullWidth} ${styles.container}`}>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        {services.map(service => (
          <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`} key={service.name}>
            <TemplateSelector onSelectedTemplate={onSelectedTemplate} service={{ ...service }} />
            {service.plugins.length > 0 && <PluginsContainer plugins={service.plugins} onSelectedPlugin={onSelectedPlugin} />}
          </div>
        ))}
      </div>
    </BorderedBox>
  )
}

TemplateAndPluginTreeSelector.propTypes = {
  /**
   * onSelectedTemplate
    */
  onSelectedTemplate: PropTypes.func,
  /**
   * onSelectedPlugin
    */
  onSelectedPlugin: PropTypes.func

}

TemplateAndPluginTreeSelector.defaultProps = {
  setSelectedTemplate: () => {},
  onSelectedPlugin: () => {}
}

export default TemplateAndPluginTreeSelector
