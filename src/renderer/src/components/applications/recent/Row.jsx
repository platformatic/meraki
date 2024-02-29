'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { DULLS_BACKGROUND_COLOR, MAIN_GREEN, MEDIUM, RICH_BLACK, SMALL, WARNING_YELLOW, WHITE } from '@platformatic/ui-components/src/components/constants'
import { ButtonOnlyIcon, Icons, PlatformaticIcon } from '@platformatic/ui-components'
import styles from './Row.module.css'
import MerakiIcon from '~/components/ui/MerakiIcon'
import tooltipStyles from '~/styles/TooltipStyles.module.css'
import { useNavigate } from 'react-router-dom'
import { APPLICATION_PATH } from '~/ui-constants'

function Row ({
  id,
  insideMeraki,
  updateVersion,
  name,
  status,
  platformaticVersion,
  onClickStop,
  onClickStart,
  onClickRestart
}) {
  const navigate = useNavigate()

  function goToApplication () {
    navigate(APPLICATION_PATH.replace(':id', id))
  }

  function statusPills () {
    if (status === 'stopped') {
      return (
        <div className={styles.stoppedPills}>
          <Icons.CircleStopIcon color={WHITE} size={SMALL} />
          <span className={`${typographyStyles.desktopOtherOverlineNormal} ${typographyStyles.textWhite}`}>{status}</span>
        </div>
      )
    }
    return (
      <div className={styles.runningPills}>
        <Icons.RunningIcon color={MAIN_GREEN} size={SMALL} />
        <span className={`${typographyStyles.desktopOtherOverlineNormal} ${typographyStyles.textMainGreen}`}>{status}</span>

      </div>
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
          {statusPills()}
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
            <ButtonOnlyIcon
              textClass={typographyStyles.desktopBody}
              altLabel='Start application'
              paddingClass={commonStyles.buttonSquarePadding}
              color={WHITE}
              backgroundColor={RICH_BLACK}
              onClick={() => onClickStart()}
              hoverEffect={DULLS_BACKGROUND_COLOR}
              platformaticIcon={{ size: SMALL, iconName: 'CirclePlayIcon', color: WHITE }}
              disabled={status === 'running'}
            />
            <ButtonOnlyIcon
              textClass={typographyStyles.desktopBody}
              altLabel='Stop application'
              paddingClass={commonStyles.buttonSquarePadding}
              color={WHITE}
              backgroundColor={RICH_BLACK}
              onClick={() => onClickStop()}
              hoverEffect={DULLS_BACKGROUND_COLOR}
              platformaticIcon={{ size: SMALL, iconName: 'CircleStopIcon', color: WHITE }}
              disabled={status === 'stopped'}
            />
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
   * onClickDelete
    */
  onClickDelete: PropTypes.func,
  /**
   * onClickSave
    */
  onClickSave: PropTypes.func

}

Row.defaultProps = {
  insideMeraki: false,
  updateVersion: false,
  name: '',
  status: '',
  platformaticVersion: '-',
  onClickDelete: () => {},
  onClickSave: () => {}
}

export default Row
