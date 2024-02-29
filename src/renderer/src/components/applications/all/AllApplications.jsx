'use strict'
import PropTypes from 'prop-types'
import styles from './AllApplications.module.css'
import TopContent from './TopContent'
import TableAll from './TableAll'
import { getApiApplications } from '~/api'
import React, { useEffect, useState } from 'react'
import ErrorComponent from '~/components/screens/ErrorComponent'
import useStackablesStore from '~/useStackablesStore'

import { PAGE_ALL_APPS } from '~/ui-constants'

const AllApplications = React.forwardRef(({ onClickCreateNewApp }, ref) => {
  const globalState = useStackablesStore()
  const { setNavigation } = globalState
  const [showErrorComponent, setShowErrorComponent] = useState(false)
  const [applications, setApplications] = useState([])
  const [applicationsLoaded, setApplicationsLoaded] = useState(false)
  const [runningApps, setRunningApps] = useState('-')
  const [stoppedApps, setStoppedApps] = useState('-')

  useEffect(() => {
    setNavigation({ label: 'All Apps', link: PAGE_ALL_APPS, key: PAGE_ALL_APPS })
  }, [])

  useEffect(() => {
    if (!applicationsLoaded) {
      async function getApplications () {
        try {
          setApplications([])
          const allApplications = await getApiApplications()
          if (allApplications.length > 0) {
            const myReworkedApplications = allApplications.map(application => {
              application.status = {
                value: application.status,
                label: application.status.charAt(0).toUpperCase() + application.status.slice(1)
              }
              return application
            })
            setApplications(myReworkedApplications)
            setStoppedApps(allApplications.filter(a => a.status.value === 'stopped').length)
            setRunningApps(allApplications.filter(a => a.status.value === 'running').length)
          } else {
            // no applications
          }
        } catch (error) {
          setShowErrorComponent(true)
          console.error(`Error on catch ${error}`)
        } finally {
          setApplicationsLoaded(true)
        }
      }
      getApplications()
    }
  }, [applicationsLoaded])

  function handleStopApplication () {
    setApplicationsLoaded(false)
  }

  function handleStartApplication () {
    setApplicationsLoaded(false)
  }

  function handleRestartApplication () {
    setApplicationsLoaded(false)
  }

  return showErrorComponent
    ? <ErrorComponent />
    : (
      <div className={styles.container} ref={ref}>
        <div className={styles.content}>
          <TopContent
            totalApps={applications.length || '-'}
            runningApps={runningApps}
            stoppedApps={stoppedApps}
          />
          <TableAll
            applicationsLoaded={applicationsLoaded}
            applications={applications}
            onStopApplication={handleStopApplication}
            onStartApplication={handleStartApplication}
            onRestartApplication={handleRestartApplication}
            onErrorOccurred={() => setShowErrorComponent(true)}
            onClickCreateNewApp={() => onClickCreateNewApp()}
          />
        </div>
      </div>
      )
})

AllApplications.propTypes = {
  /**
     * onClickCreateNewApp
     */
  onClickCreateNewApp: PropTypes.func
}

AllApplications.defaultProps = {
  onClickCreateNewApp: () => {}
}

export default AllApplications
