'use strict'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import '~/App.css'
import Header from '~/layout/Header'
import Wizard from '~/components/Wizard'
import log from 'electron-log/renderer'
import useErrorBoundary from 'use-error-boundary'
import ErrorComponent from '~/components/screens/ErrorComponent'
import ApplicationContainer from '~/components/ApplicationContainer'
import HomeContainer from '~/components/HomeContainer'
import { HOME_PATH, APPLICATION_PATH, PAGE_WELCOME } from '~/ui-constants'
import ImportApplicationFlow from '~/components/application/import/ImportApplicationFlow'
import CreateApplicationFlow from '~/components/application/create/CreateApplicationFlow'
import Welcome from '~/components/welcome/Welcome'
import { getApiApplications } from '~/api'

function App ({ path }) {
  const [currentBodyComponent, setCurrentBodyComponent] = useState(null)
  const [showCreateNewAppHeader, setShowCreateNewAppHeader] = useState(true)
  const [showModalImportApplication, setShowModalImportApplication] = useState(false)
  const [showModalCreateApplication, setShowModalCreateApplication] = useState(false)
  const featureFlag = import.meta.env.VITE_DEV_FF
  const {
    ErrorBoundary,
    didCatch,
    error
  } = useErrorBoundary({
    onDidCatch: (error) => {
      log.error(error)
    }
  })
  const [showWelcomePage, setShowWelcomePage] = useState(true)
  const [applicationsLoaded, setApplicationsLoaded] = useState(false)

  useEffect(() => {
    if (!applicationsLoaded) {
      async function getApplications () {
        try {
          const allApplications = await getApiApplications()
          if (allApplications.length > 0) {
            setShowWelcomePage(false)
          } else {
            setShowWelcomePage(true)
          }
        } catch (error) {
          console.error(`Error on catch ${error}`)
        } finally {
          setApplicationsLoaded(true)
        }
      }
      getApplications()
    }
  }, [applicationsLoaded])

  useEffect(() => {
    if (!showWelcomePage) {
      switch (path) {
        case APPLICATION_PATH:
          setCurrentBodyComponent(<ApplicationContainer />)
          setShowCreateNewAppHeader(false)
          break
        default:
          setCurrentBodyComponent(<HomeContainer />)
          setShowCreateNewAppHeader(true)
          break
      }
    } else {
      setCurrentBodyComponent(
        <Welcome
          key={PAGE_WELCOME}
          onClickImportApp={() => setShowModalImportApplication(true)}
          onClickCreateNewApp={() => setShowModalCreateApplication(true)}
        />
      )
      setShowCreateNewAppHeader(false)
    }
  }, [showWelcomePage, path])

  function handleImportApplication () {
    setShowModalImportApplication(false)
    setCurrentBodyComponent(<HomeContainer />)
    setShowCreateNewAppHeader(true)
  }

  return didCatch
    ? (
      <ErrorComponent error={error} message={error.message} />
      )
    : (
      <ErrorBoundary>
        <div className={featureFlag ? 'rootV1' : 'rootV0'}>
          <Header
            showCreateNewApp={featureFlag && showCreateNewAppHeader}
            onClickCreateNewApp={() => setShowModalCreateApplication(true)}
            onClickImportApp={() => setShowModalImportApplication(true)}
          />
          {featureFlag ? currentBodyComponent : <Wizard useClassVersion='wizardContentV0' />}
        </div>
        {showModalImportApplication && (
          <ImportApplicationFlow
            onCloseModal={() => setShowModalImportApplication(false)}
            onClickConfirm={() => handleImportApplication()}
          />
        )}
        {showModalCreateApplication && (
          <CreateApplicationFlow
            onCloseModal={() => setShowModalCreateApplication(false)}
            onClickConfirm={() => handleImportApplication()}
          />
        )}
      </ErrorBoundary>
      )
}

App.propTypes = {
  /**
   * path
    */
  path: PropTypes.string
}

App.defaultProps = {
  path: HOME_PATH
}

export default App
