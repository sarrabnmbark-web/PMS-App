const Reservation = require('../models/Reservations');
const Room = require('../models/Rooms');
const Client = require('../models/Clients')


// Fonction disponibilité
async function isRoomAvailable(room_id, check_in, check_out) {
    const reservations = await Reservation.find({
        room_id: room_id,
        status: 'Confirmée',
        $or: [
            {
                check_in_date: { $lt: check_out },
                check_out_date: { $gt: check_in }
            }
        ]
    });

    return reservations.length === 0;
}


// Calcul prix
function calculateTotalPrice(check_in, check_out, price_per_night) {
    const diffTime = new Date(check_out) - new Date(check_in);
    const nights = diffTime / (1000 * 60 * 60 * 24);
    return nights * price_per_night;
}


// CREATE réservation (AVEC MODE DEBUG)
exports.createReservation = async (req, res) => {
    try {
        const { client_id, room_id, check_in_date, check_out_date, notes } = req.body;

        // 1. Vérifier disponibilité
        const available = await isRoomAvailable(room_id, check_in_date, check_out_date);
        if (!available) {
            return res.status(400).json({ message: "Chambre non disponible dans cette période" });
        }

        // 2. Récupérer chambre
        const room = await Room.findById(room_id).populate('room_type_id');
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // ========================================================
        // 🚨 LES RADARS DE DEBUG (Regardez votre terminal !)
        // ========================================================
        console.log("--- TEST DE CREATION DE RESERVATION ---");
        console.log("Dates reçues :", check_in_date, "à", check_out_date);
        console.log("Objet Type de Chambre :", room.room_type_id);
        
        // Sécurité 1 : Est-ce que le populate a fonctionné ?
        if (!room.room_type_id || typeof room.room_type_id !== 'object') {
            return res.status(400).json({ 
                erreur: "POPULATE A ECHOUÉ", 
                message: "Le lien entre la chambre et le type de chambre est cassé dans la BDD."
            });
        }

        const price = room.room_type_id.base_price;
        console.log("Prix de base trouvé :", price);

        // Sécurité 2 : Est-ce que le prix existe bien ?
        if (price === undefined || price === null) {
            return res.status(400).json({ 
                erreur: "PRIX MANQUANT", 
                message: "Le champ 'base_price' n'existe pas dans la table RoomType pour cette chambre."
            });
        }
        // ========================================================

        // 3. Calcul prix
        const total_price = calculateTotalPrice(check_in_date, check_out_date, price);
        console.log("Prix total calculé :", total_price);

        // Sécurité 3 : Est-ce que le calcul a échoué (NaN) ?
        if (isNaN(total_price)) {
            return res.status(400).json({ 
                erreur: "CALCUL IMPOSSIBLE", 
                message: "Les dates envoyées sont invalides."
            });
        }

        // 4. Création réservation
        const reservation = new Reservation({
            client_id,
            room_id,
            created_by: req.user?._id,
            check_in_date,
            check_out_date,
            total_price,
            notes
        });

        await reservation.save();
        res.status(201).json(reservation);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET ALL
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('client_id')
            .populate('room_id');

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET ONE
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('client_id')
            .populate('room_id');

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// UPDATE
exports.updateReservation = async (req, res) => {
    try {
        const { check_in_date, check_out_date, notes, status } = req.body;

        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Vérifier disponibilité si dates changent
        if (check_in_date && check_out_date) {
            const available = await isRoomAvailable(
                reservation.room_id,
                check_in_date,
                check_out_date
            );

            if (!available) {
                return res.status(400).json({
                    message: "Chambre non disponible"
                });
            }

            reservation.check_in_date = check_in_date;
            reservation.check_out_date = check_out_date;

            // recalcul prix
            const room = await Room.findById(reservation.room_id).populate('room_type_id');
            reservation.total_price = calculateTotalPrice(
                check_in_date,
                check_out_date,
                room.room_type_id.base_price
            );
        }

        if (notes) reservation.notes = notes;
        if (status) reservation.status = status;

        await reservation.save();

        res.json(reservation);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

    //changement de status
        reservation.status = 'Annulée';

        await reservation.save();

        res.json({ message: "Reservation annulée" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};