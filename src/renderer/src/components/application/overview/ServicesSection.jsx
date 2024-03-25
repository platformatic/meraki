'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { RICH_BLACK, WHITE, DULLS_BACKGROUND_COLOR, ANTI_FLASH_WHITE, MEDIUM } from '@platformatic/ui-components/src/components/constants'
import styles from './ServicesSection.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { Button, ModalDirectional } from '@platformatic/ui-components'
import Icons from '@platformatic/ui-components/src/components/icons'
import ServiceElement from './ServiceElement'
import modalStyles from '~/styles/ModalStyles.module.css'
import useStackablesStore from '~/useStackablesStore'

function ServicesSection ({ onClickEditApplication }) {
  const globalState = useStackablesStore()
  const applicationStatus = globalState.computed.applicationStatus
  const applicationSelected = globalState.computed.applicationSelected
  const [showModalScalarIntegration, setShowModalScalarIntegration] = useState(false)
  function handleCloseModalAPIReference () {
    setShowModalScalarIntegration(false)
  }

  return (
    <>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        <div className={`${commonStyles.tinyFlexRow} ${commonStyles.fullWidth}`}>
          <Icons.ServiceIcon
            color={WHITE}
            size={MEDIUM}
          />
          <h3 className={`${typographyStyles.desktopHeadline3} ${typographyStyles.textWhite}`}>Services</h3>
        </div>

        <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} ${commonStyles.justifyBetween} `}>
          <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>This is how your application is structured. You can edit it anytime:</span>

          <div className={`${styles.buttonContainer}`}>
            <Button
              type='button'
              label='Edit Application'
              onClick={() => onClickEditApplication()}
              color={RICH_BLACK}
              bordered={false}
              backgroundColor={WHITE}
              hoverEffect={DULLS_BACKGROUND_COLOR}
              hoverEffectProperties={{ changeBackgroundColor: ANTI_FLASH_WHITE }}
              paddingClass={commonStyles.buttonPadding}
              platformaticIcon={{ iconName: 'EditIcon', color: RICH_BLACK }}
              textClass={typographyStyles.desktopBody}
            />
          </div>
        </div>

        <div className={styles.servicesContainer}>
          {applicationSelected.services.map((service, index) => <ServiceElement key={index} id={service.id} service={service} applicationEntrypoint={applicationSelected.entrypoint === service.id} applicationStatus={applicationStatus} onClickScalarIntegration={() => setShowModalScalarIntegration(true)} />)}
        </div>
      </div>
      {showModalScalarIntegration && (
        <ModalDirectional
          key='modalTemplate'
          setIsOpen={() => handleCloseModalAPIReference()}
          title='Back to Overview'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} cy-modal-template`}
          classNameModalLefty={modalStyles.modalLefty}
        >
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>Scalar integration</p>
        </ModalDirectional>
      )}
    </>
  )
}

ServicesSection.propTypes = {
  /**
   * onClickEditApplication
    */
  onClickEditApplication: PropTypes.func
}

ServicesSection.defaultProps = {
  onClickEditApplication: () => {}
}

export default ServicesSection
