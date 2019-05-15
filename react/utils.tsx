export const getCategory = (rawCategories: string[]) => {
  if (!rawCategories || !rawCategories.length) return

  const _filterEmpty = (string: string) => {
    if (string.length > 0) return string
  }

  const categories = rawCategories.map(function (categoryPath: string) {
    let splitedPath = categoryPath.split('/').filter(_filterEmpty)
    return splitedPath[0]
  })

  return categories ? categories[0] : categories
}
