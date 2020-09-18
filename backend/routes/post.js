const router = require("express").Router();
const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth');

const posts = require("../controllers/post");

// Get all posts
router.get("/", auth, posts.findAllPosts);

// Get one post
router.get("/:id", posts.findOne);

// Get all posts of a specific user
router.get("/byAuthor/:authorId", auth, posts.findPostsByUser);

// Create a new post
router.post("/", auth, multer, posts.createPost);

// Modify one post
router.put("/:id", auth, multer, posts.updatePost);

// Delete one post
router.delete("/:id", posts.deletePost);



module.exports = router;