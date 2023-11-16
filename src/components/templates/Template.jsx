'use strict'
import PropTypes from 'prop-types'
import { MAIN_GREEN, MEDIUM, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './Template.module.css'
import { Button, Logo } from '@platformatic/ui-components'

function Template ({ id, platformaticService, name, onClick, isSelected }) {
  let className = `${commonStyles.smallFlexBlock} ${styles.container} `
  className += isSelected ? styles.selected : styles.unSelected

  return (
    <div className={className} onClick={() => onClick()}>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.overflowHidden}`}>
        {platformaticService ? (<Logo width={30.32} height={24} />) : (<Icons.StackablesTemplateIcon color={MAIN_GREEN} size={MEDIUM} />)}
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

Template.propTypes = {
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
   * platformaticService
    */
  platformaticService: PropTypes.bool,
  /**
   * isSelected
    */
  isSelected: PropTypes.bool
}

Template.defaultProps = {
  name: '',
  platformaticService: false,
  isSelected: false
}

export default Template
