import defaultSettings from '@/settings'

const title = defaultSettings.title || '一拍·集合'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
