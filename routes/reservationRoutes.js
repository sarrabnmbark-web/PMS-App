const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// CREATE
router.post('/reservations', reservationController.createReservation);

// GET ALL
router.get('/reservations', reservationController.getAllReservations);

// GET ONE
router.get('/reservations/:id', reservationController.getReservationById);

// UPDATE
router.put('/reservations/:id', reservationController.updateReservation);

// DELETE (annulation)
router.delete('/reservations/:id', reservationController.deleteReservation);

module.exports = router;