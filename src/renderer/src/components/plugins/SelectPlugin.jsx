'use strict'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { RICH_BLACK, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './SelectPlugin.module.css'
import { Button, SearchBarV2 } from '@platformatic/ui-components'
import Title from '~/components/ui/Title'
import useStackablesStore from '~/useStackablesStore'
import Plugin from './Plugin'
import { getPlugins } from '../../api'
import { MAX_MUMBER_SELECT } from '~/ui-constants'

function SelectPlugin ({ onClick, serviceName }) {
  const [groupedPlugins, setGroupedPlugins] = useState([])
  const [pluginsAvailable, setPluginsAvailable] = useState([])
  const [pluginsSelected, setPluginsSelected] = useState([])
  const [filteredPlugins, setFilteredPlugins] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPages] = useState([1])
  const globalState = useStackablesStore()
  const { setPlugins, getService } = globalState
  const scrollRef = useRef(null)
  const containerScrollRef = useRef(null)

  useEffect(() => {
    const plugins = getPlugins()
    setPluginsAvailable(plugins)
    setFilteredPlugins([...plugins])
  }, [])

  useEffect(() => {
    if (serviceName && Object.keys(getService(serviceName)?.plugins).length > 0) {
      setPluginsSelected([...getService(serviceName).plugins])
    }
  }, [serviceName, Object.keys(getService(serviceName)?.plugins).length])

  useEffect(() => {
    if (filteredPlugins.length > 0) {
      const groupedPlugins = []
      for (let i = 0; i < filteredPlugins.length; i += MAX_MUMBER_SELECT) {
        groupedPlugins.push(filteredPlugins.slice(i, i + MAX_MUMBER_SELECT))
      }
      setGroupedPlugins(groupedPlugins)
      setPages(Array.from(new Array(groupedPlugins.length).keys()).map(x => x + 1))
    }
  }, [filteredPlugins.length])

  function handleUsePluginsSelected () {
    setPlugins(serviceName, pluginsSelected)
    onClick()
  }

  function handleClearPlugins () {
    setFilteredPlugins([...pluginsAvailable])
  }

  function handleFilterPlugins (value) {
    setCurrentPage(1)
    const founds = pluginsAvailable.filter(template => template.name.toLowerCase().includes(value.toLowerCase()))
    setFilteredPlugins(founds)
  }

  const scroll = (page) => {
    let sign = 0; let howManyPages = 0
    if (page > currentPage) {
      sign = 1
      howManyPages = page - currentPage
    } else {
      sign = -1
      howManyPages = currentPage - page
    }

    setCurrentPage(page)

    scrollRef.current.scrollBy({
      top: 0,
      left: sign * (containerScrollRef.current.clientWidth + 8) * howManyPages,
      behavior: 'smooth'
    })
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

  function renderContent () {
    return groupedPlugins.map((groupedPlugin, index) => (
      <div className={styles.gridContainer} key={index}>
        <div className={styles.gridContent}>
          {groupedPlugin.map(plugin =>
            <Plugin
              key={plugin.id}
              isSelected={pluginsSelected.find(pluginSelected => pluginSelected.id === plugin.id) !== undefined}
              onClick={() => handleClickPlugin(plugin)}
              {...plugin}
            />
          )}
        </div>
      </div>
    ))
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
        <SearchBarV2 placeholder='Search for a Plugin' onClear={handleClearPlugins} onChange={handleFilterPlugins} />
        <div className={styles.pluginsContainer} ref={containerScrollRef}>
          <div className={styles.pluginsContent} ref={scrollRef}>
            {renderContent()}
          </div>
        </div>
        <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyCenter}`}>
          {pages.map(page =>
            <Button
              key={page}
              classes={`${commonStyles.buttonPadding}`}
              label={`${page}`}
              onClick={() => scroll(page)}
              color={WHITE}
              selected={page === currentPage}
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
