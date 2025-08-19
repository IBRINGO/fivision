// routes/userRoutes.js
const express = require('express');
const { createUser, loginUser, getUsers, sendOtp, verifyOtp } = require('../controller/userControllers');
const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);

// OTP
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);



module.exports = router;
