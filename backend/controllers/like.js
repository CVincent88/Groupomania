const models = require('../models');
const Like = models.like;

// Create and Save a new like.
exports.reactOnPost = (req, res, next) => {
    const newLike = {
        ...req.body
    };

    Like.findOne({where: { authorId: req.body.authorId, postId: req.body.postId }})
        .then((result) => {
            if(!result) {
                Like.create(newLike)
                    .then((data) => {
                        res.status(200).json({ data });
                    })
                    .catch(err => {
                        res.status(500).send({message: err });
                    });
            }else{
                res.status(409).json({message: `L'utilisateur a déjà liké le post.`})
            }
        })
};

exports.findOne = (req, res, next) => {
    Like.findOne({where: { authorId: req.body.authorId, postId: req.body.postId}})
    .then((result) => {
        res.status(200).json({result})
    })
    .catch(err => {
        res.status(404).json({err})
    })
};

// Delete a reactioin
exports.deleteReaction = (req, res) => {
    // For some reason, req.param('id') works, but req.params.id doesn't ...
    // const likeId = req.param('id');
    // const likeId = req.params.id;

    Like.destroy({where: {authorId: req.param('authorId'), postId: req.param('postId')}})
        .then((deletedRows) => {
            if(deletedRows == 1){
                res.status(200).json({message: 'Like supprimé'});
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving post with id=" + likeId });
        });
};

