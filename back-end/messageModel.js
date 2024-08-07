const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    username: String,
    message: String,    
    timestamp: String
});


// export default mangoose.model('messages', messageSchema)
module.exports = mongoose.model('messages', messageSchema);
