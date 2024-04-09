'use strict'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MAIN_GREEN, MEDIUM, WHITE, SMALL, ACTIVE_AND_INACTIVE_STATUS, TRANSPARENT } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import modalStyles from '~/styles/ModalStyles.module.css'
import styles from './Template.module.css'
import TemplateDetail from './TemplateDetail'
import { Button, Logo, ModalDirectional } from '@platformatic/ui-components'

function Template ({
  platformaticService,
  name,
  isSelected,
  description,
  tags,
  author,
  homepage,
  downloads,
  releasedAt,
  onClickCardTemplate
}) {
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

  function handleClickSelectTemplateDetail () {
    setShowModalDetail(false)
    onClickCardTemplate()
  }

  function normalClassName () {
    return `${commonStyles.miniFlexBlock} ${styles.container} ${styles.unSelected}`
  }

  function hoverClassName () {
    return `${commonStyles.miniFlexBlock} ${styles.container} ${styles.selected}`
  }

  return (
    <>
      <div
        className={className}
        onClick={() => onClickCardTemplate()}
        onMouseLeave={() => { setHover(false) }}
        onMouseOver={() => { setHover(true) }}
        {...{ 'data-cy': 'template' }}
      >
        <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${styles.overflowHidden}`}>
          {platformaticService ? (<Logo width={30.32} height={24} />) : (<Icons.StackablesTemplateIcon color={MAIN_GREEN} size={MEDIUM} />)}
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
          title='Back to Template'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} `}
          classNameModalLefty={modalStyles.modalLefty}
          permanent
        >
          <TemplateDetail
            name={name}
            description={description}
            tags={tags}
            author={author}
            downloads={downloads}
            homepage={homepage}
            releasedAt={releasedAt}
            onClickSelectTemplate={() => handleClickSelectTemplateDetail()}
          />
        </ModalDirectional>
      )}
    </>

  )
}

Template.propTypes = {
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * platformaticService
    */
  platformaticService: PropTypes.bool,
  /**
   * isSelected
    */
  isSelected: PropTypes.bool,
  /**
   * onClickCardTemplate
    */
  onClickCardTemplate: PropTypes.func,
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
   * downloads
    */
  downloads: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /**
   * releasedAt
    */
  releasedAt: PropTypes.string,
  /**
   * homepage
    */
  homepage: PropTypes.string
}

Template.defaultProps = {
  name: '',
  platformaticService: false,
  isSelected: false,
  onClickCardTemplate: () => {},
  description: '',
  author: '',
  downloads: 0,
  homepage: '',
  releasedAt: '-',
  tags: []
}

export default Template
