const scores = require('./scores.js');

const controller = {};

controller.getScores = (req, res, next) => {
    const name = req.body.name;
    const score = req.body.score;
    console.log('req.body in controller.getScores: ', req.body)
    console.log('name in controller.getScores: ', name);
    console.log('score in controller.getScores: ', score);
    
    scores.push({'name': name, 'score': score});
    console.log('scores before sending: ', scores);
    
    res.locals.scoreList = scores
    next();

}


module.exports = controller;