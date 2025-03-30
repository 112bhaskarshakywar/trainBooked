

/* GET users listing. */
const express = require("express");
const {User} = require('../models')
const bcrypt = require('bcrypt');
const { isAuthenticated } = require("../middleware/authMiddleware");
const jwt =require("jsonwebtoken")

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(200).send({success:true, message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, hash: hashedPassword,role:"BUYER" ,salt:10});

    console.log(process.env.JWT_SECRET,'JWT_SECRET');
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.status(201).send({ success:true,message: "User registered successfully", user,token });
  } catch (error) {
    res.status(500).send({success:false, message: error.message });
  }
});

//  LOGIN & GENERATE TOKEN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).send({success:false, message: "Invalid email or password" });
    }

    console.log(password,email,'pass')
    // Check password
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(200).send({ success:true,message: "Invalid email or password" });
    }

    console.log(process.env.JWT_SECRET,'JWT_SECRET');
    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    res.status(200).send({ success:true,message: "Login successful", token,user });
  } catch (error) {
    res.status(500).send({ success:false,message: error.message });
  }
});

// GET USER DETAILS (Protected Route)
router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a User
router.put("/:id",isAuthenticated, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ name, email, password });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Delete a User
router.delete("/:id",isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



