'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { ERROR_RED, MARGIN_0, OPACITY_30, TRANSPARENT, WHITE, RICH_BLACK, DULLS_BACKGROUND_COLOR } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { Button, HorizontalSeparator } from '@platformatic/ui-components'
import Forms from '@platformatic/ui-components/src/components/forms'

function DeleteApplication ({ name, onClickCancel, onClickConfirm }) {
  const [form, setForm] = useState({ name: '' })
  const [deleting, setDeleting] = useState(false)

  function handleChange (event) {
    setForm({ name: event.target.value })
  }

  async function handleSubmit (event) {
    event.preventDefault()
    onClickConfirm()
    setDeleting(true)
  }

  async function onClickDelete () {
    onClickConfirm()
    setDeleting(true)
  }

  return (
    <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
      <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${commonStyles.fullWidth}`}>
        <span className={`${typographyStyles.opacity70}`}>You are about to destroy the application </span>{name}<span className={`${typographyStyles.opacity70}`}> permanently.</span><br /><br />
        <span className={`${typographyStyles.opacity70}`}>This action is irreversible, and the application will be permanently deleted.<br /><br />To proceed enter the name of the application<br /></span>
      </p>
      <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
      <form onSubmit={handleSubmit} className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
        <Forms.Field
          title='Enter Application name'
          titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
          helper='To delete the organization, please enter the exact name'
          helperClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          required
        >
          <Forms.Input
            placeholder={name}
            name='name'
            borderColor={WHITE}
            value={form.name}
            inputTextClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite}`}
            verticalPaddingClassName={commonStyles.noVerticalPadding}
            backgroundColor={RICH_BLACK}
            onChange={handleChange}
          />
        </Forms.Field>
        <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />

        <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyBetween}`}>
          <Button
            type='button'
            label='Cancel'
            onClick={() => onClickCancel()}
            color={WHITE}
            backgroundColor={TRANSPARENT}
            textClass={typographyStyles.desktopBody}
            paddingClass={commonStyles.buttonPadding}
          />
          <Button
            type='button'
            textClass={typographyStyles.desktopBody}
            paddingClass={commonStyles.buttonPadding}
            label={deleting ? 'Deleting App...' : 'Delete App'}
            onClick={() => onClickDelete()}
            color={WHITE}
            backgroundColor={ERROR_RED}
            hoverEffect={DULLS_BACKGROUND_COLOR}
            disabled={form.name !== name || deleting}
            bordered={false}
          />
        </div>
      </form>
    </div>
  )
}

DeleteApplication.propTypes = {
  /**
   * name
    */
  name: PropTypes.string.isRequired,
  /**
   * onClickEdit
   */
  onClickCancel: PropTypes.func,
  /**
   * onClickRemove
   */
  onClickConfirm: PropTypes.func
}

DeleteApplication.defaultProps = {
  onClickCancel: () => {},
  onClickConfirm: () => {}
}

export default DeleteApplication
