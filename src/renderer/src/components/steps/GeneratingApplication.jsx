'use strict'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { BorderedBox, Button, Icons } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './GeneratingApplication.module.css'
import { MAIN_DARK_BLUE, WHITE, SMALL, MAIN_GREEN, TRANSPARENT, ERROR_RED, RICH_BLACK } from '@platformatic/ui-components/src/components/constants'
import useStackablesStore from '~/useStackablesStore'
import Title from '~/components/ui/Title'

/* function dateDifferences(millisStartDate, millisEndDate) {
  const s = new Date(millisStartDate);
  const e = new Date(millisEndDate);
  const diffTime = Math.abs(e - s);
  const diffSeconds = String(Math.ceil(diffTime / 1000 )).padStart(2, '0')

  return `${diffSeconds}s`
} */

// eslint-disable-next-line no-unused-vars
function StepCreation ({ step, index, concludedStep, /* startTime = 0, endTime = 0,  */ indexError, externalUrl = '' }) {
  let status = 'NOT_STARTED'
  if (concludedStep >= 0) {
    if (concludedStep >= index) {
      status = 'COMPLETED'
    }
  }

  if (concludedStep + 1 === index) {
    status = 'LOADING'
  }

  let classes = `${commonStyles.mediumFlexRow} ${commonStyles.justifyBetween} ${commonStyles.smallPadding} `
  classes += concludedStep + 1 < index ? styles['apply-opacity-20'] : ''

  let cmp

  if (indexError === index) {
    return (
      <BorderedBox
        color={ERROR_RED}
        backgroundColor={TRANSPARENT}
        classes={`${commonStyles.mediumFlexRow} ${commonStyles.justifyBetween} ${commonStyles.smallPadding}`}
        key={index}
      >
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
          <Icons.AlertIcon size={SMALL} color={ERROR_RED} />
          <span className={commonStyles.typographyBody}>{step}</span>
          {externalUrl && <a href={externalUrl} target='_blank' rel='noreferrer' data-testid='api-detail-repository-link'>Check progress</a>}
        </div>
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
          <span className={commonStyles.typographyBodySmall}>Failed</span>
        </div>
      </BorderedBox>
    )
  }

  switch (status) {
    case 'LOADING':
      cmp = (
        <BorderedBox
          color={MAIN_DARK_BLUE}
          backgroundColor={MAIN_DARK_BLUE}
          backgroundColorOpacity={20}
          classes={classes}
          key={index}
        >
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <div className={styles.clockWiseRotation}><Icons.RunningIcon size={SMALL} /></div>
            <span className={commonStyles.typographyBody}>{step}</span>
            {externalUrl && <a href={externalUrl} target='_blank' rel='noreferrer' data-testid='api-detail-repository-link'>Check progress</a>}
          </div>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <span className={commonStyles.typographyBodySmall}>
              Loading
            </span>
          </div>
        </BorderedBox>
      )
      break

    case 'COMPLETED':
      cmp = (
        <BorderedBox
          color={MAIN_DARK_BLUE}
          backgroundColor={TRANSPARENT}
          backgroundColorOpacity={100}
          classes={classes}
          key={index}
        >
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <Icons.CircleCheckMarkIcon size={SMALL} color={MAIN_GREEN} />
            <span className={commonStyles.typographyBody}>{step}</span>
          </div>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <span className={commonStyles.typographyBodySmall}>
              Completed
            </span>
          </div>
        </BorderedBox>
      )
      break

    default:
      cmp = (
        <BorderedBox
          color={MAIN_DARK_BLUE}
          backgroundColor={TRANSPARENT}
          backgroundColorOpacity={100}
          classes={classes}
          key={index}
        >
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <Icons.CircleCheckMarkIcon checked={false} size={SMALL} color={MAIN_DARK_BLUE} />
            <span className={commonStyles.typographyBody}>{step}</span>
          </div>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <span className={commonStyles.typographyBodySmall}>
              Not started
            </span>
          </div>
        </BorderedBox>
      )
      break
  }

  return cmp
}

const GeneratingApplication = React.forwardRef(({ onClickComplete }, ref) => {
  const globalState = useStackablesStore()
  const { formData, services } = globalState

  useEffect(() => {
    async function generateApplication () {
      try {
        console.log('let\'scall createApp')
        const obj = { projectName: formData.createApplication.application, services, ...formData.configureApplication }
        console.log(`prjectDir: ${formData.createApplication.path}`)
        console.log(obj)
      } catch (error) {
        console.log(`Error on prepareFolder ${error}`)
      }
    }
    generateApplication()
  }, [])

  return (
    <div className={`${commonStyles.largeFlexBlock} ${commonStyles.halfWidth}`} ref={ref}>
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
  onClickComplete: () => {}
}

export default GeneratingApplication
