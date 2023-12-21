'use strict'
import { useState } from 'react'
import PropTypes from 'prop-types'
import { MAIN_GREEN, MEDIUM, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './Template.module.css'
import TemplateDetail from './TemplateDetail'
import { Button, Logo, ModalDirectional } from '@platformatic/ui-components'

function Template ({
  platformaticService,
  name,
  onClickCardTemplate,
  isSelected,
  description,
  tags,
  author
}) {
  const [showModalDetail, setShowModalDetail] = useState(false)
  let className = `${commonStyles.smallFlexBlock} ${styles.container} `
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
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.overflowHidden}`}>
          {platformaticService ? (<Logo width={30.32} height={24} />) : (<Icons.StackablesTemplateIcon color={MAIN_GREEN} size={MEDIUM} />)}
          <p
            className={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite} ${styles.ellipsis}`}
            title={name}
          >
            {name}
          </p>
        </div>
        <Button
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
          title='Back to Template'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
        >
          <TemplateDetail
            name={name}
            description={description}
            tags={tags}
            author={author}
            onClickSelectPlugin={() => handleClickSelectTemplateDetail()}
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
  author: PropTypes.string
}

Template.defaultProps = {
  name: '',
  platformaticService: false,
  isSelected: false,
  onClickCardTemplate: () => {},
  description: '',
  author: '',
  tags: []
}

export default Template
