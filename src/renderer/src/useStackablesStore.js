import { create } from 'zustand'
import { generateName } from '../../main/client.mjs'

const useStackablesStore = create((set, get) => ({
  formData: {},
  services: [],
  addFormData: (newValue) => set((state) => {
    return {
      ...state,
      formData: { ...get().formData, ...newValue }
    }
  }),
  addService: () => set((state) => {
    const currentServices = get().services
    return {
      ...state,
      services: [...currentServices, {
        name: generateName({ words: 1 }),
        template: {},
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
  })
}))

if (window.Cypress) {
  window.__store___ = useStackablesStore
}

export default useStackablesStore
