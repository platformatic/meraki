'use strict'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { DULLS_BACKGROUND_COLOR, ERROR_RED, MEDIUM, RICH_BLACK, SMALL, WARNING_YELLOW, WHITE } from '@platformatic/ui-components/src/components/constants'
import { ButtonOnlyIcon, Icons, PlatformaticIcon } from '@platformatic/ui-components'
import styles from './Row.module.css'
import MerakiIcon from '~/components/ui/MerakiIcon'
import tooltipStyles from '~/styles/TooltipStyles.module.css'
import { useNavigate } from 'react-router-dom'
import { APPLICATION_PATH, STATUS_STOPPED } from '~/ui-constants'
import ApplicationStatusPills from '~/components/ui/ApplicationStatusPills'
function Row ({
  id,
  insideMeraki,
  updateVersion,
  name,
  status,
  platformaticVersion,
  onClickStop,
  onClickStart,
  onClickRestart,
  onClickDelete
}) {
  const [buttonClicked, setButtonClicked] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setButtonClicked(false)
  }, [status])

  function goToApplication () {
    navigate(APPLICATION_PATH.replace(':appId', id))
  }

  function handleStart () {
    setButtonClicked(true)
    onClickStart()
  }

  function handleStop () {
    setButtonClicked(true)
    onClickStop()
  }

  function getStartStopButton () {
    if (buttonClicked) {
      return (
        <div className={`${styles.containerRunning} ${commonStyles.buttonSquarePadding}`}>
          <div className={styles.clockWiseRotation}>
            <Icons.RunningIcon size={MEDIUM} color={WHITE} />
          </div>
        </div>
      )
    }
    if (status === STATUS_STOPPED) {
      return (
        <ButtonOnlyIcon
          textClass={typographyStyles.desktopBody}
          altLabel='Start application'
          paddingClass={commonStyles.buttonSquarePadding}
          color={WHITE}
          backgroundColor={RICH_BLACK}
          onClick={() => handleStart()}
          hoverEffect={DULLS_BACKGROUND_COLOR}
          platformaticIcon={{ size: SMALL, iconName: 'CirclePlayIcon', color: WHITE }}
        />
      )
    }
    return (
      <ButtonOnlyIcon
        textClass={typographyStyles.desktopBody}
        altLabel='Stop application'
        paddingClass={commonStyles.buttonSquarePadding}
        color={WHITE}
        backgroundColor={RICH_BLACK}
        onClick={() => handleStop()}
        hoverEffect={DULLS_BACKGROUND_COLOR}
        platformaticIcon={{ size: SMALL, iconName: 'CircleStopIcon', color: WHITE }}
      />
    )
  }

  return (
    <div className={`${styles.tableRow} ${styles.trBordered}`}>
      <div className={styles.tableSmall}>
        <div className={styles.tableCell}>
          <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>Name</span>
        </div>
        <div className={styles.tableCell}>
          <div className={`${styles.customSmallFlexRow} ${styles.linkToApplication}`} onClick={() => goToApplication()}>
            {insideMeraki &&
              <MerakiIcon
                iconName='MerakiLogoIcon'
                color={WHITE}
                size={MEDIUM}
                tip='Application outside Meraki'
                tipClassName={tooltipStyles.tooltipDarkStyle}
                onClick={() => {}}
                internalOverHandling
              />}
            {!insideMeraki && (
              <PlatformaticIcon
                iconName='CLIIcon'
                color={WHITE}
                size={MEDIUM}
                tip='Application outside Meraki'
                tipClassName={tooltipStyles.tooltipDarkStyle}
                onClick={() => {}} internalOverHandling
              />
            )}
            <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>{name}</span>
          </div>
        </div>
      </div>
      <div className={styles.tableSmall}>
        <div className={styles.tableCell}>
          <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>Status</span>
        </div>
        <div className={styles.tableCell}>
          <ApplicationStatusPills status={status} />
        </div>
      </div>
      <div className={styles.tableSmall}>
        <div className={styles.tableCell}>
          <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>Plt Version</span>
        </div>
        <div className={styles.tableCell}>
          <div className={`${styles.customSmallFlexRow}`}>
            <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{platformaticVersion}</span>
            {updateVersion && <Icons.AlertIcon color={WARNING_YELLOW} size={SMALL} />}
          </div>
        </div>
      </div>
      <div className={styles.tableSmall}>
        <div className={styles.tableCell}>
          <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>Actions</span>
        </div>
        <div className={styles.tableCell}>
          <div className={`${styles.buttonsContainer} `}>
            {getStartStopButton()}
            <ButtonOnlyIcon
              textClass={typographyStyles.desktopBody}
              altLabel='Restart application'
              paddingClass={commonStyles.buttonSquarePadding}
              color={WHITE}
              backgroundColor={RICH_BLACK}
              onClick={() => onClickRestart()}
              hoverEffect={DULLS_BACKGROUND_COLOR}
              platformaticIcon={{ size: SMALL, iconName: 'RestartIcon', color: WHITE }}
            />
            <ButtonOnlyIcon
              textClass={typographyStyles.desktopBody}
              altLabel='Delete application'
              paddingClass={commonStyles.buttonSquarePadding}
              color={ERROR_RED}
              backgroundColor={RICH_BLACK}
              onClick={() => onClickDelete()}
              hoverEffect={DULLS_BACKGROUND_COLOR}
              platformaticIcon={{ size: SMALL, iconName: 'TrashIcon', color: ERROR_RED }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

Row.propTypes = {
  /**
   * id
    */
  id: PropTypes.string.isRequired,
  /**
   * insideMeraky
    */
  insideMeraky: PropTypes.bool,
  /**
   * updateVersion
    */
  updateVersion: PropTypes.bool,
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * status
    */
  status: PropTypes.string,
  /**
   * latest
    */
  platformaticVersion: PropTypes.string,
  /**
   * onClickStop
    */
  onClickStop: PropTypes.func,
  /**
   * onClickStart
    */
  onClickStart: PropTypes.func,
  /**
   * onClickRestart
    */
  onClickRestart: PropTypes.func,
  /**
   * onClickDelete
    */
  onClickDelete: PropTypes.func
}

Row.defaultProps = {
  insideMeraki: false,
  updateVersion: false,
  name: '',
  status: '',
  platformaticVersion: '-',
  onClickStop: () => {},
  onClickStart: () => {},
  onClickRestart: () => {},
  onClickDelete: () => {}
}

export default Row
