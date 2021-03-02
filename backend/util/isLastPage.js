const isLastPage = (total, page, pageSize) =>
  total <= (Number(page) + 1) * pageSize

module.exports = isLastPage