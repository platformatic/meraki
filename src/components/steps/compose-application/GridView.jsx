'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import useStackablesStore from '~/useStackablesStore'
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
    <div className={styles.gridClassName} ref={ref}>
      {services.map(service => (
        <GridElement
          key={service.id}
          service={{ ...service }}
          onClickEditNameService={() => onClickEditNameService(service)}
          onClickRemoveService={() => onClickRemoveService(service)}
          onClickViewAll={() => onClickViewAll(service)}
        />
      ))}
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
