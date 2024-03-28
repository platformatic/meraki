'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './Welcome.module.css'
import '~/components/component.animation.css'
import { BorderedBox, Button, HorizontalSeparator } from '@platformatic/ui-components'
import { ANTI_FLASH_WHITE, DULLS_BACKGROUND_COLOR, MARGIN_0, OPACITY_30, RICH_BLACK, SMALL, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import { onReceivedTemplateId, onStopReceivingTemplateId } from '~/api'
import useStackablesStore from '~/useStackablesStore'
import Icons from '@platformatic/ui-components/src/components/icons'
import { APPLICATION_PATH } from '~/ui-constants'
import { useNavigate } from 'react-router-dom'

const Welcome = React.forwardRef(({ onClickImportApp, onClickCreateNewApp, onClickGoToApp }, ref) => {
  const globalState = useStackablesStore()
  const {
    applications,
    useTemplateId,
    setUseTemplateId,
    resetNavigation
  } = globalState
  const [automaticallyImportedApplications, setAutomaticallyImportedApplications] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    resetNavigation()
    const handlingFunction = (_, templateIdReceived) => {
      if (templateIdReceived && useTemplateId === null) {
        setUseTemplateId(templateIdReceived)
      }
    }

    onReceivedTemplateId(handlingFunction)
    return () => {
      onStopReceivingTemplateId(handlingFunction)
      setUseTemplateId(null)
    }
  }, [])

  useEffect(() => {
    if (useTemplateId) {
      onClickCreateNewApp()
    }
  }, [useTemplateId])

  useEffect(() => {
    if (applications.length > 0) {
      setAutomaticallyImportedApplications([...applications.filter(application => application.automaticallyImported)])
    }
  }, [applications])

  function goToApplication (id) {
    navigate(APPLICATION_PATH.replace(':appId', id))
    onClickGoToApp()
  }

  function renderApplications () {
    if (automaticallyImportedApplications.length === 0) {
      return (<p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>You don’t have running application in your system.</p>)
    }
    return (
      <>
        <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70} ${styles.paddingBottom}`}>All the applications listed below are automatically imported into Meraki.<br /> Click on the application name to see the details</p>
        <BorderedBox color={WHITE} borderColorOpacity={OPACITY_30} backgroundColor={TRANSPARENT} classes={`${commonStyles.mediumFlexBlock24} ${commonStyles.fullWidth}`}>
          {
            automaticallyImportedApplications.map(application => (
              <div className={`${commonStyles.tinyFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} ${commonStyles.cursorPointer}`} key={application.id} onClick={() => goToApplication(application.id)}>
                <Icons.CLIIcon size={SMALL} color={WHITE} />
                <div className={styles.applicationName}>
                  <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${typographyStyles.ellipsis}`}>{application.name}</span>
                </div>
              </div>
            ))
          }
        </BorderedBox>
      </>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={`${commonStyles.largeFlexBlock40} ${commonStyles.fullWidth}`}>
            <div className={commonStyles.mediumFlexBlock}>
              <h1 className={`${typographyStyles.desktopHeadline1} ${typographyStyles.textWhite}`}>Welcome to Meraki</h1>
              <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>
                <span className={`${typographyStyles.opacity70}`}>Start by creating a new app, or import an existing one.<br /></span>
                <span className={`${typographyStyles.opacity70}`}>Do you need help to start? Read our&nbsp;
                  <a href='#' className={`${commonStyles.cursorPointer} ${typographyStyles.textTertiaryBlue} ${typographyStyles.onHoverUnderline}`}>Get started</a>
                &nbsp;documentation.
                </span>
              </p>
            </div>
            <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
              <Button
                label='Create new App'
                onClick={() => onClickCreateNewApp()}
                color={RICH_BLACK}
                bordered={false}
                backgroundColor={WHITE}
                hoverEffect={DULLS_BACKGROUND_COLOR}
                hoverEffectProperties={{ changeBackgroundColor: ANTI_FLASH_WHITE }}
                paddingClass={`${commonStyles.buttonPadding} cy-action-create-app`}
                platformaticIcon={{ iconName: 'CreateAppIcon', size: SMALL, color: RICH_BLACK }}
                textClass={typographyStyles.desktopBody}
              />
              <Button
                label='Import App'
                onClick={() => onClickImportApp()}
                backgroundColor={RICH_BLACK}
                color={WHITE}
                paddingClass={`${commonStyles.buttonPadding} cy-action-import-app`}
                platformaticIcon={{ iconName: 'ImportAppIcon', size: SMALL, color: WHITE }}
                textClass={typographyStyles.desktopBody}
              />
            </div>
            <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
            <div className={`${commonStyles.miniFlexBlock} ${commonStyles.fullWidth}`}>
              <p className={`${typographyStyles.desktopBodyLargeSemibold} ${typographyStyles.textWhite}`}>Applications running in your System</p>
              {renderApplications()}
            </div>
          </div>
        </div>
        <div className={`${commonStyles.largeFlexBlock} ${commonStyles.halfWidth} ${styles.imageContainer} ${commonStyles.justifyCenter}`}>
          <div className={styles.imageContent} />
        </div>
      </div>
    </>
  )
})

Welcome.propTypes = {
  /**
     * onClickImportApp
     */
  onClickImportApp: PropTypes.func,
  /**
     * onClickCreateNewApp
    */
  onClickCreateNewApp: PropTypes.func,
  /**
     * onClickGoToApp
    */
  onClickGoToApp: PropTypes.func
}

Welcome.defaultProps = {
  onClickImportApp: () => {},
  onClickCreateNewApp: () => {},
  onClickGoToApp: () => {}
}

export default Welcome
