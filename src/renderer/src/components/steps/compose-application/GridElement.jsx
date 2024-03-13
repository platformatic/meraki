'use strict'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import NameService from '../../services/NameService'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { BorderedBox, PlatformaticIcon } from '@platformatic/ui-components'
import { MAIN_GREEN, OPACITY_20, SMALL, TERTIARY_BLUE, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import styles from './GridElement.module.css'
import '~/components/component.animation.css'

function GridElement ({
  service,
  onClickEditNameService,
  onClickRemoveService,
  onClickViewAll,
  onClickChangeTemplate,
  onClickPluginHandler
}) {
  const globalState = useStackablesStore()
  const { services } = globalState

  return (
    <div className={`${commonStyles.mediumFlexRow} ${styles.container} ${commonStyles.justifyBetween}`}>
      <div className={commonStyles.flexBlockNoGap}>
        <NameService
          name={service.name}
          renameDisabled={service.renameDisabled}
          onClickEdit={() => onClickEditNameService(service)}
          onClickRemove={() => onClickRemoveService(service)}
          removeDisabled={services.length < 2}
        />
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
          <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70} `}>View All</span>
          <PlatformaticIcon iconName='ExpandIcon' color={WHITE} size={SMALL} onClick={() => onClickViewAll()} disabled={!(service?.template?.name)} />
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        {service?.template?.name &&
        (
          <BorderedBox color={TERTIARY_BLUE} backgroundColor={TERTIARY_BLUE} backgroundColorOpacity={OPACITY_20} classes={styles.box} onClick={() => { onClickPluginHandler(service) }} clickable>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
              <Icons.StackablesPluginIcon color={TERTIARY_BLUE} size={SMALL} />
              <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70} `}>{service.plugins.length}</span>
            </div>
          </BorderedBox>
        )}
        {service?.template?.disabled
          ? (
            <BorderedBox color={WHITE} backgroundColor={WHITE} backgroundColorOpacity={OPACITY_20} classes={styles.boxGrow}>
              <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
                <Icons.StackablesTemplateIcon color={WHITE} size={SMALL} />
                <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70} `}>{service?.template?.name ? 1 : 0}</span>
              </div>
            </BorderedBox>
            )
          : (
            <BorderedBox color={MAIN_GREEN} backgroundColor={MAIN_GREEN} backgroundColorOpacity={OPACITY_20} classes={styles.boxGrow} onClick={() => onClickChangeTemplate(service)} clickable>
              <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
                <Icons.StackablesTemplateIcon color={MAIN_GREEN} size={SMALL} />
                <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70} `}>{service?.template?.name ? 1 : 0}</span>
              </div>
            </BorderedBox>
            )}
      </div>
    </div>

  )
}

GridElement.propTypes = {
  service: PropTypes.object,
  onClickEditNameService: PropTypes.func,
  onClickRemoveService: PropTypes.func,
  onClickViewAll: PropTypes.func,
  onClickChangeTemplate: PropTypes.func,
  onClickPluginHandler: PropTypes.func
}

GridElement.defaultProps = {
  service: {},
  onClickEditNameService: () => {},
  onClickRemoveService: () => {},
  onClickViewAll: () => {},
  onClickChangeTemplate: () => {},
  onClickPluginHandler: () => {}
}

export default GridElement
