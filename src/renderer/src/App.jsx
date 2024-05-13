'use strict'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import '~/App.css'
import Header from '~/layout/Header'
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
import useStackablesStore from '~/useStackablesStore'
import { LoadingSpinnerV2 } from '@platformatic/ui-components'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import loadingSpinnerStyles from '~/styles/LoadingSpinnerStyles.module.css'

function App ({ path }) {
  const LOADING = 'LOADING'
  const WELCOME_PAGE = 'WELCOME_PAGE'
  const LIST = 'LIST'
  const ERROR = 'ERROR'

  const globalState = useStackablesStore()
  const {
    reloadApplications,
    setApplications,
    setReloadApplications,
    resetWizardState,
    setUseTemplateId
  } = globalState
  const [currentBodyComponent, setCurrentBodyComponent] = useState(null)
  const [showCreateNewAppHeader, setShowCreateNewAppHeader] = useState(true)
  const [showModalImportApplication, setShowModalImportApplication] = useState(false)
  const [showModalCreateApplication, setShowModalCreateApplication] = useState(false)
  const [skipCheckOnAutomaticallyImported, setSkipCheckOnAutomaticallyImported] = useState(false)
  const [showErrorComponent, setShowErrorComponent] = useState(false)
  const [error, setError] = useState(null)
  const {
    ErrorBoundary
  } = useErrorBoundary({
    onDidCatch: (error) => {
      log.error(error)
      setError(error)
      setShowErrorComponent(true)
    }
  })
  const [showComponent, setShowComponent] = useState(LOADING)
  const [intervalPoll, setIntervalPoll] = useState(null)

  useEffect(() => {
    if (reloadApplications) {
      async function getApplications () {
        try {
          stopPoll()
          setApplications([])
          const allApplications = await getApiApplications()
          setApplications(allApplications)
          if (allApplications.length === 0 || (!skipCheckOnAutomaticallyImported && allApplications.find(application => !application.automaticallyImported) === undefined)) {
            setShowComponent(WELCOME_PAGE)
          } else {
            setShowComponent(LIST)
          }
          if (!intervalPoll) {
            poll()
          }
        } catch (error) {
          console.error(`Error on catch ${error}`)
          setShowComponent(ERROR)
          setError(error)
          setShowErrorComponent(true)
        } finally {
          setReloadApplications(false)
        }
      }
      getApplications()
    }
  }, [reloadApplications])

  useEffect(() => {
    return () => stopPoll()
  }, [])

  useEffect(() => {
    if (showComponent === LIST) {
      switch (path) {
        case APPLICATION_PATH:
          stopPoll()
          setCurrentBodyComponent(<ApplicationContainer />)
          setShowCreateNewAppHeader(false)
          break
        default:
          setCurrentBodyComponent(<HomeContainer onUseTemplateId={() => setShowModalCreateApplication(true)} />)
          setShowCreateNewAppHeader(true)
          break
      }
    }
    if (showComponent === WELCOME_PAGE) {
      setCurrentBodyComponent(
        <Welcome
          key={PAGE_WELCOME}
          onClickImportApp={() => setShowModalImportApplication(true)}
          onClickCreateNewApp={() => setShowModalCreateApplication(true)}
          onClickGoToApp={() => {
            setSkipCheckOnAutomaticallyImported(true)
            setShowComponent(LIST)
          }}
        />
      )
      setShowCreateNewAppHeader(false)
    }
  }, [showComponent, path])

  function handleImportApplication () {
    setShowModalImportApplication(false)
    // setCurrentBodyComponent(<HomeContainer />)
    setShowCreateNewAppHeader(true)
    setReloadApplications(true)
    setShowComponent(LIST)
  }

  function handleCreateApplication () {
    setShowModalCreateApplication(false)
    // setCurrentBodyComponent(<HomeContainer />)
    setUseTemplateId(null)
    setShowCreateNewAppHeader(true)
    setReloadApplications(true)
    setShowComponent(LIST)
    resetWizardState()
  }

  function handleCloseModalCreateApplication () {
    setShowModalCreateApplication(false)
    setUseTemplateId(null)
    resetWizardState()
  }

  function poll () {
    const intervalId = setInterval(async () => {
      setApplications([])
      const allApplications = await getApiApplications()
      setApplications(allApplications)
    }, 2000)
    setIntervalPoll(intervalId)
  }

  function stopPoll () {
    clearInterval(intervalPoll)
    setIntervalPoll(null)
  }

  if (showComponent === LOADING) {
    return (
      <LoadingSpinnerV2
        loading
        applySentences={{
          containerClassName: `${commonStyles.mediumFlexBlock} ${commonStyles.itemsCenter}`,
          sentences: [{
            style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`,
            text: 'Loading Meraki...'
          }]
        }}
        containerClassName={loadingSpinnerStyles.loadingSpinner}
      />
    )
  }

  return showErrorComponent
    ? (
      <ErrorComponent error={error} message={error.message} onClickDismiss={() => setShowErrorComponent(false)} />
      )
    : (
      <ErrorBoundary>
        <div className='rootV1'>
          <Header
            showCreateNewApp={showCreateNewAppHeader}
            onClickCreateNewApp={() => setShowModalCreateApplication(true)}
            onClickImportApp={() => setShowModalImportApplication(true)}
          />
          {currentBodyComponent}
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
