'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from '@platformatic/ui-components'
import { MODAL_FULL_RICH_BLACK_V2 } from '@platformatic/ui-components/src/components/constants'
import HeaderCreateApplicationFlow from '~/components/application/create/HeaderCreateApplicationFlow'
import Wizard from '~/components/Wizard'
import styles from './CreateApplicationFlow.module.css'

function CreateApplicationFlow ({ onCloseModal }) {
  return (
    <Modal
      key='createApplicationFlow'
      setIsOpen={() => onCloseModal()}
      layout={MODAL_FULL_RICH_BLACK_V2}
      childrenClassContainer={`${styles.modalClassName} ${styles.rootV1}`}
      modalCloseClassName={styles.modalCloseClassName}
    >
      <HeaderCreateApplicationFlow />
      <Wizard />
    </Modal>
  )
}

CreateApplicationFlow.propTypes = {
  /**
   * onCloseModal
   */
  onCloseModal: PropTypes.func
}

CreateApplicationFlow.defaultProps = {
  onCloseModal: () => {}
}

export default CreateApplicationFlow
