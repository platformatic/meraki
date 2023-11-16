'use strict'
import PropTypes from 'prop-types'
import { BorderedBox } from '@platformatic/ui-components'
import { SMALL, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './PluginHandler.module.css'
import useStackablesStore from '~/useStackablesStore'
import { useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import Routes from '~/components/shaped-components/Routes'
import AddPlugin from '~/components/shaped-components/AddPlugin'
import './plugin.animation.css'

function PluginHandler ({ disabled, onClick, serviceId }) {
  const [templateAdded, setTemplateAdded] = useState(false)
  const globalState = useStackablesStore()
  const { services } = globalState
  const nodeRef = useRef(null)

  useEffect(() => {
    if (services[serviceId]?.template?.id) {
      setTemplateAdded(true)
    }
  }, [services[serviceId]?.template?.id])

  return (
    <CSSTransition
      in={templateAdded}
      nodeRef={nodeRef}
      timeout={300}
      classNames='plugin'
    > {
      !templateAdded
        ? (
          <BorderedBox
            color={WHITE}
            backgroundColor={TRANSPARENT}
            borderColorOpacity={disabled ? 20 : 100}
            classes={`${styles.pluginDisabled} cy-add-plugin-disabled`}
          >
            <Icons.CircleAddIcon color={WHITE} size={SMALL} />
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Add Plugin</span>
          </BorderedBox>
          )
        : (
          <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`} ref={nodeRef}>
            <Routes />
            <AddPlugin onClick={() => onClick()} />
          </div>
          )
    }
    </CSSTransition>

  )
}

PluginHandler.propTypes = {
  /**
   * disabled
    */
  disabled: PropTypes.bool,
  /**
   * onClick
    */
  onClick: PropTypes.func,
  /**
   * serviceId
    */
  serviceId: PropTypes.number.isRequired
}

PluginHandler.defaultProps = {
  disabled: true,
  onClick: () => {}
}

export default PluginHandler
