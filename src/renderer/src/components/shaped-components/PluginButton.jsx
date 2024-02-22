'use strict'
import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './PluginButton.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { PlatformaticIcon } from '@platformatic/ui-components'
import { MEDIUM, SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'
import BrickPath from './BrickPath'
import { ONLY_PLUGIN, PLUGINS_2, PLUGINS_3 } from '~/ui-constants'

function PluginButton ({
  onClickSort,
  onClickRemove,
  onClickViewAll,
  index,
  name,
  heightType,
  sortable,
  viewAll,
  totalPlugins
}) {
  const ref = useRef(null)
  const [hover, setHover] = useState(false)

  function getSpecificContainerClassName () {
    let specContainerClassName
    switch (heightType) {
      case (PLUGINS_2):
        specContainerClassName = styles.containerPlugins2
        break
      case (PLUGINS_3):
        specContainerClassName = styles.containerPlugins3
        break
      default:
        specContainerClassName = styles.containerOnlyPlugin
        break
    }
    return specContainerClassName
  }

  return (
    <div
      className={`${styles.container} ${getSpecificContainerClassName()}`}
      ref={ref}
      onMouseLeave={() => setHover(false)}
      onMouseOver={() => setHover(true)}
    >
      <svg
        viewBox='0 0 284 102'
        preserveAspectRatio='none'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className={styles.svg}
      >
        {index === 0
          ? <BrickPath width={284} height={102} hover={hover} />
          : (
            <>
              <rect
                x={0.5}
                y={0.61377}
                rx={3.5}
                fill='none'
                className={styles.rectFilled}
                fillOpacity={hover ? 0.30 : 0.15}
              />
              <rect
                x={0.5}
                y={0.61377}
                rx={3.5}
                stroke='none'
                className={styles.rectBordered}
                strokeOpacity={hover ? 1 : 0.7}
              />
            </>
            )}
      </svg>

      {viewAll
        ? (
          <div className={`${commonStyles.smallFlexBlock} ${commonStyles.justifyBetween} ${commonStyles.itemsCenter} ${commonStyles.fullWidth}`}>
            <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}>Plugins: ({totalPlugins})</span>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
              <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70} `}>View All</span>
              <PlatformaticIcon iconName='ExpandIcon' color={WHITE} size={SMALL} onClick={() => onClickViewAll()} />
            </div>
          </div>
          )
        : (
          <>
            <div className={`${commonStyles.mediumFlexRow} ${commonStyles.justifyBetween} ${commonStyles.itemsCenter} ${styles.content}`}>
              <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter} ${styles.leftContent}`}>
                {sortable && <PlatformaticIcon iconName='SortableIcon' color={WHITE} size={SMALL} onClick={() => onClickSort()} />}
                <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70} ${styles.ellipsis}`} title={name}>{name}</span>
              </div>
            </div>
            <div className={styles.deleteContainer}>
              <PlatformaticIcon iconName='TrashIcon' color={WHITE} size={MEDIUM} onClick={() => onClickRemove()} />
            </div>
          </>
          )}
    </div>
  )
}

PluginButton.propTypes = {
  /**
   * onClickSort
    */
  onClickSort: PropTypes.func,
  /**
   * onClickRemove
    */
  onClickRemove: PropTypes.func,
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * index
    */
  index: PropTypes.number,
  /**
   * sortable
    */
  sortable: PropTypes.bool,
  /**
   * viewAll
    */
  viewAll: PropTypes.bool,
  /**
   * totalPlugins
    */
  totalPlugins: PropTypes.number,
  /**
   * heightType
    */
  heightType: PropTypes.oneOf([ONLY_PLUGIN, PLUGINS_2, PLUGINS_3])
}

PluginButton.defaultProps = {
  onClickSort: () => {},
  onClickRemove: () => {},
  onClickViewAll: () => {},
  name: '',
  index: 0,
  sortable: true,
  viewAll: false,
  totalPlugins: 0,
  heightType: ONLY_PLUGIN
}

export default PluginButton
