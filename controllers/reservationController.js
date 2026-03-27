const Reservation = require('../models/Reservation');
const Room = require('../models/Room');


// 🔹 Fonction disponibilité
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


// 🔹 Calcul prix
function calculateTotalPrice(check_in, check_out, price_per_night) {
    const diffTime = new Date(check_out) - new Date(check_in);
    const nights = diffTime / (1000 * 60 * 60 * 24);
    return nights * price_per_night;
}


// ✅ CREATE réservation
exports.createReservation = async (req, res) => {
    try {
        const { client_id, room_id, check_in_date, check_out_date, notes } = req.body;

        // 1. Vérifier disponibilité
        const available = await isRoomAvailable(room_id, check_in_date, check_out_date);

        if (!available) {
            return res.status(400).json({
                message: "Chambre non disponible dans cette période"
            });
        }

        // 2. Récupérer chambre
        const room = await Room.findById(room_id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // 3. Calcul prix
        const total_price = calculateTotalPrice(
            check_in_date,
            check_out_date,
            room.price
        );

        // 4. Création réservation
        const reservation = new Reservation({
            client_id,
            room_id,
            created_by: req.user?._id, // optionnel
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


// ✅ GET ALL
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


// ✅ GET ONE
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


// ✅ UPDATE
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
            const room = await Room.findById(reservation.room_id);
            reservation.total_price = calculateTotalPrice(
                check_in_date,
                check_out_date,
                room.price
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


// ✅ DELETE (ou annulation)
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // بدل ما تمسحها -> نبدل status
        reservation.status = 'Annulée';

        await reservation.save();

        res.json({ message: "Reservation annulée" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};