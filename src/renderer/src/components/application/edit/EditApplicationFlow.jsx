'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '@platformatic/ui-components'
import { MODAL_FULL_RICH_BLACK_V2, MODAL_POPUP_V2 } from '@platformatic/ui-components/src/components/constants'
import HeaderEditApplicationFlow from '~/components/application/edit/HeaderEditApplicationFlow'
import EditWizard from '~/components/wizard/EditWizard'
import StopApplicationToEdit from '~/components/application/edit/StopApplicationToEdit'
import styles from './EditApplicationFlow.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import DiscardChanges from '~/components/application/edit/DiscardChanges'
import { STATUS_RUNNING } from '~/ui-constants'
import useStackablesStore from '~/useStackablesStore'

function EditApplicationFlow ({ onCloseModal, onClickGoToApps, onStopApplication }) {
  const globalState = useStackablesStore()
  const applicationStatus = globalState.computed.applicationStatus
  const applicationSelected = globalState.computed.applicationSelected
  const [showModalDiscardChanges, setShowModalDiscardChanges] = useState(false)

  function handleCloseModalEditApplication () {
    setShowModalDiscardChanges(true)
  }

  function handleCloseModalStopApplication () {
    onCloseModal()
  }

  function handleConfirmDiscardChanges () {
    onCloseModal()
    setShowModalDiscardChanges(false)
  }

  function handleCloseModalDiscardChanges () {
    setShowModalDiscardChanges(false)
  }

  function handleStopApplication () {
    onStopApplication()
  }

  if (applicationStatus === STATUS_RUNNING) {
    return (
      <Modal
        key='stopApplicationRunning'
        setIsOpen={() => handleCloseModalStopApplication()}
        title='Stop the Application to edit'
        titleClassName={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}
        layout={MODAL_POPUP_V2}
        permanent
      >
        <StopApplicationToEdit onClickCancel={() => handleCloseModalStopApplication()} onClickProceed={() => handleStopApplication()} />
      </Modal>
    )
  }

  return (
    <>
      <Modal
        key='editApplicationFlow'
        setIsOpen={() => handleCloseModalEditApplication()}
        layout={MODAL_FULL_RICH_BLACK_V2}
        childrenClassContainer={`${styles.modalClassName} ${styles.rootV1}`}
        modalCloseClassName={styles.modalCloseClassName}
      >
        <HeaderEditApplicationFlow />
        <EditWizard onClickGoToApps={() => onClickGoToApps()} applicationSelected={applicationSelected} />
      </Modal>
      {showModalDiscardChanges && (
        <Modal
          key='discardChanges'
          setIsOpen={() => handleCloseModalDiscardChanges()}
          title='Discard Changes'
          titleClassName={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}
          layout={MODAL_POPUP_V2}
          permanent
        >
          <DiscardChanges
            onClickCancel={() => handleCloseModalDiscardChanges()}
            onClickConfirm={() => handleConfirmDiscardChanges()}
          />
        </Modal>
      )}
    </>
  )
}

EditApplicationFlow.propTypes = {
  /**
   * onCloseModal
   */
  onCloseModal: PropTypes.func,
  /**
   * onClickGoToApps
   */
  onClickGoToApps: PropTypes.func,
  /**
   * onStopApplication
   */
  onStopApplication: PropTypes.func
}

EditApplicationFlow.defaultProps = {
  onCloseModal: () => {},
  onClickGoToApps: () => {},
  onStopApplication: () => {}
}

export default EditApplicationFlow
