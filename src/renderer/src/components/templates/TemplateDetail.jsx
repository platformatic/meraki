'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './TemplateDetail.module.css'
import Title from '~/components/ui/Title'
import { Button, HorizontalSeparator, Icons, Tag } from '@platformatic/ui-components'
import { MARGIN_0, OPACITY_30, RICH_BLACK, SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'

function TemplateDetail ({ name, description, tags, author, onClickSelectTemplate }) {
  return (
    <div className={styles.container}>
      <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
        <div className={commonStyles.mediumFlexBlock}>
          <Title
            title={name}
            iconName='StackablesTemplateIcon'
            dataAttrName='cy'
            dataAttrValue='modal-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{description}</p>
          <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} `}>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
              <Icons.UserComputerIcon color={WHITE} size={SMALL} />
              <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{author}</span>
            </div>
          </div>
        </div>

        <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
        {tags.length > 0 && (
          <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth}`}>
            <h4 className={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}>Tags</h4>
            {tags.map(tag =>
              <Tag
                key={tag}
                text={tag.toUpperCase()}
                textClassName={`${typographyStyles.desktopOtherOverlineNormal} ${typographyStyles.textWhite}`}
                backgroundColor={WHITE}
                bordered={false}
                opaque={OPACITY_30}
                fullRounded
              />)}

          </div>
        )}
      </div>

      <Button
        classes={commonStyles.buttonPadding}
        label={`Select ${name}`}
        backgroundColor={WHITE}
        color={RICH_BLACK}
        fullWidth
        bordered={false}
        onClick={() => onClickSelectTemplate()}
      />
    </div>
  )
}

TemplateDetail.propTypes = {
  /**
   * name
    */
  name: PropTypes.string.isRequired,
  /**
   * description
    */
  description: PropTypes.string,
  /**
   * tags
    */
  tags: PropTypes.arrayOf(PropTypes.string),
  /**
   * author
    */
  author: PropTypes.string,
  /**
   * onClickSelectTemplate
    */
  onClickSelectTemplate: PropTypes.func
}

TemplateDetail.defaultProps = {
  description: '',
  tags: [],
  author: '',
  onClickSelectTemplate: () => {}
}

export default TemplateDetail
