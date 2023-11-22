'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import commonStyles from '~/styles/CommonStyles.module.css'
import Routes from '~/components/shaped-components/Routes'
import AddPlugin from '~/components/shaped-components/AddPlugin'

const PluginAndRoutes = React.forwardRef(({ onClickAddPlugin }, ref) => {
  return (
    <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`} ref={ref}>
      <Routes />
      <AddPlugin onClick={() => onClickAddPlugin()} />
    </div>
  )
})

PluginAndRoutes.propTypes = {
  /**
   * onClick
    */
  onClickAddPlugin: PropTypes.func
}

PluginAndRoutes.defaultProps = {
  onClickAddPlugin: () => {}
}

export default PluginAndRoutes
