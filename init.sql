-- Utilisateurs validés
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fname VARCHAR(100),
  lname VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  accepted_terms BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Utilisateurs en attente
CREATE TABLE pending_users (
  id SERIAL PRIMARY KEY,
  fname VARCHAR(100),
  lname VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  accepted_terms BOOLEAN,
  is_verified BOOLEAN DEFAULT FALSE, -- Nouveau champ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP
CREATE TABLE otp (
  id SERIAL PRIMARY KEY,
  pending_user_id INT REFERENCES pending_users(id),
  otp_code VARCHAR(6),
  expires_at TIMESTAMP,
  is_pending BOOLEAN DEFAULT TRUE -- Nouveau champ
);

-- Historique vérification OTP
CREATE TABLE otp_verify (
  id SERIAL PRIMARY KEY,
  otp_id INT REFERENCES otp(id),
  verified BOOLEAN,
  verified_at TIMESTAMP,
  attempt_ip VARCHAR(50)
);
