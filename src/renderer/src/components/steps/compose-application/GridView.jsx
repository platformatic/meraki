'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './GridView.module.css'
import GridElement from './GridElement'

const GridView = React.forwardRef(({
  onClickEditNameService,
  onClickRemoveService,
  onClickViewAll
}, ref) => {
  const globalState = useStackablesStore()
  const { services } = globalState

  return (
    <div className={`${commonStyles.mediumFlexBlock}`}>
      <div className={commonStyles.mediumFlexRow}>
        <h5 className={`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite}`}>&nbsp;</h5>
      </div>

      <div className={styles.gridClassName} ref={ref}>
        {services.map(service => (
          <GridElement
            key={service.name}
            service={{ ...service }}
            onClickEditNameService={() => onClickEditNameService(service)}
            onClickRemoveService={() => onClickRemoveService(service)}
            onClickViewAll={() => onClickViewAll(service)}
          />
        ))}
      </div>
    </div>

  )
})

GridView.propTypes = {
  onClickEditNameService: PropTypes.func,
  onClickRemoveService: PropTypes.func,
  onClickViewAll: PropTypes.func
}

GridView.defaultProps = {
  onClickEditNameService: () => {},
  onClickRemoveService: () => {},
  onClickViewAll: () => {}
}

export default GridView
