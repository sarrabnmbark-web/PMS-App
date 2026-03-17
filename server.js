const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const reservationRoutes = require('./routes/reservationRoutes');


// Importation de vos routes
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');


dotenv.config();

connectDB();

const app = express();

app.use(cors()); 
app.use(express.json());
//app.use('/api/reservations', reservationRoutes);

// --- DÉCLARATION DES ROUTES ICI ---
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
    res.send('API PMS est en cours de fonctionnement...');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Serveur démarré en mode développement sur le port ${PORT}`);
});