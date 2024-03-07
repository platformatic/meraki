'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import tooltipStyles from '~/styles/TooltipStyles.module.css'
import { DULLS_BACKGROUND_COLOR, ERROR_RED, MEDIUM, RICH_BLACK, SMALL, WARNING_YELLOW, WHITE } from '@platformatic/ui-components/src/components/constants'
import { ButtonOnlyIcon, Icons, PlatformaticIcon } from '@platformatic/ui-components'
import styles from './Row.module.css'
import { getFormattedDate } from '~/utilityDetails'
import MerakiIcon from '~/components/ui/MerakiIcon'
import { useNavigate } from 'react-router-dom'
import { APPLICATION_PATH } from '~/ui-constants'
import ApplicationStatusPills from '~/components/ui/ApplicationStatusPills'

function Row ({
  id,
  insideMeraki,
  updateVersion,
  name,
  status,
  platformaticVersion,
  lastStarted,
  lastUpdate,
  onClickStop,
  onClickStart,
  onClickRestart,
  onClickDelete
}) {
  const navigate = useNavigate()

  function goToApplication () {
    navigate(APPLICATION_PATH.replace(':id', id))
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
                tip='Application inside Meraki'
                tipClassName={tooltipStyles.tooltipDarkStyle}
                onClick={() => {}}
                internalOverHandling
              />}
            {!insideMeraki &&
              <PlatformaticIcon
                iconName='CLIIcon'
                color={WHITE}
                size={MEDIUM}
                tip='Application outside Meraki'
                tipClassName={tooltipStyles.tooltipDarkStyle}
                onClick={() => {}}
                internalOverHandling
              />}
            <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>{name}</span>
          </div>
        </div>
      </div>
      <div className={styles.tableSmall}>
        <div className={styles.tableCell}>
          <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>Status</span>
        </div>
        <div className={styles.tableCell}>
          <ApplicationStatusPills status={status.value} />
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
          <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>Last Update</span>
        </div>
        <div className={styles.tableCell}>
          <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{getFormattedDate(lastUpdate)}</span>
        </div>
      </div>
      <div className={styles.tableSmall}>
        <div className={styles.tableCell}>
          <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>Last Started</span>
        </div>
        <div className={styles.tableCell}>
          <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{getFormattedDate(lastStarted)}</span>
        </div>
      </div>
      <div className={styles.tableSmall}>
        <div className={styles.tableCell}>
          <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>Actions</span>
        </div>
        <div className={styles.tableCell}>
          <div className={`${styles.buttonsContainer} `}>
            {status.value === 'stopped'
              ? (<ButtonOnlyIcon
                  textClass={typographyStyles.desktopBody}
                  altLabel='Start application'
                  paddingClass={commonStyles.buttonSquarePadding}
                  color={WHITE}
                  backgroundColor={RICH_BLACK}
                  onClick={() => onClickStart()}
                  hoverEffect={DULLS_BACKGROUND_COLOR}
                  platformaticIcon={{ size: SMALL, iconName: 'CirclePlayIcon', color: WHITE }}
                 />)
              : (
                <ButtonOnlyIcon
                  textClass={typographyStyles.desktopBody}
                  altLabel='Stop application'
                  paddingClass={commonStyles.buttonSquarePadding}
                  color={WHITE}
                  backgroundColor={RICH_BLACK}
                  onClick={() => onClickStop()}
                  hoverEffect={DULLS_BACKGROUND_COLOR}
                  platformaticIcon={{ size: SMALL, iconName: 'CircleStopIcon', color: WHITE }}
                />
                )}
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
  status: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string
  }),
  /**
   * platformaticVersion
    */
  platformaticVersion: PropTypes.string,
  /**
   * lastStarted
    */
  lastStarted: PropTypes.string,
  /**
   * lastUpdate
    */
  lastUpdate: PropTypes.string,
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
  lastStarted: '-',
  lastUpdate: '-',
  onClickStop: () => {},
  onClickStart: () => {},
  onClickRestart: () => {},
  onClickDelete: () => {}
}

export default Row
