'use strict'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { DULLS_BACKGROUND_COLOR, ERROR_RED, MEDIUM, POSITION_CENTER, RICH_BLACK, SMALL, WARNING_YELLOW, WHITE } from '@platformatic/ui-components/src/components/constants'
import { ButtonOnlyIcon, Icons, PlatformaticIcon, TooltipAbsolute } from '@platformatic/ui-components'
import styles from './Row.module.css'
import MerakiIcon from '~/components/ui/MerakiIcon'
import tooltipStyles from '~/styles/TooltipStyles.module.css'
import { useNavigate } from 'react-router-dom'
import { APPLICATION_PATH, STATUS_STOPPED, STATUS_RUNNING } from '~/ui-constants'
import ApplicationStatusPills from '~/components/ui/ApplicationStatusPills'
function Row ({
  id,
  insideMeraki,
  isLatestPltVersion,
  name,
  lastStarted,
  status,
  platformaticVersion,
  onClickStop,
  onClickStart,
  onClickRestart,
  onClickDelete
}) {
  const [buttonClicked, setButtonClicked] = useState(false)
  const [buttonRestartClicked, setButtonRestartClicked] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setButtonClicked(false)
  }, [status])

  useEffect(() => {
    setButtonRestartClicked(false)
  }, [lastStarted])

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

  function handleRestart () {
    setButtonRestartClicked(true)
    onClickRestart()
  }

  function getStartStopButton () {
    if (buttonClicked) {
      return (
        <div className={`${styles.containerRunning} ${commonStyles.smallButtonSquarePadding}`}>
          <div className={styles.clockWiseRotation}>
            <Icons.RunningIcon size={MEDIUM} color={WHITE} />
          </div>
        </div>
      )
    }
    if (status === STATUS_STOPPED) {
      return (
        <ButtonOnlyIcon
          disabled={buttonRestartClicked}
          textClass={typographyStyles.desktopBody}
          altLabel='Start application'
          paddingClass={commonStyles.smallButtonSquarePadding}
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
        disabled={buttonRestartClicked}
        textClass={typographyStyles.desktopBody}
        altLabel='Stop application'
        paddingClass={commonStyles.smallButtonSquarePadding}
        color={WHITE}
        backgroundColor={RICH_BLACK}
        onClick={() => handleStop()}
        hoverEffect={DULLS_BACKGROUND_COLOR}
        platformaticIcon={{ size: SMALL, iconName: 'CircleStopIcon', color: WHITE }}
      />
    )
  }

  function getRestartButton () {
    if (buttonRestartClicked) {
      return (
        <div className={`${styles.containerRunning} ${commonStyles.smallButtonSquarePadding}`}>
          <div className={styles.clockWiseRotation}>
            <Icons.RestartIcon size={MEDIUM} color={WHITE} />
          </div>
        </div>
      )
    }

    return (
      <ButtonOnlyIcon
        textClass={typographyStyles.desktopBody}
        altLabel='Restart application'
        paddingClass={commonStyles.smallButtonSquarePadding}
        color={WHITE}
        backgroundColor={RICH_BLACK}
        onClick={() => handleRestart()}
        hoverEffect={DULLS_BACKGROUND_COLOR}
        disabled={status === STATUS_STOPPED}
        platformaticIcon={{ size: SMALL, iconName: 'RestartIcon', color: WHITE }}
      />
    )
  }

  return (
    <div className={styles.tableRow}>
      <div className={`${styles.tableSmall} ${styles.colSpan6}`}>
        <div className={styles.tableCell}>
          <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>Name</span>
        </div>
        <div className={styles.tableCell}>
          <div className={`${styles.customSmallFlexRow} ${styles.linkToApplication}`} onClick={() => goToApplication()}>
            {insideMeraki &&
              <TooltipAbsolute
                tooltipClassName={tooltipStyles.tooltipDarkStyle}
                content={(<span>Application inside Meraki</span>)}
                offset={44}
              >
                <MerakiIcon
                  iconName='MerakiLogoIcon'
                  color={WHITE}
                  size={MEDIUM}
                  onClick={() => {}}
                  internalOverHandling
                />
              </TooltipAbsolute>}
            {!insideMeraki && (
              <TooltipAbsolute
                tooltipClassName={tooltipStyles.tooltipDarkStyle}
                content={(<span>Application outside Meraki</span>)}
                offset={44}
              >
                <PlatformaticIcon
                  iconName='CLIIcon'
                  color={WHITE}
                  size={MEDIUM}
                  onClick={() => {}} internalOverHandling
                />
              </TooltipAbsolute>
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
            <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{platformaticVersion || '-'}</span>
            {!isLatestPltVersion && platformaticVersion && (
              <TooltipAbsolute
                tooltipClassName={`${tooltipStyles.tooltipDarkStyle} ${styles.smallMargin}`}
                content={(<span>There is a new Platformatic Version</span>)}
                offset={44}
                position={POSITION_CENTER}
              >
                <Icons.AlertIcon color={WARNING_YELLOW} size={SMALL} />
              </TooltipAbsolute>
            )}
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
            {getRestartButton()}
            <ButtonOnlyIcon
              textClass={typographyStyles.desktopBody}
              altLabel='Delete application'
              paddingClass={commonStyles.smallButtonSquarePadding}
              color={ERROR_RED}
              backgroundColor={RICH_BLACK}
              onClick={() => onClickDelete()}
              hoverEffect={DULLS_BACKGROUND_COLOR}
              platformaticIcon={{ size: SMALL, iconName: 'TrashIcon', color: ERROR_RED }}
              disabled={status === STATUS_RUNNING}
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
   * isLatestPltVersion
    */
  isLatestPltVersion: PropTypes.bool,
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
   * lastStarted
    */
  lastStarted: PropTypes.string,
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
  isLatestPltVersion: false,
  name: '',
  status: '',
  lastStarted: '-',
  platformaticVersion: '-',
  onClickStop: () => {},
  onClickStart: () => {},
  onClickRestart: () => {},
  onClickDelete: () => {}
}

export default Row
