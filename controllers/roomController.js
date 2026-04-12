const Room = require('../models/Rooms');
const RoomType = require('../models/Room_Type');


//CRUD Room:
// @desc    Obtenir toutes les chambres
const getRooms = async (req, res) => {
    console.log("👉 1. Postman a bien contacté la route GET /api/rooms");

    try {
        // .populate() permet de récupérer les infos du type de chambre lié
        const rooms = await Room.find().populate('room_type_id');
        console.log("👉 2. MongoDB a trouvé les chambres :", rooms);

        res.json(rooms);
    } catch (error) {
        console.error("❌ Erreur MongoDB :", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Créer une nouvelle chambre
const createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Mettre à jour une chambre (ex: changer le statut)
const updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!room) return res.status(404).json({ message: 'Chambre introuvable' });
        res.json(room);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Supprimer une chambre
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) return res.status(404).json({ message: 'Chambre introuvable' });
        res.json({ message: 'Chambre supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };