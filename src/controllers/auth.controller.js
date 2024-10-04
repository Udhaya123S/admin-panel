const authService = require('../services/auth.service');
const httpStatus = require('http-status');

// Register Controller
exports.register = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await authService.register(userData);
    res.status(httpStatus.CREATED).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(error.status || httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
   
    const user = await authService.login(req, res);
 
    res.status(httpStatus.OK).json({ message: "Login successful", user });
    

  } catch (error) {
    console.log("Error during login:", error.message);

    if (!res.headersSent) {
      res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
};


// Logout controller
exports.logout = async (req, res) => {
  try {
    await authService.logout(req.cookies.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    console.error('Logout error:', error);  
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Logout failed' });
  }
};
