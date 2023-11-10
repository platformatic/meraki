'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import styles from './AddTemplateAndPlugins.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, LARGE, RICH_BLACK } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import { Button } from '@platformatic/ui-components'

const AddTemplateAndPlugins = React.forwardRef(({ onNext }, ref) => {
  function onClick () {
    console.log('AddTemplateAndPlugins')
    onNext()
  }
  return (
    <div className={styles.container} ref={ref}>
      <div className={`${commonStyles.extraLargeFlexBlock} ${commonStyles.halfWidth}`}>
        <div className={commonStyles.mediumFlexBlock}>
          <div className={commonStyles.mediumFlexRow}>
            <Icons.AppIcon color={WHITE} size={LARGE} />
            <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>Add template and Plugins</h2>
          </div>
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Start by entering the name of your Application and the name of your service.</p>
        </div>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          label='Next - Your Configuration'
          onClick={() => onClick()}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
        />
      </div>
    </div>
  )
})

AddTemplateAndPlugins.propTypes = {
  /**
     * onNext
     */
  onNext: PropTypes.func
}

AddTemplateAndPlugins.defaultProps = {
  onNext: () => {}
}

export default AddTemplateAndPlugins
