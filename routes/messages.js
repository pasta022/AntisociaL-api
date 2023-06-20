const router = require("express").Router();
const Post = require("../models/post");
const Message = require("../models/message");

//add message
router.post("/", async (req, res) => {
    const newMessage = await new Message(req.body);
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get message
router.get("/:conversationId", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;