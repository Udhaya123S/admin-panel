const User = require('../models/user.model');
const httpStatus = require('http-status');
const userService=require('../services/user.service')



exports.getDashboard = async (req, res) => {
  try {
    const { role, id } = req.user;

    if (role === 'admin') {
      
      const users = await User.findAll();
      return res.status(httpStatus.OK).json({
        message: 'Admin Dashboard',
        users,
        adminInfo: req.user
      });
    } else {
     
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
      }
      return res.status(httpStatus.OK).json({
        message: 'User Dashboard',
        user 
      });
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
      const users = await User.findAll();   
      return res.status(200).json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.getdetail = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const user= await userService.getdetail({
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      search: search.trim(),
    });

    res.status(httpStatus.OK).json(user);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};







