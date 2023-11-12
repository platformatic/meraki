'use strict'

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import ChangeTemplate from '~/components/shaped-buttons/ChangeTemplate'
import Plugin from '../shaped-buttons/Plugin'
import styles from './TemplateAndPluginHandler.module.css'
import { DEFAULT_HEIGHT_TEMPLATE, HEIGHT_PLUGIN_1, HEIGHT_PLUGIN_2, HEIGHT_PLUGIN_3 } from '~/ui-constants'

const TemplateAndPluginHandler = React.forwardRef(({ onClickTemplate }, ref) => {
  const globalState = useStackablesStore()
  const [showTemplates, setShowTemplates] = useState(false)
  const [heightTemplate, setHeightTemplate] = useState(DEFAULT_HEIGHT_TEMPLATE)
  const [heightPlugin, setHeightPlugin] = useState(0)
  const { formDataWizard, addFormDataWizard } = globalState

  useEffect(() => {
    if (formDataWizard?.plugins?.length > 0) {
      setShowTemplates(true)
      switch (formDataWizard.plugins.length) {
        case 1:
          setHeightPlugin(HEIGHT_PLUGIN_1)
          setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE - HEIGHT_PLUGIN_1)
          break
        case 2:
          setHeightPlugin(HEIGHT_PLUGIN_2)
          setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE - 2 * HEIGHT_PLUGIN_2)
          break
        case 3:
          setHeightPlugin(HEIGHT_PLUGIN_3)
          setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE - 3 * HEIGHT_PLUGIN_3)
          break
      }
    } else {
      setShowTemplates(false)
      setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE)
    }
  }, [formDataWizard?.plugins?.length])

  function updatePlugins (id) {
    addFormDataWizard({
      plugins: [...formDataWizard.plugins.filter(plugin => plugin.id !== id)]
    })
  }

  return (
    <div className={styles.container} ref={ref}>
      {showTemplates && (formDataWizard.plugins.map((plugin, index) =>
        <Plugin
          key={plugin.id}
          index={index}
          {...plugin}
          height={heightPlugin}
          sortable={formDataWizard.plugins.length !== 1}
          onClickRemove={() => updatePlugins(plugin.id)}
        />
      ))}
      <ChangeTemplate
        name={formDataWizard.template.name}
        onClick={() => onClickTemplate()}
        height={heightTemplate}
      />
    </div>
  )
})

TemplateAndPluginHandler.propTypes = {
  /**
   * onClickTemplate
    */
  onClickTemplate: PropTypes.func
}

TemplateAndPluginHandler.defaultProps = {
  onClickTemplate: () => {}
}

export default TemplateAndPluginHandler
