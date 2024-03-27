'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './RecentApplications.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import TopContent from './TopContent'
import TableRecent from './TableRecent'
import { callStartApplication, callStopApplication, callDeleteApplication } from '~/api'
import ErrorComponent from '~/components/screens/ErrorComponent'
import useStackablesStore from '~/useStackablesStore'
import { HOME_PATH, PAGE_RECENT_APPS, STATUS_RUNNING, STATUS_STOPPED } from '~/ui-constants'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@platformatic/ui-components'
import { MODAL_POPUP_V2 } from '@platformatic/ui-components/src/components/constants'
import DeleteApplication from '~/components/application/DeleteApplication'

const RecentApplications = React.forwardRef(({ onClickCreateNewApp }, ref) => {
  const globalState = useStackablesStore()
  const { applications, setNavigation, setCurrentPage, reloadApplications, setReloadApplications, setApplicationsSelected } = globalState
  const [showErrorComponent, setShowErrorComponent] = useState(false)
  const [error, setError] = useState(null)
  const [localApplications, setLocalApplications] = useState([])
  const [applicationsLoaded, setApplicationsLoaded] = useState(false)
  const [runningApps, setRunningApps] = useState('-')
  const [stoppedApps, setStoppedApps] = useState('-')
  const [showModalDeleteApplication, setShowModalDeleteApplication] = useState(false)
  const [applicationSelected, setApplicationSelected] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setNavigation({
      label: 'Recent Apps',
      handleClick: () => {
        navigate(HOME_PATH)
        setCurrentPage(PAGE_RECENT_APPS)
        setReloadApplications(true)
      },
      key: PAGE_RECENT_APPS,
      page: PAGE_RECENT_APPS
    })
  }, [])

  useEffect(() => {
    if (!reloadApplications && applications.length > 0) {
      function getApplications () {
        setApplicationsLoaded(false)
        setLocalApplications([])
        setTimeout(() => {
          let keyA, keyB
          const recentApplications = [...applications].sort((a, b) => {
            keyA = new Date(b.lastUpdated)
            keyB = new Date(a.lastUpdated)
            if (keyA < keyB) {
              return 1
            }
            if (keyA > keyB) {
              return -1
            }
            return 0
          }).slice(-5)
          setLocalApplications(recentApplications)
          setStoppedApps(recentApplications.filter(a => a.status === STATUS_STOPPED).length)
          setRunningApps(recentApplications.filter(a => a.status === STATUS_RUNNING).length)
          setApplicationsLoaded(true)
        }, 100)
      }
      getApplications()
    }
  }, [reloadApplications, applications])

  async function handleStopApplication (id) {
    try {
      const tmp = {}
      tmp[id] = await callStopApplication(id)
      setApplicationsSelected(tmp)
      setReloadApplications(true)
    } catch (error) {
      console.error(`Error on callStopApplication ${error}`)
      setShowErrorComponent(true)
      setError(error)
    }
  }

  async function handleStartApplication (id) {
    try {
      const tmp = {}
      tmp[id] = await callStartApplication(id)
      setApplicationsSelected(tmp)
      setReloadApplications(true)
    } catch (error) {
      console.error(`Error on callStartApplication ${error}`)
      setShowErrorComponent(true)
      setError(error)
    }
  }

  async function handleRestartApplication (id, status) {
    try {
      if (STATUS_RUNNING === status) {
        await callStopApplication(id)
      }
      const tmp = {}
      tmp[id] = await callStartApplication(id)
      setApplicationsSelected(tmp)
      setReloadApplications(true)
    } catch (error) {
      console.error(`Error on handleRestartApplication ${error}`)
      setShowErrorComponent(true)
      setError(error)
    }
  }

  function handleDeleteApplication (applicationSelected) {
    setApplicationSelected(applicationSelected)
    setShowModalDeleteApplication(true)
  }

  function handleCloseModalDeleteApplication () {
    setApplicationSelected(null)
    setShowModalDeleteApplication(false)
  }

  async function handleConfirmDeleteApplication () {
    try {
      await callDeleteApplication(applicationSelected.id)
      handleCloseModalDeleteApplication()
      setReloadApplications(true)
    } catch (error) {
      console.error(`Error on handleConfirmDeleteApplication ${error}`)
    }
  }

  return showErrorComponent
    ? <ErrorComponent error={error} onClickDismiss={() => setShowErrorComponent(false)} />
    : (
      <>
        <div className={styles.container} ref={ref}>
          <div className={styles.content}>
            <TopContent
              runningApps={runningApps}
              stoppedApps={stoppedApps}
            />
            <TableRecent
              applicationsLoaded={applicationsLoaded}
              applications={localApplications}
              onStopApplication={(id) => handleStopApplication(id)}
              onStartApplication={(id) => handleStartApplication(id)}
              onRestartApplication={(id, status) => handleRestartApplication(id, status)}
              onDeleteApplication={handleDeleteApplication}
              onErrorOccurred={() => setShowErrorComponent(true)}
              onClickCreateNewApp={() => onClickCreateNewApp()}
            />
          </div>
        </div>
        {showModalDeleteApplication && (
          <Modal
            key='deleteApplicationRecent'
            setIsOpen={() => handleCloseModalDeleteApplication()}
            title='Delete Application'
            titleClassName={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}
            layout={MODAL_POPUP_V2}
          >
            <DeleteApplication
              name={applicationSelected.name}
              onClickCancel={() => handleCloseModalDeleteApplication()}
              onClickConfirm={() => handleConfirmDeleteApplication()}
            />
          </Modal>
        )}
      </>
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
