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

let users = {};

io.on("connection", (socket) =>
{
    

    socket.on('join', ({ username }) =>
    {
        users[socket.id] = username;
        io.emit('user_online', { username, online: true });
        console.log("joined User", username)
    });

    socket.on("send_message", (data) =>
    {
        socket.broadcast.emit("receive_message", data);
    });

    socket.on('edit_message', async (data) =>
    {
        const message = await mongoMessages.findById(data.id);
        if (message.username === data.username)
        {
            const updatedItem = await mongoMessages.findByIdAndUpdate(data.id, {
                message: data.message,
                edited: true
            }, { new: true });
            io.emit('message_edited', updatedItem);
        }
    });

    socket.on('delete_message', async (data) =>
    {
        console.log(data)
        const message = await mongoMessages.findById(data.id);
        if (message.username === data.username)
        {
            await mongoMessages.findByIdAndDelete(data.id);
            console.log("delted id ",data.id)
            io.emit('message_deleted', { id: data.id });
        } 
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

app.get('/', (req, res) => res.status(200).send('hello world'))


app.post('/save/message', async (req, res) =>
{
    try
    {
        
        const newItem = new mongoMessages(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);

        
        
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

app.put('/edit/message/:id', async (req, res) =>
{
    try
    {
        const message = await mongoMessages.findById(req.params.id);
        if (message.username !== req.body.username)
        {
            return res.status(403).json({ message: "You can only edit your own messages" });
        }
        const updatedItem = await mongoMessages.findByIdAndUpdate(req.params.id, {
            message: req.body.message,
            edited: true
        }, { new: true });
        res.status(200).json(updatedItem);
    } catch (error)
    {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/delete/message/:id', async (req, res) =>
{
    try
    {
        const message = await mongoMessages.findById(req.params.id);
        if (message.username !== req.body.username)
        {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }
        await mongoMessages.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Message deleted" });
    } catch (error)
    {
        res.status(400).json({ message: error.message });
    }
});


server.listen(3001, () =>
{
    console.log("SERVER IS RUNNING");
});

