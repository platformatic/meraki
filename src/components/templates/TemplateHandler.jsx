'use strict'
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import { CSSTransition } from 'react-transition-group'
import AddTemplate from '~/components/shaped-buttons/AddTemplate'
import ChangeTemplate from '~/components/shaped-buttons/ChangeTemplate'
import './template.animation.css'

function TemplateHandler ({ onClick }) {
  const [templateAdded, setTemplateAdded] = useState(false)
  const globalState = useStackablesStore()
  const { formDataWizard } = globalState
  const nodeRef = useRef(null)

  useEffect(() => {
    if (formDataWizard?.template?.id) {
      setTemplateAdded(true)
    }
  }, [formDataWizard?.template?.id])

  return (
    <CSSTransition
      in={templateAdded}
      nodeRef={nodeRef}
      timeout={300}
      classNames='template'
    >

      {!templateAdded
        ? <AddTemplate onClick={() => onClick()} />
        : <ChangeTemplate
            name={formDataWizard?.template?.name}
            ref={nodeRef}
            onClick={() => onClick()}
          />}
    </CSSTransition>
  )
}

TemplateHandler.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func
}

TemplateHandler.defaultProps = {
  onClick: () => {}
}

export default TemplateHandler
