'use strict'
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { MEDIUM, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './Services.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { BorderedBox } from '@platformatic/ui-components'
import { CSSTransition } from 'react-transition-group'
import useStackablesStore from '~/useStackablesStore'
import SmallTitle from '~/components/ui/SmallTitle'
import './service.animation.css'
import ArrowConnector from '../shaped-components/ArrowConnector'

function Services ({ onClick }) {
  const [templateAdded, setTemplateAdded] = useState(false)
  const globalState = useStackablesStore()
  const { formData, services } = globalState
  const nodeRef = useRef(null)

  useEffect(() => {
    if (services[0]?.template?.id) {
      setTemplateAdded(true)
    }
  }, [services[0]?.template?.id])

  return (
    <CSSTransition
      in={templateAdded}
      nodeRef={nodeRef}
      timeout={300}
      classNames='service'
    >
      {templateAdded
        ? (
          <div className={`${commonStyles.mediumFlexRow} ${commonStyles.itemsCenter}`} ref={nodeRef}>
            <ArrowConnector />
            <div className={`${commonStyles.mediumFlexBlock} ${styles.serviceContainer}`}>
              <h5 className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite}`}>{formData.createApplication.service}</h5>
              <BorderedBox color={WHITE} borderColorOpacity={30} backgroundColor={TRANSPARENT}>
                <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`}>
                  <div className={`${commonStyles.smallFlexRow} ${commonStyles.justifyCenter}`}>
                    <Icons.FoldersIcon color={WHITE} size={MEDIUM} />
                    <h5 className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite}`}>Services</h5>
                  </div>
                  <div className={`${commonStyles.smallFlexBlock} ${styles.foldersContainer}`}>
                    {services.length > 0 && services.map((service, index) => (
                      <SmallTitle
                        key={index}
                        iconName='FoldersIcon'
                        title={service.name}
                        titleClassName={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
                        containerClassName={`${commonStyles.smallFlexRow} ${commonStyles.textCenter}`}
                      />
                    ))}
                  </div>
                </div>
              </BorderedBox>
            </div>
          </div>
          )
        : <></>}
    </CSSTransition>
  )
}

Services.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func
}

Services.defaultProps = {
  onClick: () => {}
}

export default Services
