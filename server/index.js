const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const moment = require('moment');

const time =  moment().format('MMMM Do YYYY : h:mm a');
console.log(time);

//mongoose
const mongoose = require('mongoose');
const Chat = require ("./models/Chat");
Elog = require('./models/Events.js');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

//mongoDB url and connection.
const connectionString = "mongodb://userNas:userNas@cluster0-shard-00-00-jzbyc.gcp.mongodb.net:27017,cluster0-shard-00-01-jzbyc.gcp.mongodb.net:27017,cluster0-shard-00-02-jzbyc.gcp.mongodb.net:27017/chat_App?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

//Connect to MongoDB
mongoose.connect( connectionString,({ useNewUrlParser: true },{ useUnifiedTopology: true }))
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {

  var connectEvent=new Elog({type:'CONNECTION', socket:socket.id, connect: time})
  connectEvent.save((err)=>{
          if (err) throw err;
               console.log('\n==========STORE EVENT IN DATABASE==========\nSocket: '+connectEvent.socket+'\nWith type: '+connectEvent.type+"\nHas been connected @: "+ time +'\n and Saved the event to MongoDB at: '+ time)
      })
  //creates a txt file of the event
      // fs.appendFile('./eventLog.txt', connectEvent.type+" has been started @ "+ connectEvent.connect +' for socket '+connectEvent.socket+'in the '+connectEvent.room+"\n", {'flags': 'a'},(err)=>{
      //     if (err) throw err;
      // })  


  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

     //store event
     var newUserEvent=new Elog({type:'NEW USER', name:user.name, socket:socket.id, room: user.room, connect: time})
     newUserEvent.save((err)=>{
         if (err) throw err;
         console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+newUserEvent.type+'\nCreated by: ' + newUserEvent.name + '\nFor Socket: '+newUserEvent.socket+'\nIn the: '+newUserEvent.room+'\nSaved to database at: '+ time)
     })
 //creates a txt file of the event
    //  fs.appendFile('./eventLog.txt', newUserEvent.socket+" has been created @ "+ newUserEvent.connect +" and created by "+ newUserEvent.name +' in the '+newUserEvent.room+"\n", {'flags': 'a'},(err)=>{
    //      if (err) throw err;
    //  })




    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

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
    
  Elog.find((error, documents) => {
    if (error) console.log (`Error occured on Order.find (): ${error}`);
    else {
      console.log(`Elog.find() returned documents: ${documents}`);
      let log = JSON.stringify(documents, ['type', 'name', 'socket', 'room', 'connect', 'disconnect']);
      socket.emit("events-data", log);
    }

  });
  });




  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

//store new message event
var newMessageEvent=new Elog({type:'MESSAGE SENT', name:user.name, socket:socket.id, room:user.room, connect: time})
newMessageEvent.save((err)=>{
    if (err) throw err;
    console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+newMessageEvent.type+'\nCreated by: ' + newMessageEvent.name + '\nFor Socket: '+newMessageEvent.socket+'\nIn the: '+newMessageEvent.room+'\nSaved to database at: '+ time)
})
//creates a txt file of the event
// fs.appendFile('./eventLog.txt', newMessageEvent.socket+" has sent a new message @ "+ newMessageEvent.connect +" and created by "+ newMessageEvent.name +' in the '+newMessageEvent.room+"\n", {'flags': 'a'},(err)=>{
//     if (err) throw err;
// })


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
       var disconnectEvent=new Elog({type:'DISCONNECT', disconnect: time, name:user.name, socket:socket.id})
       disconnectEvent.save((err)=>{
           if (err) throw err;
           console.log('\n==========STORE EVENT IN DATABASE==========\nEvent Type: '+disconnectEvent.type+'\nCreated by: ' + disconnectEvent.name + '\nFor Socket: '+disconnectEvent.socket+'\nSaved to database at: '+ disconnectEvent.disconnect)
       })
   //update the eventlog for specific socket in database
      //  fs.appendFile('./eventLog.txt', disconnectEvent.socket+" has been disconnected @ "+ disconnectEvent.disconnect +" and created by "+ disconnectEvent.name +"\n", {'flags': 'a'},(err)=>{
      //      if (err) throw err;
      //  })

    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));