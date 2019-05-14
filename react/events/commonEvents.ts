// Common OrderPlaced function
export const orderPlaced = (order: any) => {
  ga('send', 'event', {
    eventAction: 'view',
    eventCategory: 'orderPlaced',
    ...order,
  })
}
