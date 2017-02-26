export const addLoaderListener = () => {
  window.addEventListener('beforeunload', beforeunloadFn)
}

export const removeLoaderListener = () => {
  window.removeEventListener('beforeunload', beforeunloadFn)
}

const beforeunloadFn = e => {
  e.preventDefault()
  return e.returnValue = 'Are you sure you want to close?'
}
