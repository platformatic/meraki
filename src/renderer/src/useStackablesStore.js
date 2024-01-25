import { create } from 'zustand'

const initialState = {
  formData: {},
  services: []
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
            template: templateReplaced,
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
  reset: () => { set(initialState) }

}))

if (window.Cypress) {
  window.__store___ = useStackablesStore
}

export default useStackablesStore
