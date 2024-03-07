'use strict'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './Overview.module.css'
import { HorizontalSeparator } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import { APPLICATION_PAGE_OVERVIEW /*, APPLICATION_PATH */ } from '~/ui-constants'
import TopContent from './TopContent'
import OverviewSection from './OverviewSection'
import ServicesSection from './ServicesSection'
import { MARGIN_0, OPACITY_30, WHITE } from '@platformatic/ui-components/src/components/constants'

const Overview = React.forwardRef(({ applicationSelected }, ref) => {
  const globalState = useStackablesStore()
  const { setNavigation, setCurrentPage } = globalState

  useEffect(() => {
    setNavigation({
      label: applicationSelected.name,
      handleClick: () => {
        // navigate(APPLICATION_PATH.replace(':id', applicationSelected.id))
        setCurrentPage(APPLICATION_PAGE_OVERVIEW)
      },
      key: APPLICATION_PAGE_OVERVIEW,
      page: APPLICATION_PAGE_OVERVIEW
    }, 1)
  }, [])

  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.content}>
        <TopContent applicationSelected={applicationSelected} />
        <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
        <OverviewSection applicationSelected={applicationSelected} />
        <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
        <ServicesSection id={applicationSelected.id} services={applicationSelected.services} />
      </div>
    </div>
  )
})

Overview.propTypes = {
  /**
   * applicationSelected
    */
  applicationSelected: PropTypes.object
}

Overview.defaultProps = {
  applicationSelected: {}
}

export default Overview
