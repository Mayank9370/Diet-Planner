const express = require("express");
const router = express.Router();
const { createUserProfile } = require("../controllers/userController");

router.post("/onboard", createUserProfile);

module.exports = router;
