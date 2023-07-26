const express = require('express');
const bodyParser = require('body-parser');
const DB = require(__dirname + "/routes/db.js");
const Window = require('window');
const port = 3000;
const ejs = require('ejs');

app = express();
const window = new Window();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//global variables
let verificationNum = 0;

//Routes for rendaring the file
app.get('/', function(req, res) {
    res.render("home");
});

app.get('/upcomingevent', function(req, res) {
    res.render("upcoming");
});

app.get('/addevent', function(req, res) {
    res.render("addevent");
});

app.get('/home', function(req, res) {
    res.render("home");
});

app.get('/Login', function(req, res) {
    res.render("Login");
});

app.post('/Login', function(req, res) {
    console.log(req.body);
    res.redirect('/logedinhome');
});

app.get('/Createaccount', function(req, res) {
    res.render('createaccount');
});

app.post('/Createaccount', function(req, res) {
    verificationNum = DB.isFound(req.body);
    if (verificationNum != 0) {
        res.redirect('/OTPVer');
    } else {
        res.redirect('/login');
    }
});

app.get('/OTPVer', function(req, res) {
    console.log(verificationNum);
    res.render("OTPVer");
});

app.get('/logedinhome', function(req, res) {
    res.render('logedinhome')
});

//Activate website on specific port
app.listen(port, () => {
    console.log(`Port listing at http://localhost:${port}`);
})