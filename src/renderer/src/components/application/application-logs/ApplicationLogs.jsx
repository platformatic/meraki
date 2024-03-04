'use strict'
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { RICH_BLACK, WHITE, OPACITY_30, TRANSPARENT, MARGIN_0 } from '@platformatic/ui-components/src/components/constants'
import styles from './ApplicationLogs.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
// import { Button, HorizontalSeparator, VerticalSeparator } from '@platformatic/ui-components'
import Title from '~/components/ui/Title'
import { BorderedBox, Button, HorizontalSeparator } from '@platformatic/ui-components'
import Forms from '@platformatic/ui-components/src/components/forms'
import Log from './Log'
import { PRETTY, RAW } from '~/ui-constants'

const ApplicationLogs = React.forwardRef((_props, ref) => {
  const [displayLog, setDisplayLog] = useState(PRETTY)
  const [filterLogsByService, setFilterLogsByService] = useState('')
  const [optionsServices/* , setOptionsServices */] = useState([])
  const [scrollDirection, setScrollDirection] = useState('down')
  const [logValue, setLogValue] = useState([])
  const logContentRef = useRef()
  const [previousScrollTop, setPreviousScrollTop] = useState(0)
  const [displayGoToTop, setDisplayGoToTop] = useState(false)
  const [displayGoToBottom, setDisplayGoToBottom] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date()
      const a = Math.floor(Math.random() * 6)
      let err = null
      if (a === 5) { err = 'error' }
      setLogValue(logValue => [...logValue, [
        date.getTime(),
        JSON.stringify({
          level: a * 10,
          pid: Math.random() * 1000,
          name: ['composer', 'service', 'db'][(Math.random() * 3)],
          msg: 'Mocked message',
          err
        })
      ]
      ])
    }, 500)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (scrollDirection === 'down' && logValue.length > 0) {
      logContentRef.current.scrollTo({
        top: logContentRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth'
      })
      setPreviousScrollTop(logContentRef.current.scrollTop)
    }
  }, [scrollDirection, logValue])

  useEffect(() => {
    if (scrollDirection === 'up') {
      setDisplayGoToBottom(true)
    }
  }, [scrollDirection])

  function handleScroll (event) {
    if (event.currentTarget.scrollTop < previousScrollTop) {
      setScrollDirection('up')
    }
    // 30 Height of a single line
    if (event.currentTarget.scrollTop * 30 > logContentRef.current.clientHeight) {
      setDisplayGoToTop(true)
    } else {
      setDisplayGoToTop(false)
    }
  }

  function handleChangeService (event) {
    setFilterLogsByService(event.target.value)
  }

  function handleSelectService (event) {
    setFilterLogsByService(event.detail.value)
  }

  function handleClearService () {
    setFilterLogsByService('')
  }

  function saveLogs () {

  }

  function clickGoToTop () {
    setScrollDirection('up')
    logContentRef.current.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  function resumeScrolling () {
    setScrollDirection('down')
    setDisplayGoToBottom(false)
  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.content}>
        <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
          <div className={commonStyles.mediumFlexBlock}>
            <Title
              title='ApplicationLogs'
              iconName='CodeTestingIcon'
              dataAttrName='cy'
              dataAttrValue='application-log-title'
            />
          </div>
          <BorderedBox classes={styles.borderexBoxContainer} backgroundColor={RICH_BLACK} color={WHITE} borderColorOpacity={OPACITY_30}>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter} ${commonStyles.justifyBetween} ${styles.lateralPadding} ${styles.top}`}>
              <Forms.Select
                defaultContainerClassName={styles.select}
                backgroundColor={RICH_BLACK}
                placeholder='All Services'
                borderColor={WHITE}
                options={optionsServices}
                defaultOptionsClassName={styles.selectUl}
                onChange={handleChangeService}
                onSelect={handleSelectService}
                onClear={handleClearService}
                optionsBorderedBottom={false}
                mainColor={WHITE}
                borderListColor={WHITE}
                value={filterLogsByService}
                inputTextClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite}`}
              />
              <p>Log Selector</p>
              <div className={`${commonStyles.smallFlexRow} ${commonStyles.justifyEnd}`}>
                <Button
                  type='button'
                  paddingClass={commonStyles.buttonPadding}
                  label='Pretty'
                  onClick={() => setDisplayLog(PRETTY)}
                  color={WHITE}
                  backgroundColor={RICH_BLACK}
                  selected={displayLog === PRETTY}
                />
                <Button
                  type='button'
                  paddingClass={commonStyles.buttonPadding}
                  label='Raw'
                  onClick={() => setDisplayLog(RAW)}
                  color={WHITE}
                  backgroundColor={TRANSPARENT}
                  selected={displayLog === RAW}
                />
              </div>
            </div>
            <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
            <div className={`${styles.logsContainer} ${styles.lateralPadding}`} ref={logContentRef} onScroll={handleScroll}>
              {logValue?.length > 0 && logValue.map((log, index) => <Log key={index} log={{ ...log }} display={displayLog} onClickArrow={() => setScrollDirection('still')} />)}
            </div>
            <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter} ${commonStyles.justifyBetween} ${styles.lateralPadding} ${styles.bottom}`}>
              <Button
                type='button'
                paddingClass={commonStyles.buttonPadding}
                label='Go to Top'
                onClick={() => clickGoToTop()}
                color={displayGoToTop ? WHITE : RICH_BLACK}
                backgroundColor={RICH_BLACK}
                disabled={!displayGoToTop}
              />

              {displayGoToBottom
                ? (
                  <p className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite}`}>There are new logs. <span className={`${commonStyles.cursorPointer} ${typographyStyles.textTertiaryBlue}`} onClick={() => resumeScrolling()}>Go to the bottom</span> to resume</p>
                  )
                : (
                  <p className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textRichBlack}`}>There are new logs. Go to the bottom to resume</p>
                  )}
              <Button
                type='button'
                paddingClass={commonStyles.buttonPadding}
                label='Save Logs'
                onClick={() => saveLogs()}
                color={WHITE}
                backgroundColor={TRANSPARENT}
              />
            </div>

          </BorderedBox>
        </div>
      </div>
    </div>
  )
})

ApplicationLogs.propTypes = {
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * onClickEdit
   */
  onCloseModal: PropTypes.func,
  /**
   * onClickRemove
   */
  onClickConfirm: PropTypes.func
}

ApplicationLogs.defaultProps = {
  onCloseModal: () => {},
  onClickConfirm: () => {}
}

export default ApplicationLogs
