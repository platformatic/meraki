'use strict'
import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  STEP_ADD_TEMPLATE_AND_PLUGINS,
  STEP_PREPARE_FOLDER,
  STEP_CONFIGURE_SERVICES,
  STEP_CREATE_APPLICATION,
  STEP_CONFIGURE_APPLICATION,
  STEP_GENERATING_APPLICATION
} from '~/ui-constants'
import CreateApplication from '~/components/steps/CreateApplication'
import ComposeApplication from '~/components/steps/compose-application/ComposeApplication'
import ConfigureServices from '~/components/steps/configure-services/ConfigureServices'
import ConfigureApplication from '~/components/steps/ConfigureApplication'
import GeneratingApplication from '~/components/steps/GeneratingApplication'
import PrepareFolder from '~/components/steps/PrepareFolder'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import '~/components/component.animation.css'

function Wizard () {
  const NEXT = 'next'; const BACK = 'back'
  const [cssClassNames, setCssClassNames] = useState(NEXT)
  const [currentStep, setCurrentStep] = useState(STEP_CREATE_APPLICATION)
  const [components] = useState([
    <CreateApplication
      ref={useRef(null)}
      key={STEP_CREATE_APPLICATION}
      onNext={() => nextStep(STEP_ADD_TEMPLATE_AND_PLUGINS)}
    />,
    <ComposeApplication
      ref={useRef(null)}
      key={STEP_ADD_TEMPLATE_AND_PLUGINS}
      onBack={() => previousStep(STEP_CREATE_APPLICATION)}
      onNext={() => nextStep(STEP_PREPARE_FOLDER)}
    />,
    <PrepareFolder
      ref={useRef(null)}
      key={STEP_PREPARE_FOLDER}
      onBack={() => previousStep(STEP_ADD_TEMPLATE_AND_PLUGINS)}
      onNext={() => nextStep(STEP_CONFIGURE_SERVICES)}
    />,
    <ConfigureServices
      ref={useRef(null)}
      key={STEP_CONFIGURE_SERVICES}
      onBack={() => previousStep(STEP_ADD_TEMPLATE_AND_PLUGINS)}
      onNext={() => nextStep(STEP_CONFIGURE_APPLICATION)}
    />,
    <ConfigureApplication
      ref={useRef(null)}
      key={STEP_CONFIGURE_APPLICATION}
      onBack={() => nextStep(STEP_CONFIGURE_SERVICES)}
      onNext={() => nextStep(STEP_GENERATING_APPLICATION)}
    />,
    <GeneratingApplication
      ref={useRef(null)}
      key={STEP_GENERATING_APPLICATION}
      onRestartProcess={() => nextStep(STEP_CREATE_APPLICATION)}
    />
  ])
  const [currentComponent, setCurrentComponent] = useState(components.find(component => component.key === STEP_CREATE_APPLICATION))

  function nextStep (step) {
    if (cssClassNames === BACK) {
      setCssClassNames(NEXT)
    }
    setCurrentStep(step)
  }

  function previousStep (step) {
    /* if (cssClassNames === NEXT) {
      setCssClassNames(BACK)
    } */
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
          classNames={cssClassNames}
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
