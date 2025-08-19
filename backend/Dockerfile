# Utiliser une image officielle Node.js
FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du projet
COPY . .

# Exposer le port de l’app
EXPOSE 5000

# Lancer l’application
CMD ["npm", "start"]
