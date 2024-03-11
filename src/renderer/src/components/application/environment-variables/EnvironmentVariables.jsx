'use strict'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { WHITE, MARGIN_0, OPACITY_30, MEDIUM } from '@platformatic/ui-components/src/components/constants'
import styles from './EnvironmentVariables.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { HorizontalSeparator } from '@platformatic/ui-components'
import Icons from '@platformatic/ui-components/src/components/icons'
import DisplayEnvironmentVariables from './DisplayEnvironmentVariables'
import { generateForm } from '~/utils'
import useStackablesStore from '~/useStackablesStore'
import { APPLICATION_PAGE_ENV_VAR } from '~/ui-constants'

const EnvironmentVariables = React.forwardRef(({ services }, ref) => {
  const globalState = useStackablesStore()
  const { setNavigation, setCurrentPage } = globalState

  const mockedServices = [
    {
      template: {
        orgId: 'platformatic',
        orgName: 'Platformatic',
        name: '@platformatic/service',
        description: 'A Platformatic Service is an HTTP server based on Fastify that allows developers to build robust APIs with Node.js',
        author: 'Platformatic',
        homepage: 'https://platformatic.dev',
        public: true,
        platformaticService: true,
        envVars: [
          {
            var: 'PLT_SERVER_HOSTNAME',
            label: 'What is the hostname?',
            default: '0.0.0.0',
            type: 'string',
            configValue: 'hostname'
          },
          {
            var: 'PLT_SERVER_LOGGER_LEVEL',
            label: 'What is the logger level?',
            default: 'info',
            type: 'string',
            configValue: ''
          },
          {
            label: 'Which port do you want to use?',
            var: 'PORT',
            default: 3042,
            tyoe: 'number',
            configValue: 'port'
          }
        ]
      },
      plugins: [
        {
          name: '@fastify/accepts',
          description: 'To have accepts in your request object.',
          author: 'mock author',
          homepage: 'https://example.com',
          envVars: [
            {
              name: 'PLT_COOKIE_SECRET',
              path: 'secret',
              type: 'string'
            },
            {
              name: 'PLT_COOKIE_HOOK',
              path: 'hook',
              type: 'string'
            },
            {
              name: 'PLT_COOKIE_PARSEOPTIONS_DOMAIN',
              path: 'parseOptions.domain',
              type: 'string'
            },
            {
              name: 'PLT_COOKIE_PASEOPTIONS_MAXAGE',
              path: 'parseOptions.maxAge',
              type: 'number'
            }
          ]
        }
      ],
      name: 'lunasa-1'
    }
  ]

  useEffect(() => {
    setNavigation({
      label: 'Environment Variables',
      handleClick: () => {
        // navigate(APPLICATION_PATH.replace(':id', applicationSelected.id))
        setCurrentPage(APPLICATION_PAGE_ENV_VAR)
      },
      key: APPLICATION_PAGE_ENV_VAR,
      page: APPLICATION_PAGE_ENV_VAR
    }, 2)
  }, [])

  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.content}>
        <div className={`${commonStyles.largeFlexBlock40} ${commonStyles.fullWidth}`}>
          <div className={commonStyles.mediumFlexBlock}>
            <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth}`}>
              <Icons.AppConfigurationIcon color={WHITE} size={MEDIUM} />
              <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>Environment Variables</h2>
            </div>
            <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>These are the environment variables of your application. You can edit anytime by clicking on “Edit application” in your Application overview.</p>
          </div>
          <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
          <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
            <DisplayEnvironmentVariables configuredServices={generateForm(mockedServices)} />
          </div>
        </div>
      </div>
    </div>
  )
})

EnvironmentVariables.propTypes = {
  /**
   * services
    */
  services: PropTypes.array
}

EnvironmentVariables.defaultProps = {
  services: []
}

export default EnvironmentVariables
