const express = require('express');
const hbs = require('hbs');
const path = require("path");
var bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/sports-ticket');

var User = require('./model/user');

app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));
app.use('/customcss', express.static(path.join(__dirname, "../public/css")));
app.use('/icon', express.static(path.join(__dirname, "../images")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(staticpath));
app.set('view engine','hbs');
app.set('views', templatepath);
hbs.registerPartials(partialpath);
//routing

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET");
    next();
});
app.get("/", (req, res) => {
    res.render('index');
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.get("/signup", (req, res) => {
    res.render('signup');
});

app.post('/signup', function (request, response) {
    var user = new User();
    user.email = request.body.email;
    user.password = request.body.password;
    user.save(function(err, savedUser) {
       if (err) {
           response.status(500).send({error:"Could not register User"});
       } else {
           response.render('login');
       }
    });
});

app.post("/login", (req, res, next) => {

    User.find({email:req.body.email}, (err,usr) => {
        if(err) return next(err);
        if(!usr) {
            res.render('login');
        }
        else {
            res.send('Login Sucessful');
        }
    });

})

//server create
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});