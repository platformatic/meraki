'use strict'
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import useStackablesStore from '~/useStackablesStore'
import ServicesTree from '~/components/services/ServicesTree'
import './service.animation.css'

function ConnectorAndServicesTree () {
  const [templateAdded, setTemplateAdded] = useState(false)
  const globalState = useStackablesStore()
  const { services } = globalState
  const nodeRef = useRef(null)
  const [currentComponent, setCurrentComponent] = useState(<></>)

  useEffect(() => {
    if (Object.keys(services[0].template).length > 0 && Object.hasOwn(services[0].template, 'id')) {
      setTemplateAdded(true)
      setCurrentComponent(<ServicesTree ref={nodeRef} />)
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

export default ConnectorAndServicesTree
