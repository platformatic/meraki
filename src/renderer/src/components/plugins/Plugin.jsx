'use strict'
import PropTypes from 'prop-types'
import { MEDIUM, TERTIARY_BLUE, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './Plugin.module.css'
import { Button, ModalDirectional } from '@platformatic/ui-components'
import { useState } from 'react'
import PluginDetail from './PluginDetail'

function Plugin ({ name, onClickCardPlugin, isSelected, description, tags, author, homepage }) {
  const [showModalDetail, setShowModalDetail] = useState(false)
  let className = `${commonStyles.smallFlexBlock} ${styles.container} `
  className += isSelected ? styles.selected : styles.unSelected

  function handleShowModal (event) {
    event.stopPropagation()
    setShowModalDetail(true)
  }

  function handleClickSelectPluginDetail () {
    setShowModalDetail(false)
    onClickCardPlugin()
  }

  return (
    <>
      <div className={className} onClick={() => onClickCardPlugin()} {...{ 'data-cy': 'template' }}>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.overflowHidden}`}>
          <Icons.StackablesPluginIcon color={TERTIARY_BLUE} size={MEDIUM} />
          <p
            className={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite} ${styles.ellipsis}`}
            title={name}
          >
            {name}
          </p>
        </div>
        <Button
          type='button'
          color={WHITE}
          label='View Details'
          platformaticIconAfter={{ iconName: 'ArrowLongRightIcon', color: WHITE }}
          bordered={false}
          classes={commonStyles.noPadding}
          onClick={(event) => handleShowModal(event)}
        />
      </div>
      {showModalDetail && (
        <ModalDirectional
          key={name}
          setIsOpen={() => setShowModalDetail(false)}
          title='Back to Plugin'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
        >
          <PluginDetail
            name={name}
            description={description}
            tags={tags}
            author={author}
            homepage={homepage}
            onClickSelectPlugin={() => handleClickSelectPluginDetail()}
          />
        </ModalDirectional>
      )}
    </>
  )
}

Plugin.propTypes = {
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * isSelected
    */
  isSelected: PropTypes.bool,
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
  homepage: PropTypes.string

}

Plugin.defaultProps = {
  name: '',
  isSelected: false,
  description: '',
  tags: [],
  author: '',
  homepage: ''
}

export default Plugin
