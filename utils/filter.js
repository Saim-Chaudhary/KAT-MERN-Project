// helper to build mongoose filters from query params
const buildPackageFilter = (query) => {
  const filter = {};
  if (query.search) {
    filter.title = { $regex: query.search, $options: 'i' };
  }
  if (query.minPrice) {
    filter.basePrice = { ...filter.basePrice, $gte: Number(query.minPrice) };
  }
  if (query.maxPrice) {
    filter.basePrice = { ...filter.basePrice, $lte: Number(query.maxPrice) };
  }
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }
  // geospatial radius search
  if (query.lng && query.lat && query.radius) {
    const coords = [Number(query.lng), Number(query.lat)];
    filter.location = {
      $geoWithin: {
        $centerSphere: [coords, Number(query.radius) / 6378.1]
      }
    };
  }
  return filter;
};

const buildHotelFilter = (query) => {
  const filter = {};
  if (query.city) filter.city = query.city;
  if (query.category) filter.category = query.category;
  if (query.minDistance) {
    filter.distanceFromHaram = { ...filter.distanceFromHaram, $gte: Number(query.minDistance) };
  }
  if (query.maxDistance) {
    filter.distanceFromHaram = { ...filter.distanceFromHaram, $lte: Number(query.maxDistance) };
  }
  if (query.lng && query.lat && query.radius) {
    const coords = [Number(query.lng), Number(query.lat)];
    filter.location = {
      $geoWithin: {
        $centerSphere: [coords, Number(query.radius) / 6378.1]
      }
    };
  }
  return filter;
};

module.exports = { buildPackageFilter, buildHotelFilter };