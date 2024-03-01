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
import { HOME_PATH, APPLICATION_PATH } from '~/ui-constants'
import ImportApplicationFlow from '~/components/application/import/ImportApplicationFlow'
import CreateApplicationFlow from '~/components/application/create/CreateApplicationFlow'
/* import Welcome from '~/components/welcome/Welcome' */

function App ({ path }) {
  const [currentBodyComponent, setCurrentBodyComponent] = useState(<HomeContainer />)
  const [showCreateNewAppHeader, setShowCreateNewAppHeader] = useState(true)
  const [showModalImportApplication, setShowModalImportApplication] = useState(false)
  const [showModalCreateApplication, setShowModalCreateApplication] = useState(false)
  /* <Welcome
      ref={useRef(null)}
      key={PAGE_WELCOME}
      onClickImportApp={() => setShowModalImportApplication(true)}
    /> */
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

  useEffect(() => {
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
  }, [path])

  function handleImportApplication () {
    setShowModalImportApplication(false)
    // setCurrentPage(PAGE_RECENT_APPS)
  }

  return didCatch
    ? (
      <ErrorComponent message={error.message} />
      )
    : (
      <ErrorBoundary>
        <div className={featureFlag ? 'rootFeatureFlag' : 'rootNormal'}>
          <Header
            showCreateNewApp={featureFlag && showCreateNewAppHeader}
            onClickCreateNewApp={() => setShowModalCreateApplication(true)}
            onClickImportApp={() => setShowModalImportApplication(true)}
          />
          {featureFlag ? currentBodyComponent : <Wizard />}
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
