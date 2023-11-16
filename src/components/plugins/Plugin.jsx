'use strict'
import PropTypes from 'prop-types'
import { MEDIUM, TERTIARY_BLUE, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './Plugin.module.css'
import { Button } from '@platformatic/ui-components'

function Plugin ({ id, name, onClick, isSelected }) {
  let className = `${commonStyles.smallFlexBlock} ${styles.container} `
  className += isSelected ? styles.selected : styles.unSelected

  return (
    <div className={className} onClick={() => onClick()}>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.overflowHidden}`}>
        <Icons.StackablesPluginIcon color={TERTIARY_BLUE} size={MEDIUM} />
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
        classes={commonStyles.noPadding}
      />
    </div>
  )
}

Plugin.propTypes = {
  /**
   * id
    */
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
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
