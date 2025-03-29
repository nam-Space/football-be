const express = require('express');
const { verifyToken } = require('../middlewares/verifyToken');
const { createComment, getAllCommentsByArticleId, updateComment, deleteComment } = require('../controllers/commentController');

const router = express.Router()

router.get('/:articleId', getAllCommentsByArticleId)
router.post('/create/:articleId', verifyToken, createComment)
router.put('/update/:id', verifyToken, updateComment)
router.delete('/delete/:id', verifyToken, deleteComment)

module.exports = router;