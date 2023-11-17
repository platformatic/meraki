'use strict'
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import { CSSTransition } from 'react-transition-group'
import AddTemplate from '~/components/shaped-components/AddTemplate'
import TemplateAndPluginHandler from '~/components/template-and-plugins/TemplateAndPluginHandler'
import '~/components/component.animation.css'

function TemplateHandler ({ onClickTemplate, serviceId, onClickViewAll }) {
  const globalState = useStackablesStore()
  const { services } = globalState
  const addTemplateRef = useRef(null)
  const templateAndPluginRef = useRef(null)
  const [templateAdded, setTemplateAdded] = useState(false)
  const [currentComponent, setCurrentComponent] = useState(
    <AddTemplate onClickAddTemplate={() => onClickTemplate()} ref={addTemplateRef} />
  )

  useEffect(() => {
    if (Object.keys(services[serviceId].template).length > 0 && Object.hasOwn(services[serviceId].template, 'id')) {
      setTemplateAdded(true)
      setCurrentComponent(
        <TemplateAndPluginHandler
          ref={templateAndPluginRef}
          onClickTemplate={() => onClickTemplate()}
          serviceId={serviceId}
          onClickViewAll={() => onClickViewAll()}
        />
      )
    }
  }, [Object.keys(services[serviceId].template).length])

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

TemplateHandler.defaultProps = {
  onClickTemplate: () => {},
  onClickViewAll: () => {}
}

export default TemplateHandler
