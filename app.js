const express = require('express');
const jwt  = require("jsonwebtoken");
const mongoose = require("mongoose");
const body_parser = require('body-parser')
const mongoDBURL = "mongodb://localhost:27017";
const port = 3000;
const reg = require("./src/registration");
const login = require('./src/login')

const app = express();
app.use(express.json());

mongoose.connect(mongoDBURL,console.log("Connected To Database"));
app.use(body_parser.json());
app.use('/login/user/*', async (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, "NotesUser", function (err, decoded) {
            if (err) {
                return res.json({
                    status: 'Fail',
                    massage: "Not a valid token."
                })
            }
            req.user = decoded.data;
            console.log(req.body)
            next();
        })
    }
    else {
        return res.status(401).json({
            status: 'Fail',
            massage: 'Token not Found'
        })
    }
})
app.use(reg);
app.use(login);

app.listen(port,console.log(`Server is running on ${port}`));
