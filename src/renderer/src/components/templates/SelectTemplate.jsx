'use strict'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { RICH_BLACK, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './SelectTemplate.module.css'
import { Button, SearchBarV2 } from '@platformatic/ui-components'
import Template from './Template'
import Title from '~/components/ui/Title'
import useStackablesStore from '~/useStackablesStore'
import { getTemplates } from '../../api'

function SelectTemplate ({ onClick, serviceId }) {
  const [pages] = useState([1])
  const [templates, setTemplates] = useState([])
  const [templateSelected, setTemplateSelected] = useState(null)
  const globalState = useStackablesStore()
  const { setTemplate } = globalState

  function handleUsePlatformaticService () {
    setTemplate(serviceId, templateSelected)
    onClick()
  }

  useEffect(() => {
    setTemplates(getTemplates(12))
  }, [])

  useEffect(() => {
    if (templates.length > 0) {
      setTemplateSelected(templates[0])
    }
  }, [templates.length])

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
        <div className={styles.gridContainer}>
          <div className={styles.gridContent}>
            {templates.map(template =>
              <Template
                key={template.id}
                isSelected={templateSelected.id === template.id}
                onClick={() => setTemplateSelected(template)}
                {...template}
              />
            )}
          </div>
        </div>
        <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyCenter}`}>
          {pages.map(page =>
            <Button
              key={page}
              classes={`${commonStyles.buttonPadding}`}
              label={`${page}`}
              onClick={() => { }}
              color={WHITE}
              selected={page === 1}
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
   * serviceId
    */
  serviceId: PropTypes.number.isRequired
}

SelectTemplate.defaultProps = {
  onClick: () => {}
}

export default SelectTemplate
