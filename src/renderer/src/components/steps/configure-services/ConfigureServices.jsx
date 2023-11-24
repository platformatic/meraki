'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ConfigureServices.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK } from '@platformatic/ui-components/src/components/constants'
import { Button, LoadingSpinnerV2 } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import EditableTitle from '~/components/ui/EditableTitle'
import '~/components/component.animation.css'
import TemplateAndPluginTreeSelector from '~/components/template-and-plugins/TemplateAndPluginTreeSelector'

const ConfigureServices = React.forwardRef(({ onNext }, ref) => {
  const globalState = useStackablesStore()
  const { formData, services, addFormData } = globalState
  const [serviceSelected, setServiceSelected] = useState(null)
  const [prepareFolder, setPrepareFolder] = useState(true)

  useEffect(() => {
    if (!prepareFolder && services.length > 0) {
      setServiceSelected(services[0].name)
    }
  }, [prepareFolder, services])

  useEffect(() => {
    if (prepareFolder) {
      setTimeout(() => {
        setPrepareFolder(false)
      }, 3000)
    }
  }, [prepareFolder])

  function onClickConfigureApplication () {
    onNext()
  }

  function handleEditApplicationName (newName) {
    addFormData({
      createApplication: {
        application: newName,
        service: formData.createApplication.service
      }
    })
  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={commonStyles.largeFlexBlock}>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.halfWidth}`}>
          <EditableTitle
            title={formData.createApplication.application}
            iconName='AppIcon'
            onClickSubmit={(name) => handleEditApplicationName(name)}
            dataAttrName='cy'
            dataAttrValue='step-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template and plugins for your service from our Stackables Marketplace. Once you have chosen a template you can add another Service.</p>
        </div>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
          <LoadingSpinnerV2
            loading={prepareFolder}
            applySentences={{
              containerClassName: `${commonStyles.mediumFlexBlock} ${commonStyles.itemsCenter}`,
              sentences: [{
                style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`,
                text: 'We are installing your dependencies'
              }, {
                style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`,
                text: 'This process will just take a few seconds.'
              }]
            }}
          />
          {!prepareFolder && (
            <div className={commonStyles.mediumFlexRow}>
              <TemplateAndPluginTreeSelector serviceSelected={serviceSelected} />
              <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>select me</p>
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          disabled={prepareFolder}
          label='Next - Configure Application'
          onClick={() => onClickConfigureApplication()}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          classes={`${commonStyles.buttonPadding} cy-action-next`}
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
