const express = require('express');
const { loginUser, createUser, getUserAccount, logoutUser } = require('../controllers/userController');

const router = express.Router()

router.post('/login', loginUser)
router.post('/register', createUser)
router.get('/account', getUserAccount)
router.get('/logout', logoutUser)

module.exports = router;