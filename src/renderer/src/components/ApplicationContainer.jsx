'use strict'
import { useRef, useState, useEffect } from 'react'
import {
  PAGE_WELCOME,
  BREAKPOINTS_HEIGHT_LG,
  HEIGHT_LG,
  HEIGHT_MD
} from '~/ui-constants'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import styles from './ApplicationContainer.module.css'
import '~/components/component.animation.css'
import useWindowDimensions from '~/hooks/useWindowDimensions'
import Welcome from './welcome/Welcome'
import SideBar from '~/components/ui/SideBar'
import ImportApplicationFlow from '~/components/application/import/ImportApplicationFlow'

function ApplicationContainer () {
  const [showModalImportApplication, setShowModalImportApplication] = useState(false)
  const [cssClassNames] = useState('next')
  const [currentPage] = useState(PAGE_WELCOME)
  const [components] = useState([
    <Welcome
      ref={useRef(null)}
      key={PAGE_WELCOME}
      onClickImportApp={() => setShowModalImportApplication(true)}
    />
  ])
  const [currentComponent, setCurrentComponent] = useState(components.find(component => component.key === PAGE_WELCOME))

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

  function handleImportApplication () {
    setShowModalImportApplication(false)
    // TODO: setCurrentComponent('Recent Apps')
  }

  return (
    <>
      <div className={styles.content}>
        <SideBar
          topItems={[{
            label: 'Recent Apps',
            iconName: 'RecentAppsIcon'
          }, {
            label: 'All Apps',
            iconName: 'AppIcon'
          }, {
            label: 'Create App',
            iconName: 'CreateAppIcon'
          }, {
            label: 'Import App',
            iconName: 'ImportAppIcon',
            onClick: () => setShowModalImportApplication(true)
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
      {showModalImportApplication && (
        <ImportApplicationFlow
          onCloseModal={() => setShowModalImportApplication(false)}
          onClickConfirm={() => handleImportApplication()}
        />
      )}
    </>
  )
}

export default ApplicationContainer
