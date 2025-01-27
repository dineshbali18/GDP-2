const express = require('express');
const router = express.Router();
const verifyToken = require('../jwt/verify');


module.exports = (sequelize) => {
  // Import controller methods
  const userController = require('../controllers/userController')(sequelize); // Import the controller and pass sequelize

  const { registerUser, loginUser, getUserDetails } = userController;

  // Route to register a new user
  router.post('/register', registerUser);

  // Route to login a user
  router.post('/login', loginUser);

  // Route to get user details
  router.get('/details/:userID', verifyToken, getUserDetails);

  return router;
};