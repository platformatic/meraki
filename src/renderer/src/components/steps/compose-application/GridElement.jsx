'use strict'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import NameService from '../../services/NameService'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { BorderedBox } from '@platformatic/ui-components'
import { MAIN_GREEN, OPACITY_20, SMALL, TERTIARY_BLUE, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import styles from './GridElement.module.css'
import '~/components/component.animation.css'
import { useState } from 'react'

function GridElement ({
  service,
  groupIndex,
  onClickEditNameService,
  onClickRemoveService,
  onClickViewAll,
  onClickChangeTemplate,
  onClickPluginHandler
}) {
  const globalState = useStackablesStore()
  const { services } = globalState
  const [hover, setHover] = useState(false)
  let gridElementClassName = `${commonStyles.smallFlexRow} ${styles.container} ${commonStyles.justifyBetween} gridElement`
  const gridElementStyle = {}
  if (groupIndex > 0) {
    gridElementStyle.height = document.getElementsByClassName('gridElement')[0].getBoundingClientRect().height + 'px'
    gridElementClassName += ` ${styles.containerOthers}`
  } else {
    gridElementClassName += ` ${styles.containerFirst}`
  }

  return (
    <div className={gridElementClassName} style={gridElementStyle}>
      <div className={styles.contentLeft}>
        <NameService
          name={service.name}
          renameDisabled={service.renameDisabled}
          onClickEdit={() => onClickEditNameService(service)}
          onClickRemove={() => onClickRemoveService(service)}
          removeDisabled={services.length < 2}
        />
        {(service?.template?.name)
          ? (
            <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter} ${commonStyles.cursorPointer}`} onClick={() => onClickViewAll()} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${hover ? '' : typographyStyles.opacity70} `}>Expand View</span>
              <Icons.ExpandIcon color={WHITE} size={SMALL} inactive={!hover} />
            </div>
            )
          : (
            <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
              <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity30} `}>Expand View</span>
              <Icons.ExpandIcon color={WHITE} size={SMALL} disabled />
            </div>
            )}
      </div>
      <div className={styles.buttonsContainer}>
        {service?.template?.name &&
        (
          <BorderedBox color={TERTIARY_BLUE} backgroundColor={TERTIARY_BLUE} backgroundColorOpacity={OPACITY_20} classes={styles.box} onClick={() => { onClickPluginHandler(service) }} clickable>
            <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
              <Icons.StackablesPluginIcon color={TERTIARY_BLUE} size={SMALL} />
              <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70} `}>{service.plugins.length}</span>
            </div>
          </BorderedBox>
        )}
        {service?.template?.disabled
          ? (
            <BorderedBox color={WHITE} backgroundColor={WHITE} backgroundColorOpacity={OPACITY_20} classes={styles.boxGrow}>
              <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
                <Icons.StackablesTemplateIcon color={WHITE} size={SMALL} />
                <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70} `}>{service?.template?.name ? 1 : 0}</span>
              </div>
            </BorderedBox>
            )
          : (
            <BorderedBox color={MAIN_GREEN} backgroundColor={MAIN_GREEN} backgroundColorOpacity={OPACITY_20} classes={styles.boxGrow} onClick={() => onClickChangeTemplate(service)} clickable>
              <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
                {service?.template?.name
                  ? (
                    <>
                      <Icons.StackablesTemplateIcon color={MAIN_GREEN} size={SMALL} />
                      <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70} `}>1</span>
                    </>
                    )
                  : (
                    <div className={styles.emptyContainer}>
                      <Icons.CircleAddIcon color={MAIN_GREEN} size={SMALL} />
                    </div>
                    )}
              </div>
            </BorderedBox>
            )}
      </div>
    </div>

  )
}

GridElement.propTypes = {
  service: PropTypes.object,
  groupIndex: PropTypes.number,
  onClickEditNameService: PropTypes.func,
  onClickRemoveService: PropTypes.func,
  onClickViewAll: PropTypes.func,
  onClickChangeTemplate: PropTypes.func,
  onClickPluginHandler: PropTypes.func
}

GridElement.defaultProps = {
  service: {},
  groupIndex: 0,
  onClickEditNameService: () => {},
  onClickRemoveService: () => {},
  onClickViewAll: () => {},
  onClickChangeTemplate: () => {},
  onClickPluginHandler: () => {}
}

export default GridElement
