'use strict'
import PropTypes from 'prop-types'
import { useRef, useState, useEffect } from 'react'
import {
  // PAGE_WELCOME,
  PAGE_RECENT_APPS,
  PAGE_ALL_APPS,
  BREAKPOINTS_HEIGHT_LG,
  HEIGHT_LG,
  HEIGHT_MD
} from '~/ui-constants'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styles from './HomeContainer.module.css'
import '~/components/component.animation.css'
import useWindowDimensions from '~/hooks/useWindowDimensions'
import RecentApplications from '~/components/applications/recent/RecentApplications'
import AllApplications from '~/components/applications/all/AllApplications'
import SideBar from '~/components/ui/SideBar'
import useStackablesStore from '~/useStackablesStore'
import { onReceivedTemplateId, onStopReceivingTemplateId } from '~/api'

function HomeContainer ({ onUseTemplateId }) {
  const globalState = useStackablesStore()
  const { currentPage, setCurrentPage, useTemplateId, setUseTemplateId } = globalState
  const [cssClassNames] = useState('scroll-down')
  // const [currentPage, setCurrentPage] = useState(PAGE_WELCOME)
  const [components] = useState([
    <RecentApplications
      ref={useRef(null)}
      key={PAGE_RECENT_APPS}
    />,
    <AllApplications
      ref={useRef(null)}
      key={PAGE_ALL_APPS}
    />

  ])
  const [currentComponent, setCurrentComponent] = useState(null)
  const { height: innerHeight } = useWindowDimensions()

  useEffect(() => {
    if (innerHeight > BREAKPOINTS_HEIGHT_LG) {
      document.documentElement.style.setProperty('--compose-application-height', HEIGHT_LG)
    } else {
      document.documentElement.style.setProperty('--compose-application-height', HEIGHT_MD)
    }
  }, [innerHeight])

  useEffect(() => {
    if (currentPage) {
      setCurrentComponent(components.find(component => component.key === currentPage))
    } else {
      setCurrentPage(PAGE_RECENT_APPS)
    }
  }, [currentPage])

  useEffect(() => {
    const handlingFunction = (_, templateIdReceived) => {
      if (templateIdReceived && useTemplateId === null) {
        setUseTemplateId(templateIdReceived)
      }
    }

    onReceivedTemplateId(handlingFunction)
    return () => {
      onStopReceivingTemplateId(handlingFunction)
      setUseTemplateId(null)
    }
  }, [])

  useEffect(() => {
    if (useTemplateId) {
      onUseTemplateId()
    }
  }, [useTemplateId])

  return currentComponent && (
    <>
      <div className={styles.content}>
        <SideBar
          selected={currentPage}
          topItems={[{
            name: PAGE_RECENT_APPS,
            label: 'Recent Apps',
            iconName: 'RecentAppsIcon',
            onClick: () => setCurrentPage(PAGE_RECENT_APPS)
          }, {
            name: PAGE_ALL_APPS,
            label: 'All Apps',
            iconName: 'AllAppsIcon',
            onClick: () => setCurrentPage(PAGE_ALL_APPS)
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

HomeContainer.propTypes = {
  /**
   * onUseTemplateId
    */
  onUseTemplateId: PropTypes.func
}

HomeContainer.defaultProps = {
  onUseTemplateId: () => {}
}

export default HomeContainer
