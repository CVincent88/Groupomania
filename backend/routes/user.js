var router = require("express").Router();
const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth');

const users = require("../controllers/user");

// Create a new user
router.post("/signup", multer, users.signup);

// Login to user account
router.post("/login", multer, users.login);

// Get user info
router.get("/:id", multer, users.findUser);

// Delete user account
router.delete("/:id", auth, multer, users.deleteUser);

// Update user account
router.put("/:id", auth, multer, users.updateUser);

// Find all posts of a specific user
router.get("/:id/posts", auth, multer, users.findPostsByUser);

module.exports = router;