'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './TableRecent.module.css'
import { LoadingSpinnerV2, Button, PlatformaticIcon } from '@platformatic/ui-components'
import { RICH_BLACK, WHITE, SMALL, DULLS_BACKGROUND_COLOR, ANTI_FLASH_WHITE } from '@platformatic/ui-components/src/components/constants'
import { ASC, DESC } from '~/ui-constants'
import Row from './Row'
import { sortCollection } from '~/utilitySorting'

function TableRecent ({
  applicationsLoaded,
  applications,
  onStopApplication,
  onStartApplication,
  onRestartApplication,
  onClickCreateNewApp,
  onDeleteApplication
}) {
  const [innerLoading, setInnerLoading] = useState(true)
  const [showNoResult, setShowNoResult] = useState(false)
  const [sortActiveOn, setSortActiveOn] = useState('name')
  const [sortByName, setSortByName] = useState(ASC)
  const [sortByStatus, setSortByStatus] = useState('')
  const [sortByPltVersion, setSortByPltVersion] = useState('')
  const [filteredApplications, setFilteredApplications] = useState([])

  // const orgIdOfUser = globalState.computed.orgIdOfUser

  useEffect(() => {
    if (applicationsLoaded) {
      if (applications.length > 0) {
        setFilteredApplications([...applications])
      } else {
        setShowNoResult(true)
      }
      setInnerLoading(false)
    }
  }, [applicationsLoaded, applications.length])

  useEffect(() => {
    if (filteredApplications.length > 0) {
      setInnerLoading(false)
    }
  }, [filteredApplications])

  function handleSortByName () {
    setSortActiveOn('name')
    const newValue = sortByName === '' ? ASC : sortByName === ASC ? DESC : ASC
    setSortByName(newValue)
    setFilteredApplications(sortCollection(filteredApplications, 'name', newValue === ASC))
  }

  function handleSortByStatus () {
    setSortActiveOn('status')
    const newValue = sortByStatus === '' ? ASC : sortByStatus === ASC ? DESC : ASC
    setSortByStatus(newValue)
    setFilteredApplications(sortCollection(filteredApplications, 'status', newValue === ASC))
  }

  function handleSortByPltVersion () {
    setSortActiveOn('platformaticVersion')
    const newValue = sortByPltVersion === '' ? ASC : sortByPltVersion === ASC ? DESC : ASC
    setSortByPltVersion(newValue)
    setFilteredApplications(sortCollection(filteredApplications, 'platformaticVersion', newValue === ASC))
  }

  function getSortIcon (key, cb) {
    if (sortActiveOn !== key) {
      return 'SortIcon'
    }
    return cb
  }

  function renderComponent () {
    if (innerLoading) {
      return (
        <LoadingSpinnerV2
          loading={innerLoading}
          applySentences={{
            containerClassName: `${commonStyles.mediumFlexBlock} ${commonStyles.itemsCenter}`,
            sentences: [{
              style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`,
              text: 'Loading your applications...'
            }, {
              style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`,
              text: 'This process will just take a few seconds.'
            }]
          }}
          containerClassName={styles.loadingSpinner}
        />
      )
    }
    if (showNoResult) {
      return (
        <div className={styles.noApplicationFound}>
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} `}>Seems that you haven't any application on your machine! Click here to Create your first application! &nbsp;
            <Button
              label='Create new App'
              onClick={() => onClickCreateNewApp()}
              color={RICH_BLACK}
              bordered={false}
              backgroundColor={WHITE}
              hoverEffect={DULLS_BACKGROUND_COLOR}
              hoverEffectProperties={{ changeBackgroundColor: ANTI_FLASH_WHITE }}
              paddingClass={`${commonStyles.buttonPadding} cy-action-create-app`}
              platformaticIcon={{ iconName: 'CreateAppIcon', size: SMALL, color: RICH_BLACK }}
            />
          </p>
        </div>
      )
    }
    return (
      <div className={styles.table}>
        <div className={styles.tableHeaders}>
          <div className={styles.tableHeader}>
            <div className={styles.thWithIcon}>
              <span className={`${typographyStyles.desktopOtherOverlineNormal} ${typographyStyles.textWhite}`}>Name</span>
              <PlatformaticIcon iconName={getSortIcon('name', sortByName === ASC ? 'SortDownIcon' : 'SortUpIcon')} color={WHITE} size={SMALL} onClick={() => handleSortByName()} />
            </div>
          </div>
          <div className={styles.tableHeader}>
            <div className={styles.thWithIcon}>
              <span className={`${typographyStyles.desktopOtherOverlineNormal} ${typographyStyles.textWhite}`}>Status</span>
              <PlatformaticIcon iconName={getSortIcon('status', sortByStatus === ASC ? 'SortDownIcon' : 'SortUpIcon')} color={WHITE} size={SMALL} onClick={() => handleSortByStatus()} />
            </div>
          </div>
          <div className={styles.tableHeader}>
            <div className={styles.thWithIcon}>
              <span className={`${typographyStyles.desktopOtherOverlineNormal} ${typographyStyles.textWhite}`}>Plt Version</span>
              <PlatformaticIcon iconName={getSortIcon('platformaticVersion', sortByPltVersion === ASC ? 'SortDownIcon' : 'SortUpIcon')} color={WHITE} size={SMALL} onClick={() => handleSortByPltVersion()} />
            </div>
          </div>
          <div className={styles.tableHeader}>
            <div className={styles.thWithIcon}>
              <span className={`${typographyStyles.desktopOtherOverlineNormal} ${typographyStyles.textWhite}`}>Actions</span>
            </div>
          </div>
        </div>

        {filteredApplications.map(application => (
          <Row
            key={application.id} {...application}
            onClickStop={() => onStopApplication(application.id)}
            onClickStart={() => onStartApplication(application.id)}
            onClickRestart={() => onRestartApplication(application.id)}
            onClickDelete={() => onDeleteApplication({ id: application.id, name: application.name })}

          />
        ))}
      </div>
    )
  }

  return (
    <div className={`${styles.container}`}>
      {renderComponent()}
    </div>
  )
}

TableRecent.propTypes = {
  /**
   * applicationsLoaded
    */
  applicationsLoaded: PropTypes.bool,
  /**
   * applications
    */
  applications: PropTypes.array,
  /**
   * onStopApplication
    */
  onStopApplication: PropTypes.func,
  /**
   * onStartApplication
    */
  onStartApplication: PropTypes.func,
  /**
   * onErrorOccurred
    */
  onErrorOccurred: PropTypes.func,
  /**
   * onErrorOccurred
    */
  onRunningApplication: PropTypes.func,
  /**
   * onDeleteApplication
    */
  onDeleteApplication: PropTypes.func
}

TableRecent.defaultProps = {
  applicationsLoaded: false,
  applications: [],
  onStopApplication: () => {},
  onStartApplication: () => {},
  onErrorOccurred: () => {},
  onRunningApplication: () => {},
  onClickCreateNewApp: () => {},
  onDeleteApplication: () => {}
}

export default TableRecent
