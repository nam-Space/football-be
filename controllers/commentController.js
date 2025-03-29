const Comment = require("../models/commentModel");
const User = require("../models/userModel");

const getAllCommentsByArticleId = async (req, res) => {
    try {
        const { articleId } = req.params
        const comments = await Comment.find({ articleId }).populate({
            path: 'user',
        })
        res.status(200).json({
            data: comments
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const createComment = async (req, res) => {
    const { articleId } = req.params
    const { commentContent, titleArticle, descriptionArticle, contentArticle, urlArticle } = req.body;
    const userId = req.userId;
    try {
        const createdAt = new Date().toISOString(); // Lưu thời gian hiện tại

        const newComment = new Comment({
            user: userId,
            articleId,
            commentContent,
            titleArticle,
            descriptionArticle,
            contentArticle,
            urlArticle,
            createdAt
        })
        await newComment.save()

        res.status(201).json({
            data: newComment
        });
    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(500).json({ message: 'Failed to save comment' });
    }
}

const updateComment = async (req, res) => {
    const { id } = req.params;
    const { commentContent } = req.body;
    const userId = req.userId;
    try {

        const comment = await Comment.findOne({
            _id: id,
        })

        if (comment.user !== userId) {
            return res.status(400).json({ error: 'You cannot update this comment' })
        }

        comment.commentContent = commentContent

        await comment.save()

        res.status(201).json({
            data: comment
        });
    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(500).json({ message: 'Failed to save comment' });
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId;

        const comment = await Comment.findOne({
            _id: id,
        })

        if (comment.user !== userId) {
            return res.status(400).json({ error: 'You cannot update this comment' })
        }

        if (!comment) {
            return res.status(400).json({ error: 'Comment not found!' })
        }
        const response = await Comment.deleteOne({ _id: id })
        res.status(200).json({
            data: "OK"
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

module.exports = {
    createComment,
    getAllCommentsByArticleId,
    updateComment,
    deleteComment
}