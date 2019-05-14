/** Product viewed event
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-actvities
 */
export const productDetail = (product: any) => {
  ga('ec:addProduct', {
    brand: product.brand,
    category: product.categoryId,
    id: product.productId,
    name: product.productName,
    variant: product.variant,
  })
  ga('ec:setAction', 'detail')
  ga('send', 'event', {
    eventAction: 'Detail -> View',
    eventCategory: 'Ecommerce -> Product',
    nonInteraction: 1,
  })
}

/** Purchase event
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-transaction
 */
export const purchase = (order: any) => {
  order.transactionProducts.map((product: any) => {
    ga('ec:addProduct', {
      brand: product.brand,
      category: product.category,
      id: product.id,
      name: product.name,
      price: product.sellingPrice,
      quantity: product.quantity,
      variant: product.skuName,
    })
  })

  ga('ec:setAction', 'purchase', {
    affiliation: order.transactionAffiliation,
    coupon: order.coupon,
    id: order.orderGroup,
    revenue: order.transactionTotal,
    shipping: order.transactionShipping,
    tax: order.transactionTax,
  })

  ga('send', 'event', {
    eventAction: 'Purchase -> View',
    eventCategory: 'Ecommerce -> OrderPlaced',
    nonInteraction: 1,
  })
}
