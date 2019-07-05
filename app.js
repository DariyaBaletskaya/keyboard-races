const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken');
const passport = require('passport');

const appRouter = require('./routes/routes');
require('./middlewares/passport.config');
const textes = require('./race-textes.json');

server.listen(3000);


app.use('/', appRouter);
app.use('/login', appRouter);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

io.on('connection', socket => {
    const rand = Math.floor(Math.random() * 6 + 1);
    const randomText = textes.find(text => text.id === rand);

    socket.emit('race-start', {randomText});
 
});

module.exports = app;
