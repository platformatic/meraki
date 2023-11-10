'use strict'
import PropTypes from 'prop-types'
import { SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './AddTemplate.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'

function AddTemplate ({ onClick }) {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={`${commonStyles.smallFlexRow} ${commonStyles.justifyCenter}`}>
        <Icons.CircleAddIcon color={WHITE} size={SMALL} />
        <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>Select Template</span>
      </div>
    </div>
  )
}

AddTemplate.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func
}

AddTemplate.defaultProps = {
  onClick: () => {}
}

export default AddTemplate
