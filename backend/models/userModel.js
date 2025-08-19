// models/userModel.js
const pool = require('../db');

// Créer un nouvel utilisateur
const createUser = async (fname, lname, email, password, accepted_terms) => {
  const result = await pool.query(
    `INSERT INTO users (fname, lname, email, password, accepted_terms)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, fname, lname, email, accepted_terms`,
    [fname, lname, email, password, accepted_terms]
  );
  return result.rows[0];
};

// Récupérer tous les utilisateurs
const getAllUsers = async () => {
  const result = await pool.query(
    'SELECT id, fname, lname, email, accepted_terms FROM users'
  );
  return result.rows;
};

// Trouver un utilisateur par email
const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
};

module.exports = { createUser, getAllUsers, findUserByEmail };
