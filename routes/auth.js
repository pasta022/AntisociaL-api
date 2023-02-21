const router = require('express').Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');


//register user
router.post('/register', async (req, res) => {
    
    try {
        //generate password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //craeate user
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        //save user and return resposne 
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});



//login user 
router.post("/login", async (req, res) => {
    try {

        //find user
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).send("User not Found.\n Sign Up!!! ");

        //check password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).send('wrong password');

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json(error);
    }
})




module.exports = router;