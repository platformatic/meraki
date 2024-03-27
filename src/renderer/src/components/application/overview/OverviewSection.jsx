'use strict'
import React, { useEffect, useState } from 'react'
import { WHITE, OPACITY_30, MEDIUM, TRANSPARENT, SMALL, WARNING_YELLOW, OPACITY_10 } from '@platformatic/ui-components/src/components/constants'
import { BorderedBox, Button, ModalDirectional, PlatformaticIcon, VerticalSeparator } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import Icons from '@platformatic/ui-components/src/components/icons'
import { STATUS_STOPPED, STATUS_RUNNING } from '~/ui-constants'
import styles from './OverviewSection.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
// import { ApiReferenceReact } from '@scalar/api-reference-react'
import Scalar from '~/components/Scalar'

function OverviewSection () {
  const globalState = useStackablesStore()
  const applicationSelected = globalState.computed.applicationSelected
  const applicationStatus = globalState.computed.applicationStatus
  const [url, setUrl] = useState('-')
  const [showModalScalarIntegration, setShowModalScalarIntegration] = useState(false)

  useEffect(() => {
    if (applicationStatus === STATUS_RUNNING && applicationSelected?.runtime?.url) {
      setUrl(applicationSelected.runtime.url)
    } else {
      setUrl('-')
    }
  }, [applicationStatus, applicationSelected.runtime])

  function handleCloseModalAPIReference () {
    setShowModalScalarIntegration(false)
  }

  return (
    <>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        <div className={`${commonStyles.tinyFlexRow} ${commonStyles.fullWidth}`}>
          <Icons.AppDetailsIcon
            color={WHITE}
            size={MEDIUM}
          />
          <h3 className={`${typographyStyles.desktopHeadline3} ${typographyStyles.textWhite}`}>Overview</h3>
        </div>
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter} `}>
          {!applicationSelected.platformaticVersion
            ? (
              <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
                <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Current Platformatic Version: -</span>
              </div>)
            : (
              <>
                <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
                  <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Current Platformatic Version: </span>
                  {applicationSelected.platformaticVersion
                    ? (<span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>{applicationSelected.platformaticVersion}</span>)
                    : (<span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>-</span>)}
                </div>
                {!applicationSelected.isLatestPltVersion && (
                  <BorderedBox
                    color={WARNING_YELLOW}
                    backgroundColor={WARNING_YELLOW}
                    backgroundColorOpacity={OPACITY_10}
                    classes={`${commonStyles.buttonPadding} ${styles.updatePlatformaticBox}`}
                  >
                    <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
                      <Icons.AlertIcon size={SMALL} color={WARNING_YELLOW} />
                      <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWarningYellow}`}>There is a new Platformatic version.</span>
                    </div>
                  </BorderedBox>
                )}
              </>
              )}
        </div>

        <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} ${commonStyles.justifyBetween} `}>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} `}>
            <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
              <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Entrypoint:</span>
              <BorderedBox
                color={WHITE}
                backgroundColor={WHITE}
                backgroundColorOpacity={OPACITY_30}
                classes={commonStyles.buttonPadding}
              >
                <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}>{applicationSelected.entrypoint}</span>
              </BorderedBox>
            </div>

            <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} />

            <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
              <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>URL:</span>
              <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>{url} </span>
              <PlatformaticIcon iconName='ExpandIcon' color={WHITE} size={SMALL} onClick={() => window.open(url, '_blank')} internalOverHandling disabled={applicationStatus === STATUS_STOPPED} />
            </div>
          </div>

          <div className={`${styles.buttonContainer}`}>
            <Button
              type='button'
              label='API reference'
              onClick={() => setShowModalScalarIntegration(true)}
              color={WHITE}
              backgroundColor={TRANSPARENT}
              paddingClass={commonStyles.buttonPadding}
              platformaticIcon={{ iconName: 'APIDocsIcon', color: WHITE }}
              textClass={typographyStyles.desktopBody}
              disabled={applicationStatus === STATUS_STOPPED}
            />
          </div>
        </div>
      </div>
      {showModalScalarIntegration && (
        <ModalDirectional
          key='modalTemplate'
          setIsOpen={() => handleCloseModalAPIReference()}
          title='Back to Overview'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} cy-modal-template`}
          classNameModalLefty='should-be-full-width'
        >
          <Scalar url={url} />
        </ModalDirectional>
      )}
    </>
  )
}

export default OverviewSection
