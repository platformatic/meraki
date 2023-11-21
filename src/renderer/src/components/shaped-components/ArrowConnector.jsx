'use strict'
import { useEffect, useState } from 'react'
import styles from './ArrowConnector.module.css'
import Icons from '@platformatic/ui-components/src/components/icons'
import { LARGE, MEDIUM, SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'
import BackgroundArrowConnector from '~/components/backgrounds/BackgroundArrowConnector'
import useStackablesStore from '~/useStackablesStore'

function ArrowConnector () {
  const globalState = useStackablesStore()
  const [size, setSize] = useState(LARGE)
  const { services } = globalState

  useEffect(() => {
    switch (services.length) {
      case 0:
      case 1:
        setSize(LARGE)
        break
      case 2:
        setSize(MEDIUM)
        break
      default:
        setSize(SMALL)
        break
    }
  }, [services.length])

  return (
    <div className={styles.container}>
      <BackgroundArrowConnector classNameSvg={styles.svg} size={size} />
      <div className={styles.iconContainer}>
        <Icons.RunningIcon color={WHITE} size={LARGE} />
      </div>
    </div>
  )
}

export default ArrowConnector
