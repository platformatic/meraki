import { create } from 'zustand'

const useStackablesStore = create((set, get) => ({
  formData: {},
  services: [],
  addFormData: (newValue) => set((state) => {
    return {
      ...state,
      formData: { ...get().formData, ...newValue },
      services: [{
        id: 0,
        name: `${newValue.createApplication.service}-1`,
        template: {},
        plugins: []
      }]
    }
  }),
  addService: () => set((state) => {
    const currentServices = get().services
    const serviceName = get().formData.createApplication.service
    return {
      ...state,
      services: [...currentServices, {
        id: '',
        name: `${serviceName}-${currentServices.length + 1}`,
        template: {},
        plugins: []
      }]
    }
  }),
  removeService: (serviceId) => set((state) => {
    return { ...state, services: [...get().services.filter(service => service.id !== serviceId)] }
  }),
  setTemplate: (serviceId, template) => set((state) => {
    return {
      ...state,
      services: [...get().services.map(service => {
        if (service.id === serviceId) {
          let { template: templateReplaced, ...rest } = service
          templateReplaced = template
          console.log({
            template: templateReplaced,
            ...rest
          })
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
  setPlugins: (serviceId, plugins) => set((state) => {
    return {
      ...state,
      services: [...get().services.map(service => {
        if (service.id === serviceId) {
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
  removePlugin: (serviceId, pluginId) => set((state) => {
    return {
      ...state,
      services: [...get().services.map(service => {
        if (service.id === serviceId) {
          const { plugins, ...rest } = service
          return {
            plugins: plugins.filter(plugin => plugin.id !== pluginId),
            ...rest
          }
        } else {
          return service
        }
      })]
    }
  })

}))

export default useStackablesStore
