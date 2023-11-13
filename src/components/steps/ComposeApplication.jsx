'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ComposeApplication.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, MEDIUM, TRANSPARENT, SMALL } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import { BorderedBox, Button, ModalDirectional } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import PluginHandler from '~/components/plugins/PluginHandler'
import TemplateHandler from '~/components/templates/TemplateHandler'
import AddService from '~/components/shaped-buttons/AddService'
import SelectTemplate from '~/components/templates/SelectTemplate'
import Title from '~/components/ui/Title'
import SelectPlugin from '~/components/plugins/SelectPlugin'
import Services from '~/components/services/Services'

const ComposeApplication = React.forwardRef(({ onNext }, ref) => {
  const globalState = useStackablesStore()
  const { formData, addService, services } = globalState
  const [showModalTemplate, setShowModalTemplate] = useState(false)
  const [showModalPlugin, setShowModalPlugin] = useState(false)
  const [serviceSelected, setServiceSelected] = useState(null)

  function onClick () {
    onNext()
  }

  function handleOpenModalPlugin (serviceId) {
    setServiceSelected(serviceId)
    setShowModalPlugin(true)
  }

  function handleCloseModalPlugin () {
    setServiceSelected(null)
    setShowModalPlugin(false)
  }

  function handleOpenModalTemplate (serviceId) {
    setServiceSelected(serviceId)
    setShowModalTemplate(true)
  }

  function handleCloseModalTemplate () {
    setServiceSelected(null)
    setShowModalTemplate(false)
  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={`${commonStyles.largeFlexBlock}`}>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.halfWidth}`}>
          <Title title={formData.createApplication.application} iconName='AppIcon' />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template and plugins for your service from our Stackables Marketplace. Once you have chosen a template you can add another Service.</p>
        </div>
        <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyBetween} ${commonStyles.itemsCenter}`}>
          <div className={`${commonStyles.mediumFlexBlock}`}>
            <div className={`${commonStyles.largeFlexBlock}`}>
              <div className={commonStyles.mediumFlexRow}>
                <Icons.GearIcon color={WHITE} size={MEDIUM} />
                <h5 className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite}`}>{formData.createApplication.service}</h5>
              </div>
              <div className={`${commonStyles.mediumFlexRow} ${commonStyles.itemsStretch}`}>
                {services.map(service => (
                  <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${styles.containerPuzzle}`} key={service.id}>
                    <PluginHandler onClick={() => { handleOpenModalPlugin(service.id) }} serviceId={service.id} />
                    <TemplateHandler onClick={() => { handleOpenModalTemplate(service.id) }} serviceId={service.id} />
                  </div>
                ))}
                <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.containerPuzzle}`}>
                  <AddService onClick={() => addService()} />
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
          <div className={`${commonStyles.mediumFlexBlock}`}>
            <Services />
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
      {showModalTemplate && (
        <ModalDirectional
          key='modalTemplate'
          setIsOpen={() => handleCloseModalTemplate()}
          title='Back to Application view'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
        >
          <SelectTemplate onClick={() => handleCloseModalTemplate()} serviceId={serviceSelected} />
        </ModalDirectional>
      )}
      {showModalPlugin && (
        <ModalDirectional
          key='modalPlugin'
          setIsOpen={() => handleCloseModalPlugin()}
          title='Back to Application view'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
        >
          <SelectPlugin onClick={() => handleCloseModalPlugin()} serviceId={serviceSelected} />
        </ModalDirectional>
      )}
    </div>
  )
})

ComposeApplication.propTypes = {
  /**
     * onNext
     */
  onNext: PropTypes.func
}

ComposeApplication.defaultProps = {
  onNext: () => {}
}

export default ComposeApplication
