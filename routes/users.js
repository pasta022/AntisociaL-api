const User = require('../models/user');
const router = require('express').Router();
const bcrypt = require('bcrypt');

//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json("account updated");
        } catch (error) {
            return res.status(500).json(error);

        }
    } else {
        return res.status(403).json("You can not access another account");
    }
})


//delete user 
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("account deleted successfully");
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("you can not access another account");
    }
});

//get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username
   try {
       const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
       res.status(200).json(user);
   } catch (error) {
       res.status(500).json(error);
   } 
})

//follow a user
router.put('/:id/follow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
       try {
           const user = await User.findById(req.params.id);
           const currentUser = await User.findById(req.body.userId);
           if (!user.followers.includes(req.body.userId)) {
               await user.updateOne({
                   $push: { followers: req.body.userId }
               });
               await currentUser.updateOne({
                   $push: { following: req.params.id }
               });
               res.status(200).json("follow successful");
           } else {
                res.status(403).json("you already follow this user ")
           }
       } catch (error) {
           res.status(500).json(error);
       }
    } else {
        res.status(403).json("you can't follow yourself");
   }
});

//unfollow a user 
router.put('/:id/unfollow', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: { followers: req.body.userId }
                });
                await currentUser.updateOne({
                    $pull: { following: req.params.id }
                });
                res.status(200).json("unfollow successful")
            } else {
                res.status(403).json("you don't follow this user");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you can not unfollow yourself");
    }
})



module.exports = router;