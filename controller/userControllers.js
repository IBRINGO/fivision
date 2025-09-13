const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const pool = require('../db');
const UserModel = require('../models/userModel');

// === REGISTER ===
const registerUser = async (req, res) => {
  try {
    const { fname, lname, email, password, accepted_terms } = req.body;
    if (!fname || !lname || !email || !password)
      return res.status(400).json({ error: 'Tous les champs sont requis' });

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Ajouter directement dans users avec is_verified=false
    const result = await pool.query(
      `INSERT INTO users (fname, lname, email, password, accepted_terms)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [fname, lname, email, hashedPassword, accepted_terms]
    );
    const userId = result.rows[0].id;

    res.status(200).json({
      success: true,
      message: 'Utilisateur créé. Vous devez vérifier votre email avec un OTP.',
      userId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
// === SEND OTP (sans users) ===
const sendOtpDirect = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requis' });

    // Vérifier si l'email existe déjà dans users
    const existingUser = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Email déjà utilisé" });
    }

    // Générer OTP aléatoire (6 chiffres)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // expire dans 15 min

    // Invalider anciens OTP pour ce mail
    await pool.query(
      "UPDATE otp SET is_pending=false WHERE email=$1 AND is_pending=true",
      [email]
    );

    // Insérer nouvel OTP
    const otpInsertResult = await pool.query(
      `INSERT INTO otp (email, otp_code, expires_at, is_pending)
       VALUES ($1, $2, $3, true) RETURNING id`,
      [email, otp, otpExpires]
    );
    const otpId = otpInsertResult.rows[0].id;

    // Configurer transporteur mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // Envoyer email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Votre code OTP",
      text: `Votre code de vérification est: ${otp}`,
      html: `<p>Votre code de vérification est: <strong>${otp}</strong></p>`,
    });

    console.log(`✅ OTP ${otp} envoyé à ${email}`);

    res.status(200).json({ success: true, message: "OTP envoyé avec succès", otpId });
  } catch (err) {
    console.error("Erreur envoi OTP:", err);
    res.status(500).json({ error: err.message });
  }
};



// === VERIFY OTP & CREATE USER IF VALID ===
const verifyOtp = async (req, res) => {
  try {
    console.log("🔍 Vérification OTP pour :", req.body);
    const { email, otp } = req.body;

    // Validation des champs
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email et OTP requis" });
    }

    // Récupérer OTP actif
    const otpResult = await pool.query(
      `SELECT * FROM otp 
       WHERE email=$1 AND otp_code=$2 AND is_pending=true AND expires_at > NOW()
       ORDER BY id DESC LIMIT 1`,
      [email, otp]
    );
    const otpRecord = otpResult.rows[0];

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP invalide ou expiré" });
    }

    // Marquer OTP comme utilisé
    await pool.query("UPDATE otp SET is_pending=false WHERE id=$1", [otpRecord.id]);

    // Historiser la vérification
    await pool.query(
      `INSERT INTO otp_verify (otp_id, verified, attempt_ip, email)
       VALUES ($1, true, $2, $3)`,
      [otpRecord.id, req.ip, email]
    );

    console.log("✅ OTP vérifié avec succès pour :", email);
    return res.status(200).json({
      success: true,
      message: "OTP vérifié avec succès",
    });

  } catch (err) {
    console.error("Erreur vérification OTP :", err);
    return res.status(500).json({ success: false, message: "Erreur serveur", error: err.message });
  }
};


// === LOGIN ===
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) 
      return res.status(400).json({ error: 'Email et mot de passe requis' });

    const user = await UserModel.findUserByEmail(email);
    if (!user) 
      return res.status(400).json({ error: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(401).json({ error: 'Mot de passe incorrect' });

    res.json({
      message: 'Connexion réussie',
      user: { id: user.id, fname: user.fname, lname: user.lname, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { registerUser, sendOtpDirect, verifyOtp, loginUser };
