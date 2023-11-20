'use strict'
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import { CSSTransition } from 'react-transition-group'
import AddTemplate from '~/components/shaped-components/AddTemplate'
import TemplateAndPluginHandler from '~/components/template-and-plugins/TemplateAndPluginHandler'
import '~/components/component.animation.css'

function TemplateHandler ({ onClickTemplate, serviceName, onClickViewAll }) {
  const globalState = useStackablesStore()
  const { getService } = globalState
  const addTemplateRef = useRef(null)
  const templateAndPluginRef = useRef(null)
  const [templateAdded, setTemplateAdded] = useState(false)
  const [currentComponent, setCurrentComponent] = useState(
    <AddTemplate onClickAddTemplate={() => onClickTemplate()} ref={addTemplateRef} />
  )

  useEffect(() => {
    if (serviceName && Object.keys(getService(serviceName)?.template).length > 0) {
      setTemplateAdded(true)
      setCurrentComponent(
        <TemplateAndPluginHandler
          ref={templateAndPluginRef}
          onClickTemplate={() => onClickTemplate()}
          serviceName={serviceName}
          onClickViewAll={() => onClickViewAll()}
        />
      )
    }
  }, [serviceName, Object.keys(getService(serviceName)?.template).length])

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
   * serviceName
    */
  serviceName: PropTypes.string
}

TemplateHandler.defaultProps = {
  onClickTemplate: () => {},
  onClickViewAll: () => {},
  serviceName: ''
}

export default TemplateHandler
