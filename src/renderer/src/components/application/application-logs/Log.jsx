'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './Log.module.css'
import { PlatformaticIcon } from '@platformatic/ui-components'
import { WHITE, SMALL } from '@platformatic/ui-components/src/components/constants'
import { PRETTY } from '~/ui-constants'
import { getFormattedLogTimestamp } from '~/utilityDetails'

function Log ({ log, display, onClickArrow }) {
  const [displayJson, setDisplayJson] = useState(false)
  const [logContainerClassName, setLogContainerClassName] = useState(normalClassName())
  const { level, pid, name, msg, time } = JSON.parse(log)
  const levelDisplayed = getLevel(level)

  function getLevel (level) {
    return {
      10: 'TRACE',
      20: 'DEBUG',
      30: 'INFO',
      40: 'WARN',
      50: 'ERROR',
      60: 'FATAL'
    }[level]
  }

  // let copyValue = `${timestamp} ${levelDisplayed} ${hostname}`
  // if (name) copyValue += ` ${name} ${pid}`
  // copyValue += ` ${msg}`
  // const convertedErr = err?.stack?.split('\n') ?? []
  // eslint-disable-next-line no-unused-vars
  // copyValue += err?.stack || ''
  // const rawMessage = JSON.stringify({ level, pid, name, hostname, msg, err })
  const logClassName = `${styles.log} ` + styles[`log${level}`]

  useEffect(() => {
    if (displayJson) {
      setLogContainerClassName(activeClassName())
    } else {
      setLogContainerClassName(normalClassName())
    }
  }, [displayJson])

  function handleChangeDisplayView () {
    setDisplayJson(!displayJson)
    onClickArrow()
  }

  function normalClassName () {
    return `${styles.logContainerClassNameInactive} ${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite} `
  }

  function activeClassName () {
    return `${styles.logContainerClassNameActive} ${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite} ` + styles[`logContainerClassNameActive${level}`]
  }

  return display === PRETTY
    ? (
      <div className={logContainerClassName}>
        <div className={logClassName}>
          <PlatformaticIcon iconName={displayJson ? 'ArrowDownIcon' : 'ArrowRightIcon'} color={WHITE} size={SMALL} onClick={() => handleChangeDisplayView()} internalOverHandling />
          <span>{getFormattedLogTimestamp(time)}</span>
          <span className={styles[`text${level}`]}>{levelDisplayed}</span>
          <span>-</span>
          {name && (
            <>
              <span>{name}</span>
              <span>({pid})</span>
            </>
          )}
          <span>-</span>
          <p className={styles.msg}>{msg}</p>
        </div>
        {displayJson && (
          <div className={`${styles.log} ${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite}`}><pre>{JSON.stringify(JSON.parse(log), null, 2)}</pre></div>
        )}
      </div>
      )
    : (
      <div className={`${commonStyles.flexBlockNoGap} ${commonStyles.fullWidth}`}>
        <p className={`${styles.log} ${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite}`}>
          <span>[{getFormattedLogTimestamp(time, true)}]</span>
          <span>{levelDisplayed}</span>
          <span>({name}/{pid}):</span>
          <span>{msg}</span>
        </p>
        <p className={`${styles.log} ${styles.logRaw} ${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite}`}>{log}</p>
      </div>
      )
}

Log.propTypes = {
  /**
   * log
    */
  log: PropTypes.string,
  /**
   * display
   */
  display: PropTypes.string,
  /**
   * onClickArrow
   */
  onClickArrow: PropTypes.func
}

Log.defaultProps = {
  log: '',
  display: PRETTY,
  onClickArrow: () => {}
}

export default Log
