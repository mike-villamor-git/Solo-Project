const User = require('../models/userModel');

const userController = {};

userController.getAllUsers = (req, res, next) => {
    console.log('made it to getAllUsers!');
    User.find({}, (err, users) => {
        if (err) return next('Error in userController.getAllUsers: ' + JSON.stringify(err));
        // console.log('users in getAllUsers: ', users);
        res.locals.users = users;
        return next();
    });
};

userController.createUser = (req, res, next) => {
    
    console.log('req.body in createUser: ', req.body);
    const {name, score} = req.body;
    console.log('name in userController.createUser: ', name);
    console.log('score in userController.createUser: ', score);

    User.create({name, score}, (err, user) => {
        if (err){
            console.log('error in userController.createUser: ' + JSON.stringify(err));
        } else {
            
            console.log('res.locals.scoreList in createUser is: ', user);
        }
        return next();
    });
}

module.exports = userController;