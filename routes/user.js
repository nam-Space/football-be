const express = require('express');
const { loginUser, createUser, getUserAccount, logoutUser, getAllUsers, updateUser, deleteUser, updateUserFavouriteTeam } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/verifyToken');
const upload = require("../middlewares/upload");
const router = express.Router()

router.get('/', getAllUsers)
router.post('/login', loginUser)
router.post('/register', createUser)
router.get('/logout', logoutUser)
router.get('/account', getUserAccount)
router.post('/create', createUser)
router.put('/:id', verifyToken, upload.single("avatar"), updateUser)
router.post('/update-favourite', verifyToken, updateUserFavouriteTeam)
router.delete('/delete/:id', deleteUser)

module.exports = router;