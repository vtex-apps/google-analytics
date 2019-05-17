export interface EventData {
  event: string
  eventName: string
  currency: string
}

export interface PageViewData extends EventData {
  event: 'pageView'
  pageTitle: string
  pageUrl: string
}

export interface OrderPlacedData extends EventData {
  event: 'orderPlaced'
  transactionProducts: Product[]
  transactionAffiliation: string
  coupon: string
  orderGroup: string
  transactionTotal: number
  transactionShipping: number
  transactionTax: number
}

export interface ProductViewData extends EventData {
  event: 'productView'
  product: Product
}

export interface ProductClickData extends EventData {
  event: 'productClick'
  product: Product
}

export interface ProductImpressionData extends EventData {
  event: 'productImpression'
  product: Product
}

interface Product {
  brand: string
  categoryId: string
  categories: string[]
  productId: string
  productName: string
  selectedSku: string
  items: Item[]
}

interface Item {
  itemId: string
  name: string
}
