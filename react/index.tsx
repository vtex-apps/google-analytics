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

// Common pageview function
const pageView = (data: any) => {
  currentUrl = data.pageUrl
  ga('set', {
    page: currentUrl.replace(location.origin, ''),
    ...(data.pageTitle && {
      title: data.pageTitle,
    }),
  })
  ga('send', 'pageview')
}

/** Product viewed event
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-actvities
 */
const productDetail = (product: any) => {
  ga('ec:addProduct', {
    id: product.productId,
    name: product.productName,
    category: product.categoryId,
    brand: product.brand,
    variant: product.variant,
  })
  ga('ec:setAction', 'detail')
}

// Common OrderPlaced function
const orderPlaced = (order: any) => {
  ga('send', 'event', {
    eventCategory: 'orderPlaced',
    eventAction: 'view',
    ...order,
  })
}

/** Purchase event
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-transaction
 */
const purchase = (order: any) => {
  ga('ec:setAction', 'purchase', {
    id: order.orderGroup,
    affiliation: order.transactionAffiliation,
    revenue: order.transactionTotal,
    tax: order.transactionTax,
    shipping: order.transactionShipping,
    coupon: order.coupon,
  })
}

// Event listener for pageview
window.addEventListener('message', e => {
  if (e.data.pageUrl && e.data.pageUrl !== currentUrl) {
    switch (e.data.event) {
      case 'pageView': {
        pageView(e.data)
        return
      }
      case 'pageInfo': {
        pageView(e.data)
        return
      }
      default: {
        return
      }
    }
  }

  // Event listener for productDetail
  if (e.data.event === 'productView') {
    productDetail(e.data.product)
  }

  // Event listener for orderPlaced
  if (e.data.event === 'orderPlaced') {
    orderPlaced(e.data)
    purchase(e.data)
  }
})
