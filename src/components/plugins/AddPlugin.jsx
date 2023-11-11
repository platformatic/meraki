'use strict'
import PropTypes from 'prop-types'
import { BorderedBox } from '@platformatic/ui-components'
import { SMALL, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './AddPlugin.module.css'
import useStackablesStore from '~/useStackablesStore'
import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import Routes from '../routes/Routes'

function AddPlugin ({ disabled, onClick }) {
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
    <>
      <CSSTransition
        in={templateAdded}
        nodeRef={nodeRef}
        timeout={300}
        classNames='template'
      >
        {!templateAdded
          ? (
            <BorderedBox
              color={WHITE}
              backgroundColor={TRANSPARENT}
              borderColorOpacity={disabled ? 20 : 100}
              classes={styles.pluginDisabled}
            >
              <Icons.CircleAddIcon color={WHITE} size={SMALL} />
              <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Add Plugin</span>
            </BorderedBox>
            )
          : (
            <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`}>
              <Routes />
              <div className={styles.pluginEnabled} onClick={() => onClick()}>
                <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`} ref={nodeRef}>
                  <div className={`${commonStyles.smallFlexRow} ${commonStyles.textCenter}`}>
                    <Icons.CircleAddIcon color={WHITE} size={SMALL} />
                    <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Add Plugin</span>
                  </div>
                </div>
              </div>
            </div>
            )}
      </CSSTransition>
    </>
  )
}

AddPlugin.propTypes = {
  /**
   * disabled
    */
  disabled: PropTypes.bool,
  /**
   * onClick
    */
  onClick: PropTypes.func,
  /**
   * usePuzzle
    */
  usePuzzle: PropTypes.bool
}

AddPlugin.defaultProps = {
  disabled: true,
  onClick: () => {},
  usePuzzle: true
}

export default AddPlugin
