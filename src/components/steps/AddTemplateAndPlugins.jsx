'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import styles from './AddTemplateAndPlugins.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, LARGE, RICH_BLACK, MEDIUM, TRANSPARENT, SMALL } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import { BorderedBox, Button } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import AddPlugin from '../plugins/AddPlugin'
import SelectTemplate from '../templates/SelectTemplate'
import AddService from '../services/AddService'

const AddTemplateAndPlugins = React.forwardRef(({ onNext }, ref) => {
  const globalState = useStackablesStore()
  const { formDataWizard } = globalState

  function onClick () {
    onNext()
  }
  return (
    <div className={styles.container} ref={ref}>
      <div className={`${commonStyles.largeFlexBlock} ${commonStyles.halfWidth}`}>
        <div className={commonStyles.mediumFlexBlock}>
          <div className={commonStyles.mediumFlexRow}>
            <Icons.AppIcon color={WHITE} size={LARGE} />
            <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>{formDataWizard.createApplication.application}</h2>
          </div>
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template and plugins for your service from our Stackables Marketplace. Once you have chosen a template you can add another Service.</p>
        </div>
        <div className={`${commonStyles.mediumFlexBlock}`}>
          <div className={`${commonStyles.largeFlexBlock}`}>
            <div className={commonStyles.mediumFlexRow}>
              <Icons.GearIcon color={WHITE} size={MEDIUM} />
              <h5 className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite}`}>{formDataWizard.createApplication.service}</h5>
            </div>
            <div className={`${commonStyles.mediumFlexRow} ${commonStyles.itemsStretch}`}>
              <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${styles.containerPuzzle}`}>
                <AddPlugin />
                <SelectTemplate />
              </div>
              <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.containerPuzzle}`}>
                <AddService />
              </div>
            </div>
            <BorderedBox
              color={WHITE}
              backgroundColor={TRANSPARENT}
              classes={styles.platformaticRuntimeButton}
            >
              <Icons.CircleExclamationIcon color={WHITE} size={SMALL} />
              <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Platformatic Runtime</span>
            </BorderedBox>
          </div>
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
