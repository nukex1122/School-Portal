const express=require('express');
const path =require('path');
const router=express.Router();


const passport=require('passport')



router.get('/login',function (req,res) {
    res.redirect('/login.html')
})

router.get('/signup',function (req,res) {
    res.redirect('/signup.html')
})

router.get('/student-login',function (req,res) {
	res.redirect('/loginStudent.html')
})

router.get('/teacher-login',function (req,res) {
	res.redirect('/loginTeacher.html')
})


router.get('/profile',isLoggedIn,function (req,res) {
var obj = req.user._doc;
console.log(obj);
res.json(obj);
})


router.use('/Oauth',isLoggedIn,express.static(path.join(__dirname,'../frontend/Oauth')));
router.use('/',express.static(path.join(__dirname,'../frontend/withoutOauth')));

router.get('/studentSignup',isSchool ,function (req,res) {
	res.redirect('/signup.html')
})



router.post('/schoolSignup',passport.authenticate('school.signup',{


    failureRedirect: '/signup', // okay
    failureFlash: true

}),function (req,res) {
    console.log(req);
    res.redirect('/Oauth/teacherDashboard.html');

})


router.post('/studentSignup',passport.authenticate('student.signup',{


	failureRedirect: '/studentSignup',  // to do
	failureFlash: true

}),function (req,res) {

	res.redirect('/');

})




router.post('/login',passport.authenticate('school.login',{


    failureRedirect: '/login',
    failureFlash: true

}),function (req,res) {
    console.log(req);
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

function isSchool(req,res,next) {
	console.log(req);
	if (req.user._doc.typeof == 'School') { return next(); }
	res.redirect('/login') // to do
}


function isStudent(req,res,next) {
    console.log(req);
	if (req.user._doc.typeof == 'Student') { return next(); }
    res.redirect('/login') // to do
}

module.exports = router;
