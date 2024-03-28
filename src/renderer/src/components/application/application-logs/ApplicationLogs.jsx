'use strict'
import React, { useState, useEffect, useRef } from 'react'
import { RICH_BLACK, WHITE, OPACITY_30, TRANSPARENT, MARGIN_0, MEDIUM } from '@platformatic/ui-components/src/components/constants'
import styles from './ApplicationLogs.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
// import { Button, HorizontalSeparator, VerticalSeparator } from '@platformatic/ui-components'
import { BorderedBox, Button, HorizontalSeparator } from '@platformatic/ui-components'
import Forms from '@platformatic/ui-components/src/components/forms'
import Log from './Log'
import {
  PRETTY,
  RAW,
  DIRECTION_UP,
  DIRECTION_DOWN,
  DIRECTION_STILL,
  DIRECTION_TAIL,
  STATUS_PAUSED_LOGS,
  STATUS_RESUMED_LOGS,
  STATUS_RUNNING,
  STATUS_STOPPED,
  FILTER_ALL,
  APPLICATION_PAGE_LOGS
} from '~/ui-constants'
import LogFilterSelector from './LogFilterSelector'
import {
  callApiStartLogs,
  callApiStopLogs,
  getAppLogs,
  callThereArePreviousLogs,
  callApiGetAllLogs,
  callApiPauseLogs,
  callApiResumeLogs,
  callApiGetPreviousLogs
} from '~/api'
import Icons from '@platformatic/ui-components/src/components/icons'
import useStackablesStore from '~/useStackablesStore'

const ApplicationLogs = React.forwardRef(({ _props }, ref) => {
  const globalState = useStackablesStore()
  const { setNavigation, setCurrentPage } = globalState
  const applicationStatus = globalState.computed.applicationStatus
  const applicationSelected = globalState.computed.applicationSelected
  const [displayLog, setDisplayLog] = useState(PRETTY)
  const [filterLogsByService, setFilterLogsByService] = useState({ label: 'All Services', value: FILTER_ALL })
  const [filterLogsByLevel, setFilterLogsByLevel] = useState('')
  const [filtersInitialized, setFiltersInitialized] = useState(false)
  const [defaultOptionsSelected, setDefaultOptionsSelected] = useState(null)
  const [optionsServices, setOptionsServices] = useState([{ label: 'All Services', value: FILTER_ALL }])
  const [scrollDirection, setScrollDirection] = useState(DIRECTION_TAIL)
  const [logValue, setLogValue] = useState(null)
  const [applicationLogs, setApplicationLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const logContentRef = useRef()
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [displayGoToBottom, setDisplayGoToBottom] = useState(false)
  const [showPreviousLogs, setShowPreviousLogs] = useState(false)
  const [statusPausedLogs, setStatusPausedLogs] = useState('')
  const [filteredLogsLengthAtPause, setFilteredLogsLengthAtPause] = useState(0)

  useEffect(() => {
    if (applicationSelected.id && applicationStatus === STATUS_RUNNING) {
      getAppLogs(callbackOnLog)
      callApiStartLogs(applicationSelected.id)
      checkIfThereArePreviousLogs()
    }
  }, [applicationSelected.id, applicationStatus])

  useEffect(() => {
    if (logValue) {
      setApplicationLogs([...applicationLogs, ...logValue])
    }
  }, [logValue])
  

  useEffect(() => {
    if (scrollDirection === DIRECTION_TAIL && filteredLogs.length > 0) {
      logContentRef.current.scrollTo({
        top: logContentRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth'
      })
      if (statusPausedLogs === STATUS_PAUSED_LOGS) {
        setStatusPausedLogs(STATUS_RESUMED_LOGS)
      }
    }
    if (scrollDirection !== DIRECTION_TAIL) {
      setFilteredLogsLengthAtPause(filteredLogs.length)
    }
  }, [scrollDirection, filteredLogs])

  useEffect(() => {
    if (statusPausedLogs) {
      switch (statusPausedLogs) {
        case STATUS_PAUSED_LOGS:
          callApiPauseLogs()
          break

        case STATUS_RESUMED_LOGS:
          callApiResumeLogs()
          break

        default:
          break
      }
    }
  }, [statusPausedLogs])

  useEffect(() => {
    setNavigation({
      label: 'Logs',
      handleClick: () => {
        setCurrentPage(APPLICATION_PAGE_LOGS)
      },
      key: APPLICATION_PAGE_LOGS,
      page: APPLICATION_PAGE_LOGS
    }, 2)

    return () => callApiStopLogs()
  }, [])


  useEffect(() => {
    if (applicationLogs.length > 0) {
      const newServices = applicationLogs.map(log => JSON.parse(log).name).filter(onlyUnique).map(ele => {
        if (!optionsServices.find(element => element.value === ele)) {
          return { value: ele, label: ele }
        }
        return undefined
      }).filter(ele => !!ele)
      setOptionsServices([...optionsServices, ...newServices])

      if (!filtersInitialized) {
        if (newServices.length === 1) {
          setFilterLogsByService({ value: newServices[0].value, label: newServices[0].label })
          setDefaultOptionsSelected({ value: newServices[0].value, label: newServices[0].label })
        }
        setFilterLogsByLevel(30)
        setFiltersInitialized(true)
        return
      }

      if (filterLogsByLevel || filterLogsByService.value) {
        let founds = [...applicationLogs]
        founds = founds.filter(log => JSON.parse(log).level >= filterLogsByLevel)
        if (filterLogsByService.value !== null && filterLogsByService.value !== FILTER_ALL) {
          founds = founds.filter(log => {
            return JSON.parse(log).name.toLowerCase().includes(filterLogsByService.value.toLowerCase()
            )
          })
        }
        setFilteredLogs(founds)
      } else {
        setFilteredLogs([...applicationLogs])
      }
    }
  }, [
    applicationLogs,
    filtersInitialized,
    filterLogsByLevel,
    filterLogsByService
  ])

  useEffect(() => {
    if (scrollDirection !== DIRECTION_TAIL && filteredLogsLengthAtPause > 0 && filteredLogsLengthAtPause < filteredLogs.length) {
      setDisplayGoToBottom(true)
    }
  }, [scrollDirection, filteredLogs.length, filteredLogsLengthAtPause])

  const callbackOnLog = (_, value) => setLogValue(value)

  function handleSelectService (event) {
    setFilterLogsByService({
      label: event.detail.label,
      value: event.detail.value
    })
  }

  function resumeScrolling () {
    setScrollDirection(DIRECTION_TAIL)
    setDisplayGoToBottom(false)
    setFilteredLogsLengthAtPause(0)
  }

  async function loadPreviousLogs () {
    try {
      const response = await callApiGetPreviousLogs(applicationSelected.id)
      if (response.length > 0) {
        setApplicationLogs([...response, ...applicationLogs])
      } else {
        setShowPreviousLogs(false)
      }
    } catch (error) {
      console.error(`Error on load previous logs ${error}`)
    }
  }

  function onlyUnique (value, index, array) {
    return array.indexOf(value) === index
  }

  function handlingClickArrow () {
    setScrollDirection(DIRECTION_STILL)
    setFilteredLogsLengthAtPause(filteredLogs.length)
  }

  function renderLogs () {
    if (displayLog === PRETTY) {
      return filteredLogs.map((log, index) => <Log key={index} log={log} display={displayLog} onClickArrow={() => handlingClickArrow()} />)
    }

    return (
      <span className={`${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite}`}>
        {filteredLogs}
      </span>
    )
  }

  function handleScroll (event) {
    // setStatusPausedLogs(STATUS_PAUSED_LOGS)
    const st = event.currentTarget.scrollTop // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (st > lastScrollTop) {
      // downscroll code
      if (scrollDirection !== DIRECTION_TAIL) {
        setScrollDirection(DIRECTION_DOWN)
      }
    } else if (st < lastScrollTop) {
      // upscroll code
      setScrollDirection(DIRECTION_UP)
    }
    setLastScrollTop(st <= 0 ? 0 : st)
  }

  async function checkIfThereArePreviousLogs() {
    const val = await callThereArePreviousLogs()
    setShowPreviousLogs(val)
  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.content}>
        <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
          <div className={commonStyles.mediumFlexBlock}>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter}`}>
              <Icons.CodeTestingIcon color={WHITE} size={MEDIUM} />
              <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>Logs</h2>
              {applicationStatus === STATUS_STOPPED && <p className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>(The application is stopped. Restart the app to collect new logs.)</p>}
            </div>
          </div>
          <BorderedBox classes={styles.borderexBoxContainer} backgroundColor={RICH_BLACK} color={WHITE} borderColorOpacity={OPACITY_30}>
            <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter} ${commonStyles.justifyBetween} ${styles.lateralPadding} ${styles.top}`}>
              <Forms.Select
                defaultContainerClassName={styles.select}
                backgroundColor={RICH_BLACK}
                borderColor={WHITE}
                options={optionsServices}
                disabled={optionsServices.length <= 1}
                onSelect={handleSelectService}
                optionsBorderedBottom={false}
                optionSelected={defaultOptionsSelected}
                mainColor={WHITE}
                borderListColor={WHITE}
                value={filterLogsByService.label}
                inputTextClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite}`}
              />
              <LogFilterSelector defaultLevelSelected={30} onChangeLevelSelected={(level) => setFilterLogsByLevel(level)} />
              <div className={`${commonStyles.tinyFlexRow} ${commonStyles.justifyEnd} ${styles.buttonContainer}`}>
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
              {applicationStatus === STATUS_RUNNING && showPreviousLogs && (
                <div className={styles.previousLogContainer}>
                  <p className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.textCenter} ${commonStyles.fullWidth} `}><span className={`${commonStyles.cursorPointer} ${typographyStyles.textTertiaryBlue}`} onClick={() => loadPreviousLogs()}>Click Here</span> to load previous logs</p>
                </div>
              )}

              {filteredLogs?.length > 0 && (
                <>
                  <hr className={styles.logDividerTop} />
                  {renderLogs()}
                  <hr className={styles.logDividerBottom} />
                </>
              )}
            </div>
            <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
            <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter} ${commonStyles.justifyBetween} ${styles.lateralPadding} ${styles.bottom}`}>
              <div>&nbsp;</div>

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
                onClick={() => callApiGetAllLogs(applicationSelected.id)}
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

export default ApplicationLogs
