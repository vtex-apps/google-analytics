import {
  Item,
  OrderPlacedData,
  ProductClickData,
  ProductImpressionData,
  ProductViewData,
} from '../typings/events'
import { getCategory } from './../utils'

const getSkuName = (selectedSku: string, items: Item[]) =>
  (items.find((item: Item) => selectedSku === item.itemId) || ({} as Item)).name

/** Product viewed event
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-actvities
 */
export const productDetail = (data: ProductViewData) => {
  if (!data.product) {
    return
  }

  const product = data.product
  const category = getCategory(product.categories)

  ga('ec:addProduct', {
    brand: product.brand,
    category,
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

/** Product clicked event
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#product-click
 */
export const productClick = (data: ProductClickData) => {
  if (!data.product) {
    return
  }

  const product = data.product
  const category = getCategory(product.categories)

  ga('ec:addProduct', {
    brand: product.brand,
    category,
    id: product.productId,
    name: product.productName,
    variant: getSkuName(product.selectedSku, product.items),
  })
  ga('ec:setAction', 'click')
  ga('send', 'event', {
    eventAction: 'Click',
    eventCategory: 'Product',
    nonInteraction: 1,
  })
}

/** Product Impression event
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#product-impression
 */
export const productImpression = (data: ProductImpressionData) => {
  if (!data.product) {
    return
  }

  const { product, position, list } = data
  product.selectedSku = product.sku.itemId

  const category = getCategory(product.categories)

  ga('ec:addImpression', {
    brand: product.brand,
    category,
    id: product.productId,
    list,
    name: product.productName,
    position,
    variant: getSkuName(product.selectedSku, product.items),
  })
  ga('send', 'event', {
    eventAction: 'Impression',
    eventCategory: 'Product',
    nonInteraction: 1,
  })
}

/** Purchase event
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-transaction
 */
export const purchase = (data: OrderPlacedData) => {
  data.transactionProducts.map((product: any) => {
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
    affiliation: data.transactionAffiliation,
    coupon: data.coupon,
    id: data.orderGroup,
    revenue: data.transactionTotal,
    shipping: data.transactionShipping,
    tax: data.transactionTax,
  })

  ga('send', 'event', {
    eventAction: 'Purchase',
    eventCategory: 'Ecommerce',
    nonInteraction: 1,
  })
}
