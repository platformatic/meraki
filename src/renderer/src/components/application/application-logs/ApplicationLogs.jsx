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
import LogFilterSelector from './LogFilterSelector'
import { callApiStartLogs, getAppLogs } from '~/api'

const ApplicationLogs = React.forwardRef(({ applicationSelected }, ref) => {
  const [displayLog, setDisplayLog] = useState(PRETTY)
  const [filterLogsByService, setFilterLogsByService] = useState('')
  const [filterLogByLevel, setFilterLogByLevel] = useState(30)
  const [optionsServices/* , setOptionsServices */] = useState([])
  const [scrollDirection, setScrollDirection] = useState('down')
  const [logValue, setLogValue] = useState(null)
  const [displayedLogs, setDisplayedLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const logContentRef = useRef()
  const [previousScrollTop, setPreviousScrollTop] = useState(0)
  const [displayGoToTop, setDisplayGoToTop] = useState(false)
  const [displayGoToBottom, setDisplayGoToBottom] = useState(false)

  useEffect(() => {
    if (applicationSelected.id) {
      getAppLogs((_, value) => setLogValue(value))
      callApiStartLogs(applicationSelected.id)
    }
  }, [applicationSelected.id])

  useEffect(() => {
    if (logValue) {
      setDisplayedLogs([...displayedLogs, ...logValue])
    }
  }, [logValue])

  useEffect(() => {
    if (scrollDirection === 'down' && filteredLogs.length > 0) {
      logContentRef.current.scrollTo({
        top: logContentRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth'
      })
      setPreviousScrollTop(logContentRef.current.scrollTop)
    }
  }, [scrollDirection, filteredLogs])

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

  useEffect(() => {
    if (displayedLogs.length > 0 && (filterLogByLevel || filterLogsByService)) {
      let founds = [...displayedLogs]
      founds = founds.filter(log => JSON.parse(log).level >= filterLogByLevel)
      if (filterLogsByService && filterLogsByService !== '') {
        founds = founds.filter(application => application.name.toLowerCase().includes(filterLogsByService.toLowerCase()))
      }
      setFilteredLogs(founds)
    } else {
      setFilteredLogs([...displayedLogs])
    }
  }, [
    displayedLogs,
    filterLogByLevel,
    filterLogsByService
  ])

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
              title='Logs'
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
              <LogFilterSelector defaultLevelSelected={30} onChangeLevelSelected={(level) => setFilterLogByLevel(level)} />
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
              {filteredLogs?.length > 0 && filteredLogs.map((log, index) => <Log key={index} log={log} display={displayLog} onClickArrow={() => setScrollDirection('still')} />)}
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
   * applicationSelected
    */
  applicationSelected: PropTypes.object
}

ApplicationLogs.defaultProps = {
  applicationSelected: {}
}

export default ApplicationLogs
