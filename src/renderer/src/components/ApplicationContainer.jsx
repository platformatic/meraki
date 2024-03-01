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
import styles from './ApplicationContainer.module.css'
import '~/components/component.animation.css'
import useWindowDimensions from '~/hooks/useWindowDimensions'
import Overview from '~/components/application/overview/Overview'
import Metrics from '~/components/application/metrics/Metrics'
import ApplicationLogs from '~/components/application/application-logs/ApplicationLogs'
import EnvironmentVariables from '~/components/application/environment-variables/EnvironmentVariables'
import SideBar from '~/components/ui/SideBar'

function ApplicationContainer () {
  const [cssClassNames] = useState('scroll-down')
  const [currentPage, setCurrentPage] = useState(APPLICATION_PAGE_OVERVIEW)
  const [components] = useState([
    <Overview
      ref={useRef(null)}
      key={APPLICATION_PAGE_OVERVIEW}
    />,
    <ApplicationLogs
      ref={useRef(null)}
      key={APPLICATION_PAGE_LOGS}
    />,
    <Metrics
      ref={useRef(null)}
      key={APPLICATION_PAGE_METRICS}
    />,
    <EnvironmentVariables
      ref={useRef(null)}
      key={APPLICATION_PAGE_ENV_VAR}
    />

  ])
  const [currentComponent, setCurrentComponent] = useState(components.find(component => component.key === APPLICATION_PAGE_OVERVIEW))
  const { height: innerHeight } = useWindowDimensions()

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
            iconName: 'AppEditIcon'
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
    </>
  )
}

export default ApplicationContainer
