const router = require("express").Router();
const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth');

const posts = require("../controllers/post");

// Create a new post
router.post("/", auth, multer, posts.createPost);

// Get all posts
router.get("/", auth, posts.findAllPosts);

// Get one post
router.get("/:id", auth, posts.findOne);

// Modify one post
router.put("/:id", auth, multer, posts.updatePost);

// Delete one post
router.delete("/:id", auth, posts.deletePost);

// Find all posts by author
router.get("/author/:authorId", auth, posts.findAllByAuthor);

module.exports = router;