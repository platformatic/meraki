'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ComposeApplication.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, MODAL_POPUP_V2 } from '@platformatic/ui-components/src/components/constants'
import { Button, Modal, ModalDirectional } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import PluginHandler from '~/components/plugins/PluginHandler'
import TemplateHandler from '~/components/templates/TemplateHandler'
import AddService from '~/components/shaped-components/AddService'
import SelectTemplate from '~/components/templates/SelectTemplate'
import EditableTitle from '~/components/ui/EditableTitle'
import SelectPlugin from '~/components/plugins/SelectPlugin'
import Services from '~/components/services/Services'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import PlatformaticRuntimeButton from '~/components/shaped-components/PlatformaticRuntimeButton'
import ViewAll from '~/components/plugins/ViewAll'
import NameService from '~/components/services/NameService'
import EditService from '~/components/services/EditService'
import RemoveService from '~/components/services/RemoveService'
import '~/components/component.animation.css'

const ComposeApplication = React.forwardRef(({ onNext }, ref) => {
  const globalState = useStackablesStore()
  const { formData, addService, services, addFormData, renameService, removeService } = globalState
  const [showModalTemplate, setShowModalTemplate] = useState(false)
  const [showModalPlugin, setShowModalPlugin] = useState(false)
  const [showModalViewAll, setShowModalViewAll] = useState(false)
  const [serviceSelected, setServiceSelected] = useState(null)
  const [showModalEditService, setShowModalEditService] = useState(false)
  const [showModalRemoveService, setShowModalRemoveService] = useState(false)

  function onClick () {
    onNext()
  }

  function handleOpenModalPlugin (service) {
    setServiceSelected(service)
    setShowModalPlugin(true)
  }

  function handleCloseModalPlugin () {
    setServiceSelected(null)
    setShowModalPlugin(false)
  }

  function handleOpenModalTemplate (service) {
    setServiceSelected(service)
    setShowModalTemplate(true)
  }

  function handleCloseModalTemplate () {
    setServiceSelected(null)
    setShowModalTemplate(false)
  }

  function handleOpenModalViewAll (service) {
    setServiceSelected(service)
    setShowModalViewAll(true)
  }

  function handleCloseModalViewAll () {
    setServiceSelected(null)
    setShowModalViewAll(false)
  }

  function handleEditApplicationName (newName) {
    addFormData({
      createApplication: {
        application: newName,
        service: formData.createApplication.service
      }
    })
  }

  function handleOpenModalEditService (service) {
    setServiceSelected(service)
    setShowModalEditService(true)
  }

  function handleCloseModalEditService () {
    setServiceSelected(null)
    setShowModalEditService(false)
  }

  function handleOpenModalRemoveService (service) {
    setServiceSelected(service)
    setShowModalRemoveService(true)
  }

  function handleCloseModalRemoveService () {
    setServiceSelected(null)
    setShowModalRemoveService(false)
  }

  function handleConfirmRemoveService () {
    removeService(serviceSelected.id)
    handleCloseModalRemoveService()
  }

  function handleConfirmEditService (name) {
    renameService(serviceSelected.id, name)
    handleCloseModalEditService()
  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={`${commonStyles.largeFlexBlock}`}>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.halfWidth}`}>
          <EditableTitle
            title={formData.createApplication.application}
            iconName='AppIcon'
            onClickSubmit={(name) => handleEditApplicationName(name)}
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template and plugins for your service from our Stackables Marketplace. Once you have chosen a template you can add another Service.</p>
        </div>
        <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyBetween} ${commonStyles.itemsCenter}`}>
          <div className={`${commonStyles.flexBlockNoGap}`}>
            <div className={`${commonStyles.largeFlexBlock}`}>
              <div className={`${commonStyles.mediumFlexRow} ${commonStyles.itemsStretch}`}>
                {services.map(service => (
                  <div className={commonStyles.mediumFlexBlock} key={service.id}>
                    <NameService
                      name={service.name}
                      onClickEdit={() => handleOpenModalEditService(service)}
                      onClickRemove={() => handleOpenModalRemoveService(service)}
                      removeDisabled={services.length < 2}
                    />
                    <TransitionGroup component={null}>
                      <CSSTransition
                        key={`handling-service-${service.id}`}
                        timeout={300}
                        classNames='template'
                      >
                        <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${styles.containerPuzzle}`} key={service.id}>
                          <PluginHandler onClick={() => { handleOpenModalPlugin(service) }} serviceId={service.id} />
                          <TemplateHandler
                            onClickTemplate={() => { handleOpenModalTemplate(service) }}
                            onClickViewAll={() => { handleOpenModalViewAll(service) }}
                            serviceId={service.id}
                          />
                        </div>
                      </CSSTransition>
                    </TransitionGroup>
                  </div>
                ))}
                <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.containerPuzzle}`}>
                  <div className={commonStyles.mediumFlexRow}>
                    <h5 className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite}`}>&nbsp;</h5>
                  </div>
                  <AddService onClick={() => addService()} enabled={services.find(service => Object.keys(service.template).length === 0) === undefined} />
                </div>
              </div>
            </div>
            <PlatformaticRuntimeButton />
          </div>
          <Services />
        </div>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          label='Next - Configure Services'
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
          <SelectTemplate onClick={() => handleCloseModalTemplate()} serviceId={serviceSelected.id} />
        </ModalDirectional>
      )}
      {showModalPlugin && (
        <ModalDirectional
          key='modalPlugin'
          setIsOpen={() => handleCloseModalPlugin()}
          title='Back to Application view'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
        >
          <SelectPlugin
            onClick={() => handleCloseModalPlugin()}
            serviceId={serviceSelected.id}
          />
        </ModalDirectional>
      )}
      {showModalViewAll && (
        <ModalDirectional
          key='modalViewAll'
          setIsOpen={() => handleCloseModalViewAll()}
          title='Back to Application view'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          smallLayout
        >
          <ViewAll onClick={() => handleCloseModalViewAll()} serviceId={serviceSelected.id} />
        </ModalDirectional>
      )}
      {showModalEditService && (
        <Modal
          key='editService'
          setIsOpen={() => handleCloseModalEditService()}
          title='Edit Service'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          layout={MODAL_POPUP_V2}
        >
          <EditService
            name={serviceSelected.name}
            onClickCancel={() => handleCloseModalEditService()}
            onClickConfirm={(newName) => handleConfirmEditService(newName)}
          />
        </Modal>
      )}
      {showModalRemoveService && (
        <Modal
          key='removeService'
          setIsOpen={() => handleCloseModalRemoveService()}
          title='Delete Service'
          titleClassName={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite}`}
          layout={MODAL_POPUP_V2}
        >
          <RemoveService
            name={serviceSelected.name}
            onClickCancel={() => handleCloseModalRemoveService()}
            onClickConfirm={() => handleConfirmRemoveService()}
          />
        </Modal>
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
