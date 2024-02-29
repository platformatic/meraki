'use strict'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import { HOME_PATH, APPLICATION_PATH } from '~/ui-constants'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <Routes>
      <Route
        path={HOME_PATH}
        element={<App path={HOME_PATH} />}
      />
      <Route
        path={APPLICATION_PATH}
        element={<App path={APPLICATION_PATH} />}
      />
    </Routes>
  </HashRouter>
)
