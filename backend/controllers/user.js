const models = require("../models");
const User = models.user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const bouncer = require('../middlewares/expressBouncer')


// Create and Save a new user.
exports.signup = (req, res) => {
        bcrypt.hash(req.body.password, 15)
        .then(hash => {
            const newUser = {
                ...req.body,
                password: hash,
            };
            User.create(newUser)
                .then(function() {
                    res.status(201).json({ message: 'Account created!' });
                })
                .catch(function(err) {
                    res.status(403).json({ err });
                });
        })
        .catch(err => {
            res.status(500).json({ message: 'Erreur lors du processus de création de compte'})
        });
};

// Login to an account.
exports.login = function(req, res) {
    if(!req.body.emailAddress || !req.body.password) {
        res.status(404).json({ message: 'Username and password are needed!' });
    } else {
        const emailAddress = req.body.emailAddress;
        const password = req.body.password;
        const potentialUser = { where: { emailaddress: emailAddress } };

        User.findOne(potentialUser)
            .then(user => {
                if(!user) {
                    res.status(404).json({ message: 'Echec de l\'authentification!' });
                } else {
                    bcrypt.compare(password, user.password)
                        .then(valid => {
                            if(!valid) {
                                return res.status(401).json({ message: 'Mot de passe incorrect'});
                            }
                            bouncer.reset(req);
                            res.status(200).json({
                                token: jwt.sign(
                                    {userId: user.id},
                                    process.env.JWT_KEY,
                                    { expiresIn: '60m'}
                                ),
                                user: user
                            })
                        })
                        .catch(err => {
                            res.status(500).json({ error: err })
                        });    
                }
    
            })
            .catch(err => {
                res.status(500).json({ error: err})
            });
    }
}

// Find all posts of a specific user.
exports.findUser = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
    .then((user) => {
        res.send(user)
    })
    .catch((err) => {
    console.log("Error while find company : ", err)
    })
};

// Delete user account.
exports.deleteUser = (req, res) => {
    const id = req.params.id;

    // On cherche d'abord l'utilisateur pour récupérer le nom du fichier image à supprimer
    User.findOne({where: {id: id}})
    .then(user => {
        const registeredImage = user.profileImage.split('/images/')[1];
        if(registeredImage != 'default_profile_picture.jpg'){
            fs.unlink(`images/${registeredImage}`, () => {
                user.destroy()
                .then(num => {
                    if (num == 1) {
                        res.status(200).json({ message: "User was deleted successfully!"});
                    } else {
                        res.send({ message: `Cannot delete user with id=${id}. Maybe the user was not found!`});
                    }
                })
                .catch(err => {
                res.status(500).send({ message: "Could not delete user with id=" + id});
                });
            })
        }else{
            user.destroy()
                .then(user => {
                    if (user) {
                        res.status(200).json({ message: `L\'utilisateur: ${user.emailAddress} a bien été supprimé de la base de données.`});
                    } else {
                        res.send({ message: num});
                    }
                })
                .catch(err => {
                res.status(500).send({ message: "Could not delete user with id=" + id});
                });
        }
    })
    .catch(err => {
        res.status(500).send({ message: "Error retrieving user with id=" + id });
    });
};

// Modify user account.
exports.updateUser = (req, res) => {
    const userId = req.params.id;

    // Création d'un nouvel objet. Si pas d'image, alors on envoie req.body, si une image, on la nomme accordingly.
    const userObject = req.file ?
        {   
            ...req.body,
            profileImage: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

    User.findOne({where: {id: userId}})
        .then((user) => {

            const registeredImage = user.profileImage.split('/images/')[1];
            if(user.id == userId){

                if(userObject.profileImage && userObject.profileImage != user.profileImage && registeredImage != 'default_profile_picture.jpg'){
                    
                    fs.unlink(`images/${registeredImage}`, () => {

                        user.update(userObject)
                        .then(updatedRows => {
                            if (updatedRows == 1) {
                                res.status(200).json({ message: "User account was updated successfully." });
                            }else{
                                res.status(400).json({ message: `Cannot update User account with id=${userId}. Maybe User account was not found or req.body is empty!` });
                            }
                        })
                        .catch(function () {
                            res.status(500).send({ message: "Error updating User account with id=" + userId });
                        });
                    })
                }
                User.update(userObject, {where: {id: userId}})
                    .then(updatedRows => {
                        if (updatedRows == 1) {
                            res.status(200).json({ message: "User account was updated successfully." });
                        }else{
                            res.status(400).json({ message: `Cannot update User account with id=${userId}. Maybe User account was not found or req.body is empty!` });
                        }
                    })
                    .catch(function () {
                        res.status(500).send({ message: "Error updating User account with id=" + userId });
                    });
            }
        })
};