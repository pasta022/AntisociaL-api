const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String,
    },
    likes: { 
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: [],
        items: {
            username: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
