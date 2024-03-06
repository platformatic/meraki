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
  BREAKPOINTS_HEIGHT_LG,
  HEIGHT_LG,
  HEIGHT_MD
} from '~/ui-constants'
import CreateApplication from '~/components/steps/CreateApplication'
import ComposeApplication from '~/components/steps/compose-application/ComposeApplication'
import ConfigureServices from '~/components/steps/configure-services/ConfigureServices'
import ConfigureApplication from '~/components/steps/ConfigureApplication'
import GeneratingApplication from '~/components/steps/GeneratingApplication'
import PrepareFolder from '~/components/steps/PrepareFolder'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styles from './Wizard.module.css'
import '~/components/component.animation.css'
import useWindowDimensions from '~/hooks/useWindowDimensions'
function Wizard ({
  useVersion,
  onClickGoToApps
}) {
  const wizardClassName = styles[`wizardContentV${useVersion}`]
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
      onBack={() => previousStep(STEP_ADD_TEMPLATE_AND_PLUGINS)}
      onRestartProcess={() => nextStep(STEP_CREATE_APPLICATION)}
      useVersion={useVersion}
      onClickGoToApps={() => onClickGoToApps()}
    />
  ])
  const [currentComponent, setCurrentComponent] = useState(components.find(component => component.key === STEP_CREATE_APPLICATION))

  const { height: innerHeight } = useWindowDimensions()

  useEffect(() => {
    if (innerHeight > BREAKPOINTS_HEIGHT_LG) {
      document.documentElement.style.setProperty('--compose-application-height', HEIGHT_LG)
    } else {
      document.documentElement.style.setProperty('--compose-application-height', HEIGHT_MD)
    }
  }, [innerHeight])

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
    <div className={wizardClassName}>
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
     * useVersion
     */
  useVersion: PropTypes.string,
  /**
     * useVersion
     */
  onClickGoToApps: PropTypes.func
}

Wizard.defaultProps = {
  useVersion: '1',
  onClickGoToApps: () => {}
}

export default Wizard
