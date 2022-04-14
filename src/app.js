const express = require('express');
const hbs = require('hbs');
const path = require("path");
const logout = require('express-passport-logout');
var bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/sports-ticket');

var User = require('./model/user');
var Admin = require('./model/admin');
var Ticket = require('./model/ticket');

app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));
app.use('/customcss', express.static(path.join(__dirname, "../public/css")));
app.use('/icon', express.static(path.join(__dirname, "../images")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(staticpath));
app.set('view engine', 'hbs');
app.set('views', templatepath);
hbs.registerPartials(partialpath);
//routing


app.get("/", (req, res) => {
    Ticket.find((err, eventname) => {
        if(!err){
            res.status(201).render('index', {list: eventname});
        }
        else {
            console.log('ERROR ! ');
        }
    });
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.get("/signup", (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const user = new User({
                email: req.body.email,
                password: password,
                confirmpassword: cpassword
            });
            const registered = await user.save();
            res.status(201).render('login');
        }
        else {
            res.send("passwords are not matching");
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await User.findOne({ email: email });
        if (useremail.password === password) {
            Ticket.find((err, eventname) => {
                if(!err){
                    res.status(201).render('home', { uname: email , list: eventname, uid: useremail._id});
                }
                else {
                    console.log('ERROR ! ');
                }
            });
            
        }
        else {
            res.send('Invalid Crediantials');
        }
    }
    catch (error) {
        res.status(400).send("Invalid Email");
    }
});
app.get('/adminLogin', (req, res) => {
    res.render('adminLogin');
});
app.get("/logout", (req, res) => {
    logout();
    res.redirect('/')
});

app.post("/adminLogin", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminemail = await Admin.findOne({ email: email });
        if (adminemail.password === password) {
            res.status(201).render('adminpage');
        }
        else {
            res.send('Invalid Crediantials');
        }
    }
    catch (error) {
        res.status(400).send("Invalid Email");
    }
});

app.post('/adminpage', async (req, res) => {
    try {


        const ticket = new Ticket({
            eventname: req.body.eventname,
            date: req.body.date,
            location: req.body.location,
            price: req.body.price,
            row: req.body.row,
            seatnumber: req.body.seatnumber,

        });
        ticket.save();
        
        res.render('adminpage');

    }
    catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/delete_data', (req, res) => {
    Ticket.findOneAndDelete({}, (err, data) => {
        if(err){
            console.log(err);
            return res.status(500).send();
        }
        else{
            res.render('index')
        }
    });
});



app.patch("/login/:id/:uid", async (req, res) => {
    console.log(req.params.id);
    
    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(400).send("Ticket Not Found");
    let user = await User.findById(req.params.uid);
    if (!user) return res.status(400).send("User Not Found");
  
    
    ticket = await Ticket.updateOne({_id:req.params.id},{$set: {avalibelity:false}});
    user = await User.updateOne({_id:req.params.uid},{$set: {tickets:req.params.id}});
    if(!ticket && !user) return res.status(404).send('The ticket record not Updated')
    res.status(200).send('Ticket Record Updated')
  });
//server create
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});