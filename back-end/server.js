const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require('mongoose');
const mongoMessages = require('./messageModel');





// middlewares

app.use(express.json())
app.use(cors());


// app config
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) =>
{
    console.log(`User Connected: ${ socket.id }`);

   
    socket.on("send_message", (data) =>
    {
        console.log("send", data)
        
        socket.broadcast.emit("receive_message", data);
    }); 

});




    
// db config

const mongoURI = 'mongodb+srv://admin:KYQfxxjlOIcSpQVy@anand.lmdo9sg.mongodb.net/?retryWrites=true&w=majority&appName=anand'
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>
{
    console.log('Connected to MongoDB');
});




// api routes

app.get('/',(req,res) => res.status(200).send('hello world'))


app.post('/save/message', async (req, res) =>
{
    try
    {
        console.log('Request body:', req.body); // Log the request body to verify
        const newItem = new mongoMessages(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
        console.log(savedItem)
    } catch (error)
    {
        res.status(400).json({ message: error.message });
    }
});

app.get('/retreieve/conversation', async (req, res) =>
{
    try
    {
        const items = await mongoMessages.find();
        res.json(items);
        console.log(items)
    } catch (error)
    {
        res.status(500).json({ message: error.message });
    }
});

server.listen(3001, () =>
{
    console.log("SERVER IS RUNNING");
});




// io.on('connection', (socket) =>
// {
//     console.log('a user connected');

//     socket.on('join', ({ userId }) =>
//     {
//         socket.join(userId);
//         socket.broadcast.emit('user-online', userId);
//     });

//     socket.on('send-message', async (messageData) =>
//     {
//         const message = new Message(messageData);
//         await message.save();
//         io.to(messageData.receiver).emit('receive-message', message);
//     });

//     
// });

