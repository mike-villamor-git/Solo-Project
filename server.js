const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

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

  app.post('/index.html', controller.getScores, (req, res) => {
    return res.status(200).json({scoreList: res.locals.scoreList});
  });


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

