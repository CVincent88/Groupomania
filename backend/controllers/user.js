const models = require("../models");
const User = models.user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');

// Create and Save a new user
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
                    res.status(403).json({ message: 'Erreur lors de la création de compte' });
                });
        })
        .catch(err => {
            res.status(500).json({ message: 'Erreur lors du processus de création de compte'})
        });
};

// Login to an account
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
                            res.status(200).json({
                                token: jwt.sign(
                                    {emailAddress: user.emailAddress},
                                    process.env.JWT_KEY,
                                    { expiresIn: '60m'}
                                )
                            })
                        })
                        .catch(err => {
                            res.status(500).json({ error: 'ici' })
                        });    
                }
    
            })
            .catch(err => {
                res.status(500).json({ error: 'là'})
            });
    }
}

// Delete user account.
exports.deleteUser = (req, res) => {
    const id = req.params.id;

    // On cherche d'abord l'utilisateur pour récupérer le nom du fichier image à supprimer
    User.findByPk(id)
    .then(user => {
        if(user.profileImage){
            const filename = user.profileImage.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                User.destroy({ where: { id: id } })
                .then(num => {
                    console.log(num)
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
    // .catch(err => {
    //     res.status(500).send({ message: "Error retrieving user with id=" + id });
    // });
};

// Modify a user account.
exports.updateUser = (req, res, next) => {
    const id = req.params.id;

    // Création d'un nouvel objet. Si pas d'image, alors on envoie req.body, si une image, on la nomme accordingly.
    const userObject = req.file ?
        {
            ...req.body,
            profileImage: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };

    User.update(userObject, {where: { id: id }})
        .then(updatedRows => {
            if (updatedRows == 1) {
                res.status(200).json({ message: "User account was updated successfully." });
            } else {
                res.status(400).json({ message: `Cannot update User account with id=${id}. Maybe User account was not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating User account with id=" + id });
        });
};