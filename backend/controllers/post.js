const models = require('../models');
const Post = models.post;

// Create and Save a new post
exports.createPost = (req, res) => {
    // Validate request
    if (!req.body.content) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    // Create a Tutorial
    const newPost = {
        ...req.body
    };

    // Save post in the database
    Post.create(newPost)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({message: err.message || "Some error occurred while creating the post." });
        });
};

// Retrieve all posts from the database.
exports.findAllPosts = (req, res) => {
    Post.findAll()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving posts." });
    });
};

// Retrieve one post from the database.
exports.findOne = (req, res) => {
    const postId = req.params.id;

    Post.findByPk(postId)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving post with id=" + postId });
        });
};

// Modify a post from the database.
exports.updatePost = (req, res, next) => {
    const id = req.params.id;
    
    Post.update(req.body, {where: { id: id }})
        .then(updatedRows => {
            if (updatedRows == 1) {
            res.status(200).json({ message: "Your post was updated successfully." });
            } else {
            res.status(400).json({ message: `Cannot update the post with id=${id}. Maybe post was not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating the post with id=" + id });
        });
};

// Delete a post from database.
exports.deletePost = (req, res) => {
const id = req.params.id;

Post.destroy({ where: { id: id } })
    .then(num => {
        if (num == 1) {
            res.status(200).json({ message: "Post was deleted successfully!"});
        } else {
            res.send({ message: `Cannot delete post with id=${id}. Maybe the post was not found!`});
        }
    })
    .catch(err => {
    res.status(500).send({ message: "Could not delete post with id=" + id});
    });
};

// Finds all post by one author
exports.findAllByAuthor = (req, res) => {
    Post.findAll({ where: { authorId: req.params.authorId } })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving tutorials." });
        });
};