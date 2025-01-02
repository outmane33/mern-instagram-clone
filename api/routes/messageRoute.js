const express = require("express");
const { sendMessage, getMessage } = require("../controllers/messageController");
const { protect } = require("../middlewares/isAuthenticated");
const router = express.Router();

router.route("/send/:id").post(protect, sendMessage);
router.route("/all/:id").get(protect, getMessage);

module.exports = router;
