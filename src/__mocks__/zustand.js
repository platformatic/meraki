import { vi, afterEach } from 'vitest'
import { act } from '@testing-library/react'

const { create: actualCreate } = await vi.importActual('zustand')
export const storeResetFns = new Set()

export const create = () => {
  return (StateCreator) => {
    const store = actualCreate(StateCreator)
    const initialState = store.getState()
    storeResetFns.add(() => {
      store.setState(initialState, true)
    })
    return store
  }
}

afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn()
    })
  })
})
