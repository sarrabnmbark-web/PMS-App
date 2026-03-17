const express = require('express');
const router = express.Router();
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect } = require('../middlewares/authMiddleware'); // Import du middleware

// Routes protégées par le token JWT
router.route('/')
    .get(protect, getRooms)      // GET /api/rooms
    .post(protect, createRoom);  // POST /api/rooms

router.route('/:id')
    .put(protect, updateRoom)    // PUT /api/rooms/:id
    .delete(protect, deleteRoom); // DELETE /api/rooms/:id

module.exports = router;