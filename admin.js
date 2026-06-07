const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const servicesFile = __dirname + '/../data/services.json';
const bookingsFile = __dirname + '/../data/bookings.json';

// Add new service
router.post('/service', async (req, res) => {
    let services = await fs.readJson(servicesFile).catch(() => []);
    services.push({ id: Date.now(), ...req.body });
    await fs.writeJson(servicesFile, services);
    res.json({ msg: "Service added", service: req.body });
});

// Get all services
router.get('/service', async (req, res) => {
    let services = await fs.readJson(servicesFile).catch(() => []);
    res.json(services);
});

// Delete a service
router.delete('/service/:id', async (req, res) => {
    const id = Number(req.params.id);
    let services = await fs.readJson(servicesFile).catch(() => []);
    const filtered = services.filter(s => s.id !== id);
    await fs.writeJson(servicesFile, filtered);
    res.json({ msg: 'Service deleted', id });
});

// Get all bookings
router.get('/bookings', async (req, res) => {
    let bookings = await fs.readJson(bookingsFile).catch(() => []);
    res.json(bookings);
});

// Update booking status (e.g., paymentStatus or custom status)
router.post('/bookings/:bookingId/status', async (req, res) => {
    const { bookingId } = req.params;
    const { paymentStatus } = req.body;
    let bookings = await fs.readJson(bookingsFile).catch(() => []);
    const idx = bookings.findIndex(b => b.bookingId === bookingId);
    if (idx === -1) return res.status(404).json({ msg: 'Booking not found' });
    bookings[idx].paymentStatus = paymentStatus;
    await fs.writeJson(bookingsFile, bookings);
    res.json({ msg: 'Booking updated', booking: bookings[idx] });
});

// Delete a booking
router.delete('/bookings/:bookingId', async (req, res) => {
    const { bookingId } = req.params;
    let bookings = await fs.readJson(bookingsFile).catch(() => []);
    const filtered = bookings.filter(b => b.bookingId !== bookingId);
    await fs.writeJson(bookingsFile, filtered);
    res.json({ msg: 'Booking deleted', bookingId });
});

module.exports = router;
