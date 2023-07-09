const chatMessageSchema = new mongoose.Schema({
    user: String,
    message: String,
  });
  
  // Create a model for the chat messages
  const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
  module.exports =ChatMessage;