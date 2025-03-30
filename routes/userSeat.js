const express = require("express");
const router = express.Router();
const { userSeats } = require("../models");


router.post("/", async (req, res) => {
  try {
    const { userID, seatsNumber } = req.body;

    const existingBooking = await userSeats.findOne({ where: { userID } });
    if (existingBooking) {
      return res.status(400).json({ message: "User has already booked seats." });
    }

    const newBooking = await userSeats.create({ userID, seatsNumber });
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: "Error booking seats", error: error.message });
  }
});

// - Read (Get all booked seats)
router.get("/", async (req, res) => {
  try {
    const bookings = await userSeats.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
});

// - Read (Get booking by userID)
router.get("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const booking = await userSeats.findOne({ where: { userID } });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error: error.message });
  }
});

// - Update (Modify booked seats)
router.put("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const { seatsNumber } = req.body;

    const booking = await userSeats.findOne({ where: { userID } });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.update({ seatsNumber });
    res.status(200).json({ message: "Booking updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error: error.message });
  }
});

// - Delete (Cancel booking)
router.delete("/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    const booking = await userSeats.findOne({ where: { userID } });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.destroy();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error: error.message });
  }
});

module.exports = router;
