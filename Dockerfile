
#psql -U postgres -d mydb

# Utiliser une image officielle Node.js
FROM node:18

# Définir le dossier de travail dans le container
WORKDIR /app

# Copier uniquement les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (production + dev si nécessaire)
RUN npm install --legacy-peer-deps

# Copier tout le reste du projet
COPY . .

# Supprimer le dossier node_modules local s'il existe (sécurité)
RUN rm -rf node_modules && npm install --legacy-peer-deps

# Exposer le port utilisé par l’app (5000 dans ton cas)
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]
