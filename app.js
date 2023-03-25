const express = require('express');
const jwt  = require("jsonwebtoken");
const mongoose = require("mongoose");
const body_parser = require('body-parser')
const mongoDBURL = process.env.MongoDbUrl || "mongodb://127.0.0.1:27017";
const port = process.env.port || 3000;
const reg = require("./src/registration");
const login = require('./src/login')

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  next();
});
mongoose.set('strictQuery', false);
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
