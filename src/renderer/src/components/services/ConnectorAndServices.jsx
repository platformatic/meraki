'use strict'
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import useStackablesStore from '~/useStackablesStore'
import Services from '~/components/services/Services'
import './service.animation.css'

function ConnectorAndServices () {
  const [templateAdded, setTemplateAdded] = useState(false)
  const globalState = useStackablesStore()
  const { services } = globalState
  const nodeRef = useRef(null)
  const [currentComponent, setCurrentComponent] = useState(<></>)

  useEffect(() => {
    if (Object.keys(services[0].template).length > 0 && Object.hasOwn(services[0].template, 'id')) {
      setTemplateAdded(true)
      setCurrentComponent(<Services ref={nodeRef} />)
    }
  }, [Object.keys(services[0].template).length])

  return (
    <CSSTransition
      in={templateAdded}
      nodeRef={nodeRef}
      timeout={300}
      classNames='service'
    >
      {currentComponent}
    </CSSTransition>
  )
}

export default ConnectorAndServices
