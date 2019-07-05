const express = require('express');
const debug = require('debug')('router');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const users = require('../user-credentials.json');


router.get('/', function(req, res) {
    debug(req.method + ' ' + req.url);
    res.redirect('/login');
  });

router.get('/login', function(req, res) {
    debug(req.method + ' ' + req.url);
    res.sendFile(path.join(__dirname , '/view/login.html'));
  });

router.post('/login', function(req, res){
    const userFromReq = req.body;
    const userInDB = users.find(user => user.username === userFromReq.username);
    if (userInDB && userInDB.password === userFromReq.password) {
      const token = jwt.sign(userFromReq, 'someSecret', { expiresIn: '24h' });
      res.status(200).json({ auth: true, token });
    } else {
      res.sendFile(path.join(__dirname , '/view/error.html'));
  }
});

router.get('/race', /*passport.authenticate('jwt')*/ function (req, res) {
   debug(req.method + ' ' + req.url);
   res.sendFile(path.join(__dirname, '/view/race.html'));
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

  module.exports = router;

