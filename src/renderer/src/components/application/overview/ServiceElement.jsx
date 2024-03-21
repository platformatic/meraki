'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { RICH_BLACK, WHITE, MEDIUM, OPACITY_30, MARGIN_0, TRANSPARENT, SMALL, MAIN_GREEN, OPACITY_10, TERTIARY_BLUE } from '@platformatic/ui-components/src/components/constants'
import styles from './ServiceElement.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { BorderedBox, ButtonOnlyIcon, HorizontalSeparator, PlatformaticIcon, VerticalSeparator } from '@platformatic/ui-components'
import Icons from '@platformatic/ui-components/src/components/icons'
import { STATUS_STOPPED, STATUS_RUNNING } from '~/ui-constants'
import JavascriptIcon from '../../ui/icons/JavascriptIcon'
import TypescriptIcon from '../../ui/icons/TypescriptIcon'

function ServiceElementTemplate ({ name, id }) {
  return (
    <BorderedBox classes={styles.serviceTemplate} color={MAIN_GREEN} borderColorOpacity={OPACITY_30} backgroundColor={MAIN_GREEN} backgroundColorOpacity={OPACITY_10}>
      <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
        <Icons.StackablesTemplateIcon color={MAIN_GREEN} size={SMALL} />
        <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.textCenter} ${styles.ellipsis} ${styles.templateName}`} title={name}>{name}</p>
        <PlatformaticIcon iconName='ExpandIcon' color={WHITE} size={SMALL} onClick={() => window.open(`https://marketplace.platformatic.dev/#/detail/template/${id}`, '_blank')} internalOverHandling />
      </div>
    </BorderedBox>
  )
}

function ServiceElementPlugin ({ name, id }) {
  return (
    <BorderedBox classes={styles.servicePlugin} color={TERTIARY_BLUE} borderColorOpacity={OPACITY_30} backgroundColor={TERTIARY_BLUE} backgroundColorOpacity={OPACITY_10}>
      <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
        <Icons.StackablesPluginIcon color={TERTIARY_BLUE} size={SMALL} />
        <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.textCenter} ${styles.ellipsis} ${styles.pluginName}`} title={name}>{name}</p>
        <PlatformaticIcon iconName='ExpandIcon' color={WHITE} size={SMALL} onClick={() => window.open(`https://marketplace.platformatic.dev/#/detail/plugin/${id}`, '_blank')} internalOverHandling />
      </div>
    </BorderedBox>
  )
}

function ServiceElement ({
  service,
  applicationEntrypoint,
  applicationStatus,
  onClickScalarIntegration
}) {
  const [expanded, setExpanded] = useState(false)

  function getTemplateId (service) {
    return service.templateDesc.find(templateDesc => templateDesc.name === service.template).id
  }

  function getPluginId (plugin, service) {
    return service.pluginsDesc.find(pluginDesc => pluginDesc.name === plugin.name).id
  }

  function getIcon () {
    
    let typeScript = false
    if (service.config.plugins && service.config.plugins.typescript) {
      const envTypescript = service.config.plugins.typescript
      if (envTypescript.indexOf('{') === 0) {
        typeScript = service.env[envTypescript.replace(/[{}]/g), ''].toLowerCase() === 'true'
      } else {
        typescript = envTypescript.toLowerCase() === 'true'
      }
    }
    return typeScript ? <TypescriptIcon /> : <JavascriptIcon />
  }

  return (
    <BorderedBox classes={styles.paddingElement} backgroundColor={RICH_BLACK} color={WHITE} borderColorOpacity={OPACITY_30}>
      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`}>
        <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} ${commonStyles.justifyBetween} `}>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            {applicationEntrypoint && (<Icons.EntrypointIcon size={SMALL} color={WHITE} />)}
            <span className={`${typographyStyles.desktopBodyLargeSemibold} ${typographyStyles.textWhite}`}>{service.id}</span>
            {applicationEntrypoint && (
              <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>(This service is the Application Entrypoint)</span>
            )}
            {getIcon()}
          </div>

          <div className={`${styles.buttonContainer}`}>
            <ButtonOnlyIcon
              type='button'
              onClick={() => onClickScalarIntegration()}
              color={WHITE}
              backgroundColor={TRANSPARENT}
              paddingClass={commonStyles.buttonSquarePadding}
              platformaticIcon={{ iconName: 'APIDocsIcon', color: WHITE }}
              textClass={typographyStyles.desktopBody}
              disabled={applicationStatus === STATUS_STOPPED}
            />
            <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} />
            <PlatformaticIcon iconName={expanded ? 'ArrowUpIcon' : 'ArrowDownIcon'} color={WHITE} size={MEDIUM} onClick={() => setExpanded(!expanded)} internalOverHandling />
          </div>
        </div>

        {expanded && (
          <>
            <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
            <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`}>
              {service.template !== null && (
                <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
                  <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Template: </span>
                  <ServiceElementTemplate name={service.template} id={getTemplateId(service)} />
                </div>
              )}
              {service.plugins.length > 0 && (
                <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
                  <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Plugins: </span>
                  {service.plugins.map(plugin => <ServiceElementPlugin key={plugin.name} name={plugin.name} id={getPluginId(plugin, service)} />)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </BorderedBox>
  )
}

ServiceElement.propTypes = {
  /**
   * id
    */
  id: PropTypes.string,
  /**
   * services
    */
  services: PropTypes.array,
  /**
   * applicationEntrypoint
    */
  applicationEntrypoint: PropTypes.bool,
  /**
   * applicationStatus
    */
  applicationStatus: PropTypes.oneOf([STATUS_RUNNING, STATUS_STOPPED]),
  /**
   * onClickScalarIntegration
    */
  onClickScalarIntegration: PropTypes.func

}

ServiceElement.defaultProps = {
  id: {},
  services: [],
  applicationEntrypoint: false,
  applicationStatus: STATUS_STOPPED,
  onClickScalarIntegration: () => {}
}

export default ServiceElement
