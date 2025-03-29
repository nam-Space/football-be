const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    articleId: { type: String, required: true },
    commentContent: { type: String, required: true },
    titleArticle: { type: String, required: true },
    descriptionArticle: { type: String, required: true },
    contentArticle: { type: String, required: true },
    urlArticle: { type: String, required: true },
    createdAt: { type: Date, required: true },
});

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment