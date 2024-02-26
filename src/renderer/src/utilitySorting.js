export const sortCollection = (collection, key, ascending = true) => {
  return collection.sort((a, b) => {
    let keyA = a[key]
    let keyB = b[key]
    if (typeof keyB === 'string') {
      keyB = keyB.toUpperCase()
    }
    if (typeof keyA === 'string') {
      keyA = keyA.toUpperCase()
    }

    if (keyA < keyB) {
      return ascending ? -1 : 1
    }
    if (keyA > keyB) {
      return ascending ? 1 : -1
    }
    return 0
  })
}
