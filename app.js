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
const textes = require('./race-textes.json');
require('./middlewares/passport.config');


app.use('/', appRouter);
app.use('/login', appRouter);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

server.listen(3000);

let roomNumber = 1;

io.sockets.on('connection', socket => {

    //Increase room number when 2 clients are present in a room.
    if(io.nsps['/'].adapter.rooms["room-"+roomNumber] && io.nsps['/'].adapter.rooms["room-"+roomNumber].length > 2) {
      roomNumber++;
    } 
    
    socket.on('auth', payload => {
       socket.join("room-" + roomNumber);
        const  token  = payload.token;
        const username = jwt.decode(token).username;

        const rand = Math.floor(Math.random() * 6 + 1);
        const randomText = textes.find(text => text.id === rand);

        socket.emit('game-start', {user: username, randomText});
        io.in(`room-${roomNumber}`).emit('join-user', {user: username});

        socket.on('game-win', () => {
          console.log(`${username} won in the room ${roomNumber}`);
          io.in(`room-${roomNumber}`).emit('show-winner', {user: username});
        });

        socket.on('disconnect', () => {
          console.log(`${username} disconnected from room ${roomNumber}`);
          io.in(`room-${roomNumber}`).emit('disconnect-user', {user: username});
        });
      
      });

      //set up countdown before the game 
      let countdown = 10;
      let timerId = setInterval(() => {
        if(countdown) { 
            countdown--;
         } else {
          clearInterval(timerId);
        }
        socket.emit('countdown', { countdown: countdown });
      }, 1000);

      //set up game timer
      setInterval(()=>  {
        socket.emit('game-timer');
        }, 1000);

});


module.exports = app;
