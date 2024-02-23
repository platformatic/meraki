'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import Title from '~/components/ui/Title'
import useStackablesStore from '~/useStackablesStore'
import { TEMPLATE_WITH_PLUGIN, PLUGINS_3 } from '~/ui-constants'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import PluginButton from '~/components/shaped-components/PluginButton'
import ChangeTemplate from '~/components/shaped-components/ChangeTemplate'
import styles from './ViewAll.module.css'

function ViewAll ({ serviceName }) {
  const globalState = useStackablesStore()
  const { removePlugin, getService } = globalState

  return (
    <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
      <div className={commonStyles.mediumFlexBlock}>
        <Title
          title={serviceName}
          iconName='StackablesPluginIcon'
          dataAttrName='cy'
          dataAttrValue='modal-title'
        />
        <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}><span className={typographyStyles.opacity70}>Plugins selected for this service: (</span>{getService(serviceName).plugins.length}<span className={typographyStyles.opacity70}>)</span></p>
      </div>

      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        <div className={styles.pluginContainer}>
          <TransitionGroup component={null}>
            {getService(serviceName).plugins.map((plugin, index) =>
              <CSSTransition
                key={`changePlugin-${plugin.name}-${getService(serviceName).plugins.length}`}
                timeout={300}
                classNames='fade-vertical'
              >
                <PluginButton
                  key={plugin.name}
                  index={index}
                  {...plugin}
                  heightType={PLUGINS_3}
                  sortable
                  onClickRemove={() => removePlugin(serviceName, plugin.name)}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </div>

        <CSSTransition
          key={`changeTemplate${getService(serviceName).plugins.length}`}
          timeout={300}
          classNames='fade-vertical'
        >
          <ChangeTemplate
            showIcon
            name={getService(serviceName).template.name}
            heightType={TEMPLATE_WITH_PLUGIN}
            useRefForWidth={false}
            clickable={false}
          />
        </CSSTransition>
      </div>
    </div>
  )
}

ViewAll.propTypes = {
  /**
   * serviceName
    */
  serviceName: PropTypes.string.isRequired
}

ViewAll.defaultProps = {}

export default ViewAll
