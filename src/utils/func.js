export const debounce = (func, wait, immediate) => {
  let timeout
  return () => {
    const context = this
    const args = arguments
    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
}

export const createId = ({name, hash}) => `___scroll-section___${name || ''}___${hash || ''}`;

export const getAnchoreByName = (object = {}, name) => {
  const key = Object.keys(object).find(key => object[key].name === name && !object[key].hash);
  return key ? object[key] : null;
}
