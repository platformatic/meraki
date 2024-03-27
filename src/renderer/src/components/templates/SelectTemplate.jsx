'use strict'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { BOX_SHADOW, RICH_BLACK, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './SelectTemplate.module.css'
import { Button, LoadingSpinnerV2, SearchBarV2 } from '@platformatic/ui-components'
import Template from './Template'
import Title from '~/components/ui/Title'
import NoResults from '~/components/ui/NoResults'
import useStackablesStore from '~/useStackablesStore'
import { getApiTemplates, registerUserStatusListener } from '~/api'
import { MAX_MUMBER_SELECT, MIN_MUMBER_SELECT, NO_RESULTS_VIEW, LIST_TEMPLATES_VIEW, MAX_HEIGHT_CHANGE_NUMBER_SELECT } from '~/ui-constants'
import Forms from '@platformatic/ui-components/src/components/forms'
import useWindowDimensions from '~/hooks/useWindowDimensions'

function SelectTemplate ({ onClick, serviceName }) {
  const globalState = useStackablesStore()
  const { getService, setTemplate } = globalState
  const [templates, setTemplates] = useState([])
  const [innerLoading, setInnerLoading] = useState(true)
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [optionsOrganizationsTemplates, setOptionsOrganizationsTemplates] = useState([])
  const [groupedTemplates, setGroupedTemplates] = useState([])
  const [userStatus, setUserStatus] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentView, setCurrentView] = useState(LIST_TEMPLATES_VIEW)
  const [pages, setPages] = useState([1])
  const [templateSelected, setTemplateSelected] = useState(null)
  const scrollRef = useRef(null)
  const [filterTemplatesByName, setFilterTemplatesByName] = useState('')
  const [filterTemplatesByOrgName, setFilterTemplatesByOrgName] = useState('')
  const [maxStackableDispay, setMaxStackableDispay] = useState(MAX_MUMBER_SELECT)
  const { height: innerHeight } = useWindowDimensions()
  const [templateContainerClassName, setTemplateContainerClassName] = useState(`${styles.templatesContainer} ${styles.templatesContainerMediumHeight}`)
  const [viewContainerClassName, setViewContainerClassName] = useState(`${styles.containerView} ${styles.containerViewMediumHeight}`)
  const containerScrollRef = useRef(null)

  registerUserStatusListener((_, value) => setUserStatus(value))

  useEffect(() => {
    async function getTemplates () {
      const templates = await getApiTemplates()
      setOptionsOrganizationsTemplates([...getOrganizationGrouped(templates)])
      setTemplates(templates)
      setFilteredTemplates([...templates])
      setTemplateSelected(templates[0])
      setInnerLoading(false)
    }
    getTemplates()
  }, [])

  useEffect(() => {
    if (innerHeight >= MAX_HEIGHT_CHANGE_NUMBER_SELECT && maxStackableDispay === MIN_MUMBER_SELECT) {
      setMaxStackableDispay(MAX_MUMBER_SELECT)
      setTemplateContainerClassName(`${styles.templatesContainer} ${styles.templatesContainerMediumHeight}`)
      setViewContainerClassName(`${styles.containerView} ${styles.containerViewMediumHeight}`)
    }
    if (innerHeight < MAX_HEIGHT_CHANGE_NUMBER_SELECT && maxStackableDispay === MAX_MUMBER_SELECT) {
      setMaxStackableDispay(MIN_MUMBER_SELECT)
      setTemplateContainerClassName(`${styles.templatesContainer} ${styles.templatesContainerSmallHeight}`)
      setViewContainerClassName(`${styles.containerView} ${styles.containerViewSmallHeight}`)
    }
  }, [innerHeight])

  useEffect(() => {
    if (templates.length > 0 && serviceName && Object.keys(getService(serviceName)?.template).length > 0) {
      setTemplateSelected(getService(serviceName).template)
    } else {
      setTemplateSelected(templates[0])
    }
  }, [templates, serviceName, Object.keys(getService(serviceName).template).length])

  useEffect(() => {
    if (filterTemplatesByOrgName || filterTemplatesByName) {
      let founds = [...templates]
      if (filterTemplatesByOrgName) {
        founds = templates.filter(template => template.orgName === filterTemplatesByOrgName)
      }
      founds = founds.filter(template => template.name.toLowerCase().includes(filterTemplatesByName.toLowerCase()))
      setFilteredTemplates(founds)
    } else {
      setFilteredTemplates([...templates])
    }
  }, [filterTemplatesByOrgName, filterTemplatesByName])

  useEffect(() => {
    if (filteredTemplates.length > 0) {
      if (currentView === NO_RESULTS_VIEW) {
        setCurrentView(LIST_TEMPLATES_VIEW)
      }
      const groupedTemplates = []
      for (let i = 0; i < filteredTemplates.length; i += maxStackableDispay) {
        groupedTemplates.push(filteredTemplates.slice(i, i + maxStackableDispay))
      }
      setGroupedTemplates(groupedTemplates)
      setPages(Array.from(new Array(groupedTemplates.length).keys()).map(x => x + 1))
    }
    if (filteredTemplates.length === 0 && filterTemplatesByName) {
      if (currentView === LIST_TEMPLATES_VIEW) {
        setCurrentView(NO_RESULTS_VIEW)
      }
    }
  }, [filteredTemplates.length, filterTemplatesByName, maxStackableDispay])

  function handleUsePlatformaticService () {
    setTemplate(serviceName, templateSelected)
    onClick()
  }

  function getOrganizationGrouped (templates) {
    return templates.map(e => e?.orgName || 'No Name').reduce((acc, currentValue) => {
      const found = acc.find(a => a.label === currentValue)
      if (found) {
        found.count += 1
      } else {
        acc.push({
          label: currentValue,
          count: 1
        })
      }
      return acc
    }, []).sort((a, b) => {
      const labelA = a.label.toUpperCase()
      const labelB = b.label.toUpperCase()
      if (labelA < labelB) {
        return -1
      }
      if (labelA > labelB) {
        return 1
      }
      return 0
    }).map(ele => ({
      label: ele.label,
      value: ele.label,
      iconName: 'OrganizationIcon',
      descriptionValue: `( ${ele.count} ${ele.count > 1 ? 'Templates' : 'Template'} )`
    }))
  }

  function handleClearTemplates () {
    setFilterTemplatesByName('')
  }

  function handleFilterTemplates (value) {
    setFilterTemplatesByName(value)
  }

  const scroll = (page) => {
    let sign = 0; let howManyPages = 0
    if (page > currentPage) {
      sign = 1
      howManyPages = page - currentPage
    } else {
      sign = -1
      howManyPages = currentPage - page
    }

    setCurrentPage(page)

    scrollRef.current.scrollBy({
      top: 0,
      left: sign * (containerScrollRef.current.clientWidth + 8) * howManyPages,
      behavior: 'smooth'
    })
  }

  // Functions Related to Form.Select
  function handleChangeOrganization (event) {
    setFilterTemplatesByOrgName(event.target.value)
  }

  function handleSelectOrganization (event) {
    setFilterTemplatesByOrgName(event.detail.value)
  }

  function handleClearOrganization () {
    setFilterTemplatesByOrgName('')
  }
  // End Functions Related to Form.Select

  function renderListTemplates () {
    return groupedTemplates.map((templates, index) => (
      <div className={styles.gridContainer} key={index}>
        <div className={styles.gridContent}>
          {templates.map(template =>
            <Template
              key={template.name}
              isSelected={templateSelected.name === template.name}
              onClickCardTemplate={() => setTemplateSelected(template)}
              {...template}
            />
          )}
        </div>
      </div>
    ))
  }

  function renderCurrentView () {
    if (currentView === LIST_TEMPLATES_VIEW) {
      return (
        <div className={templateContainerClassName} ref={containerScrollRef}>
          <div className={styles.templatesContent} ref={scrollRef}>
            {renderListTemplates()}
          </div>
        </div>
      )
    }
    return (
      <NoResults
        searchedValue={filterTemplatesByName}
        dataAttrName='cy'
        dataAttrValue='template-no-results'
      />
    )
  }

  function renderLoginStatusMessage (color, message, showInstructions) {
    return (
      <div className={`${commonStyles.miniFlexBlock}`}>
        <div className={`${commonStyles.tinyFlexRow} ${commonStyles.fullWidth}`}>
          <div>
            <svg width='10' height='10'>
              <circle cx='5' cy='5' r='4' fill={color} />
            </svg>
          </div>
          <div className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
            {message}
          </div>
        </div>
        {showInstructions && (
          <div className={`${commonStyles.tinyFlexRow} ${commonStyles.fullWidth}`}>
            <div>
              <svg width='10' height='10' />
            </div>
            <div className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
              If you want to view stackables in one of your organizations, remember to log in using <a href='https://docs.platformatic.dev/docs/reference/cli/#login' target='_blank' className={styles.link} rel='noreferrer'>platformatic login</a>.
            </div>
          </div>
        )}
      </div>
    )
  }

  function renderLoginStatus () {
    if (userStatus === 'LOGGED_IN') {
      return renderLoginStatusMessage('green', 'Login session valid')
    } else if (userStatus === 'INVALID_API_KEY') {
      return renderLoginStatusMessage('yellow', 'Login session expired', true)
    } else if (userStatus === 'NO_API_KEY') {
      return renderLoginStatusMessage('red', 'Login session invalid', true)
    }
  }

  return (
    <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth} ${styles.container}`}>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        <div className={commonStyles.mediumFlexBlock}>
          <Title
            title='Select a Template'
            iconName='StackablesTemplateIcon'
            dataAttrName='cy'
            dataAttrValue='modal-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
            Select a template from our Stackables Marketplace to be uses as a base for your new Service. If you don’t want to select any Template your new service will be built on top of Platformatic Service.
          </p>
        </div>
        <div className={`${commonStyles.mediumFlexBlock24} ${commonStyles.fullWidth}`}>
          <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`}>
            <div className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
              {renderLoginStatus()}
            </div>
            <div className={`${commonStyles.tinyFlexRow} ${commonStyles.fullWidth}`}>
              <Forms.SelectWithInput
                defaultContainerClassName={styles.select}
                backgroundColor={RICH_BLACK}
                placeholder='Select Organization'
                borderColor={WHITE}
                options={optionsOrganizationsTemplates}
                defaultOptionsClassName={styles.selectUl}
                onChange={handleChangeOrganization}
                onSelect={handleSelectOrganization}
                onClear={handleClearOrganization}
                optionsBorderedBottom={false}
                mainColor={WHITE}
                borderListColor={WHITE}
                value={filterTemplatesByOrgName}
              />
              <SearchBarV2
                placeholder='Search for a Template'
                onClear={handleClearTemplates}
                onChange={handleFilterTemplates}
              />
            </div>
          </div>
          <div className={`${commonStyles.mediumFlexBlock24} ${commonStyles.fullWidth} ${commonStyles.justifyCenter} ${viewContainerClassName}`}>
            {innerLoading
              ? <LoadingSpinnerV2
                  loading={innerLoading}
                  applySentences={{
                    containerClassName: `${commonStyles.mediumFlexBlock} ${commonStyles.itemsCenter}`,
                    sentences: [{
                      style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`,
                      text: 'Loading templates...'
                    }, {
                      style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`,
                      text: 'This process will just take a few seconds.'
                    }]
                  }}
                  containerClassName={styles.loadingSpinner}
                />
              : renderCurrentView()}
          </div>
        </div>
      </div>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        {currentView === LIST_TEMPLATES_VIEW && (
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyCenter}`}>
            {pages.map(page =>
              <Button
                key={page}
                paddingClass={commonStyles.buttonPadding}
                label={`${page}`}
                onClick={() => scroll(page)}
                color={WHITE}
                selected={page === currentPage}
                backgroundColor={TRANSPARENT}
                bordered={false}
              />
            )}
          </div>
        )}
        <Button
          disabled={!templateSelected}
          paddingClass={`${commonStyles.buttonPadding} cy-action-use-template`}
          label={`Use ${templateSelected?.name ?? '...'}`}
          color={RICH_BLACK}
          backgroundColor={WHITE}
          hoverEffect={BOX_SHADOW}
          fullWidth
          bordered={false}
          onClick={() => handleUsePlatformaticService()}
        />
      </div>
    </div>
  )
}

SelectTemplate.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func,
  /**
   * serviceName
    */
  serviceName: PropTypes.string
}

SelectTemplate.defaultProps = {
  onClick: () => {},
  serviceName: ''
}

export default SelectTemplate
