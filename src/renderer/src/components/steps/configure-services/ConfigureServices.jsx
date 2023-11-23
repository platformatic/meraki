'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ConfigureServices.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, TRANSPARENT } from '@platformatic/ui-components/src/components/constants'
import { Button, TabbedWindowV2 } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import EditableTitle from '~/components/ui/EditableTitle'
import '~/components/component.animation.css'
import ConfigureServiceHeaderTab from './ConfigureServiceHeaderTab'
import ConfigureEnvVarsTemplateAndPlugins from './ConfigureEnvVarsTemplateAndPlugins'

const ConfigureServices = React.forwardRef(({ onNext }, ref) => {
  const globalState = useStackablesStore()
  const { formData, services, addFormData } = globalState
  const [serviceTabs, setServiceTabs] = useState([])
  const [keyTabSelected, setKeyTabSelected] = useState(null)

  useEffect(() => {
    if (services.length > 0) {
      setKeyTabSelected(services[0].name)
    }
  }, [services])

  useEffect(() => {
    if (keyTabSelected) {
      setServiceTabs(services.map((service, index) => ({
        key: service.name,
        headerComponent: () => (<ConfigureServiceHeaderTab key={service.name} serviceName={service.name} serviceNameSelected={keyTabSelected} position={index} onClick={() => setKeyTabSelected(service.name)} />),
        component: () => (<ConfigureEnvVarsTemplateAndPlugins key={service.name} service={{ ...service }} />)
      })))
    }
  }, [keyTabSelected])

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
          {serviceTabs.length > 0 && (
            <TabbedWindowV2
              tabs={serviceTabs}
              keySelected={keyTabSelected}
              backgroundColor={TRANSPARENT}
            />)}
        </div>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
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
