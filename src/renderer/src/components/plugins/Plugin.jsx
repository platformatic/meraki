'use strict'
import PropTypes from 'prop-types'
import { ACTIVE_AND_INACTIVE_STATUS, MEDIUM, SMALL, TERTIARY_BLUE, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import modalStyles from '~/styles/ModalStyles.module.css'
import styles from './Plugin.module.css'
import { Button, ModalDirectional } from '@platformatic/ui-components'
import { useState, useEffect } from 'react'
import PluginDetail from './PluginDetail'

function Plugin ({ name, onClickCardPlugin, isSelected, description, tags, author, homepage, downloads, releasedAt }) {
  const [showModalDetail, setShowModalDetail] = useState(false)
  const [hover, setHover] = useState(false)
  const [className, setClassName] = useState(normalClassName())

  useEffect(() => {
    if (hover || isSelected) {
      setClassName(hoverClassName())
    } else {
      setClassName(normalClassName())
    }
  }, [hover, isSelected])

  function handleShowModal (event) {
    event.stopPropagation()
    setShowModalDetail(true)
  }

  function handleClickSelectPluginDetail () {
    setShowModalDetail(false)
    onClickCardPlugin()
  }

  function normalClassName () {
    return `${commonStyles.extraSmallFlexBlock} ${styles.container} ${styles.unSelected}`
  }

  function hoverClassName () {
    return `${commonStyles.extraSmallFlexBlock} ${styles.container} ${styles.selected}`
  }

  return (
    <>
      <div
        className={className}
        onClick={() => onClickCardPlugin()}
        onMouseLeave={() => { setHover(false) }}
        onMouseOver={() => { setHover(true) }}
        {...{ 'data-cy': 'plugin' }}
      >
        <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${styles.overflowHidden}`}>
          <Icons.StackablesPluginIcon color={TERTIARY_BLUE} size={MEDIUM} />
          <p
            className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${styles.ellipsis}`}
            title={name}
          >
            {name}
          </p>
        </div>
        <Button
          type='button'
          paddingClass={commonStyles.buttonPadding}
          label='View Details'
          onClick={(event) => handleShowModal(event)}
          color={WHITE}
          bordered={false}
          backgroundColor={TRANSPARENT}
          hoverEffect={ACTIVE_AND_INACTIVE_STATUS}
          platformaticIconAfter={{ iconName: 'ArrowLongRightIcon', size: SMALL, color: WHITE }}
        />
      </div>
      {showModalDetail && (
        <ModalDirectional
          key={name}
          setIsOpen={() => setShowModalDetail(false)}
          title='Back to Plugin'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}
          classNameModalLefty={modalStyles.modalLefty}
        >
          <PluginDetail
            name={name}
            description={description}
            tags={tags}
            author={author}
            homepage={homepage}
            downloads={downloads}
            releasedAt={releasedAt}
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
  ]),
  /**
   * releasedAt
    */
  releasedAt: PropTypes.string
}

Plugin.defaultProps = {
  name: '',
  isSelected: false,
  description: '',
  tags: [],
  author: '',
  downloads: 0,
  homepage: '',
  releasedAt: '-'
}

export default Plugin
