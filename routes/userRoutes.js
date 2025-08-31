const express = require('express');
const router = express.Router();
const { createUser, verifyOtp, loginUser, getUsers,sendOtpEmail } = require('../controller/userControllers');

router.post('/register', createUser);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.post('/send-otp', sendOtpEmail);

router.get('/', getUsers);

module.exports = router;
