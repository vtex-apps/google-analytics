import { OrderPlacedData, PageViewData } from '../typings/events'

let currentUrl = ''

// Common pageview function
export const pageView = (origin: string, data: PageViewData) => {
  if (!data.pageUrl || data.pageUrl === currentUrl) {
    return
  }

  currentUrl = data.pageUrl
  ga('set', {
    location: currentUrl,
    page: currentUrl.replace(origin, ''),
    ...(data.pageTitle && {
      title: data.pageTitle,
    }),
  })
  ga('send', 'pageview')
}

// Common OrderPlaced function
export const orderPlaced = (data: OrderPlacedData) => {
  ga('send', 'event', {
    eventAction: 'view',
    eventCategory: 'orderPlaced',
    ...data,
  })
}
