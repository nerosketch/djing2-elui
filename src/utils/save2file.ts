export default (content: any, contentType: string, fname: string) => {
  const myBlob = new Blob([content], { type: contentType, endings: 'native' })
  const anchor = document.createElement('a')
  anchor.download = fname
  anchor.href = window.URL.createObjectURL(myBlob)
  anchor.click()
  anchor.parentElement?.removeChild(anchor)
}
