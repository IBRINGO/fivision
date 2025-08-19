// controllers/userController.js
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const pool = require('../db'); // ta connexion PostgreSQL
const UserModel = require('../models/userModel');

// ✅ Register
const createUser = async (req, res) => {
  try {
    const { fname, lname, email, password, accepted_terms } = req.body;

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.createUser(fname, lname, email, hashedPassword, accepted_terms);

    res.status(201).json({ message: 'Utilisateur créé avec succès', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findUserByEmail(email);

    if (!user) return res.status(400).json({ error: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Mot de passe incorrect' });

    res.json({
      message: 'Connexion réussie',
      user: { id: user.id, fname: user.fname, lname: user.lname, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get users
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Send OTP
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email requis' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      'UPDATE users SET otp = $1, otp_expires = $2 WHERE email = $3',
      [otp, otpExpires, email]
    );

    await sendOtpEmail(email, otp);

    res.status(200).json({ success: true, message: 'Code OTP envoyé avec succès' });
  } catch (err) {
    console.error('Erreur envoi OTP:', err);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi du code OTP' });
  }
};

// ✅ Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email et OTP requis' });
  }

  try {
    const result = await pool.query(
      'SELECT otp, otp_expires FROM users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Code OTP invalide' });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ success: false, message: 'Code OTP expiré' });
    }

    await pool.query('UPDATE users SET otp = NULL, otp_expires = NULL WHERE email = $1', [email]);

    return res.status(200).json({
      success: true,
      message: 'OTP vérifié avec succès'
      
    });
  } catch (err) {
    console.error('Erreur vérification OTP:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la vérification' });
  }
};

// ✅ Fonction utilitaire d’envoi d’email
async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Votre code OTP',
    text: `Votre code de vérification est: ${otp}`,
    html: `<p>Votre code de vérification est: <strong>${otp}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { createUser, loginUser, getUsers, sendOtp, verifyOtp };
