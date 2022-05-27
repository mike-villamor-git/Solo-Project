const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');


const dbURI = 'mongodb+srv://mvillamor2:test123@cluster0.gnhpt.mongodb.net/leaderboard-database?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then((result) => console.log('connected to db'))
  .catch((err) => console.log('error connecting to db: ', err));



const controller = require('./server/controllers/controller.js');
const userController = require('./server/controllers/userController.js')


app.use(express.json());
app.use(express.urlencoded({ extended: true}));
// app.use(express.static);


  app.get('/', (req, res) => {
      res.status(200).sendFile(path.join(__dirname, '/index.html'));
  });``

  app.get('/index.js', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/index.js'));
  });

  app.get('/styles.css', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/styles.css'));
  });

  app.post('/index.html', 
    controller.getScores,
    userController.createUser,
    // userController.getAllUsers, 
    
    (req, res) => {
    return res.status(200).json({scoreList: res.locals.scoreList});
  });

  app.get('/leaderboard.html', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '/leaderboard.html'));
  });

  app.get('/index.html', (req,res) => {
    res.status(200).sendFile(path.join(__dirname, '/index.html'));
  })

  app.get('/leaderboard.js', (req,res) => {
    res.status(200).sendFile(path.join(__dirname, '/leaderboard.js'));
  })

  app.get('/leaderboard.html/scores', userController.getAllUsers, (req, res) => {
    res.status(200).send({users: res.locals.users});
  })




// app.use((req,res) => {
//     console.log('catch-all for errors');
//     return res.status(404).sendFile(path.resolve(__dirname, './client/404.html' ));
//   });

//Global Error Handler
app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 400,
      message: { err: 'An error occurred globally' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    console.log(__dirname);
    return res.status(errorObj.status).json(errorObj.message);
  });

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}!!!!`)
});

