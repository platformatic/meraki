'use strict'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { BOX_SHADOW, RICH_BLACK, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './SelectPlugin.module.css'
import { Button, LoadingSpinnerV2, SearchBarV2 } from '@platformatic/ui-components'
import Title from '~/components/ui/Title'
import useStackablesStore from '~/useStackablesStore'
import Plugin from './Plugin'
import { getApiPlugins } from '~/api'
import useWindowDimensions from '~/hooks/useWindowDimensions'
import { MAX_WIDTH_LG, MAX_MUMBER_SELECT, MAX_MUMBER_SELECT_LG, NO_RESULTS_VIEW, LIST_PLUGINS_VIEW } from '~/ui-constants'
import NoResults from '~/components/ui/NoResults'

function SelectPlugin ({ onClick, serviceName }) {
  const globalState = useStackablesStore()
  const { setPlugins, getService } = globalState
  const [groupedPlugins, setGroupedPlugins] = useState([])
  const [pluginsAvailable, setPluginsAvailable] = useState([])
  const [pluginsSelected, setPluginsSelected] = useState([])
  const [filteredPlugins, setFilteredPlugins] = useState([])
  const [filterPluginsByValue, setFilterPluginsByValue] = useState('')
  const [innerLoading, setInnerLoading] = useState(true)
  const [currentView, setCurrentView] = useState(LIST_PLUGINS_VIEW)
  const { width: innerWindow } = useWindowDimensions()
  const [currentPage, setCurrentPage] = useState(1)
  const [pages, setPages] = useState([1])
  const scrollRef = useRef(null)
  const containerScrollRef = useRef(null)
  const [maxPluginDispay, setMaxPluginDisplay] = useState(innerWindow < MAX_WIDTH_LG ? MAX_MUMBER_SELECT : MAX_MUMBER_SELECT_LG)

  useEffect(() => {
    async function getPlugins () {
      const plugins = await getApiPlugins()
      setPluginsAvailable(plugins)
      setFilteredPlugins([...plugins])
      setInnerLoading(false)
    }
    getPlugins()
  }, [])

  useEffect(() => {
    if (innerWindow < MAX_WIDTH_LG && maxPluginDispay === MAX_MUMBER_SELECT_LG) {
      setMaxPluginDisplay(MAX_MUMBER_SELECT)
    }
    if (innerWindow >= MAX_WIDTH_LG && maxPluginDispay === MAX_MUMBER_SELECT) {
      setMaxPluginDisplay(MAX_MUMBER_SELECT_LG)
    }
  }, [innerWindow])

  useEffect(() => {
    if (serviceName && Object.keys(getService(serviceName)?.plugins).length > 0) {
      setPluginsSelected([...getService(serviceName).plugins])
    }
  }, [serviceName, Object.keys(getService(serviceName)?.plugins).length])

  useEffect(() => {
    if (filteredPlugins.length > 0) {
      if (currentView === NO_RESULTS_VIEW) {
        setCurrentView(LIST_PLUGINS_VIEW)
      }
      const groupedPlugins = []
      for (let i = 0; i < filteredPlugins.length; i += maxPluginDispay) {
        groupedPlugins.push(filteredPlugins.slice(i, i + maxPluginDispay))
      }
      setGroupedPlugins(groupedPlugins)
      setPages(Array.from(new Array(groupedPlugins.length).keys()).map(x => x + 1))
    }
    if (filteredPlugins.length === 0 && filterPluginsByValue) {
      if (currentView === LIST_PLUGINS_VIEW) {
        setCurrentView(NO_RESULTS_VIEW)
      }
    }
  }, [filteredPlugins.length, filterPluginsByValue, maxPluginDispay])

  function handleUsePluginsSelected () {
    setPlugins(serviceName, pluginsSelected)
    onClick()
  }

  function handleClearPlugins () {
    setFilterPluginsByValue('')
    setFilteredPlugins([...pluginsAvailable])
  }

  function handleFilterPlugins (value) {
    setFilterPluginsByValue(value)
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
    const index = pluginsSelected.findIndex(pluginSelected => pluginSelected.name === plugin.name)
    if (index > -1) {
      setPluginsSelected(
        pluginsSelected.filter(pluginSelected => pluginSelected.name !== plugin.name)
      )
    } else {
      setPluginsSelected([
        ...pluginsSelected,
        { ...plugin }
      ])
    }
  }

  function renderListPlugins () {
    return groupedPlugins.map((groupedPlugin, index) => (
      <div className={styles.gridContainer} key={index}>
        <div className={styles.gridContent}>
          {groupedPlugin.map(plugin =>
            <Plugin
              key={plugin.name}
              isSelected={pluginsSelected.find(pluginSelected => pluginSelected.name === plugin.name) !== undefined}
              onClickCardPlugin={() => handleClickPlugin(plugin)}
              {...plugin}
            />
          )}
        </div>
      </div>
    ))
  }

  function renderCurrentView () {
    if (currentView === LIST_PLUGINS_VIEW) {
      return (
        <>
          <div className={styles.pluginsContainer} ref={containerScrollRef}>
            <div className={styles.pluginsContent} ref={scrollRef}>
              {renderListPlugins()}
            </div>
          </div>
          <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyCenter}`}>
            {pages.map(page =>
              <Button
                key={page}
                paddingClass={commonStyles.buttonPadding}
                label={`${page}`}
                onClick={() => scroll(page)}
                color={WHITE}
                selected={page === currentPage}
                backgroundColor={TRANSPARENT}
                bordered={false}
              />
            )}
          </div>
        </>
      )
    }
    return (
      <NoResults
        searchedValue={filterPluginsByValue}
        dataAttrName='cy'
        dataAttrValue='template-no-results'
      />
    )
  }

  return (
    <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth} ${styles.container}`}>
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
          <div className={`${commonStyles.mediumFlexBlock24} ${commonStyles.fullWidth} ${commonStyles.justifyCenter} ${styles.containerView}`}>
            {innerLoading
              ? <LoadingSpinnerV2
                  loading={innerLoading}
                  applySentences={{
                    containerClassName: `${commonStyles.mediumFlexBlock} ${commonStyles.itemsCenter}`,
                    sentences: [{
                      style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`,
                      text: 'Loading plugins....'
                    }, {
                      style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`,
                      text: 'This process will just take a few seconds.'
                    }]
                  }}
                  containerClassName={styles.loadingSpinner}
                />
              : renderCurrentView()}
          </div>
        </div>
      </div>
      <Button
        disabled={pluginsSelected.length === 0}
        paddingClass={commonStyles.buttonPadding}
        label={pluginsSelected.length > 1 ? `Continue with these Plugins (${pluginsSelected.length})` : 'Continue with this plugin'}
        backgroundColor={WHITE}
        color={RICH_BLACK}
        hoverEffect={BOX_SHADOW}
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
