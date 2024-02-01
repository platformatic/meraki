'use strict'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import PluginAndRoutes from '~/components/plugins/PluginAndRoutes'
import AddPlugin from '~/components/shaped-components/AddPlugin'
import './plugin.animation.css'

function PluginHandler ({ onClickAddPlugin, serviceName }) {
  const [templateAdded, setTemplateAdded] = useState(false)
  const globalState = useStackablesStore()
  const { getService } = globalState
  const nodeRef = useRef(null)
  const [currentComponent, setCurrentComponent] = useState(
    <AddPlugin inactive />
  )

  useEffect(() => {
    if (serviceName && Object.keys(getService(serviceName)?.template).length > 0) {
      setTemplateAdded(true)
      setCurrentComponent(
        <PluginAndRoutes onClickAddPlugin={onClickAddPlugin} ref={nodeRef} />
      )
    }
  }, [serviceName, Object.keys(getService(serviceName)?.template).length])

  return (
    <CSSTransition
      in={templateAdded}
      nodeRef={nodeRef}
      timeout={300}
      classNames='plugin'
    >
      {currentComponent}
    </CSSTransition>

  )
}

PluginHandler.propTypes = {
  /**
   * onClickAddPlugin
    */
  onClickAddPlugin: PropTypes.func,
  /**
   * serviceName
    */
  serviceName: PropTypes.string
}

PluginHandler.defaultProps = {
  onClickAddPlugin: () => {},
  serviceName: ''
}

export default PluginHandler
