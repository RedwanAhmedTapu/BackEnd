const mongoose = require("mongoose");
const chatMessageSchema = new mongoose.Schema({
    image:String,
    user: String,
    message: String,
  });
  
  // Create a model for the chat messages
  const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
  module.exports =ChatMessage;