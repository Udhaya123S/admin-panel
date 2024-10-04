const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const JWT_SECRET = 'your_jwt_secret'; 

exports.authenticate = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Access Denied: No Token Provided' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET); 
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(httpStatus.FORBIDDEN).json({ message: 'Invalid Token' });
  }
};




exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(httpStatus.FORBIDDEN).json({ message: 'Access Denied: Admins Only' });
  }
  next(); 
};
