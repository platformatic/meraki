'use strict'
import React from 'react'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './Log.module.css'
import { CopyAndPaste, PlatformaticIcon } from '@platformatic/ui-components'
import { WHITE, SMALL } from '@platformatic/ui-components/src/components/constants'
import { PRETTY } from '~/ui-constants'

export default function Log ({ log, display }) {
  const timestamp = new Date(log[0] / 1000000).toISOString()
  const message = log[1]
  const { level, pid, name, hostname, msg, err } = JSON.parse(message)
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
  let copyValue = `${timestamp} ${levelDisplayed} ${hostname}`
  if (name) copyValue += ` ${name} ${pid}`
  copyValue += ` ${msg}`
  const convertedErr = err?.stack?.split('\n') ?? []
  copyValue += err?.stack || ''
  // const rawMessage = JSON.stringify({ level, pid, name, hostname, msg, err })
  const logClassName = `${styles.log} ` + styles[`log${level}`]
  console.log('copyValue', copyValue)
  return display === PRETTY
    ? (
      <>
        <div className={logClassName}>
          <PlatformaticIcon iconName='ArrowRightIcon' color={WHITE} size={SMALL} onClick={() => {}} internalOverHandling />
          <span className={`${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite}`}>[{`${timestamp}`}]</span>&nbsp;
          <span className={styles[`text${level}`]}>{levelDisplayed}</span>&nbsp;
          <span>{hostname}</span>&nbsp;
          {name && (
            <>
              <span>{name}</span>&nbsp;
              <span>({pid})</span>&nbsp;
            </>
          )}
          <span>{msg}</span>&nbsp;
        </div>
        {convertedErr.length > 0 && (
          <p className={commonStyles.fullWidth}>
            {convertedErr.map((err, index) => <React.Fragment key={`${err}-${index}`}><span className={index === 0 ? commonStyles.fullWidth : commonStyles.containerLeftSpacedSmall}> {err}</span><br /></React.Fragment>)}
          </p>
        )}
      </>
      )
    : (
      <div className={`${commonStyles.smallFlexRow} ${commonStyles.justifyBetween}`}>
        <p className={styles.log}>{message}</p>
        <div className={commonStyles.smallFlexRow}>
          <CopyAndPaste value={message} tooltipLabel='Message copied!' color={WHITE} size={SMALL} />
        </div>
      </div>
      )
}
