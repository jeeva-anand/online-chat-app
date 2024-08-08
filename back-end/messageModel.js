const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    username: String,
    message: String,    
    timestamp: String,
    delivered: Boolean,
    edited: Boolean,
    online: Boolean
});

const typeModel = mongoose.model('messages', messageSchema)
module.exports = typeModel



