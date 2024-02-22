'use strict'
import './App.css'
import Header from './layout/Header'
import Wizard from './components/Wizard'
import log from 'electron-log/renderer'
import useErrorBoundary from 'use-error-boundary'
import ErrorComponent from './components/errors/ErrorComponent'

function App () {
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
        <Wizard />
      </ErrorBoundary>
      )
}

export default App
