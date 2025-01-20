const User = require('../models/userModel');  // Import the User model

// Controller to handle user registration
const axios = require('axios'); // Import Axios for making HTTP requests
const { User } = require('../models'); // Adjust based on your project structure

const registerUser = async (req, res) => {
  const { username, email, phoneNum, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const user = await User.create({ username, email, phoneNum });

    // Hash and set the password
    user.setPassword(password);
    await user.save();

    // Call the AWS OTP microservice to generate and send the OTP
    const otpApiResponse = await axios.post('http://localhost:3000/api/user/generateotp', { email });

    if (otpApiResponse.status !== 200 || !otpApiResponse.data.success) {
      // Rollback the user registration if OTP generation fails
      await user.destroy();
      return res.status(500).json({ error: 'Failed to generate OTP. Registration rolled back.' });
    }

    res.status(201).json({
      message: 'User registered successfully. OTP has been sent.',
      user: { username: user.username, email: user.email, phoneNum: user.phoneNum },
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find user by username
      const user = await User.findOne({ where: { username } });
  
      // Authenticate user credentials
      if (user && user.authenticate(password)) {
        // Send OTP for 2FA
        const otpApiResponse = await axios.post('http://localhost:3000/api/user/generateotp', { email: user.email });
  
        if (otpApiResponse.status !== 200 || !otpApiResponse.data.success) {
          return res.status(500).json({ error: 'Failed to send OTP for 2FA.' });
        }
  
        // Respond with success message
        res.status(200).json({
          message: 'Authentication successful. OTP sent for 2FA.',
          user: { username: user.username, email: user.email },
        });
      } else {
        // Handle invalid credentials
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
