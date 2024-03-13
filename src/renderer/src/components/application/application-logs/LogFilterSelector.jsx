'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './LogFilterSelector.module.css'
import typographyStyles from '~/styles/Typography.module.css'
// import commonStyles from '~/styles/CommonStyles.module.css'
// import { Button, HorizontalSeparator, VerticalSeparator } from '@platformatic/ui-components'

function LogFilterSelector ({ defaultLevelSelected, onChangeLevelSelected }) {
  const levels = {
    50: 'ERROR',
    40: 'WARN',
    30: 'INFO',
    20: 'DEBUG',
    10: 'TRACE'
  }
  const levelOrdered = [50, 40, 30, 20, 10]
  const barLevels = {
    50: '0%',
    40: 'calc(25% - 4px)',
    30: 'calc(50% - 4px)',
    20: 'calc(75% - 4px)',
    10: 'calc(100% - 4px)'
  }
  const [levelSelected, setLevelSeleted] = useState(defaultLevelSelected)
  const [barValue, setBarValue] = useState(barLevels[defaultLevelSelected])

  function handleChangeLevelSelected (level) {
    setLevelSeleted(level)
    setBarValue(barLevels[level])
    onChangeLevelSelected(level)
  }

  function renderButton (currentLevel) {
    const levelName = levels[currentLevel].toLowerCase()
    let classNamePoint = styles.point + ' ' + styles[`${levelName}Point`]
    if (levelSelected > currentLevel) {
      classNamePoint += ` ${styles.inactivePoint}`
    }
    if (levelSelected === currentLevel) {
      classNamePoint += ` ${styles.selectedPoint}`
    }
    return (
      <div className={`${styles.buttonLevel} ${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite}`} onClick={() => handleChangeLevelSelected(currentLevel)}>
        {levelName}
        <div className={classNamePoint} />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {levelOrdered.map(k => renderButton(k))}
      <div className={styles.progressContainer}>
        <div className={styles.progress}>
          <div className={styles.bar} style={{ width: `${barValue}` }}>
            <p className={styles.percent} />
          </div>
        </div>
      </div>
    </div>
  )
}

LogFilterSelector.propTypes = {
  /**
   * defaultLevelSelected
    */
  defaultLevelSelected: PropTypes.number,
  /**
   * onChangeLevelSelected
    */
  onChangeLevelSelected: PropTypes.func
}

LogFilterSelector.defaultProps = {
  defaultLevelSelected: 10,
  onChangeLevelSelected: () => {}
}

export default LogFilterSelector
