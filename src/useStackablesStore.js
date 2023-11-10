import { create } from 'zustand'

const useStackablesStore = create((set, get) => ({
  formDataWizard: {},
  addFormDataWizard: (newValue) => set((state) => {
    return { ...state, formDataWizard: { ...get().formDataWizard, ...newValue } }
  }),
  setFormDataWizard: (formDataWizard) => set((state) => {
    return { ...state, formDataWizard }
  })
}))

export default useStackablesStore
