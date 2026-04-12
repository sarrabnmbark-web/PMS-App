const Room = require('../models/Rooms');
const Invoice = require('../models/Invoices');

const getDashboardStats = async (req, res) => {
    try {
        // Statistiques des chambres
        const availableRooms = await Room.countDocuments({ status: 'Disponible' });
        const occupiedRooms = await Room.countDocuments({ status: 'Occupée' });

        //  Calcul des revenus (Aujourd'hui et ce Mois)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Début de la journée

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Revenus du jour (On additionne les total_amount des factures générées aujourd'hui)
        const dailyInvoices = await Invoice.find({ generated_at: { $gte: today } });
        const dailyRevenue = dailyInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

        // Revenus du mois
        const monthlyInvoices = await Invoice.find({ generated_at: { $gte: firstDayOfMonth } });
        const monthlyRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);

        // Renvoyer les données au Frontend
        res.json({
            rooms: {
                available: availableRooms,
                occupied: occupiedRooms,
                total: availableRooms + occupiedRooms
            },
            revenue: {
                daily: dailyRevenue,
                monthly: monthlyRevenue
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };