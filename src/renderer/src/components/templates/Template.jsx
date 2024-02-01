'use strict'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { MAIN_GREEN, MEDIUM, WHITE, SMALL } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import modalStyles from '~/styles/ModalStyles.module.css'
import styles from './Template.module.css'
import TemplateDetail from './TemplateDetail'
import { Logo, ModalDirectional } from '@platformatic/ui-components'

function Template ({
  platformaticService,
  name,
  isSelected,
  description,
  tags,
  author,
  homepage,
  downloads,
  onClickCardTemplate
}) {
  const [showModalDetail, setShowModalDetail] = useState(false)
  let className = `${commonStyles.extraSmallFlexBlock} ${styles.container} `
  className += isSelected ? styles.selected : styles.unSelected

  function handleShowModal (event) {
    event.stopPropagation()
    setShowModalDetail(true)
  }

  function handleClickSelectTemplateDetail () {
    setShowModalDetail(false)
    onClickCardTemplate()
  }

  return (
    <>
      <div className={className} onClick={() => onClickCardTemplate()} {...{ 'data-cy': 'template' }}>
        <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${styles.overflowHidden}`}>
          {platformaticService ? (<Logo width={30.32} height={24} />) : (<Icons.StackablesTemplateIcon color={MAIN_GREEN} size={MEDIUM} />)}
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
          title='Back to Template'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          classNameModalLefty={modalStyles.modalLefty}
        >
          <TemplateDetail
            name={name}
            description={description}
            tags={tags}
            author={author}
            downloads={downloads}
            homepage={homepage}
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
  tags: []
}

export default Template
