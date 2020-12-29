export const download = (name, str) => {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str))
  element.setAttribute('download', name)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

export const copy = (str, cb) => {
  const element = document.createElement('textarea')
  element.value = str

  element.style.top = '0'
  element.style.left = '0'
  element.style.position = 'fixed'

  document.body.appendChild(element)

  element.focus()
  element.select()

  try {
    const success = document.execCommand('copy')
    cb(success)
  } catch (e) {
    cb(false)
  }

  document.body.removeChild(element)
}
