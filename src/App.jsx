'use strict'
import { useEffect } from 'react'
import './App.css'
import Header from './layout/Header'
import CreateApplication from './components/steps/CreateApplication'

function App () {
  useEffect(() => {
    document.body.classList.add('body--main-dark-blue')
  })
  return (
    <>
      <Header />
      <CreateApplication />
    </>
  )
}

export default App
