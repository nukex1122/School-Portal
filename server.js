const express=require('express');
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
        console.log('Connected to Server successfully!');
    }
});

app.listen(3000,function () {
    console.log('server started');
}) ;