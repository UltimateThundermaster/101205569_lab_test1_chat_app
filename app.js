require('dotenv').config()
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const http = require('http')
const socketio = require('socket.io')
const {connectDb} = require('./config/db')
const routes = require('./routes')
const {  userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers } = require('./services/user.services')
const utility = require('./utils/utility')
const { GroupMessage } = require('./model')
const app = express()
const server = http.createServer(app)
const io = socketio(server)


// Run when client connects
const botName = "Admin"
io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
  
      socket.join(user.room);
  
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          utility.formatMessage(botName, `${user.username} has joined the chat`)
        );
  
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });
  
    socket.on("chatMessage", async (msg) => {
      const user = getCurrentUser(socket.id);
      const messageObj = utility.formatMessage(user.username, msg)
      await GroupMessage.create({from_user: user.username, room: user.room, message: messageObj.text, date_sent: messageObj.time})
      io.to(user.room).emit("message", messageObj);
    });

    socket.on('typing', (data)=>{
      const user = getCurrentUser(socket.id);
      if(data.typing==true)
        socket.broadcast.to(user.room).emit('display', data)
      else{
        socket.broadcast.to(user.room).emit('display', data)
      }
    })
  
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);
  
      if (user) {
        io.to(user.room).emit(
          "message",
          utility.formatMessage(botName, `${user.username} has left the chat`)
        );
  
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });

connectDb()

// Set Templating Engine
app.use(expressLayouts)
app.set('view engine', 'ejs')

app.use(express.json())
app.use(morgan('dev'))

// static files
app.use(express.static(__dirname + '/public'));

app.use('/chat', routes)

app.use((req, res, next) => {
    res.status(500).render('pagenotfound', {title: "page not found"})
    next()
});

const port = process.env.PORT || 8000
server.listen(port, () => console.log(`Server is up at port ${port}`))