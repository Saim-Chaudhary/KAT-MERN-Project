// helper to apply pagination parameters to a Mongoose query
const getPagination = (page = 1, limit = 10) => {
  const pageNumber = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;
  return { skip, limit: pageSize, page: pageNumber };
};

const generatePagingResult = (total, pageSize, page) => {
  const pages = Math.ceil(total / pageSize);
  return { total, page, pages, pageSize };
};

module.exports = { getPagination, generatePagingResult };