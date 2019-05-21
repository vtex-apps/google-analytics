import { orderPlaced } from './events/commonEvents'
import {
  addToCart,
  productDetail,
  productClick,
  productImpression,
  purchase,
  removeFromCart,
} from './events/enhancedCommerce'

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

let currentUrl = ''

interface EventData {
  event: string
  eventName: string
  currency: string
}

interface PageViewData extends EventData {
  pageTitle: string
  pageUrl: string
}

// Common pageview function
const pageView = (origin: string, data: PageViewData) => {
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

function listener(e: MessageEvent) {
  // Event listener for productDetail
  if (e.data.event === 'productView') {
    productDetail(e.data.product)
    return
  }

  // Event listener for productClick
  if (e.data.event === 'productClick') {
    const product = e.data.product
    product.selectedSku = product.sku.itemId
    productClick(product)
    return
  }

  // Event listener for productImpression
  if (e.data.event === 'productImpression') {
    productImpression(e.data.product, e.data.position, e.data.list)
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

  if (e.data.event === "addToCart") {
    e.data.items.forEach((product: any) => {
      product.productName = product.name
      addToCart(product, product.price, product.quantity)
    })
  }

  if (e.data.event === "removeFromCart") {
    e.data.items.forEach((product: any) => {
      product.productId = product.id
      product.productName = product.name
      removeFromCart(product, product.sellingPrice)
    })
  }

}

// Event listener for pageview
window.addEventListener('message', listener)
