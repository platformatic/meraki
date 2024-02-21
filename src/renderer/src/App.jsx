'use strict'
import './App.css'
import Header from './layout/Header'
import Wizard from './components/Wizard'
import log from 'electron-log/renderer'
import useErrorBoundary from 'use-error-boundary'

function App () {
  const {
    ErrorBoundary,
    didCatch,
    error
  } = useErrorBoundary({
    onDidCatch: (error, errorInfo) => {
      log.error(error, errorInfo)
    }
  })

  console.log = log.log
  Object.assign(console, log.functions)

  return didCatch
    ? (
      <p>An error has been caught: {error.message}</p>
      )
    : (
      <ErrorBoundary>
        <Header />
        <Wizard />
      </ErrorBoundary>
      )
}

export default App
