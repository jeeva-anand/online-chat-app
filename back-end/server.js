const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require('mongoose');
const mongoMessages = require('./messageModel');




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
        console.log("send",data)
        socket.broadcast.emit("receive_message", data);
    }); 

});

// middlewares

app.use(cors());
app.use(express.json())


    
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

// app.post('/save/message', (req, res) =>
// {
//     const dbMessage = req.body
//     console.log(dbMessage)

//     mongoMessages.create(dbMessage, (err) =>
//     {
//         if (err)
//         {
//             res.status(500).send(err)
//         } else
//         {
//             res.status(201).send(err)
//         }
//     })

// })


const itemSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: String
});

const Item = mongoose.model('Item', itemSchema);

app.post('/save/message', async (req, res) =>
{
    console.log('logging.....')
    try
    {
        const newItem = new Item(req.body);
        console.log(req.body)
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error)
    {
        res.status(400).json({ message: error.message });
    }
});

app.get('/items', async (req, res) =>
{
    try
    {
        const items = await Item.find();
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

