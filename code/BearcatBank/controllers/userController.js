const axios = require('axios');


// Ensure sequelize is passed correctly to the controller
module.exports = (sequelize) => {
  const User = require('../models/user')(sequelize); // Pass sequelize to the model

  const registerUser = async (req, res) => {
    const { username, email, phoneNum, password } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Create the user in the database
      const user = await User.create({ username, email, phoneNum, password });
      
      if (user.UserID !== undefined) {
        // Step 1: Make request to AWS OTP service for 2FA (Generate OTP)
        const otpApiResponse = await axios.post('http://localhost:3000/api/user/generateotp', { email });
  
        console.log("otpApiResponse", otpApiResponse);
        // Check if OTP generation was successful
        if (otpApiResponse.status !== 200) {
          // Rollback user creation if OTP generation failed
          await user.destroy();
          return res.status(500).json({ error: 'Failed to generate OTP. Registration rolled back.' });
        }
  
        // Step 2: Send OTP to the user's email
        const sendOtpResponse = await axios.post('http://localhost:3000/api/user/sendotp', { email });
  
        console.log("sendOtpResponse::::::::::", sendOtpResponse.status);
        // Check if OTP sending was successful
        if (sendOtpResponse.status !== 200) {
          // Rollback user creation if OTP sending failed
          await user.destroy();
          return res.status(500).json({ error: 'Failed to send OTP. Registration rolled back.' });
        }
  
        // If everything is successful, respond with the user registration details
        return res.status(201).json({
          message: 'User registered successfully. OTP has been sent.',
          user: { username: user.username, email: user.email, phoneNum: user.phoneNum },
        });
      }
  
    } catch (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ error: 'An error occurred during registration.' });
    }
  };

  const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });

      if (user && await user.validatePassword(password)) {
        // OTP generation for 2FA
        const otpApiResponse = await axios.post('http://localhost:3000/api/user/generateotp', { email: user.email });

        if (otpApiResponse.status !== 200 || !otpApiResponse.data.success) {
          return res.status(500).json({ error: 'Failed to send OTP for 2FA.' });
        }

        res.status(200).json({
          message: 'Authentication successful. OTP sent for 2FA.',
          user: { username: user.username, email: user.email },
        });
      } else {
        res.status(400).json({ error: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'An error occurred during login.' });
    }
  };

  const getUserDetails = async (req, res) => {
    const { userID } = req.params;

    try {
      const user = await User.findOne({ where: { UserID: userID } });

      if (user) {
        res.status(200).json({
          message: 'User details fetched successfully',
          user: { username: user.username, email: user.email },
        });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      res.status(500).json({ error: 'An error occurred while fetching user details.' });
    }
  };

  return { registerUser, loginUser, getUserDetails };
};
