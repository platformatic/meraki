'use strict'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MODAL_POPUP_V2 } from '@platformatic/ui-components/src/components/constants'
import styles from './UpgradePlatformaticFlow.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { LoadingSpinnerV2, Modal } from '@platformatic/ui-components'
import { LOADING, SUCCESS, NONE, ERROR, STATUS_STOPPED, STATUS_RUNNING } from '~/ui-constants'
import ErrorComponent from '~/components/screens/ErrorComponent'
import SuccessComponent from '~/components/screens/SuccessComponent'
import StopApplicationToUpgrade from './StopApplicationToUpgrade'
import { callUpgradeAppPlt } from '~/api'
import useStackablesStore from '~/useStackablesStore'

function UpgradePlatformaticFlow ({ onTerminateUpgradePlatformaticFlow, onStopApplication, onCancelUpgrade }) {
  const globalState = useStackablesStore()
  const { applicationSelectedId } = globalState
  const applicationStatus = globalState.computed.applicationStatus
  const [innerStatus, setInnerStatus] = useState(NONE)
  const [error, setError] = useState('')

  useEffect(() => {
    if (applicationStatus === STATUS_STOPPED) {
      setInnerStatus(LOADING)
    }
  }, [applicationStatus])

  useEffect(() => {
    if (innerStatus === LOADING) {
      upgradePlt()
    }
  }, [innerStatus])

  async function upgradePlt () {
    try {
      await callUpgradeAppPlt(applicationSelectedId)
      setInnerStatus(SUCCESS)
      setTimeout(() => onTerminateUpgradePlatformaticFlow(), 2000)
    } catch (error) {
      setInnerStatus(ERROR)
      setError(error)
    }
  }
  function renderContent () {
    if (applicationStatus === STATUS_RUNNING) {
      return (
        <Modal
          key='stopApplicationRunning'
          setIsOpen={() => onCancelUpgrade()}
          title='Stop the Application to edit'
          titleClassName={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}
          layout={MODAL_POPUP_V2}
          permanent
        >
          <StopApplicationToUpgrade onClickCancel={() => onCancelUpgrade()} onClickProceed={() => onStopApplication()} />
        </Modal>
      )
    }

    if (innerStatus === LOADING) {
      return (
        <LoadingSpinnerV2
          loading
          applySentences={{
            containerClassName: `${commonStyles.mediumFlexBlock} ${commonStyles.itemsCenter}`,
            sentences: [{
              style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`,
              text: 'Upgrading your application to latest Platformatic Version...'
            }, {
              style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`,
              text: 'Once finished re-start the application to make the upgrade effective!'
            }]
          }}
          containerClassName={styles.loadingSpinner}
        />
      )
    }

    if (innerStatus === SUCCESS) {
      return (
        <SuccessComponent
          title='Your Application has been upgraded successfully'
          subtitle='Restart the application to see the upgraded version of Platformatic'
        />
      )
    }
    if (innerStatus === ERROR) {
      return <ErrorComponent message={error} onClickDismiss={() => onCancelUpgrade()} />
    }

    return <></>
  }

  return (
    <div className={`${styles.container} ${innerStatus === NONE ? '' : styles.containerDulls}`}>
      {renderContent()}
    </div>
  )
}

UpgradePlatformaticFlow.propTypes = {
  /**
   * onTerminateUpgradePlatformaticFlow: function to be called at the end of the flow
   */
  onTerminateUpgradePlatformaticFlow: PropTypes.func,
  /**
   * onStopApplication: function to be called on the confirm button
   */
  onStopApplication: PropTypes.func,
  /**
   * onCancelUpgrade: function to be called on the cancel button
   */
  onCancelUpgrade: PropTypes.func
}

UpgradePlatformaticFlow.defaultProps = {
  onTerminateUpgradePlatformaticFlow: () => {},
  onStopApplication: () => {},
  onCancelUpgrade: () => {}
}

export default UpgradePlatformaticFlow
