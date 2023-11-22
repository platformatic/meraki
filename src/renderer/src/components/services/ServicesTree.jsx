'use strict'
import React from 'react'
import { MEDIUM, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './ServicesTree.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { BorderedBox } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import SmallTitle from '~/components/ui/SmallTitle'
import ArrowConnector from '~/components/shaped-components/ArrowConnector'
import FoldersLineIcon from '~/components/services/FoldersLineIcon'

const ServicesTree = React.forwardRef(({ _ }, ref) => {
  const globalState = useStackablesStore()
  const { formData, services } = globalState

  return (
    <div className={`${commonStyles.mediumFlexRow} ${commonStyles.itemsCenter}`} ref={ref}>
      <ArrowConnector />
      <div className={`${commonStyles.mediumFlexBlock} ${styles.serviceContainer}`}>
        <h5 className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite}`}>{formData.createApplication.service}</h5>
        <BorderedBox color={WHITE} borderColorOpacity={30} backgroundColor={TRANSPARENT} classes={commonStyles.fullWidth}>
          <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`}>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.justifyCenter}`}>
              <Icons.FoldersIcon color={WHITE} size={MEDIUM} />
              <h5 className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite}`}>Services</h5>
            </div>
            {services.length > 0 && (
              <div className={`${styles.flexContainerServices}`}>
                <div className={styles.folderLineIconContainer}>
                  <FoldersLineIcon width={24} height={(28 * services.length) + (5 * services.length)} topPosition={-13} />
                </div>
                <div className={`${commonStyles.smallFlexBlock}`}>
                  {services.map((service, index) => (
                    <div className={`${styles.foldersContainer}`} key={index}>
                      {index + 1 !== services.length && <hr className={styles.horizontalDivided} />}
                      <SmallTitle
                        iconName='FoldersIcon'
                        title={service.name}
                        titleClassName={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
                        containerClassName={`${commonStyles.smallFlexRow} ${typographyStyles.textCenter}`}
                      />
                    </div>

                  ))}
                </div>
              </div>
            )}
          </div>
        </BorderedBox>
      </div>
    </div>
  )
})

export default ServicesTree
