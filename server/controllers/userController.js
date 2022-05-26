const User = require('../models/userModel');

const userController = {};

userController.getAllUsers = (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) return next('Error in userController.getAllUsers: ' + JSON.stringify(err));

        res.locals.users = users;
        return next();
    });
};

userController.createUser = (req, res, next) => {
    const {username, score} = req.body;

    User.create({username, score}, (err, user) => {
        if (err){
            console.log('error in userController.createUser: ' + JSON.stringify(err));
        } else {
            res.locals.user = user;
        }
        return next();
    });
}

module.exports = userController;