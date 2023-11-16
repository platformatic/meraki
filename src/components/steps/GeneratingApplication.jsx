'use strict'
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { BorderedBox, Button, HorizontalSeparator, Icons } from '@platformatic/ui-components'
import workspaceStyles from '../../workspace/Workspace.module.css'
import commonStyles from '../../../CommonStyles.module.css'
import styles from './GeneratingApplication.module.css'
import { BOX_SHADOW, MAIN_DARK_BLUE, WHITE, MARGIN_0, SMALL, MAIN_GREEN, TRANSPARENT, LARGE, ERROR_RED, BACKGROUND_COLOR_OPAQUE } from '@platformatic/ui-components/src/components/constants'
import { createApiKeyOnWorkspace, createApplication, createGitHubApplication, createWorkspace, getGitHubApplicationsSteps, getGitHubRepoSteps, getGitHubWorflowsRun, importGitHubApplication } from '../../../api'
import usePlatformaticStore from '../../../usePlatformaticStore'
import ErrorBox from '../../../ErrorBox'
import { COMPLETED, DYNAMIC, NOT_FOUND, STATIC, IN_PROGRESS } from '../../../utils'
import { TYPESCRIPT } from '../../../graphicalConstants'

/* function dateDifferences(millisStartDate, millisEndDate) {
  const s = new Date(millisStartDate);
  const e = new Date(millisEndDate);
  const diffTime = Math.abs(e - s);
  const diffSeconds = String(Math.ceil(diffTime / 1000 )).padStart(2, '0')

  return `${diffSeconds}s`
} */

function StepCreation ({ step, index, concludedStep, /* startTime = 0, endTime = 0,  */ indexError, externalUrl = '' }) {
  let status = 'NOT_STARTED'
  if (concludedStep >= 0) {
    if (concludedStep >= index) {
      status = 'COMPLETED'
    }
  }

  if (concludedStep + 1 === index) {
    status = 'LOADING'
  }

  let classes = `${commonStyles.mediumFlexRow} ${commonStyles.justifyBetween} ${commonStyles.smallPadding} `
  classes += concludedStep + 1 < index ? styles['apply-opacity-20'] : ''

  let cmp

  if (indexError === index) {
    return (
      <BorderedBox
        color={ERROR_RED}
        backgroundColor={TRANSPARENT}
        classes={`${commonStyles.mediumFlexRow} ${commonStyles.justifyBetween} ${commonStyles.smallPadding}`}
        key={index}
      >
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
          <Icons.AlertIcon size={SMALL} color={ERROR_RED} />
          <span className={commonStyles.typographyBody}>{step}</span>
          {externalUrl && <a href={externalUrl} target='_blank' rel='noreferrer' data-testid='api-detail-repository-link'>Check progress</a>}
        </div>
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
          <span className={commonStyles.typographyBodySmall}>Failed</span>
        </div>
      </BorderedBox>
    )
  }

  switch (status) {
    case 'LOADING':
      cmp = (
        <BorderedBox
          color={MAIN_DARK_BLUE}
          backgroundColor={MAIN_DARK_BLUE}
          backgroundColorOpacity={20}
          classes={classes}
          key={index}
        >
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <div className={styles.clockWiseRotation}><Icons.RunningIcon size={SMALL} /></div>
            <span className={commonStyles.typographyBody}>{step}</span>
            {externalUrl && <a href={externalUrl} target='_blank' rel='noreferrer' data-testid='api-detail-repository-link'>Check progress</a>}
          </div>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <span className={commonStyles.typographyBodySmall}>
              Loading
            </span>
          </div>
        </BorderedBox>
      )
      break

    case 'COMPLETED':
      cmp = (
        <BorderedBox
          color={MAIN_DARK_BLUE}
          backgroundColor={TRANSPARENT}
          backgroundColorOpacity={100}
          classes={classes}
          key={index}
        >
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <Icons.CircleCheckMarkIcon size={SMALL} color={MAIN_GREEN} />
            <span className={commonStyles.typographyBody}>{step}</span>
          </div>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <span className={commonStyles.typographyBodySmall}>
              Completed
            </span>
          </div>
        </BorderedBox>
      )
      break

    default:
      cmp = (
        <BorderedBox
          color={MAIN_DARK_BLUE}
          backgroundColor={TRANSPARENT}
          backgroundColorOpacity={100}
          classes={classes}
          key={index}
        >
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <Icons.CircleCheckMarkIcon checked={false} size={SMALL} color={MAIN_DARK_BLUE} />
            <span className={commonStyles.typographyBody}>{step}</span>
          </div>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <span className={commonStyles.typographyBodySmall}>
              Not started
            </span>
          </div>
        </BorderedBox>
      )
      break
  }

  return cmp
}

function GeneratingApplication ({ onBack, onConfirm, onFailure, onNext, onTryAgain, importFlow }) {
  const [error, setError] = useState(null)
  const [reader, setReader] = useState(null)
  const [done, setDone] = useState(false)
  const [statusButton, setStatusButton] = useState('')
  const [doneReaderSteps, setDoneReaderSteps] = useState(false)
  const [concludedStep, setConcludedStep] = useState(-2)
  const [allSteps, setAllSteps] = useState([])
  const globalState = usePlatformaticStore()
  const {
    formDataWizard,
    payloadDataWizard,
    organizationSelected,
    addPayloadDataWizard,
    setPayloadDataWizard,
    addFormDataWizard
  } = globalState
  const [stepInError, setStepInError] = useState(-2)
  const [proceed, setProceed] = useState(false)
  const [doneCallWorkspaces, setDoneCallWorkspaces] = useState(false)
  const [restartInterval, setRestartInterval] = useState(true)
  const [workspaceType, setWorkspaceType] = useState('')
  const REFRESH_INTERVAL = 5000
  const TRY_AGAIN = 'try_again'
  const intervalRef = useRef(null)
  const [checkProgressExternalUrl, setCheckProgressExternalUrl] = useState('')

  // const [times, setTimes] = useState([])

  function handleError (error, stepInError = 0) {
    setError(error)
    setStepInError(stepInError)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    onFailure()
  }

  function handleStartCreation () {
    onConfirm()
    setProceed(true)
    setConcludedStep(-1)
  }

  useEffect(() => {
    if (globalState.accessToken && allSteps.length === 0) {
      async function getAllSteps () {
        try {
          let res
          if (importFlow) {
            res = await getGitHubRepoSteps(globalState.baseUrl, globalState.accessToken)
          } else {
            res = await getGitHubApplicationsSteps(globalState.baseUrl, globalState.accessToken)
          }
          if (res.status === 200) {
            const tmpSteps = await res.json()
            tmpSteps.push('Wait for deployed app...')
            setAllSteps(tmpSteps)
          } else {
            const error = await res.json()
            handleError(`Error creating Application: ${error.message}`)
          }
        } catch (err) {
          handleError(`Error creating Application: ${err}`)
        }
      }
      getAllSteps()
    }
  }, [globalState.accessToken, allSteps])

  useEffect(() => {
    if (createApplication) {
      const tmp = formDataWizard
      const payload = {
        owner: tmp.importRepository.form.installation.label,
        repository: tmp.importRepository.form.repository.label,
        applicationName: tmp.configureApplication.name,
        typescript: tmp.configureApplication.language === TYPESCRIPT
      }
      if (importFlow) {
        if (formDataWizard?.applicationType) payload.type = formDataWizard.applicationType
      } else {
        payload.workspaceType = tmp.configureApplication.workspaceTypeDynamic ? DYNAMIC : STATIC
        if (tmp.importRepository.newRepositoryType) payload.type = tmp.importRepository.newRepositoryType
        if (tmp.configureDatabase?.connectionString) payload.connectionString = tmp.configureDatabase.connectionString
        if (tmp?.createMigration?.ddl) payload.ddl = tmp.createMigration.ddl
      }
      setPayloadDataWizard(payload)
      setWorkspaceType(tmp.configureApplication.workspaceTypeDynamic ? DYNAMIC : STATIC)
    }
  }, [createApplication])

  useEffect(() => {
    if (globalState.accessToken && proceed) {
      async function callCreateApplication () {
        try {
          const res = await createApplication({ orgId: organizationSelected.id, name: payloadDataWizard.applicationName }, globalState.baseUrl, globalState.accessToken)
          if (res.status === 200) {
            const data = await res.json()
            addPayloadDataWizard({ applicationId: data.id })
          } else {
            const error = await res.json()
            handleError(`Error creating Application: ${error.message}`)
          }
        } catch (err) {
          handleError(`Error creating Application: ${err}`)
        }
      }
      callCreateApplication()
    }
  }, [globalState.accessToken, proceed])

  useEffect(() => {
    if (globalState.accessToken && payloadDataWizard.applicationId) {
      async function callCreateWorkspace () {
        try {
          const functions = [
            createWorkspace({
              appId: payloadDataWizard.applicationId,
              name: `${STATIC}-default`,
              type: STATIC,
              orgId: organizationSelected.id,
              slots: 0
            }, globalState.baseUrl, globalState.accessToken)
          ]
          if (workspaceType === DYNAMIC) {
            functions.push(
              createWorkspace({
                appId: payloadDataWizard.applicationId,
                name: `${DYNAMIC}-default`,
                type: DYNAMIC,
                orgId: organizationSelected.id,
                slots: 0
              }, globalState.baseUrl, globalState.accessToken)
            )
          }

          const responses = await Promise.all(functions)
          for (const res of responses) {
            if (res.status === 200) {
              const data = await res.json()
              if (data.type === STATIC) {
                addFormDataWizard({ workspaceStaticId: data.id })
              } else {
                addFormDataWizard({ workspaceDynamicId: data.id })
              }
            } else {
              const error = await res.json()
              throw (error.message)
            }
          }
          setDoneCallWorkspaces(true)
        } catch (err) {
          handleError(`Error creating Workspace: ${err}`)
        }
      }
      callCreateWorkspace()
    }
  }, [globalState.accessToken, payloadDataWizard.applicationId])

  useEffect(() => {
    if (globalState.accessToken && doneCallWorkspaces) {
      async function callCreateApiKey () {
        try {
          const functions = [
            createApiKeyOnWorkspace({ workspaceId: formDataWizard.workspaceStaticId }, globalState.baseUrl, globalState.accessToken)
          ]
          if (workspaceType === DYNAMIC) {
            functions.push(
              createApiKeyOnWorkspace({ workspaceId: formDataWizard.workspaceDynamicId }, globalState.baseUrl, globalState.accessToken)
            )
          }

          const responses = await Promise.all(functions)
          const workspaces = {}
          for (const res of responses) {
            if (res.status === 200) {
              const data = await res.json()
              if (data.workspaceId === formDataWizard.workspaceStaticId) {
                workspaces.static = {
                  id: formDataWizard.workspaceStaticId,
                  apiKey: data.key
                }
                if (importFlow) {
                  workspaces.static.env = { ...formDataWizard.submittedConfiguredEnvironment.static_env }
                }
              } else {
                workspaces.dynamic = {
                  id: formDataWizard.workspaceDynamicId,
                  apiKey: data.key
                }
                if (importFlow) {
                  workspaces.dynamic.env = { ...formDataWizard.submittedConfiguredEnvironment.dynamic_env }
                }
              }
            } else {
              const error = await res.json()
              throw (error.message)
            }
          }
          addPayloadDataWizard({ workspaces })
        } catch (err) {
          handleError(`Error creating Workspace: ${err}`)
        }
      }
      callCreateApiKey()
    }
  }, [globalState.accessToken, doneCallWorkspaces])

  useEffect(() => {
    if (globalState.accessToken && payloadDataWizard.workspaces) {
      async function callCreateGithubApplication () {
        try {
          let response
          if (importFlow) {
            response = await importGitHubApplication({ ...payloadDataWizard, github_token: globalState.ghToken }, globalState.baseUrl, globalState.accessToken)
          } else {
            response = await createGitHubApplication({ ...payloadDataWizard, github_token: globalState.ghToken }, globalState.baseUrl, globalState.accessToken)
          }
          setReader(response.body.getReader())
        } catch (error) {
          console.log(error)
          handleError(`Error creating Github Application: ${error}`)
        }
      }
      callCreateGithubApplication()
    }
  }, [globalState.accessToken, payloadDataWizard.workspaces])

  useEffect(() => {
    if (reader && concludedStep > -2) {
      async function checkReader () {
        let continueLoop = true
        while (continueLoop) {
          const { value, done } = await reader.read()
          if (done) {
            setDoneReaderSteps(true)
            continueLoop = false
            break
          }
          try {
            const str = String.fromCharCode.apply(null, value)
            const start = str.lastIndexOf('{')
            const end = str.lastIndexOf('}') + 1
            const { currentStep, error: currentError, message } = JSON.parse(str.substring(start, end))
            setConcludedStep(currentStep)
            if (currentError) {
              continueLoop = false
              handleError(message, currentStep)
            }
          } catch (err) {
            continueLoop = false
            console.error(`Error on parsing: ${err}`)
            handleError(err, concludedStep)
          }
        }
      }
      checkReader()
    }
  }, [reader, concludedStep])

  useEffect(() => {
    if (globalState.accessToken && doneReaderSteps && restartInterval) {
      setRestartInterval(false)
      intervalRef.current = setInterval(async () => {
        try {
          const res = await getGitHubWorflowsRun({
            github_token: globalState.ghToken,
            owner: formDataWizard.importRepository.form.installation.label,
            repository: formDataWizard.importRepository.form.repository.label
          }, globalState.baseUrl, globalState.accessToken)
          if (res.status === 200) {
            const data = await res.json()
            const { status, conclusion, url } = data
            switch (status) {
              case COMPLETED:
                if (conclusion === 'success') {
                  setStatusButton(COMPLETED)
                  setConcludedStep(concludedStep + 1)
                } else {
                  setStatusButton(TRY_AGAIN)
                  handleError('Cannot find the deploy action. Click on "Try again" button below in a few seconds', concludedStep + 1)
                }
                setDone(true)
                break

              case NOT_FOUND:
                handleError('Cannot find the deploy action. Click on "Try again" button below in a few seconds', concludedStep + 1)
                setStatusButton(TRY_AGAIN)
                setDone(true)
                break

              case IN_PROGRESS:
                if (checkProgressExternalUrl === '') {
                  setCheckProgressExternalUrl(url)
                }
                break

              default:
                break
            }
          } else {
            const error = await res.json()
            console.error('concludedStep', concludedStep)
            handleError(`Error creating Application: ${error.message}`, concludedStep + 1)
          }
        } catch (err) {
          console.error('concludedStep', concludedStep)
          handleError(`Error creating Application: ${err}`, concludedStep)
        }
      }, REFRESH_INTERVAL)
    }
  }, [globalState.accessToken, doneReaderSteps, restartInterval])

  useEffect(() => {
    if (done) {
      clearInterval(intervalRef.current)
    }
  }, [done])

  function handleGitHubWorkflowInterval () {
    setError(null)
    setCheckProgressExternalUrl('')
    setStatusButton('')
    setDone(false)
    setRestartInterval(true)
    setStepInError(-2)
    onTryAgain()
  }

  function getButton () {
    if (statusButton === TRY_AGAIN) {
      return (
        <Button
          disabled={!done}
          color={WHITE}
          backgroundColor={MAIN_DARK_BLUE}
          label='Try again'
          type='button'
          onClick={() => handleGitHubWorkflowInterval()}
          bordered={false}
          bold
          hoverEffect={BOX_SHADOW}
        />
      )
    }
    return (
      <Button
        disabled={!done}
        color={WHITE}
        backgroundColor={MAIN_DARK_BLUE}
        label='Complete'
        type='button'
        onClick={() => onNext()}
        bordered={false}
        bold
        hoverEffect={BOX_SHADOW}
      />
    )
  }

  return (
    <div className={commonStyles.mediumFlexBlock}>
      <h4 className={workspaceStyles.titleSectionTmp}>
        <div className={workspaceStyles.iconContainer}>
          <Icons.CreatingAppIcon size={LARGE} />
        </div>
        {proceed ? 'We are creating your App' : 'Create your app'}
      </h4>
      <div className={`${commonStyles.containerLeftSpaced} ${commonStyles.mediumFlexBlock}`}>
        <p className={commonStyles.typographyBodySmall}>The creation process of your app it might take a few minutes. You can follow the status of the process by having a look at the list of the steps that we this creation process will require. Once the process is complete you can to continue by clicking the button below.</p>
        {allSteps.map((step, index) => <StepCreation key={index} step={step} concludedStep={concludedStep} index={index} indexError={stepInError} externalUrl={checkProgressExternalUrl} />)}
      </div>
      <HorizontalSeparator marginTop={MARGIN_0} marginBottom={MARGIN_0} color={MAIN_DARK_BLUE} opacity={20} />
      <div className={`${commonStyles.containerLeftSpaced} ${commonStyles.mediumFlexBlock}`}>
        <p className={commonStyles.typographyBodyVerySmall}>There is a problem with the creation of your App? Please connect with us at <a className={commonStyles.applyHoverUnderline} href='mailto:support@platformatic.dev?subject=Problems during Creation of my application!'>support@platformatic.dev</a>.</p>
        {error && <ErrorBox message={error} onClose={() => { setError(null) }} />}
        <div className={commonStyles.buttonEditContainer}>
          <Button
            disabled={proceed}
            color={MAIN_DARK_BLUE}
            label='Back'
            type='button'
            platformaticIcon={{ iconName: 'ArrowLeftIcon', color: MAIN_DARK_BLUE }}
            onClick={() => onBack()}
            bold
            hoverEffect={BACKGROUND_COLOR_OPAQUE}
          />
          {proceed
            ? (getButton())
            : (
              <Button
                color={WHITE}
                backgroundColor={MAIN_DARK_BLUE}
                label='Start creation'
                type='button'
                onClick={() => handleStartCreation()}
                bordered={false}
                bold
                hoverEffect={BOX_SHADOW}
              />
              )}
        </div>
      </div>
    </div>
  )
}

GeneratingApplication.propTypes = {
  /**
   * onBack
   */
  onBack: PropTypes.func,
  /**
   * onConfirm
   */
  onConfirm: PropTypes.func,
  /**
   * onFailure
   */
  onFailure: PropTypes.func,
  /**
   * onNext
   */
  onNext: PropTypes.func,
  /**
   * onTryAgain
   */
  onTryAgain: PropTypes.func,
  /**
   * importFlow
   */
  importFlow: PropTypes.bool
}

GeneratingApplication.defaultProps = {
  onBack: () => {},
  onConfirm: () => {},
  onFailure: () => {},
  onNext: () => {},
  onTryAgain: () => {},
  importFlow: true
}

export default GeneratingApplication
