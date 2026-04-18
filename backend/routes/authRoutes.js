const express = require("express");
const router = express.Router();
const User = require("../models/User");

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role, name } = req.body;

  try {
    let user = await User.findOne({ email, password, role });

    // 🔥 Auto register if not found
    if (!user) {
      user = new User({ name, email, password, role });
      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

