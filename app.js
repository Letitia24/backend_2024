const express = require('express')
const morgan = require('morgan')
const app = express()
const user = require('./users')
const port = 3000
const host = '127.0.0.1'
const multer = require("multer");
const upload = multer({dest: "public"});
const path = require("path");
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require("fs")

// Morgan 
app.use(morgan("combined"));

// menangani cors dengan middleware
app.use(cors({
    origin : 'http://127.0.0.1:5500',
    credentials : "true"
}))



// menangani file statis dengan menggunakan middleware
app.use(express.static(path.join(__dirname, "public")))

// Middleware  BODYPARSER
app.use(express.urlencoded({extended : true}))
app.use(express.json());
app.post("/login", (req, res)=>{
    const {username, password}=req.body;
    res.json({
        status : "success",
        data : {
            username : username,
            password : password
        }
    })
});

// Get Users ==> no 1
app.get('/users', (req, res) => {
    res.status(200).json(user.users);
  });

// No 2
app.get('/users/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const user = user.users.find(u => u.name.toLowerCase() === name); // perbaiki ini
    if (!user) {
        res.status(404).json({ message: 'Data user tidak ditemukan' });
    } else {
        res.json(user);
    }
});


// No 3
app.post('/users', (req, res) => {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const user = { id: users.length + 1, name: req.body.name };
    users.push(user);
    res.json(user);
  });

// No 4
app.post("/upload", upload.single("file"), (req,res)=>{
    const file = req.file;
    if(file) {
        const target = path.join(__dirname, "public", file.originalname);
        fs.renameSync(file.path, target)
        res.send("file berhasil diupload");
    }
    else {
        res.send("file gagal diupload")
    }
});

//   No 5
app.put('/users/:name', (req, res) => {
  const user = users.find(u => u.name.toLowerCase() === req.params.name.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  user.name = req.body.name;
  res.json(user);
});

// Middleware 2
app.use((req, res) => {
    res.status(404).json({
        status: "error",
        message: "resource tidak ditemukan",
    });
});

// Middleware 3
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      status: "error",
      message: "terjadi kesalahan pada server"
    });
  });


app.listen(port, ()=>console.log(`Server running at http://${host}:${port}`))