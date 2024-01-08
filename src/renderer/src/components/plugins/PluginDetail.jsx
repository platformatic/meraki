'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './PluginDetail.module.css'
import Title from '~/components/ui/Title'
import { Button, HorizontalSeparator, Icons, Tag, VerticalSeparator } from '@platformatic/ui-components'
import { MARGIN_0, OPACITY_30, RICH_BLACK, SMALL, TERTIARY_BLUE, WHITE } from '@platformatic/ui-components/src/components/constants'

function PluginDetail ({ name, description, tags, author, homepage, onClickSelectPlugin }) {
  return (
    <div className={styles.container}>
      <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
        <div className={commonStyles.mediumFlexBlock}>
          <Title
            title={name}
            iconName='StackablesPluginIcon'
            dataAttrName='cy'
            dataAttrValue='modal-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{description}</p>
          <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} `}>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
              <Icons.UserComputerIcon color={WHITE} size={SMALL} />
              <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{author}</span>
            </div>

            {homepage && (
              <>
                <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} />
                <a className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter} ${styles.link}`} href={homepage} target='_blank' rel='noreferrer'>
                  <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textTertiaryBlue}`}>README File</span>
                  <Icons.ExpandIcon color={TERTIARY_BLUE} size={SMALL} />
                </a>
              </>
            )}
          </div>
        </div>

        <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
        {tags.length > 0 && (
          <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
            <h4 className={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}>Tags</h4>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth}`}>
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
        onClick={() => onClickSelectPlugin()}
      />
    </div>
  )
}

PluginDetail.propTypes = {
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
   * homepage
    */
  homepage: PropTypes.string,
  /**
   * onClickSelectPlugin
    */
  onClickSelectPlugin: PropTypes.func
}

PluginDetail.defaultProps = {
  description: '',
  tags: [],
  author: '',
  homepage: '',
  onClickSelectPlugin: () => {}
}

export default PluginDetail
