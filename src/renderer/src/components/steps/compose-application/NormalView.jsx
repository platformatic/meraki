'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import NameService from '~/components/services/NameService'
import PluginHandler from '~/components/plugins/PluginHandler'
import TemplateHandler from '~/components/templates/TemplateHandler'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import commonStyles from '~/styles/CommonStyles.module.css'
import '~/components/component.animation.css'
import styles from './NormalView.module.css'

const NormalView = React.forwardRef(({
  onClickEditNameService,
  onClickRemoveService,
  onClickPluginHandler,
  onClickTemplate,
  onClickViewAll
}, ref) => {
  const globalState = useStackablesStore()
  const { services } = globalState

  return (
    <div className={`${commonStyles.mediumFlexRow} ${commonStyles.itemsStretch}`} ref={ref}>
      {services.map(service => (
        <div className={commonStyles.mediumFlexBlock} key={service.name}>
          <NameService
            name={service.name}
            onClickEdit={() => onClickEditNameService(service)}
            onClickRemove={() => onClickRemoveService(service)}
            removeDisabled={services.length < 2}
          />
          <TransitionGroup component={null}>
            <CSSTransition
              key={`handling-service-${service.id}`}
              timeout={300}
              classNames='template'
            >
              <div
                className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${styles.containerPuzzle}`}
                key={service.id}
              >
                <PluginHandler onClick={() => { onClickPluginHandler(service) }} serviceId={service.id} />
                <TemplateHandler
                  onClickTemplate={() => { onClickTemplate(service) }}
                  onClickViewAll={() => { onClickViewAll(service) }}
                  serviceId={service.id}
                />
              </div>
            </CSSTransition>
          </TransitionGroup>
        </div>
      ))}
    </div>
  )
})

NormalView.propTypes = {
  onClickEditNameService: PropTypes.func,
  onClickRemoveService: PropTypes.func,
  onClickPluginHandler: PropTypes.func,
  onClickTemplate: PropTypes.func,
  onClickViewAll: PropTypes.func
}

NormalView.defaultProps = {
  onClickEditNameService: () => {},
  onClickRemoveService: () => {},
  onClickPluginHandler: () => {},
  onClickTemplate: () => {},
  onClickViewAll: () => {}
}

export default NormalView
