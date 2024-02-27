'use strict'
import PropTypes from 'prop-types'
import styles from './RecentApplications.module.css'
import TopContent from './TopContent'
import TableRecent from './TableRecent'
import { getApiApplications } from '~/api'
import React, { useEffect, useState } from 'react'
import ErrorComponent from '~/components/screens/ErrorComponent'

const RecentApplications = React.forwardRef(({ onClickCreateNewApp }, ref) => {
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
          let keyA, keyB
          const applications = await getApiApplications()
          if (applications.length > 0) {
            const recentApplications = applications.sort((a, b) => {
              keyA = new Date(b.lastUpdate)
              keyB = new Date(a.lastUpdate)
              if (keyA < keyB) {
                return 1
              }
              if (keyA > keyB) {
                return -1
              }
              return 0
            }).slice(-5)
            setApplications(recentApplications)
            setStoppedApps(recentApplications.filter(a => a.status === 'stopped').length)
            setRunningApps(recentApplications.filter(a => a.status === 'running').length)
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
            runningApps={runningApps}
            stoppedApps={stoppedApps}
          />
          <TableRecent
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

RecentApplications.propTypes = {
  /**
     * onClickCreateNewApp
     */
  onClickCreateNewApp: PropTypes.func
}

RecentApplications.defaultProps = {
  onClickCreateNewApp: () => {}
}

export default RecentApplications
