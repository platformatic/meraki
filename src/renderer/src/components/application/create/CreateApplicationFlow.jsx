'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from '@platformatic/ui-components'
import { MODAL_FULL_RICH_BLACK } from '@platformatic/ui-components/src/components/constants'
import Wizard from '~/components/Wizard'

function CreateApplicationFlow ({ onCloseModal }) {
  return (
    <Modal
      key='createApplicationFlow'
      setIsOpen={() => onCloseModal()}
      layout={MODAL_FULL_RICH_BLACK}
    >
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
