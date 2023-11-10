'use strict'
import PropTypes from 'prop-types'
import { SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './AddService.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'

function AddService ({ onClick }) {
  return (
    <div className={styles.container} onClick={() => onClick}>
      <div className={`${commonStyles.smallFlexRow} ${commonStyles.justifyCenter}`}>
        <Icons.CircleAddIcon color={WHITE} size={SMALL} />
        <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Add Service</span>
      </div>
    </div>
  )
}

AddService.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func
}

AddService.defaultProps = {
  onClick: () => {}
}

export default AddService
