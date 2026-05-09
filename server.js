const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');



// Importation de vos routes
//ph1:
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const clientRoutes = require("./routes/clientRoutes");
const reservationRoutes = require('./routes/reservationRoutes');
const stayRoutes = require('./routes/stayRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');

//ph2:
const paymentRoutes = require('./routes/paymentRoutes');
const invoiceItemRoutes = require('./routes/invoiceItemRoutes');
const seasonalPricingRoutes = require('./routes/seasonalPricingRoutes');
const housekeepingRoutes = require('./routes/housekeepingRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');




dotenv.config();

connectDB();

const app = express();


// --- DÉCLARATION DES ROUTES ICI ---

//ph1
app.use(cors()); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use("/api/clients", clientRoutes);
app.use('/api', reservationRoutes);

app.use('/api/stays', stayRoutes);
app.use('/api/invoices', invoiceRoutes);


app.get('/', (req, res) => {
    res.send('API PMS est en cours de fonctionnement...');
});

//ph2:
app.use('/api/payments', paymentRoutes);
app.use('/api/invoice-items', invoiceItemRoutes);
app.use('/api/seasons', seasonalPricingRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/audit-logs', auditLogRoutes);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Serveur démarré en mode développement sur le port ${PORT}`);
});