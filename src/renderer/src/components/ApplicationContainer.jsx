'use strict'
import { useRef, useState, useEffect } from 'react'
import {
  APPLICATION_PAGE_OVERVIEW,
  APPLICATION_PAGE_METRICS,
  APPLICATION_PAGE_LOGS,
  APPLICATION_PAGE_ENV_VAR,
  BREAKPOINTS_HEIGHT_LG,
  HEIGHT_LG,
  HEIGHT_MD,
  HOME_PATH
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
import UpgradePlatformaticFlow from '~/components/application/upgrade-platformatic/UpgradePlatformaticFlow'
import SideBar from '~/components/ui/SideBar'
import { useNavigate, useParams } from 'react-router-dom'
import {
  callOpenApplication,
  callStartApplication,
  callStopApplication,
  onReceivedTemplateId,
  onStopReceivingTemplateId
} from '~/api'
import { LoadingSpinnerV2 } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import ErrorComponent from '~/components/screens/ErrorComponent'

function ApplicationContainer () {
  const globalState = useStackablesStore()
  const {
    currentPage,
    setCurrentPage,
    resetWizardState,
    restartAutomaticApplications,
    setApplicationsSelected,
    setApplicationSelectedId,
    useTemplateIdOnEdit,
    setUseTemplateIdOnEdit
  } = globalState

  const navigate = useNavigate()
  const { appId } = useParams()
  const [innerLoading, setInnerLoading] = useState(true)
  const applicationSelected = globalState.computed.applicationSelected
  const [cssClassNames] = useState('scroll-down')
  // const [currentPage, setCurrentPage] = useState(null)
  const overViewRef = useRef(null)
  const applicationLogsRef = useRef(null)
  const metricRef = useRef(null)
  const envVarRef = useRef(null)
  const [components, setComponents] = useState([])
  const [currentComponent, setCurrentComponent] = useState(null)
  const [reloadApplication, setReloadApplication] = useState(true)
  const { height: innerHeight } = useWindowDimensions()
  const [showModalEditApplicationFlow, setShowModalEditApplicationFlow] = useState(false)
  const [showUpgradePlatformaticFlow, setShowUpgradePlatformaticFlow] = useState(false)
  const [showErrorComponent, setShowErrorComponent] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handlingFunction = (_, templateIdReceived) => {
      if (templateIdReceived && useTemplateIdOnEdit === null) {
        setUseTemplateIdOnEdit(templateIdReceived)
      }
    }
    onReceivedTemplateId(handlingFunction)
    return () => {
      onStopReceivingTemplateId(handlingFunction)
      setUseTemplateIdOnEdit(null)
      setApplicationSelectedId(null)
    }
  }, [])

  useEffect(() => {
    if (useTemplateIdOnEdit) {
      setShowModalEditApplicationFlow(true)
    }
  }, [useTemplateIdOnEdit])

  useEffect(() => {
    if (appId && reloadApplication) {
      async function getApplication () {
        try {
          setInnerLoading(true)
          const applicationSelected = await callOpenApplication(appId)
          const tmp = {}
          tmp[appId] = applicationSelected
          setApplicationsSelected(tmp)
          setApplicationSelectedId(appId)
          setReloadApplication(false)
        } catch (error) {
          console.error(`Error on getApplication ${error}`)
          setError(error)
          setShowErrorComponent(true)
        }
      }
      getApplication()
    }
  }, [appId, reloadApplication])

  useEffect(() => {
    if (applicationSelected) {
      setComponents([
        <Overview
          ref={overViewRef}
          key={APPLICATION_PAGE_OVERVIEW}
          onClickEditApplication={() => setShowModalEditApplicationFlow(true)}
          onClickUpgradeAppPlt={() => setShowUpgradePlatformaticFlow(true)}
        />,
        <ApplicationLogs
          ref={applicationLogsRef}
          key={APPLICATION_PAGE_LOGS}
        />,
        <Metrics
          ref={metricRef}
          key={APPLICATION_PAGE_METRICS}
        />,
        <EnvironmentVariables
          ref={envVarRef}
          key={APPLICATION_PAGE_ENV_VAR}
          services={applicationSelected.services}
        />
      ])
    } else {
      setComponents([])
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

  async function handleStartApplication () {
    const tmp = {}
    tmp[appId] = await callStartApplication(appId)
    setApplicationsSelected(tmp)
  }

  async function handleStopApplication () {
    const tmp = {}
    tmp[appId] = await callStopApplication(appId)
    setApplicationsSelected(tmp)
  }

  function handleTerminateUpgradePlatformaticFlow () {
    setApplicationSelectedId(null)
    setInnerLoading(true)
    setApplicationsSelected(null)
    setReloadApplication(true)
    setShowUpgradePlatformaticFlow(false)
    if (restartAutomaticApplications[appId]) {
      handleStartApplication()
    }
  }

  function handleCloseEditApplicationFlow () {
    setShowModalEditApplicationFlow(false)
    setUseTemplateIdOnEdit(null)
    resetWizardState()
  }

  async function handleSuccessfulEditApplicationFlow () {
    setShowModalEditApplicationFlow(false)
    setUseTemplateIdOnEdit(null)
    resetWizardState()
    setInnerLoading(true)
    setApplicationsSelected(null)
    setApplicationSelectedId(null)
    setReloadApplication(true)
    if (restartAutomaticApplications[appId]) {
      handleStartApplication()
    }
  }

  function handleDismiss () {
    setError(null)
    setShowErrorComponent(false)
    navigate(HOME_PATH)
  }

  function renderComponent () {
    if (showErrorComponent) {
      return (<ErrorComponent error={error} message={error.message} onClickDismiss={() => handleDismiss()} />)
    }

    if (innerLoading) {
      return (
        <LoadingSpinnerV2
          loading
          applySentences={{
            containerClassName: `${commonStyles.mediumFlexBlock} ${commonStyles.itemsCenter}`,
            sentences: [{
              style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`,
              text: 'Loading your application...'
            }, {
              style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`,
              text: 'This process will just take a few seconds.'
            }]
          }}
          containerClassName={styles.loadingSpinner}
        />
      )
    }

    return applicationSelected && (
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
              label: 'Services configurations',
              iconName: 'AppConfigurationIcon',
              onClick: () => setCurrentPage(APPLICATION_PAGE_ENV_VAR)
            }]}
            bottomItems={[{
              label: 'Edit App',
              iconName: 'AppEditIcon',
              disabled: !applicationSelected.isLatestPltVersion,
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
            onStopApplication={async () => await handleStopApplication()}
          />
        )}
        {showUpgradePlatformaticFlow && (
          <UpgradePlatformaticFlow
            onTerminateUpgradePlatformaticFlow={() => handleTerminateUpgradePlatformaticFlow()}
            onStopApplication={async () => await handleStopApplication()}
            onCancelUpgrade={() => setShowUpgradePlatformaticFlow(false)}
          />
        )}
      </>
    )
  }

  return renderComponent()
}

export default ApplicationContainer
