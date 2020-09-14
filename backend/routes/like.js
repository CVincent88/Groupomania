const router = require("express").Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config')

const likes = require("../controllers/like");

// Find one like
router.get("/", multer, likes.findOne);

// Add reaction on post
router.post("/", multer, likes.reactOnPost);

// Delete one reaction
// I deleted the :id in the route because for some reason, req.params.id does not work, only req.param('id)
router.delete("/", likes.deleteReaction);


module.exports = router;