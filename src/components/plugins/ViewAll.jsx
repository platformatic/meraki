'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import Title from '~/components/ui/Title'
import useStackablesStore from '~/useStackablesStore'
import { HEIGHT_PLUGIN_3 } from '~/ui-constants'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import PluginButton from '~/components/shaped-components/PluginButton'
import ChangeTemplate from '~/components/shaped-components/ChangeTemplate'

function ViewAll ({ onClickTemplate, serviceId }) {
  const globalState = useStackablesStore()
  const { services, removePlugin } = globalState

  return (
    <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
      <div className={commonStyles.mediumFlexBlock}>
        <Title title={services[serviceId].name} iconName='StackablesPluginIcon' />
        <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Plugins selected for this service: ({services[serviceId].plugins.length})</p>
      </div>

      <div className={`${commonStyles.flexBlockNoGap} ${commonStyles.fullWidth}`}>
        <TransitionGroup component={null}>
          {services[serviceId].plugins.map((plugin, index) =>
            <CSSTransition
              key={`changePlugin-${plugin.id}-${services[serviceId].plugins.length}`}
              timeout={300}
              classNames='fade-vertical'
            >
              <PluginButton
                key={plugin.id}
                index={index}
                {...plugin}
                height={HEIGHT_PLUGIN_3}
                sortable
                onClickRemove={() => removePlugin(serviceId, plugin.id)}
              />
            </CSSTransition>
          )}
          <CSSTransition
            key={`changeTemplate${services[serviceId].plugins.length}`}
            timeout={300}
            classNames='fade-vertical'
          >
            <ChangeTemplate
              name={services[serviceId].template.name}
              onClick={() => onClickTemplate()}
              height={175}
            />
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  )
}

ViewAll.propTypes = {
  /**
   * onClickTemplate
    */
  onClickTemplate: PropTypes.func,
  /**
   * serviceId
    */
  serviceId: PropTypes.number.isRequired
}

ViewAll.defaultProps = {
  onClickTemplate: () => {}
}

export default ViewAll
