'use strict'
import PropTypes from 'prop-types'
import { BorderedBox } from '@platformatic/ui-components'
import { SMALL, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './AddPlugin.module.css'

function AddPlugin ({ disabled, onClick, usePuzzle }) {
  return usePuzzle
    ? (
      <BorderedBox
        color={WHITE}
        backgroundColor={TRANSPARENT}
        borderColorOpacity={disabled ? 20 : 100}
        classes={styles.boxDisabled}
      >
        <Icons.CircleAddIcon color={WHITE} size={SMALL} />
        <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Add Plugin</span>
      </BorderedBox>
      )
    : <></>
}

AddPlugin.propTypes = {
  /**
   * disabled
    */
  disabled: PropTypes.bool,
  /**
   * onClick
    */
  onClick: PropTypes.func,
  /**
   * usePuzzle
    */
  usePuzzle: PropTypes.bool
}

AddPlugin.defaultProps = {
  disabled: true,
  onClick: () => {},
  usePuzzle: true
}

export default AddPlugin
