const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const moment = require('moment');

const time =  moment().format('MMMM Do YYYY : h:mm a');

//mongoose
const mongoose = require('mongoose');
const Chat = require ("./models/Chat");
Ev_Log = require('./models/Events.js');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const router = require('./router');

// Set up mongoose connection
var dev_db_url = 'mongodb://userNas:userNas@cluster0-shard-00-00-jzbyc.gcp.mongodb.net:27017,cluster0-shard-00-01-jzbyc.gcp.mongodb.net:27017,cluster0-shard-00-02-jzbyc.gcp.mongodb.net:27017/chat_App?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
var mongoDB = process.env.MONGODB_URI || dev_db_url;

//Connect to MongoDB
mongoose.connect( mongoDB,({ useNewUrlParser: true },{ useUnifiedTopology: true }))
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {

  var connectEvent=new Ev_Log({type:'CONNECTION', socket:socket.id, connect: time})
  connectEvent.save((err)=>{
          if (err) throw err;
               console.log('\n==========STORE EVENT IN DATABASE==========\nSocket: '+connectEvent.socket+'\nWith type: '+connectEvent.type+"\nHas been connected @: "+ time +'\n and Saved the event to MongoDB at: '+ time)
      })


  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

     //store event
     var newUserEvent=new Ev_Log({type:'NEW USER', name:user.name, socket:socket.id, room: user.room, connect: time})
     newUserEvent.save((err)=>{
         if (err) throw err;
         console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+newUserEvent.type+'\nCreated by: ' + newUserEvent.name + '\nFor Socket: '+newUserEvent.socket+'\nIn the: '+newUserEvent.room+'\nSaved to database at: '+ time)
     })

    socket.emit('message', { user: 'admin', text: `Hi ${user.name}, Welcome to the room - ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined the room @ ${time}` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  //chat history
  socket.on("get-orders", () => {
    console.log("server - Chat History called");
    
  Chat.find((error, documents) => {
    if (error) console.log (`Error occured on Order.find (): ${error}`);
    else {
      console.log(`Chat.find() returned documents: ${documents}`);
      let data = JSON.stringify(documents, ['user', 'msg', 'room', 'created']);
      socket.emit("orders-data", data);
    }

  });
  });
   //Event Logs
   socket.on("get-logs", () => {
    console.log("server - Event Log called");
    
  Ev_Log.find((error, documents) => {
    if (error) console.log (`Error occured on Order.find (): ${error}`);
    else {
      console.log(`Ev_Log.find() returned documents: ${documents}`);
      let log = JSON.stringify(documents, ['type', 'name', 'socket', 'room', 'connect', 'disconnect']);
      socket.emit("events-data", log);
    }
  });
  });
 socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

//store new message event
var newMessageEvent=new Ev_Log({type:'MESSAGE SENT', name:user.name, socket:socket.id, room:user.room, connect: time})
newMessageEvent.save((err)=>{
    if (err) throw err;
    console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+newMessageEvent.type+'\nCreated by: ' + newMessageEvent.name + '\nFor Socket: '+newMessageEvent.socket+'\nIn the: '+newMessageEvent.room+'\nSaved to database at: '+ time)
})

 //chat event to MongDB
console.log("server - Add chat to MongoDB called");
const chat = new Chat({ user: user.name, msg: message, room: user.room, created: time})
chat.save().then(() => socket.emit("chat-data-added"));
    
    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left the room.${time}` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});

       //store disconnect event
       var disconnectEvent=new Ev_Log({type:'DISCONNECT', disconnect: time, name:user.name, socket:socket.id})
       disconnectEvent.save((err)=>{
           if (err) throw err;
           console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+disconnectEvent.type+'\nCreated by: ' + disconnectEvent.name + '\nFor Socket: '+disconnectEvent.socket+'\nSaved to database at: '+ disconnectEvent.disconnect)
       })
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));