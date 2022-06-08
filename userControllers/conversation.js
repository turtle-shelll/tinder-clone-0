const Conversation = require("../DBmodels/conversation_model");

const saveConversation = async (req, res) => {
  const { conversationIDS } = req.body;

  const newConversation = {
    members: conversationIDS,
  };
  if (!conversationIDS) {
    return res.status(404).json({
      success: false,
      message: "invalid conversationIDS please try again.",
    });
  }
  try {
    ////find one if exist return that conversation ID
    const exist = await Conversation.findOne({
      members: { $all: conversationIDS },
    });
    console.log("exist", exist);
    if (exist) {
      return res.status(200).json({
        success: true,
        //   message: "conversationIDS has created successfully",
        message: "conversationIDS already exist",
        conversationid: exist?._id,
      });
    }

    /////or else create new conversation
    const conversation = await Conversation.create({ ...newConversation });
    console.log("conversation has created successfully", conversation);
    return res.status(200).json({
      success: true,
      message: "conversationIDS has created successfully",
      conversationid: conversation?._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating conversationIDS",
    });
    console.log("error from creating of conversation", error);
  }
};
// };

module.exports = { saveConversation };
