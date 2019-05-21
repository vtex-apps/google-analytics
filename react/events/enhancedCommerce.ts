import { getCategory } from './../utils'

interface Item {
  itemId: string
  name: string
}

interface Product {
  brand: string
  categoryId: string
  categories: string[]
  productId: string
  productName: string
  selectedSku: string
  items: Item[]
  variant: string
}

const getSkuName = (selectedSku: string, items: Item[]) =>
  (items.find((item: Item) => selectedSku === item.itemId) || ({} as Item)).name

/** Product viewed event
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-actvities
 */
export const productDetail = (product: Product) => {
  if (!product) return

  const category = getCategory(product.categories)

  ga('ec:addProduct', {
    brand: product.brand,
    category: category,
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
export const productClick = (product: Product) => {
  if (!product) return

  const category = getCategory(product.categories)

  ga('ec:addProduct', {
    id: product.productId,
    name: product.productName,
    category: category,
    brand: product.brand,
    variant: getSkuName(product.selectedSku, product.items),
  })
  ga('ec:setAction', 'click')
  ga('send', 'event', {
    eventAction: 'Click',
    eventCategory: 'Product',
  })
}

/** Product Impression event
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#product-impression
 */
export const productImpression = (
  product: Product,
  position: number,
  list: string
) => {
  if (!product) return

  const category = getCategory(product.categories)

  ga('ec:addImpression', {
    id: product.productId,
    name: product.productName,
    category: category,
    brand: product.brand,
    variant: getSkuName(product.selectedSku, product.items),
    list: list,
    position: position,
  })
  ga('send', 'event', {
    eventAction: 'Impression',
    eventCategory: 'Product',
    nonInteraction: 1,
  })
}

/** Addition to cart events
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#add-remove-cart
 */
export const addToCart = (
  product: Product,
  price: number,
  quantity: number
) => {
  if (!product) return

  ga('ec:addProduct', {
    name: product.productName,
    brand: product.brand,
    variant: product.variant,
    price,
    quantity,
  })
  ga('ec:setAction', 'add')
  ga('send', 'event', {
    eventAction: 'Click',
    eventCategory: 'Add to cart',
  })
}

/** Removal from cart events
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#add-remove-cart
 */
export const removeFromCart = (product: Product, price: number) => {
  if (!product) return

  ga('ec:addProduct', {
    id: product.productId,
    name: product.productName,
    price,
  })
  ga('ec:setAction', 'remove')
  ga('send', 'event', {
    eventAction: 'Click',
    eventCategory: 'Remove from cart',
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
