'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './GridView.module.css'
import GridElement from './GridElement'

const GridView = React.forwardRef(({
  onClickEditNameService,
  onClickRemoveService,
  onClickViewAll,
  onClickChangeTemplate,
  onClickPluginHandler
}, ref) => {
  const globalState = useStackablesStore()
  const { services } = globalState
  const [gridClassName, setGridClassName] = useState(styles.gridClassName)
  const [contentClassName, setContentClassName] = useState(styles.container)
  const MAX_NUMBER = 5

  useEffect(() => {
    if (services.length > MAX_NUMBER) {
      setGridClassName(`${styles.gridClassName} ${styles.halfWidth}`)
      setContentClassName(`${styles.container}`)
    } else {
      setGridClassName(styles.gridClassName)
      setContentClassName(styles.container)
    }
  }, [services?.length])

  function renderContent () {
    const groupedServices = []
    for (let i = 0; i < services.length; i += MAX_NUMBER) {
      groupedServices.push(services.slice(i, i + MAX_NUMBER))
    }

    return groupedServices.map((group, index) => (
      <div className={gridClassName} key={index}>
        {group.map(service => (
          <GridElement
            key={service.name}
            service={{ ...service }}
            onClickEditNameService={() => onClickEditNameService(service)}
            onClickRemoveService={() => onClickRemoveService(service)}
            onClickViewAll={() => onClickViewAll(service)}
            onClickChangeTemplate={() => onClickChangeTemplate(service)}
            onClickPluginHandler={() => onClickPluginHandler(service)}
          />
        ))}
      </div>
    ))
  }

  return (
    <div className={`${commonStyles.mediumFlexBlock}`}>
      <div className={commonStyles.mediumFlexRow}>
        <h5 className={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}>&nbsp;</h5>
      </div>

      <div className={contentClassName} ref={ref}>
        {renderContent()}
      </div>
    </div>
  )
})

GridView.propTypes = {
  onClickEditNameService: PropTypes.func,
  onClickRemoveService: PropTypes.func,
  onClickViewAll: PropTypes.func,
  onClickChangeTemplate: PropTypes.func,
  onClickPluginHandler: PropTypes.func
}

GridView.defaultProps = {
  onClickEditNameService: () => {},
  onClickRemoveService: () => {},
  onClickViewAll: () => {},
  onClickChangeTemplate: () => {},
  onClickPluginHandler: () => {}
}

export default GridView
