import { orderPlaced, pageView } from './events/commonEvents'
import {
  productDetail,
  productClick,
  productImpression,
  purchase,
} from './events/enhancedCommerce'
import { OrderPlacedData, ProductViewData, ProductClickData, PageViewData, ProductImpressionData } from './typings/events'

const gaId = window.__SETTINGS__.gaId

if (!gaId) {
  throw new Error(
    'Warning: No Google Analytics ID is defined. To setup the app, go to your admin.'
  )
}

// Initialize async analytics
window.ga =
  window.ga ||
  function() {
    ;(ga.q = ga.q || []).push(arguments)
  }
ga.l = +new Date()
ga('create', `${gaId}`, 'auto')
ga('require', 'ec')

// Load analytics script
const script = document.createElement('script')
script.src = `https://www.google-analytics.com/analytics.js`
script.async = true
document.head!.prepend(script)

interface PixelMessage extends MessageEvent {
  data: ProductViewData | ProductClickData | OrderPlacedData | PageViewData | ProductImpressionData
}

function listener(e: PixelMessage) {
  // Event listener for productDetail
  if (e.data.event === 'productView') {
    productDetail(e.data)
    return
  }

  // Event listener for productClick
  if (e.data.event === 'productClick') {
    productClick(e.data)
    return
  }

  // Event listener for productImpression
  if (e.data.event === 'productImpression') {
    productImpression(e.data)
    return
  }

  // Event listener for orderPlaced
  if (e.data.event === 'orderPlaced') {
    orderPlaced(e.data)
    purchase(e.data)
    return
  }

  if (e.data.event === 'pageView') {
    pageView(e.origin, e.data)
    return
  }
}

// Event listener for pageview
window.addEventListener('message', listener)
