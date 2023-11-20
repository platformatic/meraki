'use strict'

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import ChangeTemplate from '~/components/shaped-components/ChangeTemplate'
import PluginButton from '~/components/shaped-components/PluginButton'
import styles from './TemplateAndPluginHandler.module.css'
import { DEFAULT_HEIGHT_TEMPLATE, HEIGHT_PLUGIN_1, HEIGHT_PLUGIN_2, HEIGHT_PLUGIN_3 } from '~/ui-constants'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import '~/components/component.animation.css'

const TemplateAndPluginHandler = React.forwardRef(({ serviceName, onClickTemplate, onClickViewAll }, ref) => {
  const globalState = useStackablesStore()
  const [heightTemplate, setHeightTemplate] = useState(DEFAULT_HEIGHT_TEMPLATE)
  const [heightPlugin, setHeightPlugin] = useState(0)
  const { getService, removePlugin } = globalState

  useEffect(() => {
    if (serviceName && Object.keys(getService(serviceName)?.plugins).length > 0) {
      console.log('Object.keys(getService(serviceName).plugins', Object.keys(getService(serviceName).plugins).length)
      switch (Object.keys(getService(serviceName).plugins).length) {
        case 2:
          console.log('case 2')
          setHeightPlugin(HEIGHT_PLUGIN_2)
          setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE - 2 * HEIGHT_PLUGIN_2)
          break
        case 3:
          console.log('case 3')

          setHeightPlugin(HEIGHT_PLUGIN_3)
          setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE - 3 * HEIGHT_PLUGIN_3)
          break
        default:
          console.log('defaukt2')

          setHeightPlugin(HEIGHT_PLUGIN_1)
          setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE - HEIGHT_PLUGIN_1)
          break
      }
    } else {
      setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE)
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
              height={heightPlugin}
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
              height={heightPlugin}
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
            height={heightTemplate}
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
