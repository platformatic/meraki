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

function App ({ path }) {
  const [currentBodyComponent, setCurrentBodyComponent] = useState(<HomeContainer />)

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
        break
      default:
        setCurrentBodyComponent(<HomeContainer />)
        break
    }
  }, [path])

  return didCatch
    ? (
      <ErrorComponent message={error.message} />
      )
    : (
      <ErrorBoundary>
        <div className={featureFlag ? 'rootFeatureFlag' : 'rootNormal'}>
          <Header />
          {featureFlag ? currentBodyComponent : <Wizard />}
        </div>
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
