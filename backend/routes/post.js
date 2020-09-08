const router = require("express").Router();
const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth');

const posts = require("../controllers/post");

// Get all posts
router.get("/", auth, posts.findAllPosts);

// Get one post
router.get("/:id", auth, posts.findOne);

// Get all posts of a specific user
router.get("/:id/author", auth, posts.findUserByPost);

// Create a new post
router.post("/", auth, multer, posts.createPost);

// Like or dislike a post
// router.post("/:id/like", auth, multer, posts.opinionOnPost);

// Modify one post
router.put("/:id", auth, multer, posts.updatePost);

// Delete one post
router.delete("/:id", auth, posts.deletePost);



module.exports = router;