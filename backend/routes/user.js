var router = require("express").Router();
const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth');
const inputCheck = require('../middlewares/inputCheck');
const users = require("../controllers/user");
const bouncer = require("../middlewares/expressBouncer")

// Create a new user
router.post("/signup", inputCheck, users.signup);

// Login to user account
router.post("/login", inputCheck, bouncer.block, users.login);

// Get user info
router.get("/:id", auth, multer, users.findUser);

// Delete user account
router.delete("/:id", auth, users.deleteUser);

// Update user account
router.put("/:id", auth, multer, users.updateUser);

module.exports = router;