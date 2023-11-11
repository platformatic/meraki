'use strict'
import PropTypes from 'prop-types'
import { MAIN_GREEN, MEDIUM, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './Plugin.module.css'
import { Button } from '@platformatic/ui-components'

function Plugin ({ id, name, onClick, isSelected }) {
  let className = `${commonStyles.smallFlexBlock} ${styles.container} `
  if (isSelected) {
    className += styles.selected
  }
  return (
    <div className={className} onClick={() => onClick()}>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.overflowHidden}`}>
        <Icons.StackablesPluginIcon color={MAIN_GREEN} size={MEDIUM} />
        <p
          className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite} ${styles.ellipsis}`}
          title={name}
        >
          {name}
        </p>
      </div>
      <Button
        color={WHITE}
        label='View Details'
        platformaticIconAfter={{ iconName: 'ArrowLongRightIcon', color: WHITE }}
        bordered={false}
        classes={commonStyles.buttonNoPadding}
      />
    </div>
  )
}

Plugin.propTypes = {
  /**
   * id
    */
  id: PropTypes.string.isRequired,
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * isSelected
    */
  isSelected: PropTypes.bool
}

Plugin.defaultProps = {
  name: '',
  isSelected: false
}

export default Plugin
