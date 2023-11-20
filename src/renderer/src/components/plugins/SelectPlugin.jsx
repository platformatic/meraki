'use strict'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { RICH_BLACK, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './SelectPlugin.module.css'
import { Button, SearchBarV2 } from '@platformatic/ui-components'
import Title from '~/components/ui/Title'
import useStackablesStore from '~/useStackablesStore'
import Plugin from './Plugin'
import { getPlugins } from '../../api'

function SelectPlugin ({ onClick, serviceName }) {
  const [pages] = useState([1])
  const [pluginsAvailable, setPluginsAvailable] = useState([])
  const [pluginsSelected, setPluginsSelected] = useState([])
  const globalState = useStackablesStore()
  const { setPlugins, getService } = globalState

  useEffect(() => {
    setPluginsAvailable(getPlugins(10))
  }, [])

  useEffect(() => {
    if (serviceName && Object.keys(getService(serviceName)?.plugins).length > 0) {
      setPluginsSelected([...getService(serviceName).plugins])
    }
  }, [serviceName, Object.keys(getService(serviceName)?.plugins).length])

  function handleUsePluginsSelected () {
    setPlugins(serviceName, pluginsSelected)
    onClick()
  }

  function handleClickPlugin (plugin) {
    const index = pluginsSelected.findIndex(pluginSelected => pluginSelected.id === plugin.id)
    if (index > -1) {
      setPluginsSelected(
        pluginsSelected.filter(pluginSelected => pluginSelected.id !== plugin.id)
      )
    } else {
      setPluginsSelected([
        ...pluginsSelected,
        { ...plugin }
      ])
    }
  }

  return (
    <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
      <div className={commonStyles.mediumFlexBlock}>
        <Title
          title='Select a Plugin'
          iconName='StackablesPluginIcon'
          dataAttrName='cy'
          dataAttrValue='modal-title'
        />
        <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select one or more Plugins from our Stackables Marketplace to be added to your new serviceAdding a plugin to your service is optional.</p>
      </div>
      <div className={`${commonStyles.mediumFlexBlock24} ${commonStyles.fullWidth}`}>
        <SearchBarV2 placeholder='Search for a Plugin' />
        <div className={styles.gridContainer}>
          <div className={styles.gridContent}>
            {pluginsAvailable.map(plugin =>
              <Plugin
                key={plugin.id}
                isSelected={pluginsSelected.find(pluginSelected => pluginSelected.id === plugin.id) !== undefined}
                onClick={() => handleClickPlugin(plugin)}
                {...plugin}
              />
            )}
          </div>
        </div>
        <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyCenter}`}>
          {pages.map(page =>
            <Button
              key={page}
              classes={`${commonStyles.buttonPadding}`}
              label={`${page}`}
              onClick={() => { }}
              color={WHITE}
              selected={page === 1}
              backgroundColor={TRANSPARENT}
              bordered={false}
            />
          )}
        </div>
      </div>
      <Button
        disabled={pluginsSelected.length === 0}
        classes={commonStyles.buttonPadding}
        label={pluginsSelected.length > 1 ? `Continue with these Plugins (${pluginsSelected.length})` : 'Continue with this plugin'}
        backgroundColor={WHITE}
        color={RICH_BLACK}
        fullWidth
        bordered={false}
        onClick={() => handleUsePluginsSelected()}
      />

    </div>
  )
}

SelectPlugin.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func,
  /**
   * serviceName
    */
  serviceName: PropTypes.string
}

SelectPlugin.defaultProps = {
  onClick: () => {},
  serviceName: ''
}

export default SelectPlugin
