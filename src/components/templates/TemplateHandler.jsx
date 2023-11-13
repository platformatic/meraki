'use strict'
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import { CSSTransition } from 'react-transition-group'
import AddTemplate from '~/components/shaped-components/AddTemplate'
import TemplateAndPluginHandler from '~/components/template-and-plugins/TemplateAndPluginHandler'
import '~/components/component.animation.css'

function TemplateHandler ({ onClick, serviceId }) {
  const globalState = useStackablesStore()
  const { services } = globalState
  const addTemplateRef = useRef(null)
  const templateAndPluginRef = useRef(null)
  const [templateAdded, setTemplateAdded] = useState(false)
  const [currentComponent, setCurrentComponent] = useState(
    <AddTemplate onClick={() => onClick()} ref={addTemplateRef} />
  )

  useEffect(() => {
    if (services[serviceId]?.template?.id) {
      setTemplateAdded(true)
      setCurrentComponent(
        <TemplateAndPluginHandler
          ref={templateAndPluginRef}
          onClickTemplate={() => onClick()}
          serviceId={serviceId}
        />
      )
    }
  }, [services[serviceId]?.template?.id])

  return (
    <CSSTransition
      in={templateAdded}
      out={!templateAdded}
      nodeRef={templateAdded ? templateAndPluginRef : addTemplateRef}
      timeout={300}
      classNames='template'
    >
      {currentComponent}
    </CSSTransition>
  )
}

TemplateHandler.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func,
  /**
   * serviceId
    */
  serviceId: PropTypes.number.isRequired
}

TemplateHandler.defaultProps = {
  onClick: () => {}
}

export default TemplateHandler
