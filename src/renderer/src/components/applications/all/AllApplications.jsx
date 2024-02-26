'use strict'
import PropTypes from 'prop-types'
import styles from './AllApplications.module.css'
import TopContent from './TopContent'
import Table from './Table'
import { getApiApplications } from '~/api'
import React, { useEffect, useState } from 'react'
import ErrorComponent from '~/components/screens/ErrorComponent'

const AllApplications = React.forwardRef(({ onClickCreateNewApp }, ref) => {
  const [showErrorComponent, setShowErrorComponent] = useState(false)
  const [applications, setApplications] = useState([])
  const [applicationsLoaded, setApplicationsLoaded] = useState(false)
  const [runningApps, setRunningApps] = useState('-')
  const [stoppedApps, setStoppedApps] = useState('-')

  useEffect(() => {
    if (!applicationsLoaded) {
      async function getApplications () {
        try {
          setApplications([])
          const allApplications = await getApiApplications()
          if (allApplications.length > 0) {
            setApplications(allApplications)
            setStoppedApps(allApplications.filter(a => a.status === 'stopped').length)
            setRunningApps(allApplications.filter(a => a.status === 'running').length)
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
          <Table
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
