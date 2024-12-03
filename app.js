const express = require('express')
const { Sequelize } = require('sequelize')
const config = require('./config/config.json')[process.env.NODE_ENV || 'development']
const db = require('./models')

const app = express()
const PORT = process.env.PORT || 3000

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
})

app.use(express.json())

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const { username, password } = req.body
        const newUser = await db.User.create({ username, password })
        res.status(201).json(newUser)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
})

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await db.User.findAll()
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message })
    }
})

// Get a user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await db.User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
})

// Update a user by ID
app.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const { username, password } = req.body
        const user = await db.User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        user.username = username || user.username
        user.password = password || user.password

        await user.save()
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const user = await db.User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        await user.destroy()
        res.status(204).send() // No content status
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: error.message })
    }
})