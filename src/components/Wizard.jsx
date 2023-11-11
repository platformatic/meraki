'use strict'
import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import CreateApplication from '~/components/steps/CreateApplication'
import AddTemplateAndPlugins from '~/components/steps/AddTemplateAndPlugins'
import ConfigureServices from '~/components/steps/ConfigureServices'
import { STEP_ADD_TEMPLATE_AND_PLUGINS, STEP_CONFIGURE_SERVICES, STEP_CREATE_APPLICATION } from '~/ui-constants'
import './component.animation.css'

function Wizard () {
  const [currentStep, setCurrentStep] = useState(STEP_CREATE_APPLICATION)
  const [components] = useState([
    <CreateApplication
      ref={useRef(null)}
      key={STEP_CREATE_APPLICATION}
      onNext={() => nextStep(STEP_ADD_TEMPLATE_AND_PLUGINS)}
    />,
    <AddTemplateAndPlugins
      ref={useRef(null)}
      key={STEP_ADD_TEMPLATE_AND_PLUGINS}
      onNext={() => nextStep(STEP_CONFIGURE_SERVICES)}
    />,
    <ConfigureServices
      ref={useRef(null)}
      key={STEP_CONFIGURE_SERVICES}
      onNext={() => nextStep(STEP_CREATE_APPLICATION)}
    />
  ])
  const [currentComponent, setCurrentComponent] = useState(components.find(component => component.key === STEP_CREATE_APPLICATION))

  function nextStep (step) {
    setCurrentStep(step)
  }

  useEffect(() => {
    setCurrentComponent(components.find(component => component.key === currentStep))
  }, [currentStep])

  return (
    <div>
      <SwitchTransition>
        <CSSTransition
          key={currentComponent.key}
          nodeRef={currentComponent.ref}
          timeout={300}
          classNames='component'
        >
          {currentComponent}
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}

Wizard.propTypes = {
  /**
     * children
     */
  children: PropTypes.node
}

Wizard.defaultProps = {
  children: null
}

export default Wizard
