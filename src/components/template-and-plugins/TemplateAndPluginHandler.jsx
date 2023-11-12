'use strict'

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import ChangeTemplate from '~/components/shaped-buttons/ChangeTemplate'
import Plugin from '../shaped-buttons/Plugin'
import styles from './TemplateAndPluginHandler.module.css'

const TemplateAndPluginHandler = React.forwardRef(({ onClickTemplate }, ref) => {
  const globalState = useStackablesStore()
  const [showTemplates, setShowTemplates] = useState(false)
  const { formDataWizard } = globalState

  useEffect(() => {
    if (formDataWizard?.plugins?.length > 0) {
      setShowTemplates(true)
    } else {
      setShowTemplates(false)
    }
  }, [formDataWizard?.plugins])

  return (
    <div className={styles.container} ref={ref}>
      {showTemplates && (formDataWizard.plugins.map((plugin, index) =>
        <Plugin
          key={plugin.id}
          index={index}
          {...plugin}
        />
      ))}
      <ChangeTemplate
        name={formDataWizard.template.name}
        onClick={() => onClickTemplate()}
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
