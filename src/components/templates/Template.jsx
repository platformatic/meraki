'use strict'
import PropTypes from 'prop-types'
import { MAIN_GREEN, MEDIUM, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './Template.module.css'
import { Button, Logo } from '@platformatic/ui-components'

function Template ({ id, platformaticService, title, onClick, isSelected }) {
  let className = `${commonStyles.mediumFlexBlock} ${styles.container} `
  if (isSelected) {
    className += styles.selected
  }
  return (
    <div className={className} onClick={() => onClick()}>
      {platformaticService ? (<Logo width={30.32} height={24} />) : (<Icons.AppIcon color={MAIN_GREEN} size={MEDIUM} />)}
      <p
        className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite} ${styles.ellipsis}`}
        title={title}
      >
        {title}
      </p>
      <Button
        color={WHITE}
        label='View Details'
        platformaticIconAfter={{ iconName: 'ArrowLongRightIcon', color: WHITE }}
        bordered={false}
      />
    </div>
  )
}

Template.propTypes = {
  /**
   * id
    */
  id: PropTypes.string.isRequired,
  /**
   * title
    */
  title: PropTypes.string,
  /**
   * platformaticService
    */
  platformaticService: PropTypes.bool,
  /**
   * isSelected
    */
  isSelected: PropTypes.bool
}

Template.defaultProps = {
  title: '',
  platformaticService: false,
  isSelected: false
}

export default Template
