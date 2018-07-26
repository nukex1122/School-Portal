const express=require('express');
const path =require('path');
const router=express.Router();
var User=require('../model/user');

const passport=require('passport')



router.get('/login',function (req,res) {
    res.redirect('/login.html')
})

router.get('/signup',function (req,res) {
    res.redirect('/signup.html')
})

router.get('/profile',isLoggedIn,function (req,res) {
var obj = req.user._doc;
res.json(obj);
})

router.use('/Oauth',isLoggedIn,express.static(path.join(__dirname,'../frontend/Oauth')));
router.use('/',express.static(path.join(__dirname,'../frontend/withoutOauth')));



router.post('/signup',passport.authenticate('local.signup',{


    failureRedirect: '/signup',
    failureFlash: true

}),function (req,res) {
    if(req.user._doc.typeOf == 'student'){
        res.redirect('/Oauth/studentDashboard.html');
    }
    else if(req.user._doc.typeOf == 'teacher'){
        res.redirect('/Oauth/teacherDashboard.html');
    }
})



router.post('/login',passport.authenticate('local.login',{


    failureRedirect: '/login',
    failureFlash: true

}),function (req,res) {

    if(req.user._doc.typeOf == 'student'){
        res.redirect('/Oauth/studentDashboard.html');
    }
    else if(req.user._doc.typeOf == 'teacher'){
        res.redirect('/Oauth/teacherDashboard.html');
    }
})


router.get('/logout',function (req,res) {

    req.logout();
    res.redirect('/');
})


function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

module.exports = router;