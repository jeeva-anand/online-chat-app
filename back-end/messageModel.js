const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    username: String,
    message: String,    
    timestamp: String
});

const typeModel = mongoose.model('messages', messageSchema)
module.exports = typeModel



