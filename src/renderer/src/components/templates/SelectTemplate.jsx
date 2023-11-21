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
import useStackablesStore from '~/useStackablesStore'
import { getTemplates } from '../../api'
import { MAX_MUMBER_SELECT } from '~/ui-constants'

function SelectTemplate ({ onClick, serviceName }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPages] = useState([1])
  const [groupedTemplates, setGroupedTemplates] = useState([])
  const [templates, setTemplates] = useState([])
  const [templateSelected, setTemplateSelected] = useState(null)
  const globalState = useStackablesStore()
  const { setTemplate } = globalState
  const scrollRef = useRef(null)
  const containerScrollRef = useRef(null)

  function handleUsePlatformaticService () {
    setTemplate(serviceName, templateSelected)
    onClick()
  }

  /* useEffect(() => {
    function handleScroll(evt) {
      console.log(evt);
    }

    scrollRef.current.addEventListener('scroll', handleScroll)

    return function cleanup() {
      scrollRef.current.removeEventListener('scroll', handleScroll)
    }
  }) */

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

  useEffect(() => {
    setTemplates(getTemplates())
  }, [])

  useEffect(() => {
    if (templates.length > 0) {
      setTemplateSelected(templates[0])
      const groupedTemplates = []
      for (let i = 0; i < templates.length; i += MAX_MUMBER_SELECT) {
        groupedTemplates.push(templates.slice(i, i + MAX_MUMBER_SELECT))
      }
      setGroupedTemplates(groupedTemplates)
      setPages(Array.from(new Array(groupedTemplates.length).keys()).map(x => x + 1))
    }
  }, [templates.length])

  function renderContent () {
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
        <SearchBarV2 placeholder='Search for a Template' />
        <div className={styles.templatesContainer} ref={containerScrollRef}>
          <div className={styles.templatesContent} ref={scrollRef}>
            {renderContent()}
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
