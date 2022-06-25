const Message = require("../DBmodels/chatDb_model");

const saveMessage = async (data, socket) => {
  const message = data;
  try {
    if (!message) {
      error = {
        success: false,
        message: "message is required",
      };
      return error;
    }
    // console.log("message from saveMessage", message);
    const NewMessage = await Message.create({ ...message });
    // console.log("NewMessage", NewMessage);
    return NewMessage;
  } catch (error) {
    console.log("error from saveMessage", error);
  }
};

const saveImageMessage = async (data, socket) => {
  const message = data;
  try {
    const NewMessage = await Message.create({ ...message });
    // console.log("NewMessage", NewMessage);
    socket.emit("onGetImage", NewMessage);
    return NewMessage;
  } catch (err) {
    const error = {
      success: false,
      message: "there is an error in saveImageMessage",
    };
    socket.emit("onGetImage", error);
    // console.log("error from saveImageMessage", err);
  }
};

const updateImage = async (imageData, imageID, socket) => {
  try {
    if (!imageData) {
      error = {
        success: false,
        message: "there is no newImageData available",
      };
      socket.emit("newImageData", error);
      return;
    }
    // console.log("imageData==******", imageData);
    const newImageData = await Message.findOneAndUpdate(
      { _id: imageID },
      imageData,
      { new: true, runValidators: true, overwrite: true }
    );
    // console.log("newImageData ==**=", newImageData);
    socket.emit("newImageData", newImageData);
    return newImageData;
  } catch (err) {
    console.log("error from updateImage", err);
    error = {
      success: false,
      message: "there is an error in updateImage",
    };
    socket.emit("newImageData", error);
    return;
  }
};

const getAllMessages = async (req, res) => {
  const conversationID = req.params.conversationID;
  // console.log("conversationID: ", conversationID);

  const messages = await Message.find({ conversationID: conversationID });
  return res.status(200).json({
    success: true,
    message: "getAllMessages",
    messages: messages,
  });
};
module.exports = { saveMessage, saveImageMessage, getAllMessages, updateImage };
