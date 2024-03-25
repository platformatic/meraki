'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { ERROR_RED, MAIN_GREEN, MEDIUM, WHITE } from '@platformatic/ui-components/src/components/constants'
import { Icons } from '@platformatic/ui-components'
import { RUNNING, NONE, SUCCESS, ERROR } from '~/ui-constants'
import styles from './CountDown.module.css'

function CountDown ({ status }) {
  const [seconds, setSeconds] = useState(0)
  const [className, setClassName] = useState(`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`)
  const [icon, setIcon] = useState(null)

  useEffect(() => {
    let intervalId
    switch (status) {
      case RUNNING:
        intervalId = setInterval(() => {
          setSeconds((seconds) => seconds + 1)
        }, 1000)
        setClassName(`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite}`)
        setIcon(<div className={styles.clockWiseRotation}><Icons.RunningIcon size={MEDIUM} color={WHITE} /></div>)
        break
      case ERROR:
        if (intervalId) clearInterval(intervalId)
        setClassName(`${typographyStyles.desktopBodySmall} ${typographyStyles.textErrorRed}`)
        setIcon(<Icons.AlertIcon size={MEDIUM} color={ERROR_RED} />)
        break
      case SUCCESS:
        if (intervalId) clearInterval(intervalId)
        setClassName(`${typographyStyles.desktopBodySmall} ${typographyStyles.textMainGreen}`)
        setIcon(<Icons.CircleCheckMarkIcon size={MEDIUM} color={MAIN_GREEN} />)
        break

      default:
        if (intervalId) clearInterval(intervalId)
        setClassName(`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`)
        setIcon(<Icons.CircleCheckMarkIcon checked={false} size={MEDIUM} color={WHITE} disabled />)
        break
    }
    return () => clearInterval(intervalId)
  }, [status])

  return (
    <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter} ${commonStyles.fullWidth}`}>
      {icon}
      <p className={className}>Generation started {seconds}s ago</p>
    </div>
  )
}

CountDown.propTypes = {
  /**
     * status
     */
  status: PropTypes.oneOf([NONE, RUNNING, SUCCESS, ERROR])
}

CountDown.defaultProps = {
  status: ''
}

export default CountDown
