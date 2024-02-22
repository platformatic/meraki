'use strict'
import './App.css'
import Header from './layout/Header'
import Wizard from './components/Wizard'
import log from 'electron-log/renderer'
import useErrorBoundary from 'use-error-boundary'
import ErrorComponent from './components/errors/ErrorComponent'
import ApplicationContainer from './components/ApplicationContainer'

function App () {
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

  return didCatch
    ? (
      <ErrorComponent message={error.message} />
      )
    : (
      <ErrorBoundary>
        <Header />
        {featureFlag ? <ApplicationContainer /> : <Wizard />}
      </ErrorBoundary>
      )
}

export default App
