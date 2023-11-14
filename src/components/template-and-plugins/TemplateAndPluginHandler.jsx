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

const TemplateAndPluginHandler = React.forwardRef(({ serviceId, onClickTemplate, onClickViewAll }, ref) => {
  const globalState = useStackablesStore()
  const [showTemplates, setShowTemplates] = useState(false)
  const [heightTemplate, setHeightTemplate] = useState(DEFAULT_HEIGHT_TEMPLATE)
  const [heightPlugin, setHeightPlugin] = useState(0)
  const { services, removePlugin } = globalState

  useEffect(() => {
    if (services[serviceId].plugins.length > 0) {
      setShowTemplates(true)
      switch (services[serviceId].plugins.length) {
        case 2:
          setHeightPlugin(HEIGHT_PLUGIN_2)
          setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE - 2 * HEIGHT_PLUGIN_2)
          break
        case 3:
          setHeightPlugin(HEIGHT_PLUGIN_3)
          setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE - 3 * HEIGHT_PLUGIN_3)
          break
        default:
          setHeightPlugin(HEIGHT_PLUGIN_1)
          setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE - HEIGHT_PLUGIN_1)
          break
      }
    } else {
      setShowTemplates(false)
      setHeightTemplate(DEFAULT_HEIGHT_TEMPLATE)
    }
  }, [services[serviceId].plugins.length])

  function renderPlugins () {
    if (services[serviceId].plugins.length > 3) {
      return (
        <CSSTransition
          key={`changePlugin-${services[serviceId].plugins.length}`}
          timeout={300}
          classNames='fade-vertical'
        >
          <PluginButton
            sortable={false}
            totalPlugins={services[serviceId].plugins.length}
            viewAll
            height={heightPlugin}
            onClickViewAll={() => onClickViewAll()}
          />
        </CSSTransition>
      )
    }
    return (
      <>
        {services[serviceId].plugins.map((plugin, index) =>
          <CSSTransition
            key={`changePlugin-${plugin.id}-${services[serviceId].plugins.length}`}
            timeout={300}
            classNames='fade-vertical'
          >
            <PluginButton
              key={plugin.id}
              index={index}
              {...plugin}
              height={heightPlugin}
              sortable={services[serviceId].plugins.length !== 1}
              onClickRemove={() => removePlugin(serviceId, plugin.id)}
            />
          </CSSTransition>
        )}
      </>
    )
  }

  return (
    <div className={styles.container} ref={ref}>
      <TransitionGroup component={null}>
        {showTemplates && renderPlugins()}
        <CSSTransition
          key={`changeTemplate${services[serviceId].plugins.length}`}
          timeout={300}
          classNames='fade-vertical'
        >
          <ChangeTemplate
            name={services[serviceId].template.name}
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
   * serviceId
    */
  serviceId: PropTypes.number.isRequired
}

TemplateAndPluginHandler.defaultProps = {
  onClickTemplate: () => {},
  onClickViewAll: () => {}
}

export default TemplateAndPluginHandler
