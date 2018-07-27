const express=require('express');
const path =require('path');
const body_parser=require('body-parser');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const mongoose=require('mongoose');
const passport=require('passport');
const MongoStore=require('connect-mongo')(session); // allo us to save session in mongodb so when we refresh our page session is saved
const flash=require('express-flash');

var app=express();

mongoose.connect('mongodb://mohan_kukreja:school_portal1@ds247171.mlab.com:47171/school_portal', function(err, db) {
    if (err) {
        console.log('Unable to connect to the server. Please start the server. Error:', err);
    } else {
        console.log('Connected to DB successfully!');
    }
});


app.use(body_parser.urlencoded({extended:true}));
app.use(body_parser.json());
app.use(cookieParser())

//passport is initialized after session is declared
app.use(session({
    secret:'mysecretsessionkey',
    resave:true,
    saveUninitialized:true,
    store: new MongoStore({mongooseConnection : mongoose.connection })
}));
app.use(flash());
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());


var main = require('./controllers/user');

app.use('/', main);

app.listen(3000,function () {
    console.log('server started');
}) ;
