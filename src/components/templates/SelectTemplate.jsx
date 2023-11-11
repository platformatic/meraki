'use strict'
import { useState } from 'react'
import { RICH_BLACK, WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './SelectTemplate.module.css'
import { Button, SearchBarV2 } from '@platformatic/ui-components'
import Template from './Template'
import Title from '~/components/ui/Title'

function SelectTemplate () {
  const [templateSelected, setTemplateSelected] = useState('0')
  const [pages] = useState([1])
  const [templates] = useState([{
    id: '0', title: 'Platformatic service', platformaticService: true
  }, {
    id: '1', title: 'Template really long really longreally long name'
  }, {
    id: '2', title: 'Template name#1'
  }, {
    id: '3', title: 'Short'
  }, {
    id: '4', title: 'Template name#2'
  }, {
    id: '5', title: 'Casual Template'
  }])

  return (
    <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
      <div className={commonStyles.mediumFlexBlock}>
        <Title title='Select a Template' iconName='StackablesTemplate' />
        <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template from our Stackables Marketplace to be uses as a base for your new Service.If you don’t want to select any Template your new service will be built on top of Platformatic Service.</p>
      </div>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        <SearchBarV2 placeholder='Search for a Template' />
        <div className={styles.gridContainer}>
          <div className={styles.gridContent}>
            {templates.map(template =>
              <Template
                key={template.id}
                isSelected={templateSelected === template.id}
                onClick={() => setTemplateSelected(template.id)}
                {...template}
              />
            )}
          </div>
        </div>
        <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyCenter}`}>
          {pages.map(page => <div className={styles.page} key={page}>{page}</div>)}
        </div>
      </div>
      <Button
        classes={commonStyles.buttonPadding}
        label='Use Platformatic Service'
        backgroundColor={WHITE}
        color={RICH_BLACK}
        fullWidth
        bordered={false}
      />

    </div>
  )
}

export default SelectTemplate
