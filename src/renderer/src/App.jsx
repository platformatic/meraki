'use strict'
import './App.css'
import Header from './layout/Header'
import Wizard from './components/Wizard'

function App () {
  const searchParams = new URLSearchParams(document.location.search)
  console.log('searchParams templateId', searchParams.get('templateId'))

  return (
    <>
      <Header />
      <Wizard />
    </>
  )
}

export default App
