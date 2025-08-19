const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

//  définis le préfixe
app.use('/api/users', userRoutes);



module.exports = app;
