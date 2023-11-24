'use strict'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { RICH_BLACK, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './SelectTemplate.module.css'
import { Button, SearchBarV2 } from '@platformatic/ui-components'
import Template from './Template'
import Title from '~/components/ui/Title'
import NoResults from '~/components/ui/NoResults'
import useStackablesStore from '~/useStackablesStore'
import { getApiTemplates } from '~/api'
import { MAX_MUMBER_SELECT, NO_RESULTS_VIEW, LIST_TEMPLATES_VIEW } from '~/ui-constants'
import Forms from '@platformatic/ui-components/src/components/forms'

function SelectTemplate ({ onClick, serviceName }) {
  const globalState = useStackablesStore()
  const { getService, setTemplate } = globalState
  const [templates, setTemplates] = useState([])
  const [filteredTemplates, setFilteredTemplates] = useState([])
  const [optionsOrganizationsTemplates, setOptionsOrganizationsTemplates] = useState([])
  const [groupedTemplates, setGroupedTemplates] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filterTemplatesByValue, setFilterTemplatesByValue] = useState('')
  const [currentView, setCurrentView] = useState(LIST_TEMPLATES_VIEW)
  const [pages, setPages] = useState([1])
  const [templateSelected, setTemplateSelected] = useState(null)
  const scrollRef = useRef(null)
  const containerScrollRef = useRef(null)

  useEffect(() => {
    async function getTemplates () {
      const templates = await getApiTemplates()
      const tmpOptions = templates.map(e => e.orgName).filter(onlyUnique).sort().map(ele => ({ label: ele, value: ele, iconName: 'OrganizationIcon' }))
      setOptionsOrganizationsTemplates([...tmpOptions])
      setTemplates(templates)
      setFilteredTemplates([...templates])
      setTemplateSelected(templates[0])
    }
    getTemplates()
  }, [])

  useEffect(() => {
    if (templates.length > 0 && serviceName && Object.keys(getService(serviceName)?.template).length > 0) {
      setTemplateSelected(getService(serviceName).template)
    } else {
      setTemplateSelected(templates[0])
    }
  }, [templates, serviceName, Object.keys(getService(serviceName).template).length])

  useEffect(() => {
    if (filteredTemplates.length > 0) {
      if (currentView === NO_RESULTS_VIEW) {
        setCurrentView(LIST_TEMPLATES_VIEW)
      }
      const groupedTemplates = []
      for (let i = 0; i < filteredTemplates.length; i += MAX_MUMBER_SELECT) {
        groupedTemplates.push(filteredTemplates.slice(i, i + MAX_MUMBER_SELECT))
      }
      setGroupedTemplates(groupedTemplates)
      setPages(Array.from(new Array(groupedTemplates.length).keys()).map(x => x + 1))
    }
    if (filteredTemplates.length === 0 && filterTemplatesByValue) {
      if (currentView === LIST_TEMPLATES_VIEW) {
        setCurrentView(NO_RESULTS_VIEW)
      }
    }
  }, [filteredTemplates.length, filterTemplatesByValue])

  function handleUsePlatformaticService () {
    setTemplate(serviceName, templateSelected)
    onClick()
  }

  function onlyUnique (value, index, array) {
    return array.indexOf(value) === index
  }

  function handleClearTemplates () {
    setFilterTemplatesByValue('')
    setFilteredTemplates([...templates])
  }

  function handleFilterTemplates (value) {
    setFilterTemplatesByValue(value)
    setCurrentPage(1)
    const founds = templates.filter(template => template.name.toLowerCase().includes(value.toLowerCase()))
    setFilteredTemplates(founds)
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
  function handleChangeOrganization () {

  }

  function handleSelectOrganization () {

  }

  function handleClearOrganization () {

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
              onClick={() => setTemplateSelected(template)}
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
        <>
          <div className={styles.templatesContainer} ref={containerScrollRef}>
            <div className={styles.templatesContent} ref={scrollRef}>
              {renderListTemplates()}
            </div>
          </div>
          <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyCenter}`}>
            {pages.map(page =>
              <Button
                key={page}
                classes={`${commonStyles.buttonPadding}`}
                label={`${page}`}
                onClick={() => scroll(page)}
                color={WHITE}
                selected={page === currentPage}
                backgroundColor={TRANSPARENT}
                bordered={false}
              />
            )}
          </div>
        </>
      )
    }
    return (
      <NoResults
        searchedValue={filterTemplatesByValue}
        dataAttrName='cy'
        dataAttrValue='template-no-results'
      />
    )
  }

  return templateSelected && (
    <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
      <div className={commonStyles.mediumFlexBlock}>
        <Title
          title='Select a Template'
          iconName='StackablesTemplateIcon'
          dataAttrName='cy'
          dataAttrValue='modal-title'
        />
        <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template from our Stackables Marketplace to be uses as a base for your new Service.If you don’t want to select any Template your new service will be built on top of Platformatic Service.</p>
      </div>
      <div className={`${commonStyles.mediumFlexBlock24} ${commonStyles.fullWidth}`}>
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth}`}>
          <Forms.Select
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
          />
          <SearchBarV2
            placeholder='Search for a Template'
            onClear={handleClearTemplates}
            onChange={handleFilterTemplates}
          />
        </div>
        <div className={`${commonStyles.mediumFlexBlock24} ${commonStyles.fullWidth} ${commonStyles.justifyCenter} ${styles.containerView}`}>
          {renderCurrentView()}
        </div>
      </div>
      <Button
        classes={`${commonStyles.buttonPadding} cy-action-use-template`}
        label={`Use ${templateSelected.name}`}
        backgroundColor={WHITE}
        color={RICH_BLACK}
        fullWidth
        bordered={false}
        onClick={() => handleUsePlatformaticService()}
      />
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
