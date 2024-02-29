'use strict'
import React from 'react'
import PropTypes from 'prop-types'
// import { RICH_BLACK, WHITE, MARGIN_0, OPACITY_30, TRANSPARENT, DULLS_BACKGROUND_COLOR, ANTI_FLASH_WHITE } from '@platformatic/ui-components/src/components/constants'
import styles from './EnvironmentVariables.module.css'
// import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
// import { Button, HorizontalSeparator, VerticalSeparator } from '@platformatic/ui-components'
import Title from '~/components/ui/Title'

const EnvironmentVariables = React.forwardRef((_props, ref) => {
  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.content}>
        <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
          <div className={commonStyles.mediumFlexBlock}>
            <Title
              title='EnvironmentVariables'
              iconName='StackablesTemplateIcon'
              dataAttrName='cy'
              dataAttrValue='modal-title'
            />
          </div>
        </div>
      </div>
    </div>
  )
})

EnvironmentVariables.propTypes = {
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * onClickEdit
   */
  onCloseModal: PropTypes.func,
  /**
   * onClickRemove
   */
  onClickConfirm: PropTypes.func
}

EnvironmentVariables.defaultProps = {
  onCloseModal: () => {},
  onClickConfirm: () => {}
}

export default EnvironmentVariables
