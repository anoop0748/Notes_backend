const express = require('express');
const jwt  = require("jsonwebtoken");
const mongoose = require("mongoose");
const body_parser = require('body-parser');
const cors = require('cors')
const mongoDBURL = process.env.mongoDBURL || "mongodb://localhost:27017";
const port = process.env.port || 5000;
const reg = require("./src/registration");
const login = require('./src/login')

const app = express();
app.use(express.json());
app.use(cors())
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  next();
});
mongoose.set('strictQuery', false);
mongoose.connect(mongoDBURL, (e, db) => {
    console.log(mongoDBURL)
    if (e) { console.log("DataBase Error :", e) }
    else { console.log('connected to DB') }
})
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
