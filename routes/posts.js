const router = require("express").Router();
const Post = require("../models/post");
const User = require('../models/user');

//create post
router.post("/", async (req, res) => {
    const newPost = await new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});


//update post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body
            });
            res.status(200).json("post has been updated successfully");
        } else {
            res.status(403).json("you can only update your post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//delete post
router.delete("/:id", async (req, res) => {
   try {
       const post = await Post.findById(req.params.id);
       if (post.userId === req.body.userId) {
           await post.deleteOne();
           res.status(200).json("post has been deleted successfully");
       } else {
           res.status(403).json('you can only delete your post');
       }
   } catch (error) {
       res.status(500).json(error);
   }
})


//like a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: { likes: req.body.userId }
            });
            res.status(200).json("post has been liked successfully");
        } else {
            await post.updateOne({
                $pull: { likes: req.body.userId }
            });
            res.status(200).json("post has been unliked successfully");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})


//get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
})


//get timeline posts
router.get("/timeline/all", async (req, res) => {
    let postArray = [];
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({
            userId: currentUser._id
        });
        const friendsPost = await Promise.all(
            currentUser.following.map((friendId) => {
                return Post.find({
                    userId: friendId
                });
            })
        );
        postArray = [...userPosts, ...friendsPost];
        res.status(200).json(postArray);
    } catch (error) {
        res.status(500).json(error);
    }
});



module.exports = router;