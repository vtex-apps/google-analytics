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
    const prodData = e.data.product
    const skuId = prodData && prodData.sku && prodData.sku.itemId
    const selectedProduct = {
      ...e.data.product,
      selectedSku: skuId,
    }
    productClick(selectedProduct)
    return
  }

  // Event listener for productImpression
  if (e.data.event === 'productImpression') {
    const prodData = e.data.product
    const skuId = prodData && prodData.sku && prodData.sku.itemId
    const product = {
      ...e.data.product,
      selectedSku: skuId,
    }
    productImpression(product, e.data.position, e.data.list)
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

  if (e.data.event === 'addToCart') {
    e.data.items.forEach((product: any) => {
      const addedProd = {
        ...product,
        productId: product.skuId || product.id,
        productName: product.name,
        variant: product.variant || product.skuName,
      }
      addToCart(addedProd, product.price, product.quantity)
    })
    return
  }

  if (e.data.event === 'removeFromCart') {
    e.data.items.forEach((product: any) => {
      const removedProd = {
        ...product,
        productId: product.id || product.skuId,
        productName: product.name,
        variant: product.skuName,
      }
      const price = product.price || product.sellingPrice
      removeFromCart(removedProd, price, product.quantity)
    })
    return
  }
}

// Event listener for pageview
window.addEventListener('message', listener)
