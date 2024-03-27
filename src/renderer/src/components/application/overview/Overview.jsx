'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './Overview.module.css'
import { HorizontalSeparator } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import { APPLICATION_PAGE_OVERVIEW, PAGE_ALL_APPS, HOME_PATH } from '~/ui-constants'
import TopContent from './TopContent'
import OverviewSection from './OverviewSection'
import ServicesSection from './ServicesSection'
import { MARGIN_0, OPACITY_30, WHITE } from '@platformatic/ui-components/src/components/constants'
import ErrorComponent from '~/components/screens/ErrorComponent'
import { useNavigate } from 'react-router-dom'

const Overview = React.forwardRef(({ onClickEditApplication }, ref) => {
  const globalState = useStackablesStore()
  const { breadCrumbs, setNavigation, setCurrentPage, setReloadApplications } = globalState
  const [showErrorComponent, setShowErrorComponent] = useState(false)
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const applicationSelected = globalState.computed.applicationSelected

  useEffect(() => {
    if (breadCrumbs.length === 0) {
      setNavigation({
        label: 'All Apps',
        handleClick: () => {
          navigate(HOME_PATH)
          setCurrentPage(PAGE_ALL_APPS)
          setReloadApplications(true)
        },
        key: PAGE_ALL_APPS,
        page: PAGE_ALL_APPS
      })
    }
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
            onErrorOccurred={(error) => {
              setError(error)
              setShowErrorComponent(true)
            }}
          />
          <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
          <OverviewSection />
          <HorizontalSeparator
            marginBottom={MARGIN_0}
            marginTop={MARGIN_0}
            color={WHITE}
            opacity={OPACITY_30}
          />
          <ServicesSection
            url={applicationSelected.runtime?.url}
            onClickEditApplication={onClickEditApplication}
          />
        </div>
      </div>
      )
})

Overview.propTypes = {
  /**
   * onClickEditApplication
    */
  onClickEditApplication: PropTypes.func
}

Overview.defaultProps = {
  onClickEditApplication: () => {}
}

export default Overview
