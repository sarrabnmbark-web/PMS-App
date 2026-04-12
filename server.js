const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');



// Importation de vos routes
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const clientRoutes = require("./routes/clientRoutes");
const reservationRoutes = require('./routes/reservationRoutes');
const stayRoutes = require('./routes/stayRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');



dotenv.config();

connectDB();

const app = express();


// --- DÉCLARATION DES ROUTES ICI ---
app.use(cors()); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use("/api/clients", clientRoutes);
app.use('/api', reservationRoutes);

app.use('/api/stays', stayRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.get('/', (req, res) => {
    res.send('API PMS est en cours de fonctionnement...');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Serveur démarré en mode développement sur le port ${PORT}`);
});