var router = require("express").Router();
const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth');

const users = require("../controllers/user");

// Create a new user
router.post("/signup", users.signup);

// Login to user account
router.post("/login", users.login);

// Get user info
router.get("/:id", multer, users.findUser);

// Delete user account
router.delete("/:id", auth, users.deleteUser);

// Update user account
router.put("/:id", auth, users.updateUser);

// Find all posts of a specific user
router.get("/:id/posts", auth, users.findPostsByUser);

module.exports = router;