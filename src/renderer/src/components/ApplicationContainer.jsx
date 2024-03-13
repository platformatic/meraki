'use strict'
import { useRef, useState, useEffect } from 'react'
import {
  APPLICATION_PAGE_OVERVIEW,
  APPLICATION_PAGE_METRICS,
  APPLICATION_PAGE_LOGS,
  APPLICATION_PAGE_ENV_VAR,
  BREAKPOINTS_HEIGHT_LG,
  HEIGHT_LG,
  HEIGHT_MD
} from '~/ui-constants'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './ApplicationContainer.module.css'
import '~/components/component.animation.css'
import useWindowDimensions from '~/hooks/useWindowDimensions'
import Overview from '~/components/application/overview/Overview'
import Metrics from '~/components/application/metrics/Metrics'
import ApplicationLogs from '~/components/application/application-logs/ApplicationLogs'
import EnvironmentVariables from '~/components/application/environment-variables/EnvironmentVariables'
import EditApplicationFlow from '~/components/application/edit/EditApplicationFlow'
import SideBar from '~/components/ui/SideBar'
import { useParams } from 'react-router-dom'
import { callOpenApplication } from '~/api'
import { LoadingSpinnerV2 } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'

function ApplicationContainer () {
  const globalState = useStackablesStore()
  const { currentPage, setCurrentPage, resetWizardState } = globalState
  const { appId } = useParams()
  const [innerLoading, setInnerLoading] = useState(true)
  const [applicationSelected, setApplicationSelected] = useState(null)
  const [cssClassNames] = useState('scroll-down')
  // const [currentPage, setCurrentPage] = useState(null)
  const overViewRef = useRef(null)
  const applicationLogsRef = useRef(null)
  const metricRef = useRef(null)
  const envVarRef = useRef(null)
  const [components, setComponents] = useState([])
  const [currentComponent, setCurrentComponent] = useState(null)
  const { height: innerHeight } = useWindowDimensions()
  const [showModalEditApplicationFlow, setShowModalEditApplicationFlow] = useState(false)

  useEffect(() => {
    if (appId) {
      async function getApplication () {
        const applicationSelected = await callOpenApplication(appId)
        setApplicationSelected(applicationSelected)
      }
      getApplication()
    }
  }, [appId])

  useEffect(() => {
    if (applicationSelected !== null) {
      setComponents([
        <Overview
          ref={overViewRef}
          key={APPLICATION_PAGE_OVERVIEW}
          applicationSelected={applicationSelected}
          onClickEditApplication={() => setShowModalEditApplicationFlow(true)}
        />,
        <ApplicationLogs
          ref={applicationLogsRef}
          key={APPLICATION_PAGE_LOGS}
          applicationSelected={applicationSelected}
        />,
        <Metrics
          ref={metricRef}
          key={APPLICATION_PAGE_METRICS}
          applicationSelected={applicationSelected}
        />,
        <EnvironmentVariables
          ref={envVarRef}
          key={APPLICATION_PAGE_ENV_VAR}
          services={applicationSelected.services}
        />
      ])
    }
  }, [applicationSelected])

  useEffect(() => {
    if (components.length > 0) {
      setCurrentComponent(components.find(component => component.key === APPLICATION_PAGE_OVERVIEW))
      setCurrentPage(APPLICATION_PAGE_OVERVIEW)
      setInnerLoading(false)
    }
  }, [components.length])

  useEffect(() => {
    if (innerHeight > BREAKPOINTS_HEIGHT_LG) {
      document.documentElement.style.setProperty('--compose-application-height', HEIGHT_LG)
    } else {
      document.documentElement.style.setProperty('--compose-application-height', HEIGHT_MD)
    }
  }, [innerHeight])

  useEffect(() => {
    setCurrentComponent(components.find(component => component.key === currentPage))
  }, [currentPage])

  function handleCloseEditApplicationFlow () {
    setShowModalEditApplicationFlow(false)
    resetWizardState()
  }

  function handleSuccessfulEditApplicationFlow () {
    setShowModalEditApplicationFlow(false)
    resetWizardState()
  }

  function renderComponent () {
    if (innerLoading) {
      return (
        <LoadingSpinnerV2
          loading
          applySentences={{
            containerClassName: `${commonStyles.mediumFlexBlock} ${commonStyles.itemsCenter}`,
            sentences: [{
              style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`,
              text: 'Loading yours application....'
            }, {
              style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`,
              text: 'This process will just take a few seconds.'
            }]
          }}
          containerClassName={styles.loadingSpinner}
        />
      )
    }

    return (
      <>
        <div className={styles.content}>
          <SideBar
            selected={currentPage}
            topItems={[{
              name: APPLICATION_PAGE_OVERVIEW,
              label: 'Overview',
              iconName: 'AppDetailsIcon',
              onClick: () => setCurrentPage(APPLICATION_PAGE_OVERVIEW)
            }, {
              name: APPLICATION_PAGE_METRICS,
              label: 'Metrics',
              iconName: 'MetricsIcon',
              onClick: () => setCurrentPage(APPLICATION_PAGE_METRICS)
            }, {
              name: APPLICATION_PAGE_LOGS,
              label: 'Logs',
              iconName: 'CodeTestingIcon',
              onClick: () => setCurrentPage(APPLICATION_PAGE_LOGS)
            }, {
              name: APPLICATION_PAGE_ENV_VAR,
              label: 'Environment Variables',
              iconName: 'AppConfigurationIcon',
              onClick: () => setCurrentPage(APPLICATION_PAGE_ENV_VAR)
            }]}
            bottomItems={[{
              label: 'Edit App',
              iconName: 'AppEditIcon',
              onClick: () => setShowModalEditApplicationFlow(true)
            }]}
          />
          <SwitchTransition>
            <CSSTransition
              key={currentComponent.key}
              nodeRef={currentComponent.ref}
              timeout={300}
              classNames={cssClassNames}
            >
              {currentComponent}
            </CSSTransition>
          </SwitchTransition>
        </div>
        {showModalEditApplicationFlow && (
          <EditApplicationFlow
            onCloseModal={() => handleCloseEditApplicationFlow()}
            onClickGoToApps={() => handleSuccessfulEditApplicationFlow()}
            applicationSelected={applicationSelected}
          />
        )}
      </>
    )
  }

  return renderComponent()
}

export default ApplicationContainer
