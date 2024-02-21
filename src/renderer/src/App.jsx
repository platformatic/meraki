'use strict'
import './App.css'
import Header from './layout/Header'
import Wizard from './components/Wizard'
import log from 'electron-log/renderer'
import useErrorBoundary from 'use-error-boundary'
import typographyStyles from '~/styles/Typography.module.css'

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

  console.log = log.log
  Object.assign(console, log.functions)

  return didCatch
    ? (
      <p className={`${typographyStyles.desktopBody} ${typographyStyles.textErrorRed}`}>An error has been caught: {error.message}</p>
      )
    : (
      <ErrorBoundary>
        <Header />
        <Wizard />
      </ErrorBoundary>
      )
}

export default App
