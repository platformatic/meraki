'use strict'
import PropTypes from 'prop-types'
import { MEDIUM, SMALL, TERTIARY_BLUE, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import modalStyles from '~/styles/ModalStyles.module.css'
import styles from './Plugin.module.css'
import { ModalDirectional } from '@platformatic/ui-components'
import { useState } from 'react'
import PluginDetail from './PluginDetail'

function Plugin ({ name, onClickCardPlugin, isSelected, description, tags, author, homepage, downloads }) {
  const [showModalDetail, setShowModalDetail] = useState(false)
  let className = `${commonStyles.extraSmallFlexBlock} ${styles.container} `
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
        <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${styles.overflowHidden}`}>
          <Icons.StackablesPluginIcon color={TERTIARY_BLUE} size={MEDIUM} />
          <p
            className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${styles.ellipsis}`}
            title={name}
          >
            {name}
          </p>
        </div>
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter} ${styles.link}`} onClick={(event) => handleShowModal(event)}>
          <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} `}>View Details</span>
          <Icons.ArrowLongRightIcon color={WHITE} size={SMALL} />
        </div>
      </div>
      {showModalDetail && (
        <ModalDirectional
          key={name}
          setIsOpen={() => setShowModalDetail(false)}
          title='Back to Plugin'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          classNameModalLefty={modalStyles.modalLefty}
        >
          <PluginDetail
            name={name}
            description={description}
            tags={tags}
            author={author}
            homepage={homepage}
            downloads={downloads}
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
  homepage: PropTypes.string,
  /**
   * downloads
    */
  downloads: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

Plugin.defaultProps = {
  name: '',
  isSelected: false,
  description: '',
  tags: [],
  author: '',
  downloads: 0,
  homepage: ''
}

export default Plugin
