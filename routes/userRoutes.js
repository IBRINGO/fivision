const express = require('express');
const router = express.Router();
const { registerUser, sendOtpDirect, verifyOtp, loginUser } = require('../controller/userControllers');

// 1. Pré-inscription : création utilisateur avec is_verified=false
router.post("/register", registerUser);

// 2. Envoi OTP
router.post("/send-otp", sendOtpDirect);

// 3. Vérification OTP
router.post("/verify-otp", verifyOtp);

// 4. Connexion
router.post("/login", loginUser);

module.exports = router;
