'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from '@platformatic/ui-components'
import { MODAL_FULL_RICH_BLACK_V2, MODAL_POPUP_V2 } from '@platformatic/ui-components/src/components/constants'
import HeaderCreateApplicationFlow from '~/components/application/create/HeaderCreateApplicationFlow'
import Wizard from '~/components/Wizard'
import styles from './CreateApplicationFlow.module.css'
import DiscardCreate from '~/components/application/create/DiscardCreate'
import typographyStyles from '~/styles/Typography.module.css'

function CreateApplicationFlow ({ onCloseModal, onClickGoToApps }) {
  const [showModalDiscardCreate, setShowModalDiscardCreate] = useState(false)

  function handleCloseModalDiscardCreate () {
    setShowModalDiscardCreate(false)
  }

  function handleCloseModalCreateApplication () {
    setShowModalDiscardCreate(true)
  }

  return (
    <>
      <Modal
        key='createApplicationFlow'
        setIsOpen={() => handleCloseModalCreateApplication()}
        layout={MODAL_FULL_RICH_BLACK_V2}
        childrenClassContainer={`${styles.modalClassName} ${styles.rootV1}`}
        modalCloseClassName={styles.modalCloseClassName}
      >
        <HeaderCreateApplicationFlow />
        <Wizard onClickGoToApps={() => onClickGoToApps()} />
      </Modal>
      {showModalDiscardCreate && (
        <Modal
          key='showModalDiscardCreate'
          setIsOpen={() => handleCloseModalDiscardCreate()}
          title='Close Application'
          titleClassName={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}
          layout={MODAL_POPUP_V2}
        >
          <DiscardCreate
            onClickCancel={() => handleCloseModalDiscardCreate()}
            onClickConfirm={() => onCloseModal()}
          />
        </Modal>
      )}
    </>
  )
}

CreateApplicationFlow.propTypes = {
  /**
   * onCloseModal
   */
  onCloseModal: PropTypes.func,
  /**
   * onClickGoToApps
   */
  onClickGoToApps: PropTypes.func
}

CreateApplicationFlow.defaultProps = {
  onCloseModal: () => {},
  onClickGoToApps: () => {}
}

export default CreateApplicationFlow
