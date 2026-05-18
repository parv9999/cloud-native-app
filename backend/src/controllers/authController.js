const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  userModel.findUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    userModel.createUser(name, email, hashedPassword, (err) => {
      if (err) return res.status(500).json({ error: err });

      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

module.exports = { registerUser };
