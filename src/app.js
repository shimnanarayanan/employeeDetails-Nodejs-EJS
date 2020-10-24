const express = require("express");
const http = require('http')
const session = require('express-session')
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/config/.env" });
const path = require('path');
const db = require("./db/db");


//import routes
const userRoutes = require("./routes/user");



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// To handle session
app.use(session({
    secret: 'thisismyseceretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use("/api/user", userRoutes);

const port = process.env.PORT || 4000;
// const port = 4000
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});


