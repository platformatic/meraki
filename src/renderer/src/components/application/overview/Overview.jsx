'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './Overview.module.css'
import { HorizontalSeparator } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import { APPLICATION_PAGE_OVERVIEW /*, APPLICATION_PATH */ } from '~/ui-constants'
import TopContent from './TopContent'
import OverviewSection from './OverviewSection'
import ServicesSection from './ServicesSection'
import { MARGIN_0, OPACITY_30, WHITE } from '@platformatic/ui-components/src/components/constants'
import ErrorComponent from '~/components/screens/ErrorComponent'

const Overview = React.forwardRef(({ applicationSelected, onClickEditApplication }, ref) => {
  const globalState = useStackablesStore()
  const { setNavigation, setCurrentPage } = globalState
  const [showErrorComponent, setShowErrorComponent] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setNavigation({
      label: applicationSelected.name,
      handleClick: () => {
        setCurrentPage(APPLICATION_PAGE_OVERVIEW)
      },
      key: APPLICATION_PAGE_OVERVIEW,
      page: APPLICATION_PAGE_OVERVIEW
    }, 1)
  }, [])

  return showErrorComponent
    ? <ErrorComponent error={error} message={error.message} onClickDismiss={() => setShowErrorComponent(false)} />
    : (
      <div className={styles.container} ref={ref}>
        <div className={styles.content}>
          <TopContent
            applicationSelected={applicationSelected}
            onErrorOccurred={(error) => {
              setError(error)
              setShowErrorComponent(true)
            }}
          />
          <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
          <OverviewSection applicationSelected={applicationSelected} />
          <HorizontalSeparator
            marginBottom={MARGIN_0}
            marginTop={MARGIN_0}
            color={WHITE}
            opacity={OPACITY_30}
          />
          <ServicesSection
            id={applicationSelected.id}
            services={applicationSelected.services}
            entrypoint={applicationSelected.entrypoint}
            onClickEditApplication={onClickEditApplication}
          />
        </div>
      </div>
      )
})

Overview.propTypes = {
  /**
   * applicationSelected
    */
  applicationSelected: PropTypes.object,
  /**
   * onClickEditApplication
    */
  onClickEditApplication: PropTypes.func
}

Overview.defaultProps = {
  applicationSelected: {},
  onClickEditApplication: () => {}
}

export default Overview
