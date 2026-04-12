const Stay = require('../models/Stays');
const Reservation = require('../models/Reservations');
const Room = require('../models/Rooms');
const Invoice = require('../models/Invoices');

// CHECK-IN (Arrivée du client)
const checkIn = async (req, res) => {
    try {
        const { reservation_id, nb_guests } = req.body;

        // Récupérer la réservation
        const reservation = await Reservation.findById(reservation_id);
        if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });

        // Créer le séjour (Stay)
        const stay = await Stay.create({
            reservation_id,
            checked_in_by: req.user._id, // L'employé connecté
            nb_guests: nb_guests || 1,
            stay_status: 'En cours',
            actual_check_in: new Date()
        });

        // Mettre à jour le statut de la chambre -> "Occupée"
        await Room.findByIdAndUpdate(reservation.room_id, { status: 'Occupée' });

        res.status(201).json({ message: "Check-in réussi, chambre occupée.", stay });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CHECK-OUT (Départ du client + Génération automatique Facture)
const checkOut = async (req, res) => {
    try {
        const { stay_id } = req.params;

        // Récupérer le séjour avec les infos de la réservation liée
        const stay = await Stay.findById(stay_id).populate('reservation_id');
        if (!stay) return res.status(404).json({ message: "Séjour introuvable" });
        if (stay.stay_status === 'Terminé') return res.status(400).json({ message: "Check-out déjà effectué" });

        // Mettre à jour le séjour -> "Terminé"
        stay.stay_status = 'Terminé';
        stay.actual_check_out = new Date();
        await stay.save();

        // Mettre à jour la chambre -> "Disponible" (ou Maintenance selon votre logique)
        await Room.findByIdAndUpdate(stay.reservation_id.room_id, { status: 'Disponible' });

        // Générer la facture automatiquement !
        const invoice = await Invoice.create({
            stay_id: stay._id,
            generated_by: req.user._id,
            invoice_number: `INV-${Date.now()}`, // Génère un numéro unique (ex: INV-16982345)
            total_amount: stay.reservation_id.total_price, // Récupère le prix calculé lors de la réservation
            payment_status: 'Non payée'
        });

        res.json({ message: "Check-out réussi, facture générée.", invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { checkIn, checkOut };