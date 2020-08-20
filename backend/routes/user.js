var router = require("express").Router();
const multer = require('../middlewares/multer-config')

const users = require("../controllers/user");

// Create a new user
router.post("/signup", multer, users.signup);

// Login to user account
router.post("/login", multer, users.login);

// Delete user account
router.delete("/:id", multer, users.deleteUser);

// Update user account
router.put("/:id", multer, users.updateUser);

module.exports = router;