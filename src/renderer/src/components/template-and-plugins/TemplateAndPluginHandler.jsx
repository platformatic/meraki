'use strict'

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import ChangeTemplate from '~/components/shaped-components/ChangeTemplate'
import PluginButton from '~/components/shaped-components/PluginButton'
import styles from './TemplateAndPluginHandler.module.css'
import { ONLY_TEMPLATE, TEMPLATE_WITH_PLUGIN, TEMPLATE_WITH_2_PLUGINS, TEMPLATE_WITH_3_PLUGINS, ONLY_PLUGIN, PLUGINS_2, PLUGINS_3 } from '~/ui-constants'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import '~/components/component.animation.css'

const TemplateAndPluginHandler = React.forwardRef(({ serviceName, onClickTemplate, onClickViewAll }, ref) => {
  const globalState = useStackablesStore()
  const [heightTemplateType, setHeightTemplateType] = useState(ONLY_TEMPLATE)
  const [heightPluginType, setHeightPluginType] = useState(0)
  const { getService, removePlugin } = globalState

  useEffect(() => {
    if (serviceName && Object.keys(getService(serviceName)?.plugins).length > 0) {
      switch (Object.keys(getService(serviceName).plugins).length) {
        case 2:
          setHeightPluginType(PLUGINS_2)
          setHeightTemplateType(TEMPLATE_WITH_2_PLUGINS)
          break
        case 3:
          setHeightPluginType(PLUGINS_3)
          setHeightTemplateType(TEMPLATE_WITH_3_PLUGINS)
          break
        default:
          setHeightPluginType(ONLY_PLUGIN)
          setHeightTemplateType(TEMPLATE_WITH_PLUGIN)
          break
      }
    } else {
      setHeightPluginType(ONLY_PLUGIN)
      setHeightTemplateType(ONLY_TEMPLATE)
    }
  }, [serviceName, Object.keys(getService(serviceName)?.plugins).length])

  return (
    <div className={styles.container} ref={ref}>
      <TransitionGroup component={null}>
        {getService(serviceName).plugins.length > 0 && getService(serviceName).plugins.length <= 3 && getService(serviceName).plugins.map((plugin, index) =>
          <CSSTransition
            key={`templatePlugin-${plugin.name}-${getService(serviceName).plugins.length}`}
            timeout={300}
            classNames='fade-vertical'
          >
            <PluginButton
              key={plugin.name}
              index={index}
              {...plugin}
              heightType={heightPluginType}
              sortable={getService(serviceName).plugins.length !== 1}
              onClickRemove={() => removePlugin(serviceName, plugin.name)}
            />
          </CSSTransition>
        )}
        {getService(serviceName).plugins.length > 3 && (
          <CSSTransition
            key={`changePlugin-${getService(serviceName).plugins.length}`}
            timeout={300}
            classNames='fade-vertical'
          >
            <PluginButton
              sortable={false}
              totalPlugins={getService(serviceName).plugins.length}
              viewAll
              heightType={heightPluginType}
              onClickViewAll={() => onClickViewAll()}
            />
          </CSSTransition>
        )}
        <CSSTransition
          key={`changeTemplate${getService(serviceName).plugins.length}`}
          timeout={300}
          classNames='fade-vertical'
        >
          <ChangeTemplate
            showIcon={getService(serviceName).plugins.length < 2}
            name={getService(serviceName).template.name}
            onClick={() => onClickTemplate()}
            heightType={heightTemplateType}
          />
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
})

TemplateAndPluginHandler.propTypes = {
  /**
   * onClickTemplate
    */
  onClickTemplate: PropTypes.func,
  /**
   * onClickViewAll
    */
  onClickViewAll: PropTypes.func,
  /**
   * serviceName
    */
  serviceName: PropTypes.string
}

TemplateAndPluginHandler.defaultProps = {
  onClickTemplate: () => {},
  onClickViewAll: () => {},
  serviceName: ''
}

export default TemplateAndPluginHandler
