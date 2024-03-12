'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '@platformatic/ui-components'
import { MODAL_FULL_RICH_BLACK_V2, MODAL_POPUP_V2 } from '@platformatic/ui-components/src/components/constants'
import HeaderEditApplicationFlow from '~/components/application/edit/HeaderEditApplicationFlow'
import Wizard from '~/components/Wizard'
import styles from './EditApplicationFlow.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import DiscardChanges from '~/components/application/edit/DiscardChanges'

function EditApplicationFlow ({ onCloseModal, onClickGoToApps }) {
  const [showModalDiscardChanges, setShowModalDiscardChanges] = useState(false)

  function handleCloseModalEditApplication () {
    setShowModalDiscardChanges(true)
  }

  function handleConfirmDiscardChanges () {
    onCloseModal()
    setShowModalDiscardChanges(false)
  }

  function handleCloseModalDiscardChanges () {
    setShowModalDiscardChanges(false)
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
        <Wizard onClickGoToApps={() => onClickGoToApps()} />
      </Modal>
      {showModalDiscardChanges && (
        <Modal
          key='discardChanges'
          setIsOpen={() => handleCloseModalDiscardChanges()}
          title='Discard Changes'
          titleClassName={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}
          layout={MODAL_POPUP_V2}
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
  onClickGoToApps: PropTypes.func
}

EditApplicationFlow.defaultProps = {
  onCloseModal: () => {},
  onClickGoToApps: () => {}
}

export default EditApplicationFlow
