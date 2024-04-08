'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './AddTemplate.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import SmallTitle from '../ui/SmallTitle'
import { SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'

const AddTemplate = React.forwardRef(({ onClickAddTemplate }, ref) => {
  const [hover, setHover] = useState(false)
  const [titleClassName, setTitleClassName] = useState(`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`)

  useEffect(() => {
    if (hover) {
      setTitleClassName(`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`)
    } else {
      setTitleClassName(`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`)
    }
  }, [hover])

  return (
    <div
      className={`${styles.container} cy-add-template`}
      onClick={() => onClickAddTemplate()}
      ref={ref}
      onMouseLeave={() => setHover(false)}
      onMouseOver={() => setHover(true)}
    >
      <svg
        viewBox='0 0 264 324'
        fill='none'
        preserveAspectRatio='none'
        xmlns='http://www.w3.org/2000/svg'
        className={`${styles.svg} ${hover ? styles.svgHover : styles.svgRelaxed} `}
      >
        <path
          d='M263.5 11.1133V319.113C263.5 321.046 261.933 322.613 260 322.613H4C2.067 322.613 0.5 321.046 0.5 319.113V11.1133C0.5 9.18029 2.067 7.61328 4 7.61328H7.19014C9.39928 7.61328 11.1901 5.82242 11.1901 3.61328C11.1901 1.95643 12.5333 0.613281 14.1901 0.613281H58.7817C60.4385 0.613281 61.7817 1.95643 61.7817 3.61328C61.7817 5.82242 63.5726 7.61328 65.7817 7.61328H71.831C73.764 7.61328 75.331 6.04628 75.331 4.11328C75.331 2.14527 76.8056 0.613281 78.5493 0.613281H122.704C124.448 0.613281 125.923 2.14527 125.923 4.11328C125.923 6.04628 127.49 7.61328 129.423 7.61328H134.113C136.046 7.61328 137.613 6.04628 137.613 4.11328C137.613 2.14527 139.087 0.613281 140.831 0.613281H184.986C186.73 0.613281 188.204 2.14527 188.204 4.11328C188.204 6.04628 189.771 7.61328 191.704 7.61328H199.183C201.116 7.61328 202.683 6.04628 202.683 4.11328C202.683 2.14527 204.158 0.613281 205.901 0.613281H250.056C251.8 0.613281 253.275 2.14527 253.275 4.11328C253.275 6.04628 254.842 7.61328 256.775 7.61328H260C261.933 7.61328 263.5 9.18028 263.5 11.1133Z'
          stroke='none'
          fillOpacity={hover ? 0.15 : 0}
          strokeOpacity={hover ? 1 : 0.7}
        />
      </svg>
      <SmallTitle
        title='Select Template'
        titleClassName={titleClassName}
        iconName='CircleAddIcon'
        platformaticIcon={{
          iconName: 'CircleAddIcon',
          disabled: false,
          inactive: !hover,
          color: WHITE,
          size: SMALL,
          tip: ''
        }}
        containerClassName={`${commonStyles.tinyFlexRow} ${commonStyles.justifyCenter}`}
      />
    </div>
  )
})

AddTemplate.propTypes = {
  /**
   * onClick
    */
  onClickAddTemplate: PropTypes.func
}

AddTemplate.defaultProps = {
  onClickAddTemplate: () => {}
}

export default AddTemplate
