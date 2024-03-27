'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
// import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './Log.module.css'
import { CopyAndPaste, PlatformaticIcon } from '@platformatic/ui-components'
import { WHITE, SMALL } from '@platformatic/ui-components/src/components/constants'
import { PRETTY } from '~/ui-constants'
import { getFormattedLogTimestamp } from '~/utilityDetails'

function Log ({ log, display, onClickArrow }) {
  const [displayJson, setDisplayJson] = useState(false)
  const [logContainerClassName, setLogContainerClassName] = useState(normalClassName())
  const { level, time, pid, name, msg, reqId, req, hostname, responseTime, ...rest } = JSON.parse(log)
  const levelDisplayed = getLevel(level)
  let msgClassName = `${styles.msg} `
  msgClassName += styles[`text${level}`]

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

  function cleanElement (element) {
    return element.replace(/[{}\n]/g, '').replace('"', '').replace('"', '')
  }

  function cleanJson (element) {
    return element.replace(/(^{\n|}$)/g, '').replace('"', '').replace('"', '')
  }

  function displayRest () {
    if (!rest) return (<></>)
    let variable = ''
    const content = []
    let tmp = {}

    Object.keys(rest).forEach(k => {
      variable = rest[k]
      tmp = {}
      tmp[k] = variable

      if (typeof variable === 'object' &&
      !Array.isArray(variable) &&
      variable !== null) {
        content.push(
          <div className={`${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite}`}>
            <pre>{cleanJson(JSON.stringify(tmp, null, 2))}</pre>
          </div>
        )
      } else {
        content.push(
          <div className={`${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite}`}>
            <pre>{cleanElement(JSON.stringify(tmp, null, 2))}</pre>
          </div>
        )
      }
    })
    return content
  }

  return display === PRETTY
    ? (
      <div className={logContainerClassName}>
        <div className={logClassName}>
          <PlatformaticIcon iconName={displayJson ? 'ArrowDownIcon' : 'ArrowRightIcon'} color={WHITE} size={SMALL} onClick={() => handleChangeDisplayView()} disabled={!reqId} />
          <span>{getFormattedLogTimestamp(time)}</span>
          <span className={styles[`text${level}`]}>{levelDisplayed}</span>
          <span>-</span>
          <span>{name}</span>
          {reqId &&
            <>
              <span>-</span>
              <span>“..{reqId.substr(-4)}”</span>
            </>}
          {req &&
            <>
              <span>-</span>
              <span className={styles.request}>{req.method} {req.url} </span>
            </>}
          <p className={msgClassName}>{msg}</p>
        </div>
        {displayJson && (
          <>
            <div className={styles.copyPasteIcon}>
              <CopyAndPaste value={log} tooltipLabel='Log copied!' color={WHITE} size={SMALL} />
            </div>
            <div className={styles.displayedElements}>
              <div className={`${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite}`} key=''>
                <pre>{cleanElement(JSON.stringify({ reqId }, null, 2))}</pre>
              </div>
              {req && (
                <div className={`${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite}`} key=''>
                  <pre>{cleanJson(JSON.stringify({ req }, null, 2))}</pre>
                </div>)}
              {displayRest()}
            </div>
          </>
        )}
      </div>
      )
    : (
      <span className={`${styles.log} ${styles.logRaw} ${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite}`}>{log}</span>
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
