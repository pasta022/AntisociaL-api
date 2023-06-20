const express = require("express");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages');

const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        const fileName = Date.now()+ file.originalname
        cb(null, fileName);
    }
});

const upload = multer({storage});

dotenv.config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, () => {
    console.log('mongo db running');
});

//middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});


app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);
app.use('/images', express.static(path.join(__dirname, "/public/images")));


app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        res.json({
            fileName: req.file.filename
        })
        return res.status(200).json("File Uploaded successfully");
    } catch (error) {
        return res.status(500).json(error);
    }
})

app.listen(8000, () => {
    console.log('hello papa');
});