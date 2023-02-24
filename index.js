const express = require("express");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

const app = express();

dotenv.config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, () => {
    console.log('mongo db running');
});

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => {
    console.log('hello papa');
})