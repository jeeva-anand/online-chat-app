const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://anand:Jeeva123*@anand.lmdo9sg.mongodb.net/?retryWrites=true&w=majority&appName=anand', { useNewUrlParser: true, useUnifiedTopology: true });

const messageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: 'sent' }
});

const Message = mongoose.model('Message', messageSchema);

io.on('connection', (socket) =>
{
    console.log('a user connected');

    socket.on('join', ({ userId }) =>
    {
        socket.join(userId);
        socket.broadcast.emit('user-online', userId);
    });

    socket.on('send-message', async (messageData) =>
    {
        const message = new Message(messageData);
        await message.save();
        io.to(messageData.receiver).emit('receive-message', message);
    });

    socket.on('disconnect', () =>
    {
        console.log('user disconnected');
    });
});

app.get('/messages/:sender/:receiver', async (req, res) =>
{
    const { sender, receiver } = req.params;
    const messages = await Message.find({
        $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender }
        ]
    }).sort('timestamp');
    res.json(messages);
});

server.listen(5000, () =>
{
    console.log('listening on *:5000');
});
