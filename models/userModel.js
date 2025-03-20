const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }, // Mức độ truy cập (user/admin)
    avatar: { type: String, required: false }, 
    phone: { type: String, required: false },
    team: {
        id: Number,
        name: String,
        shortName: String,
        address: String,
        crest: String,
        tla: String,
        venue: String,
        website: String
    }
});

const User = mongoose.model('User', userSchema)
module.exports = User