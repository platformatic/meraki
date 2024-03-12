import { create } from 'zustand'

const initialState = {
  formData: {},
  services: [],
  breadCrumbs: [],
  currentPage: '',
  applications: [],
  reloadApplications: true
}

const useStackablesStore = create((set, get) => ({
  ...initialState,
  addFormData: (newValue) => set((state) => {
    return {
      ...state,
      formData: { ...get().formData, ...newValue }
    }
  }),
  addService: (serviceName, template = {}) => set((state) => {
    const currentServices = get().services
    return {
      ...state,
      services: [...currentServices, {
        name: serviceName,
        renameDisabled: false,
        template,
        plugins: []
      }]
    }
  }),
  getService: (serviceName) => ({ ...get().services.find(service => service.name === serviceName) || {} }),
  renameService: (serviceName, newName) => set((state) => {
    return {
      ...state,
      services: [...get().services.map(service => {
        if (service.name === serviceName) {
          const { name, ...rest } = service
          return {
            name: newName,
            ...rest
          }
        } else {
          return service
        }
      })]
    }
  }),
  removeService: (serviceName) => set((state) => {
    return { ...state, services: [...get().services.filter(service => service.name !== serviceName)] }
  }),
  setTemplate: (serviceName, template) => set((state) => {
    return {
      ...state,
      services: [...get().services.map(service => {
        if (service.name === serviceName) {
          let { template: templateReplaced, ...rest } = service
          templateReplaced = template
          return {
            template: { ...templateReplaced, disabled: false },
            ...rest
          }
        } else {
          return service
        }
      })]
    }
  }),
  setPlugins: (serviceName, plugins) => set((state) => {
    return {
      ...state,
      services: [...get().services.map(service => {
        if (service.name === serviceName) {
          const { plugins: oldPlugins, ...rest } = service
          return {
            plugins: plugins.map(plugin => ({ ...plugin })),
            ...rest
          }
        } else {
          return service
        }
      })]
    }
  }),
  removePlugin: (serviceName, pluginName) => set((state) => {
    return {
      ...state,
      services: [...get().services.map(service => {
        if (service.name === serviceName) {
          const { plugins, ...rest } = service
          return {
            plugins: plugins.filter(plugin => plugin.name !== pluginName),
            ...rest
          }
        } else {
          return service
        }
      })]
    }
  }),
  reset: () => { set(initialState) },
  setNavigation: (item, level = 0) => {
    set((state) => {
      const currentBreadcrumbs = state.breadCrumbs.slice(0, level)
      currentBreadcrumbs.push(item)
      return {
        ...state,
        breadCrumbs: currentBreadcrumbs
      }
    })
  },
  pushNavigation: (item) => {
    set((state) => {
      const currentBreadcrumbs = state.breadCrumbs
      currentBreadcrumbs.push(item)
      return {
        ...state,
        breadCrumbs: currentBreadcrumbs
      }
    })
  },
  resetNavigation: () => {
    set((state) => {
      return {
        ...state,
        breadCrumbs: []
      }
    })
  },
  setCurrentPage: (page) => {
    set((state) => {
      return {
        ...state,
        currentPage: page
      }
    })
  },
  setApplications: (data = []) => {
    set((state) => {
      return {
        ...state,
        applications: [...data]
      }
    })
  },
  setReloadApplications: (reloadApplications) => {
    set((state) => {
      return {
        ...state,
        reloadApplications
      }
    })
  },
  resetWizardState: () => {
    set((state) => {
      return {
        ...state,
        formData: {},
        services: []
      }
    })
  },
  initializeWizardState: (formData, services) => {
    set((state) => {
      return {
        ...state,
        formData: { ...formData },
        services: [...services]
      }
    })
  }
}))

if (window.Cypress) {
  window.__store___ = useStackablesStore
}

export default useStackablesStore
