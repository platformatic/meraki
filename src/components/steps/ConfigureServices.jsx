'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import styles from './ConfigureServices.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK } from '@platformatic/ui-components/src/components/constants'
import { Button } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import Title from '../ui/Title'

const ConfigureServices = React.forwardRef(({ onNext }, ref) => {
  const globalState = useStackablesStore()
  const { formData } = globalState

  function onClick () {
    onNext()
  }
  return (
    <div className={styles.container} ref={ref}>
      <div className={`${commonStyles.largeFlexBlock} ${commonStyles.halfWidth}`}>
        <div className={commonStyles.mediumFlexBlock}>
          <Title title={formData.createApplication.application} iconName='AppIcon' />
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

ConfigureServices.propTypes = {
  /**
     * onNext
     */
  onNext: PropTypes.func
}

ConfigureServices.defaultProps = {
  onNext: () => {}
}

export default ConfigureServices
