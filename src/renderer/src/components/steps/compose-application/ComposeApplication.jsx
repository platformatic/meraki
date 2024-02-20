'use strict'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ComposeApplication.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, MODAL_POPUP_V2, TRANSPARENT, BOX_SHADOW } from '@platformatic/ui-components/src/components/constants'
import { Button, Modal, ModalDirectional } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
/* import PluginHandler from '~/components/plugins/PluginHandler'
import TemplateHandler from '~/components/templates/TemplateHandler'
 */import AddService from '~/components/shaped-components/AddService'
import SelectTemplate from '~/components/templates/SelectTemplate'
import EditableTitle from '~/components/ui/EditableTitle'
import SelectPlugin from '~/components/plugins/SelectPlugin'
import ConnectorAndBundleFolderTree from '~/components/services/ConnectorAndBundleFolderTree'
import PlatformaticRuntimeButton from '~/components/shaped-components/PlatformaticRuntimeButton'
import ViewAll from '~/components/plugins/ViewAll'
import EditService from '~/components/services/EditService'
import EditApplicationName from '~/components/application/EditApplicationName'
import RemoveService from '~/components/services/RemoveService'
import '~/components/component.animation.css'
import NormalView from './NormalView'
// import { CSSTransition, SwitchTransition } from 'react-transition-group'
import GridView from './GridView'
import { NORMAL_VIEW, GRID_VIEW } from '~/ui-constants'
import modalStyles from '~/styles/ModalStyles.module.css'

const ComposeApplication = React.forwardRef(({ onNext, onBack }, ref) => {
  const globalState = useStackablesStore()
  const { formData, addService, services, addFormData, renameService, removeService } = globalState
  const [showModalTemplate, setShowModalTemplate] = useState(false)
  const [showModalPlugin, setShowModalPlugin] = useState(false)
  const [showModalViewAll, setShowModalViewAll] = useState(false)
  const [serviceSelected, setServiceSelected] = useState(null)
  const [showModalEditService, setShowModalEditService] = useState(false)
  const [showModalEditApplicationName, setShowModalEditApplicationName] = useState(false)
  const [showModalRemoveService, setShowModalRemoveService] = useState(false)
  const normalViewRef = useRef(null)
  const gridViewRef = useRef(null)
  const [currentView, setCurrentView] = useState(NORMAL_VIEW)
  const [currentComponentClassName, setCurrentComponentClassName] = useState(`${commonStyles.mediumFlexRow} ${commonStyles.itemsStretch}`)
  const [currentComponent, setCurrentComponent] = useState(
    <NormalView
      onClickEditNameService={(service) => handleOpenModalEditService(service)}
      onClickRemoveService={(service) => handleOpenModalRemoveService(service)}
      onClickPluginHandler={(service) => handleOpenModalPlugin(service)}
      onClickTemplate={(service) => handleOpenModalTemplate(service)}
      onClickViewAll={(service) => { handleOpenModalViewAll(service) }}
      ref={normalViewRef}
    />
  )

  useEffect(() => {
    setCurrentComponentClassName(services.length > 3 ? `${commonStyles.mediumFlexRow} ${commonStyles.itemsEnd}` : `${commonStyles.mediumFlexRow} ${commonStyles.itemsStretch}`)
    setCurrentComponent(
      services.length > 3
        ? <GridView
            ref={gridViewRef}
            onClickEditNameService={(service) => handleOpenModalEditService(service)}
            onClickRemoveService={(service) => handleOpenModalRemoveService(service)}
            onClickViewAll={(service) => { handleOpenModalViewAll(service) }}
            onClickChangeTemplate={(service) => handleOpenModalTemplate(service)}
            onClickPluginHandler={(service) => handleOpenModalPlugin(service)}
          />
        : <NormalView
            onClickEditNameService={(service) => handleOpenModalEditService(service)}
            onClickRemoveService={(service) => handleOpenModalRemoveService(service)}
            onClickPluginHandler={(service) => handleOpenModalPlugin(service)}
            onClickTemplate={(service) => handleOpenModalTemplate(service)}
            onClickViewAll={(service) => { handleOpenModalViewAll(service) }}
            ref={normalViewRef}
          />
    )
    setCurrentView(services.length > 3 ? GRID_VIEW : NORMAL_VIEW)
  }, [services.length])

  function onClickPrepareFolder () {
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

  async function onClickAddService () {
    const serviceName = await window.api.getServiceName()
    addService(serviceName)
  }

  function handleEditApplicationName (newName) {
    setShowModalEditApplicationName(false)
    addFormData({
      createApplication: {
        application: newName,
        service: formData.createApplication.service,
        path: formData.createApplication.path
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
    removeService(serviceSelected.name)
    handleCloseModalRemoveService()
  }

  function handleConfirmEditService (name) {
    renameService(serviceSelected.name, name)
    handleCloseModalEditService()
  }

  return (
    <>
      <div className={styles.container} ref={ref}>
        <div className={`${commonStyles.largeFlexBlock}`}>
          <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
            <EditableTitle
              title={formData.createApplication.application}
              iconName='AppIcon'
              onClickIcon={() => setShowModalEditApplicationName(true)}
              dataAttrName='cy'
              dataAttrValue='step-title'
            />
            <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template and plugins for your service from our Stackables Marketplace. <br />Once you have chosen a template you can add another Service.</p>
          </div>
          <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyBetween} ${commonStyles.itemsCenter}`}>
            <div className={`${commonStyles.flexBlockNoGap}`}>
              <div className={`${commonStyles.largeFlexBlock}`}>
                <div className={currentComponentClassName}>
                  {currentComponent}
                  <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.containerPuzzle}`}>
                    <div className={commonStyles.mediumFlexRow}>
                      <h5 className={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}>&nbsp;</h5>
                    </div>
                    <AddService
                      onClick={() => onClickAddService()}
                      enabled={services.find(service => Object.keys(service.template).length === 0) === undefined || currentView === GRID_VIEW}
                    />
                  </div>
                </div>
              </div>
              <PlatformaticRuntimeButton view={currentView} />
            </div>
            <ConnectorAndBundleFolderTree />
          </div>
        </div>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          type='button'
          label='Back'
          onClick={() => onBack()}
          color={WHITE}
          backgroundColor={TRANSPARENT}
          paddingClass={`${commonStyles.buttonPadding} cy-action-back`}
        />

        <Button
          disabled={services.find(service => (service.template?.name ?? '') === '') !== undefined}
          label='Next - Prepare Folder'
          onClick={() => onClickPrepareFolder()}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          hoverEffect={BOX_SHADOW}
          paddingClass={`${commonStyles.buttonPadding} cy-action-next`}
        />
      </div>
      {showModalTemplate && (
        <ModalDirectional
          key='modalTemplate'
          setIsOpen={() => handleCloseModalTemplate()}
          title='Back to Application view'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70} cy-modal-template`}
          classNameModalLefty={modalStyles.modalLefty}
        >
          <SelectTemplate onClick={() => handleCloseModalTemplate()} serviceName={serviceSelected.name} />
        </ModalDirectional>
      )}
      {showModalPlugin && (
        <ModalDirectional
          key='modalPlugin'
          setIsOpen={() => handleCloseModalPlugin()}
          title='Back to Application view'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          classNameModalLefty={modalStyles.modalLefty}
        >
          <SelectPlugin
            onClick={() => handleCloseModalPlugin()}
            serviceName={serviceSelected.name}
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
          <ViewAll onClick={() => handleCloseModalViewAll()} serviceName={serviceSelected.name} />
        </ModalDirectional>
      )}
      {showModalEditApplicationName && (
        <Modal
          key='editApplicationName'
          setIsOpen={() => setShowModalEditApplicationName(false)}
          title='Application Name'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          layout={MODAL_POPUP_V2}
        >
          <EditApplicationName
            name={formData.createApplication.application}
            onClickCancel={() => setShowModalEditApplicationName(false)}
            onClickConfirm={(newName) => handleEditApplicationName(newName)}
          />
        </Modal>
      )}
      {showModalEditService && (
        <Modal
          key='editService'
          setIsOpen={() => handleCloseModalEditService()}
          title='Service Name'
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
          titleClassName={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}
          layout={MODAL_POPUP_V2}
        >
          <RemoveService
            name={serviceSelected.name}
            onClickCancel={() => handleCloseModalRemoveService()}
            onClickConfirm={() => handleConfirmRemoveService()}
          />
        </Modal>
      )}
    </>
  )
})

ComposeApplication.propTypes = {
  /**
    * onNext
    */
  onNext: PropTypes.func,
  /**
    * onNext
    */
  onBack: PropTypes.func
}

ComposeApplication.defaultProps = {
  onNext: () => {},
  onBack: () => {}
}

export default ComposeApplication
