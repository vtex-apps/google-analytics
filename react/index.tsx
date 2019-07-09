import { orderPlaced } from './events/commonEvents'
import {
  addToCart,
  productDetail,
  productClick,
  productImpression,
  purchase,
  removeFromCart,
  Impression,
} from './events/enhancedCommerce'

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
    const {
      product: oldFormatProduct,
      position: oldFormatPosition,
      impressions,
    } = e.data
    let parsedImpressions: Impression[] = []
    if (oldFormatProduct != null && oldFormatPosition !== null) {
      const skuId =
        oldFormatProduct && oldFormatProduct.sku && oldFormatProduct.sku.itemId
      const newProduct = { ...oldFormatProduct, selectedSku: skuId }
      parsedImpressions = [{ product: newProduct, position: oldFormatPosition }]
    }

    if (impressions != null) {
      parsedImpressions = impressions.map(({ product }: Impression) => {
        const skuId = product && product.sku && product.sku.itemId
        return { ...product, selectedSku: skuId }
      })
    }

    productImpression(parsedImpressions, e.data.list)
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
      product.productName = product.name
      addToCart(product, product.price, product.quantity)
    })
    return
  }

  if (e.data.event === 'removeFromCart') {
    e.data.items.forEach((product: any) => {
      product.productId = product.id
      product.productName = product.name
      removeFromCart(product, product.sellingPrice)
    })
    return
  }
}

// Event listener for pageview
window.addEventListener('message', listener)
