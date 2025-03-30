const express = require("express");

const { isAuthenticated, isAdmin } = require('../../middleware/authMiddleware');
const seat = require("../../models/seat");

const router = express.Router();



router.post("/",isAuthenticated,isAdmin, async (req, res) => {
    try {
      const { trainId, seatNumber, createdBy } = req.body;
  
      const seat = await Seat.create({
        trainId,
        seatNumber,
        createdBy,
      });
  
      res.status(201).json({ message: "Seat created successfully", seat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
router.get("/",isAuthenticated,isAdmin, async (req, res) => {
    try {
      const seats = await Seat.findAll({
        include: [
          { model: Train, as: "train" },
          { model: User, as: "selectedUser" },
          { model: User, as: "bookedUser" },
          { model: User, as: "creator" },
        ],
      });
  
      res.status(200).json(seats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
router.get("/:id",isAuthenticated,isAdmin, async (req, res) => {
    try {
      const seat = await Seat.findByPk(req.params.id, {
        include: [
          { model: Train, as: "train" },
          { model: User, as: "selectedUser" },
          { model: User, as: "bookedUser" },
          { model: User, as: "creator" },
        ],
      });
  
      if (!seat) {
        return res.status(404).json({ message: "Seat not found" });
      }
  
      res.status(200).json(seat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
router.put("/:id",isAuthenticated,isAdmin, async (req, res) => {
    try {
      const seat = await Seat.findByPk(req.params.id);
  
      if (!seat) {
        return res.status(404).json({ message: "Seat not found" });
      }
  
      await seat.update(req.body);
      res.status(200).json({ message: "Seat updated successfully", seat });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
router.delete("/:id",isAuthenticated,isAdmin, async (req, res) => {
    try {
      const seat = await Seat.findByPk(req.params.id);
  
      if (!seat) {
        return res.status(404).json({ message: "Seat not found" });
      }
  
      await seat.destroy();
      res.status(200).json({ message: "Seat deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

module.exports = router;
