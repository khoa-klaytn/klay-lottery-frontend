export const LS_KEY = 'blog_sweepstakes_language'

export const getLanguageCodeFromLS = () => {
  try {
    const codeFromStorage = localStorage.getItem(LS_KEY)
    return codeFromStorage || 'en'
  } catch {
    return 'en'
  }
}
