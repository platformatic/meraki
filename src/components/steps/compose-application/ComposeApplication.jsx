'use strict'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './ComposeApplication.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, MODAL_POPUP_V2 } from '@platformatic/ui-components/src/components/constants'
import { Button, Modal, ModalDirectional } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
/* import PluginHandler from '~/components/plugins/PluginHandler'
import TemplateHandler from '~/components/templates/TemplateHandler'
 */import AddService from '~/components/shaped-components/AddService'
import SelectTemplate from '~/components/templates/SelectTemplate'
import EditableTitle from '~/components/ui/EditableTitle'
import SelectPlugin from '~/components/plugins/SelectPlugin'
import Services from '~/components/services/Services'
import PlatformaticRuntimeButton from '~/components/shaped-components/PlatformaticRuntimeButton'
import ViewAll from '~/components/plugins/ViewAll'
import EditService from '~/components/services/EditService'
import RemoveService from '~/components/services/RemoveService'
import '~/components/component.animation.css'
import NormalView from './NormalView'
// import { CSSTransition, SwitchTransition } from 'react-transition-group'
import GridView from './GridView'

const ComposeApplication = React.forwardRef(({ onNext }, ref) => {
  const globalState = useStackablesStore()
  const { formData, addService, services, addFormData, renameService, removeService } = globalState
  const [showModalTemplate, setShowModalTemplate] = useState(false)
  const [showModalPlugin, setShowModalPlugin] = useState(false)
  const [showModalViewAll, setShowModalViewAll] = useState(false)
  const [serviceSelected, setServiceSelected] = useState(null)
  const [showModalEditService, setShowModalEditService] = useState(false)
  const [showModalRemoveService, setShowModalRemoveService] = useState(false)
  const normalViewRef = useRef(null)
  const gridViewRef = useRef(null)
  const [view, setView] = useState('normal')
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
    setView(services.length > 3 ? 'grid' : 'normal')
    setCurrentComponent(
      services.length > 3
        ? <GridView
            ref={gridViewRef}
            onClickEditNameService={(service) => handleOpenModalEditService(service)}
            onClickRemoveService={(service) => handleOpenModalRemoveService(service)}
            onClickViewAll={(service) => { handleOpenModalViewAll(service) }}
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
  }, [services.length])

  function onClickConfigureServices () {
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
            dataAttrName='cy'
            dataAttrValue='step-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template and plugins for your service from our Stackables Marketplace. Once you have chosen a template you can add another Service.</p>
        </div>
        <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyBetween} ${commonStyles.itemsCenter}`}>
          <div className={`${commonStyles.flexBlockNoGap}`}>
            <div className={`${commonStyles.largeFlexBlock}`}>
              <div className={`${commonStyles.mediumFlexRow} ${commonStyles.itemsStretch}`}>
                {/* <SwitchTransition>
                  <CSSTransition
                    key={currentComponent.name}
                    nodeRef={currentComponent.ref}
                    addEndListener={(done) => {
                      ref.current.addEventListener('transitionend', done, false)
                    }}
                    classNames='fade-vertical'
                  >
                 */}    {currentComponent}
                {/*   </CSSTransition>
                </SwitchTransition>
 */}
                <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.containerPuzzle}`}>
                  {view === 'normal' && (
                    <div className={commonStyles.mediumFlexRow}>
                      <h5 className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite}`}>&nbsp;</h5>
                    </div>
                  )}
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
          disabled={!(services[0]?.template?.id)}
          label='Next - Configure Services'
          onClick={() => onClickConfigureServices()}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          classes={`${commonStyles.buttonPadding} cy-action-next`}
        />
      </div>
      {showModalTemplate && (
        <ModalDirectional
          key='modalTemplate'
          setIsOpen={() => handleCloseModalTemplate()}
          title='Back to Application view'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70} cy-modal-template`}
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
