'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { DULLS_BACKGROUND_COLOR, MEDIUM, RICH_BLACK, SMALL, WARNING_YELLOW, WHITE } from '@platformatic/ui-components/src/components/constants'
import { ButtonOnlyIcon, Icons } from '@platformatic/ui-components'
import styles from './Row.module.css'

function Row ({
  id,
  insideMeraki,
  name,
  status,
  platformaticVersion,
  onClickStop,
  onClickStart,
  onClickRunning
}) {
  return (
    <tr className={styles.trBordered}>
      <td data-label='Name' colSpan={6}>
        <div className={`${styles.customSmallFlexRow}`} title={name}>
          {insideMeraki && <Icons.StackablesPluginIcon color={WHITE} size={MEDIUM} />}
          {!insideMeraki && <Icons.StackablesTemplateIcon color={WHITE} size={MEDIUM} />}
          <span className={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} ${styles.ellipsis}`} title={name}>{name}</span>
        </div>
      </td>
      <td data-label='Status' colSpan={2}>
        <div className={`${styles.customSmallFlexRow}`}>
          {/* <Icons.CircleFullIcon color={getCircleColor()} size={EXTRA_SMALL} /> */}
          <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{status}</span>
        </div>
      </td>
      <td data-label='Plt Version' colSpan={2}>
        <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{platformaticVersion}</span>
      </td>
      <td data-label='Actions' colSpan={2}>
        <div className={`${styles.buttonsContainer} `}>
          <ButtonOnlyIcon
            textClass={typographyStyles.desktopBody}
            altLabel='Refresh npm'
            paddingClass={commonStyles.buttonSquarePadding}
            color={WHITE}
            backgroundColor={RICH_BLACK}
            onClick={() => onClickStop()}
            hoverEffect={DULLS_BACKGROUND_COLOR}
            platformaticIcon={{ size: SMALL, iconName: 'StopIcon', color: WHITE }}
          />
          <ButtonOnlyIcon
            textClass={typographyStyles.desktopBody}
            altLabel='Refresh npm'
            paddingClass={commonStyles.buttonSquarePadding}
            color={WHITE}
            backgroundColor={RICH_BLACK}
            onClick={() => onClickStart()}
            hoverEffect={DULLS_BACKGROUND_COLOR}
            platformaticIcon={{ size: SMALL, iconName: 'PlayIcon', color: WHITE }}
          />
          <ButtonOnlyIcon
            textClass={typographyStyles.desktopBody}
            altLabel='Refresh npm'
            paddingClass={commonStyles.buttonSquarePadding}
            color={WHITE}
            backgroundColor={RICH_BLACK}
            onClick={() => onClickRunning()}
            hoverEffect={DULLS_BACKGROUND_COLOR}
            platformaticIcon={{ size: SMALL, iconName: 'RestartIcon', color: WHITE }}
          />
        </div>
      </td>
    </tr>
  )
}

Row.propTypes = {
  /**
   * id
    */
  id: PropTypes.string.isRequired,
  /**
   * type
    */
  type: PropTypes.string,
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
   * latest
    */
  platformaticVersion: PropTypes.string,
  /**
   * downloads
    */
  downloads: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /**
   * orgName
    */
  orgName: PropTypes.string,
  /**
   * description
    */
  description: PropTypes.string,
  /**
   * tags
    */
  tags: PropTypes.array,
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
  insideMeraki: '',
  name: '',
  status: '',
  platformaticVersion: '-',
  downloads: '-',
  orgName: '',
  description: '',
  tags: [],
  onClickDelete: () => {},
  onClickSave: () => {}
}

export default Row
