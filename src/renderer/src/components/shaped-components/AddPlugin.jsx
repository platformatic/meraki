'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './AddPlugin.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import SmallTitle from '~/components/ui/SmallTitle'
import React from 'react'
import { SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'

const AddPlugin = React.forwardRef(({ onClick, inactive }, ref) => {
  return inactive
    ? (
      <div className={styles.containerInactive} onClick={() => onClick()} ref={ref}>
        <svg viewBox='0 0 264 102' fill='none' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg' className={styles.svg}>
          <rect x='0.5' y='0.5' width='263' height='101' rx='3.5' stroke='white' strokeOpacity='0.3' />
        </svg>
        <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
          <SmallTitle
            title='Add Plugin'
            titleClassName={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
            containerClassName={`${commonStyles.smallFlexRow} ${typographyStyles.textCenter}`}
            platformaticIcon={{
              iconName: 'CircleAddIcon',
              disabled: false,
              inactive: true,
              color: WHITE,
              size: SMALL,
              tip: ''
            }}
          />
        </div>
      </div>
      )
    : (
      <div className={styles.container} onClick={() => onClick()} ref={ref}>
        <svg viewBox='0 0 264 74' fill='none' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg' className={styles.svg}>
          <path d='M263.5 10.0515V69.1137C263.5 71.0467 261.933 72.6137 260 72.6137H4C2.067 72.6137 0.5 71.0467 0.5 69.1137V10.0515C0.5 8.11851 2.067 6.55151 4 6.55151H10.9748C12.8906 6.55151 14.4437 4.99843 14.4437 3.08261C14.4437 1.71907 15.549 0.613708 16.9126 0.613708H56.9888C58.3524 0.613708 59.4577 1.71907 59.4577 3.08261C59.4577 4.99843 61.0108 6.55151 62.9266 6.55151H68.7887H73.4366C74.5614 6.55151 75.5988 6.20953 76.3662 5.6328C77.1339 5.05593 77.6549 4.2211 77.6549 3.25725V2.90797C77.6549 2.32859 77.9663 1.76629 78.5444 1.33184C79.1227 0.89725 79.9444 0.613708 80.8732 0.613708H119.451C120.38 0.613708 121.201 0.89725 121.78 1.33184C122.358 1.76629 122.669 2.32859 122.669 2.90797V3.25725C122.669 4.2211 123.19 5.05593 123.958 5.6328C124.725 6.20953 125.763 6.55151 126.887 6.55151H131.07H135.718C136.843 6.55151 137.88 6.20953 138.648 5.6328C139.416 5.05593 139.937 4.2211 139.937 3.25725V2.90797C139.937 2.32859 140.248 1.76629 140.826 1.33184C141.404 0.897251 142.226 0.613708 143.155 0.613708H181.732C182.661 0.613708 183.483 0.897251 184.061 1.33184C184.639 1.76629 184.951 2.32859 184.951 2.90797V3.25725C184.951 4.2211 185.472 5.05593 186.239 5.6328C187.007 6.20953 188.044 6.55151 189.169 6.55151H193.352H198C199.125 6.55151 200.162 6.20953 200.93 5.6328C201.697 5.05593 202.218 4.2211 202.218 3.25725V2.90797C202.218 2.32859 202.53 1.76629 203.108 1.33184C203.686 0.89725 204.508 0.613708 205.437 0.613708H215.43H244.014C244.943 0.613708 245.765 0.897251 246.343 1.33184C246.921 1.76629 247.232 2.32859 247.232 2.90797V3.25725C247.232 4.2211 247.753 5.05593 248.521 5.6328C249.289 6.20953 250.326 6.55151 251.451 6.55151H260C261.933 6.55151 263.5 8.11851 263.5 10.0515Z' stroke='none' strokeOpacity={0.7} />
        </svg>

        <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
          <SmallTitle
            title='Add Plugin'
            titleClassName={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
            containerClassName={`${commonStyles.smallFlexRow} ${typographyStyles.textCenter}`}
            platformaticIcon={{
              iconName: 'CircleAddIcon',
              disabled: false,
              inactive: false,
              color: WHITE,
              size: SMALL,
              tip: ''
            }}
          />
        </div>
      </div>
      )
})

AddPlugin.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func,
  /**
   * inactive
    */
  inactive: PropTypes.bool
}

AddPlugin.defaultProps = {
  onClick: () => {},
  inactive: false
}

export default AddPlugin
