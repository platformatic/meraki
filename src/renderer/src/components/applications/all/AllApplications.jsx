'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './AllApplications.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import TopContent from './TopContent'
import TableAll from './TableAll'
import { getApiApplications } from '~/api'
import ErrorComponent from '~/components/screens/ErrorComponent'
import useStackablesStore from '~/useStackablesStore'
import { HOME_PATH, PAGE_ALL_APPS } from '~/ui-constants'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@platformatic/ui-components'
import { MODAL_POPUP_V2 } from '@platformatic/ui-components/src/components/constants'
import DeleteApplication from '~/components/application/DeleteApplication'

const AllApplications = React.forwardRef(({ onClickCreateNewApp }, ref) => {
  const globalState = useStackablesStore()
  const { setNavigation, setCurrentPage } = globalState
  const [showErrorComponent, setShowErrorComponent] = useState(false)
  const [showModalDeleteApplication, setShowModalDeleteApplication] = useState(false)
  const [applicationSelected, setApplicatinSelected] = useState(null)
  const [applications, setApplications] = useState([])
  const [applicationsLoaded, setApplicationsLoaded] = useState(false)
  const [runningApps, setRunningApps] = useState('-')
  const [stoppedApps, setStoppedApps] = useState('-')
  const navigate = useNavigate()

  useEffect(() => {
    setNavigation({
      label: 'All Apps',
      handleClick: () => {
        navigate(HOME_PATH)
        setCurrentPage(PAGE_ALL_APPS)
      },
      key: PAGE_ALL_APPS,
      page: PAGE_ALL_APPS
    })
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

  function handleDeleteApplication (applicationSelected) {
    setApplicatinSelected(applicationSelected)
    setShowModalDeleteApplication(true)
  }

  function handleCloseModalDeleteApplication () {
    setApplicatinSelected(null)
    setShowModalDeleteApplication(false)
  }

  function handleConfirmDeleteApplication () {
    // TODO: call applicationSelected delete
    handleCloseModalDeleteApplication()
  }

  return showErrorComponent
    ? <ErrorComponent />
    : (
      <>
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
              onDeleteApplication={handleDeleteApplication}
            />
          </div>
        </div>
        {showModalDeleteApplication && (
          <Modal
            key='deleteApplicationAll'
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
