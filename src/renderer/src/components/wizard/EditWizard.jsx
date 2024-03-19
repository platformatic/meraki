'use strict'
import { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  STEP_ADD_TEMPLATE_AND_PLUGINS,
  STEP_PREPARE_FOLDER,
  STEP_CONFIGURE_SERVICES,
  STEP_CONFIGURE_APPLICATION,
  STEP_UPDATING_APPLICATION,
  BREAKPOINTS_HEIGHT_LG,
  HEIGHT_LG,
  HEIGHT_MD
} from '~/ui-constants'
import ComposeApplication from '~/components/steps/compose-application/ComposeApplication'
import ConfigureServices from '~/components/steps/configure-services/ConfigureServices'
import ConfigureApplication from '~/components/steps/ConfigureApplication'
import UpdatingApplication from '~/components/steps/UpdatingApplication'
import PrepareFolder from '~/components/steps/PrepareFolder'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styles from './EditWizard.module.css'
import '~/components/component.animation.css'
import useWindowDimensions from '~/hooks/useWindowDimensions'
import { prepareStoreForEditApplication } from '~/utils'
import useStackablesStore from '~/useStackablesStore'
import { LoadingSpinnerV2 } from '@platformatic/ui-components'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'

function EditWizard ({
  onClickGoToApps,
  applicationSelected
}) {
  const globalState = useStackablesStore()
  const { formData, initializeWizardState } = globalState
  const NEXT = 'next'; const BACK = 'back'
  const startingStep = STEP_ADD_TEMPLATE_AND_PLUGINS
  const [cssClassNames, setCssClassNames] = useState(NEXT)
  const [currentStep, setCurrentStep] = useState(startingStep)
  const [innerLoading, setInnerLoading] = useState(true)

  const components = [
    <ComposeApplication
      ref={useRef(null)}
      key={STEP_ADD_TEMPLATE_AND_PLUGINS}
      onNext={() => nextStep(STEP_PREPARE_FOLDER)}
      createMode={false}
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
      onNext={() => nextStep(STEP_UPDATING_APPLICATION)}
    />,
    <UpdatingApplication
      ref={useRef(null)}
      key={STEP_UPDATING_APPLICATION}
      onBack={() => previousStep(STEP_ADD_TEMPLATE_AND_PLUGINS)}
      onClickGoToApps={() => onClickGoToApps()}
      applicationSelectedId={applicationSelected.id}
    />
  ]
  const [currentComponent, setCurrentComponent] = useState(components.find(component => component.key === startingStep))
  const { height: innerHeight } = useWindowDimensions()

  useEffect(() => {
    if (applicationSelected) {
      const { formData, services } = prepareStoreForEditApplication(applicationSelected)
      initializeWizardState(formData, services)
    }
  }, [applicationSelected])

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      setInnerLoading(false)
    }
  }, [formData])

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

  function renderComponent () {
    if (innerLoading) {
      return (
        <LoadingSpinnerV2
          loading
          applySentences={{
            containerClassName: `${commonStyles.mediumFlexBlock} ${commonStyles.itemsCenter}`,
            sentences: [{
              style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`,
              text: 'Loading your application...'
            }]
          }}
          containerClassName={styles.loadingSpinner}
        />
      )
    }

    return (
      <div className={styles.content}>
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

  return renderComponent()
}

EditWizard.propTypes = {
  /**
     * onClickGoToApps
     */
  onClickGoToApps: PropTypes.func,
  /**
     * applicationSelected
     */
  applicationSelected: PropTypes.object
}

EditWizard.defaultProps = {
  onClickGoToApps: () => {},
  applicationSelected: {}
}

export default EditWizard
