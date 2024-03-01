'use strict'
import React from 'react'
import PropTypes from 'prop-types'
// import { RICH_BLACK, WHITE, MARGIN_0, OPACITY_30, TRANSPARENT, DULLS_BACKGROUND_COLOR, ANTI_FLASH_WHITE } from '@platformatic/ui-components/src/components/constants'
import styles from './ApplicationLogs.module.css'
// import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
// import { Button, HorizontalSeparator, VerticalSeparator } from '@platformatic/ui-components'
import Title from '~/components/ui/Title'

const ApplicationLogs = React.forwardRef((_props, ref) => {
  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.content}>
        <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
          <div className={commonStyles.mediumFlexBlock}>
            <Title
              title='ApplicationLogs'
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

ApplicationLogs.propTypes = {
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

ApplicationLogs.defaultProps = {
  onCloseModal: () => {},
  onClickConfirm: () => {}
}

export default ApplicationLogs
