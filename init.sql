-- Table des utilisateurs
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fname VARCHAR(100) NOT NULL,
  lname VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,        -- stocké hashé
  accepted_terms BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table OTP (liée à l'email, pas besoin de user_id au départ)
CREATE TABLE otp (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,           -- OTP associé à un email
  otp_code CHAR(6) NOT NULL,             -- toujours 6 chiffres
  expires_at TIMESTAMP NOT NULL,         -- date d’expiration
  is_pending BOOLEAN DEFAULT TRUE,       -- encore valide ?
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historique de vérification OTP
CREATE TABLE otp_verify (
  id SERIAL PRIMARY KEY,
  otp_id INT NOT NULL REFERENCES otp(id) ON DELETE CASCADE,
  verified BOOLEAN NOT NULL,
  verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attempt_ip VARCHAR(50),
  email VARCHAR(255) NOT NULL            -- email utilisé lors de la tentative
);
