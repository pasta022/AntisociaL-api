const router = require("express").Router();
const Post = require("../models/post");
const Conversation = require("../models/conversation");

//new conversation
router.post("/", async (req, res) => {
    const newConversation = await new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(newConversation);
    } catch (error) {
        res.status(500).json(error);
    }
});

//get a user's conversation
router.get("/:userId", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error);
    }
})

//get conversation from two userIds
router.get("/find/:firstId/:secondId", async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] },
        });
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json(error);        
    }
})

module.exports = router;