'use strict'
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { MAIN_GREEN, SMALL, WHITE, LARGE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './AddTemplate.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import useStackablesStore from '~/useStackablesStore'
import { CSSTransition } from 'react-transition-group'
import './template.animation.css'

function AddTemplate ({ onClick }) {
  const [classNameContainer, setClassNameContainer] = useState(styles.container)
  const [templateAdded, setTemplateAdded] = useState(false)
  const globalState = useStackablesStore()
  const { formDataWizard } = globalState
  const nodeRef = useRef(null)

  useEffect(() => {
    if (formDataWizard?.template?.id) {
      setTemplateAdded(true)
      setClassNameContainer(`${styles.container} ${styles.added}`)
    }
  }, [formDataWizard?.template?.id])

  return (
    <div className={classNameContainer} onClick={onClick}>
      <CSSTransition
        in={templateAdded}
        nodeRef={nodeRef}
        timeout={300}
        classNames='template'
      >

        {!templateAdded
          ? (
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.justifyCenter}`}>
              <Icons.CircleAddIcon color={WHITE} size={SMALL} />
              <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>Select Template</span>
            </div>
            )
          : (
            <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`} ref={nodeRef}>
              <Icons.StackablesTemplate color={MAIN_GREEN} size={LARGE} />
              <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.textCenter}`}>{formDataWizard?.template?.name}</p>
              <p className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.textCenter} ${typographyStyles.opacity70}`}>Change Template</p>
            </div>
            )}
      </CSSTransition>
    </div>
  )
}

AddTemplate.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func
}

AddTemplate.defaultProps = {
  onClick: () => {}
}

export default AddTemplate
