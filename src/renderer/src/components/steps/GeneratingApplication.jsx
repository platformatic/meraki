'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { BorderedBox, Button, Icons } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './GeneratingApplication.module.css'
import { WHITE, TRANSPARENT, RICH_BLACK, OPACITY_30, OPACITY_100, SMALL } from '@platformatic/ui-components/src/components/constants'
import useStackablesStore from '~/useStackablesStore'
import Title from '~/components/ui/Title'
import { callCreateApp, logInfo, quitApp } from '~/api'

/* function dateDifferences(millisStartDate, millisEndDate) {
  const s = new Date(millisStartDate);
  const e = new Date(millisEndDate);
  const diffTime = Math.abs(e - s);
  const diffSeconds = String(Math.ceil(diffTime / 1000 )).padStart(2, '0')

  return `${diffSeconds}s`
} */

// eslint-disable-next-line no-unused-vars
function Step ({ label, index, currentStep }) {
  const [active, setActive] = useState(false)
  const [classNameLabel, setClassNameLabel] = useState(`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`)
  useEffect(() => {
    if (currentStep === index) {
      setActive(true)
      setClassNameLabel(`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`)
    }
  }, [currentStep])

  return (
    <BorderedBox
      color={WHITE}
      backgroundColor={TRANSPARENT}
      borderColorOpacity={active ? OPACITY_100 : OPACITY_30}
      classes={`${commonStyles.mediumFlexRow} ${commonStyles.justifyBetween} ${styles.paddingStep}`}
      key={index}
    >
      <span className={classNameLabel}>{label}</span>
      {active ? <Icons.RunningIcon color={WHITE} size={SMALL} /> : <Icons.CircleCheckMarkIcon checked={false} color={WHITE} size={SMALL} disabled />}
    </BorderedBox>
  )
}

const GeneratingApplication = React.forwardRef(({ onClickComplete }, ref) => {
  const globalState = useStackablesStore()
  const { formData } = globalState
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState()

  useEffect(() => {
    if (formData.configuredServices.services) {
      const tmpStep = []
      formData.configuredServices.services.forEach(service => {
        tmpStep.push({
          label: `Generating ${service.name}`,
          index: `${service.name}-${service.template}`
        })
      })
      tmpStep.push({ label: 'App Created!', index: 'app-created' })
      setSteps([...tmpStep])
    }
  }, [formData.configuredServices.services])

  useEffect(() => {
    logInfo((_, value) => setCurrentStep(value))
    async function generateApplication () {
      try {
        const obj = { projectName: formData.createApplication.application, services: formData.configuredServices.services, ...formData.configureApplication }
        const response = await callCreateApp(formData.createApplication.path, obj)
        console.log('response', response)
      } catch (error) {
        console.error(`Error on generateApplication ${error}`)
      }
    }
    generateApplication()
  }, [steps.length > 0])
  return (
    <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`} ref={ref}>
      <div className={commonStyles.mediumFlexBlock}>
        <Title
          title={`Generating ${formData.createApplication.application}`}
          iconName='AppIcon'
          dataAttrName='cy'
          dataAttrValue='step-title'
        />
        <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
          We are generating your app. Once all the steps are done you will be able to complete and use your new application.
        </p>
      </div>
      <div className={`${styles.content} ${commonStyles.halfWidth}`}>
        <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`}>
          {steps.map(step => <Step {...step} key={step.index} currentStep={currentStep} />)}
        </div>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          label='Complete'
          onClick={() => onClickComplete()}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          classes={`${commonStyles.buttonPadding} cy-action-next`}
        />
      </div>
    </div>
  )
})

GeneratingApplication.propTypes = {
  /**
   * onClickComplete
   */
  onClickComplete: PropTypes.func
}

GeneratingApplication.defaultProps = {
  onClickComplete: () => {
    quitApp()
  }
}

export default GeneratingApplication
