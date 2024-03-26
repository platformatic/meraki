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
import { getApiApplications, onReceivedTemplateId } from '~/api'
import { isDevMode } from '~/utils'
import useStackablesStore from '~/useStackablesStore'

function App ({ path }) {
  const globalState = useStackablesStore()
  const {
    reloadApplications,
    setApplications,
    setReloadApplications,
    resetWizardState,
    useTemplateId,
    setUseTemplateId
  } = globalState
  const [currentBodyComponent, setCurrentBodyComponent] = useState(null)
  const [showCreateNewAppHeader, setShowCreateNewAppHeader] = useState(true)
  const [showModalImportApplication, setShowModalImportApplication] = useState(false)
  const [showModalCreateApplication, setShowModalCreateApplication] = useState(false)
  const featureFlag = isDevMode()
  const [showErrorComponent, setShowErrorComponent] = useState(false)

  useEffect(() => {
    onReceivedTemplateId((_, templateIdReceived) => {
      if (templateIdReceived && useTemplateId === null) {
        setUseTemplateId(templateIdReceived)
      }
    })

    return () => setUseTemplateId(null)
  }, [])

  const {
    ErrorBoundary,
    error
  } = useErrorBoundary({
    onDidCatch: (error) => {
      setShowErrorComponent(true)
      log.error(error)
    }
  })
  const [showWelcomePage, setShowWelcomePage] = useState(true)

  useEffect(() => {
    if (reloadApplications) {
      async function getApplications () {
        try {
          setApplications([])
          const allApplications = await getApiApplications()
          if (allApplications.length > 0) {
            setApplications(allApplications)
            setShowWelcomePage(false)
          } else {
            setShowWelcomePage(true)
          }
        } catch (error) {
          console.error(`Error on catch ${error}`)
        } finally {
          setReloadApplications(false)
        }
      }
      getApplications()
    }
  }, [reloadApplications])

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

  useEffect(() => {
    if (path === HOME_PATH && useTemplateId !== null) {
      setShowModalCreateApplication(true)
    }
  }, [path, useTemplateId])

  function handleImportApplication () {
    setShowModalImportApplication(false)
    // setCurrentBodyComponent(<HomeContainer />)
    setShowCreateNewAppHeader(true)
    setReloadApplications(true)
    setShowWelcomePage(false)
  }

  function handleCreateApplication () {
    setShowModalCreateApplication(false)
    // setCurrentBodyComponent(<HomeContainer />)
    setShowCreateNewAppHeader(true)
    setReloadApplications(true)
    setShowWelcomePage(false)
    resetWizardState()
  }

  function handleCloseModalCreateApplication () {
    setShowModalCreateApplication(false)
    resetWizardState()
  }

  return showErrorComponent
    ? (
      <ErrorComponent error={error} message={error.message} onClickDismiss={() => setShowErrorComponent(false)} />
      )
    : (
      <ErrorBoundary>
        <div className={featureFlag ? 'rootV1' : 'rootV0'}>
          <Header
            showCreateNewApp={featureFlag && showCreateNewAppHeader}
            onClickCreateNewApp={() => setShowModalCreateApplication(true)}
            onClickImportApp={() => setShowModalImportApplication(true)}
          />
          {featureFlag ? currentBodyComponent : <Wizard useVersion='0' />}
        </div>
        {showModalImportApplication && (
          <ImportApplicationFlow
            onCloseModal={() => setShowModalImportApplication(false)}
            onClickConfirm={() => handleImportApplication()}
          />
        )}
        {showModalCreateApplication && (
          <CreateApplicationFlow
            onCloseModal={() => handleCloseModalCreateApplication()}
            onClickGoToApps={() => handleCreateApplication()}
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
