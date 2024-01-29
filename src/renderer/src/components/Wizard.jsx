'use strict'
import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  STEP_ADD_TEMPLATE_AND_PLUGINS,
  STEP_PREPARE_FOLDER,
  STEP_CONFIGURE_SERVICES,
  STEP_CREATE_APPLICATION,
  STEP_CONFIGURE_APPLICATION,
  STEP_GENERATING_APPLICATION,
  MAX_WIDTH_XL
} from '~/ui-constants'
import CreateApplication from '~/components/steps/CreateApplication'
import ComposeApplication from '~/components/steps/compose-application/ComposeApplication'
import ConfigureServices from '~/components/steps/configure-services/ConfigureServices'
import ConfigureApplication from '~/components/steps/ConfigureApplication'
import GeneratingApplication from '~/components/steps/GeneratingApplication'
import PrepareFolder from '~/components/steps/PrepareFolder'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import useWindowDimensions from '~/hooks/useWindowDimensions'
import styles from './Wizard.module.css'
import useStackablesStore from '~/useStackablesStore'
import '~/components/component.animation.css'

function Wizard () {
  const globalState = useStackablesStore()
  const { composeApplicationComponentWidth, setComposeApplicationComponentWidth } = globalState
  const { width: innerWindow  } = useWindowDimensions()
  
  useEffect(() => {
    // padding on the root normal size
    let calcWidth = Math.floor((innerWindow - 40) / 6) - 16
    if (innerWindow > MAX_WIDTH_XL) {
      // padding on the root xl size
      calcWidth = Math.floor((innerWindow - 240) / 6) - 16
    } 
    if (calcWidth !== composeApplicationComponentWidth) {
      setComposeApplicationComponentWidth(calcWidth)
    }
  }, [innerWindow])


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
    setCssClassNames(NEXT)
    setCurrentStep(step)
  }

  function previousStep (step) {
    setCssClassNames(BACK)
    setCurrentStep(step)
  }

  useEffect(() => {
    setCurrentComponent(components.find(component => component.key === currentStep))
  }, [currentStep])

  return (
    <div className={styles.wizardContent}>
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
