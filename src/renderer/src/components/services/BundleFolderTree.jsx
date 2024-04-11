'use strict'
import React, { useState, useEffect } from 'react'
import { MEDIUM, SMALL, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './BundleFolderTree.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { BorderedBox } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import ArrowConnector from '~/components/shaped-components/ArrowConnector'
import FoldersLineIcon from '~/components/services/FoldersLineIcon'

const BundleFolderTree = React.forwardRef(({ _ }, ref) => {
  const globalState = useStackablesStore()
  const [containerClassName, setContainerClassName] = useState('')
  const { formData, services } = globalState

  useEffect(() => {
    switch (services.length) {
      case 0:
        setContainerClassName('')
        break

      case 1:
        setContainerClassName(styles.containerNumberServices1)
        break
      case 2:
        setContainerClassName(styles.containerNumberServices2)
        break
      default:
        setContainerClassName(styles.containerNumberServicesOver)
        break
    }
  }, [services.length])

  return (
    <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter} ${containerClassName}`} ref={ref}>
      <ArrowConnector />
      <div className={`${commonStyles.mediumFlexBlock} ${styles.serviceContainer} ${commonStyles.overflowHidden}`}>
        <p className={`${typographyStyles.desktopBodyLargeSemibold} ${typographyStyles.textWhite} ${typographyStyles.ellipsis}`} title={formData.createApplication.application}>{formData.createApplication.application}</p>
        <BorderedBox color={WHITE} borderColorOpacity={30} backgroundColor={TRANSPARENT} classes={styles.boxContainer}>
          <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`}>
            <div className={`${commonStyles.tinyFlexRow} ${commonStyles.justifyCenter}`}>
              <Icons.FoldersIcon color={WHITE} size={MEDIUM} />
              <p className={`${typographyStyles.desktopBodyLargeSemibold} ${typographyStyles.textWhite}`}>Services</p>
            </div>
            {services.length > 0 && (
              <div className={`${styles.flexContainerServices}`}>
                <div className={styles.folderLineIconContainer}>
                  <FoldersLineIcon width={24} height={(28 * services.length) + (4 * services.length)} topPosition={-13} />
                </div>
                <div className={`${commonStyles.smallFlexBlock}`}>
                  {services.map((service, index) => (
                    <div className={`${styles.foldersContainer}`} key={index}>
                      {index + 1 !== services.length && <hr className={styles.horizontalDivided} />}
                      <div className={`${commonStyles.tinyFlexRow} ${typographyStyles.textCenter} ${commonStyles.overflowHidden}`}>
                        <Icons.FolderIcon color={WHITE} size={SMALL} inactive />
                        <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70} ${styles.ellipsis}`} title={service.name}>{service.name}</span>
                      </div>
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

export default BundleFolderTree
