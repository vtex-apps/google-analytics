/** Product viewed event
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-actvities
 */

interface Item {
  itemId: string
  name: string
}

interface Product {
  brand: string
  categoryId: string
  productId: string
  productName: string
  selectedSku: string
  items: Item[]
}

const getSkuName = (selectedSku: string, items: Item[]) =>
  (items.find((item: Item) => selectedSku === item.itemId) || ({} as Item)).name

export const productDetail = (product: Product) => {
  ga('ec:addProduct', {
    brand: product.brand,
    category: product.categoryId,
    id: product.productId,
    name: product.productName,
    variant: getSkuName(product.selectedSku, product.items),
  })

  ga('ec:setAction', 'detail')

  ga('send', 'event', {
    eventAction: 'Detail',
    eventCategory: 'Ecommerce',
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
    eventAction: 'Purchase',
    eventCategory: 'Ecommerce',
    nonInteraction: 1,
  })
}
