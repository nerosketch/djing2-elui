import Cookies from 'js-cookie'

function getNight() {
  const now = new Date()
  now.setDate(now.getDate() + 7)
  now.setHours(3, 0, 0, 0)
  return now
}

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) => Cookies.set(sidebarStatusKey, sidebarStatus)

const languageKey = 'language'
export const getLanguage = () => Cookies.get(languageKey)
export const setLanguage = (language: string) => Cookies.set(languageKey, language)

// User
const tokenKey = 'djing2_admin_access_token'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => Cookies.set(tokenKey, token, {
  expires: getNight()
})
export const removeToken = () => Cookies.remove(tokenKey)
