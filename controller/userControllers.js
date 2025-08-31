const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const pool = require('../db');
const UserModel = require('../models/userModel');

// === REGISTER ===
const createUser = async (req, res) => {
  try {
    const { fname, lname, email, password, accepted_terms } = req.body;
    if (!fname || !lname || !email || !password)
      return res.status(400).json({ error: 'Tous les champs sont requis' });

    const existingUser = await UserModel.findUserByEmail(email);
    const existingPending = await pool.query(
      'SELECT * FROM pending_users WHERE email = $1',
      [email]
    );

    if (existingUser || existingPending.rows.length > 0) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Enregistrer dans pending_users
    const result = await pool.query(
      `INSERT INTO pending_users (fname, lname, email, password, accepted_terms)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email`,
      [fname, lname, email, hashedPassword, accepted_terms]
    );
    const pendingUser = result.rows[0];

    // Générer OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      `INSERT INTO otp (pending_user_id, otp_code, expires_at)
       VALUES ($1, $2, $3)`,
      [pendingUser.id, otp, otpExpires]
    );

    await sendOtpEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP envoyé pour vérification'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// === VERIFY OTP ===
const verifyOtp = async (req, res) => {
  const { otpId, otp, attemptIp } = req.body;
  if (!otpId || !otp)
    return res.status(400).json({ success: false, message: 'otpId et otp sont requis' });

  try {
    // Récupérer OTP
    const otpResult = await pool.query('SELECT * FROM otp WHERE id = $1', [otpId]);
    const otpRecord = otpResult.rows[0];
    if (!otpRecord) return res.status(404).json({ success: false, message: 'OTP non trouvé' });

    const now = new Date();
    const isValid = otpRecord.otp_code === otp && now <= new Date(otpRecord.expires_at);

    // Historique vérification
    await pool.query(
      `INSERT INTO otp_verify (otp_id, verified, verified_at, attempt_ip)
       VALUES ($1, $2, $3, $4)`,
      [otpId, isValid, isValid ? now : null, attemptIp || null]
    );

    if (!isValid) return res.status(400).json({ success: false, message: 'OTP invalide ou expiré' });

    // Marquer OTP et pending_user comme validés
    await pool.query('UPDATE otp SET is_pending = false WHERE id = $1', [otpId]);
    await pool.query('UPDATE pending_users SET is_verified = true WHERE id = $1', [otpRecord.pending_user_id]);

    // Créer utilisateur final dans users
    const pendingUser = await pool.query(
      'SELECT * FROM pending_users WHERE id = $1',
      [otpRecord.pending_user_id]
    );
    const userData = pendingUser.rows[0];

    const user = await UserModel.createUser(
      userData.fname,
      userData.lname,
      userData.email,
      userData.password,
      userData.accepted_terms
    );

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé après vérification OTP',
      user: { id: user.id, fname: user.fname, lname: user.lname, email: user.email }
    });

  } catch (err) {
    console.error('Erreur vérification OTP:', err);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: err.message });
  }
};

// === LOGIN ===
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });

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

// === GET USERS ===
const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// === EMAIL ===
async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Votre code OTP',
    text: `Votre code de vérification est: ${otp}`,
    html: `<p>Votre code de vérification est: <strong>${otp}</strong></p>`,
  });

  console.log(`✅ OTP ${otp} envoyé à ${email}`);
}

module.exports = { createUser, verifyOtp, loginUser, getUsers ,sendOtpEmail};
