const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const httpStatus = require('http-status');

const JWT_SECRET = 'your_jwt_secret';

// Register User or Admin


exports.register = async (userData) => {
  const { name, email, password, role } = userData;
  const existingUser = await User.findOne({ where: { email, role } });
  if (existingUser) {
    throw { status: httpStatus.CONFLICT, message: `This Email already in use for the role ${role}` };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || 'user',
  });

  return newUser;
};

// logout user or Admin
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  const user = await User.findOne({ where: { email }, attributes: ['id', 'role', 'password'] });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }
  // console.log("userrrrrrr",user. dataValues)
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  
  res.cookie('token', token, {
    maxAge: 3600000,
    httpOnly: true,
    sameSite: 'None',
    secure: true,  
  });
  return { id: user. dataValues.id, role: user. dataValues.role ,token };
};

// Logout User (Simply acknowledge logout)
exports.logout = async (refreshToken) => {
  try {
    const result = await cookie.deleteOne({ token: refreshToken });
    if (result.deletedCount === 0) {
      
      console.warn('No token found to delete');
    }
    return { message: 'Logged out successfully' };
  } catch (error) {
    console.error('Error deleting token:', error); 
    throw new Error('Failed to delete refresh token');
  }
};