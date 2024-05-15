const express = require('express');
const morgan = require('morgan');
const users = require('./users');

const app = express(); 

// Middleware yang digunakan
app.use(express.json());
app.use(morgan('dev'));

// GET /users endpoint
app.get('/users', (req, res) => {
    res.json(users);
});

// GET /users/:name endpoint
app.get('/users/:name', (req, res) => {
    const { name } = req.params;
    const user = users.find(user => user.name.toLowerCase() === name.toLowerCase());
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "Data user tidak ditemukan" });
    }
});

// Penanganan routing 404
app.use((req, res, next) => {
    res.status(404).json({ status: "error", message: "resource tidak ditemukan" });
});

// Penanganan Error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "error", message: "terjadi kesalahan pada server" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});