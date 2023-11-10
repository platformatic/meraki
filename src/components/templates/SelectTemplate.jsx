'use strict'
import { useState } from 'react'
import { LARGE, RICH_BLACK, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './SelectTemplate.module.css'
import { Button, SearchBar } from '@platformatic/ui-components'
import Template from './Template'

function SelectTemplate () {
  const [templateSelected, setTemplateSelected] = useState('0')
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
        <div className={commonStyles.mediumFlexRow}>
          <Icons.AppIcon color={WHITE} size={LARGE} />
          <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>Select a Template</h2>
        </div>
        <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template from our Stackables Marketplace to be uses as a base for your new Service.If you don’t want to select any Template your new service will be built on top of Platformatic Service.</p>
      </div>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        <SearchBar />
        <div className={styles.gridContainer}>
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
