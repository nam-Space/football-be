const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    try {
        const { name, gender, address, email, password, role } = req.body
        const user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ error: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            name, gender, address,
            email,
            password: hashedPassword,
            role
        })
        await newUser.save()

        if (newUser) {
            const token = generateTokenAndSetCookie(newUser._id, res)
            res.status(201).json({
                data: {
                    _id: newUser._id,
                    name, gender, address,
                    email: newUser.email,
                    role: newUser.role,
                    token
                }
            })
        }
        else {
            res.status(400).json({ error: 'Invalid user data' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: 'Invalid email' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid password' })
        }
        const token = generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            data: {
                _id: user._id,
                name: user.name,
                gender: user.gender,
                address: user.address,
                email: user.email,
                role: user.role,
                token
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('jwt')
        res.status(200).json({
            data: "User logged out successfully"
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json({
            data: users.reverse()
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const updateUser = async (req, res) => {
    try {
        const { _id,
            name,
            password,
            gender,
            address,
            role } = req.body

        let user = await User.findOne({ _id })
        if (!user) {
            return res.status(400).json({ error: 'User not found!' })
        }

        if (password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            user.password = hashedPassword
        }

        user.name = name || user.name
        user.gender = gender || user.gender
        user.address = address || user.address
        user.role = role || user.role

        user = await user.save()

        user.password = null
        res.status(200).json({
            data: user
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        let user = await User.findOne({ _id: id })
        if (!user) {
            return res.status(400).json({ error: 'User not found!' })
        }
        const response = await User.deleteOne({ _id: id })
        res.status(200).json({
            data: response
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message)
    }
}

const getUserAccount = async (req, res) => {
    try {
        const token = req.headers["authorization"];

        const data = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

        const user = await User.findOne({ _id: data.userId })
        user.password = null

        res.status(200).json({
            data: user,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ isError: true, error });
    }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    getAllUsers,
    updateUser,
    deleteUser,
    getUserAccount
}