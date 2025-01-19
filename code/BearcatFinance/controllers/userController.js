const User = require('../models/userModel');  // Import the User model

// Controller to handle user registration
const registerUser = async (req, res) => {
  const { username, email, phoneNum, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = await User.create({
      username,
      email,
      phoneNum
    });

    user.setPassword(password);  // Hash the password and set the encrypted password
    await user.save();  // Save the user to the database

    res.status(201).json({
      message: 'User registered successfully',
      user: { username: user.username, email: user.email, phoneNum: user.phoneNum }
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'An error occurred while registering the user.' });
  }
};

// Controller to handle user login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ where: { username } });

    if (user && user.authenticate(password)) {
      res.status(200).json({
        message: 'Authentication successful',
        user: { username: user.username, email: user.email }
      });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
};

// Controller to retrieve user details by UserID
const getUserDetails = async (req, res) => {
  const { userID } = req.params;

  try {
    // Find user by userID
    const user = await User.findOne({ where: { id: userID } });

    if (user) {
      res.status(200).json({
        message: 'User details fetched successfully',
        user: { name: user.username, email: user.email }  // Only return name and email
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ error: 'An error occurred while fetching user details.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserDetails
};
