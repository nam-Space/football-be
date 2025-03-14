const express = require('express');
const { loginUser, createUser, getUserAccount, logoutUser, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router()

router.get('/', getAllUsers)
router.post('/login', loginUser)
router.post('/register', createUser)
router.get('/logout', logoutUser)
router.get('/account', getUserAccount)
router.post('/create', createUser)
router.post('/update', updateUser)
router.delete('/delete/:id', deleteUser)

module.exports = router;