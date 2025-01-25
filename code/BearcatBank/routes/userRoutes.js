const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserDetails } = require('../controllers/userController');  // Import controller methods

// Route to register a new user
router.post('/register', registerUser);
// after clicking on signup and after each login make a req to AWSotpmicroservice
// so that i will generate a code req body is the emial and validate it in the next page..

// Route to authenticate a user
router.post('/login', loginUser);

// Route to authenticate a user
router.post('/', loginUser);

// Route to get user details by userID
router.get('/:userID', getUserDetails);  // Use dynamic route parameter for userID

module.exports = router;
