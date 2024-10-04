const { Op } = require('sequelize');
const User = require('../models/user.model');

exports.getdetail = async ({ page = 1, limit = 10, search = '' }) => {
  page = Math.max(1, parseInt(page) || 1);
  limit = Math.max(1, parseInt(limit) || 10);

  const offset = (page - 1) * limit;
  const whereClause = search ? {
    [Op.or]: [
      {name: { [Op.iLike]: `%${search}%` }} ]
  } : {};  
  const users = await User.findAndCountAll({
    where: whereClause,
    limit: limit,
    offset: offset,
  });
  

  return {
    data: users.rows,
    total: users.count,
    page,
    totalPages: Math.ceil(users.count / limit),
    currentPage: page,
  };
};
