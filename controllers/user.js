const express=require('express');
const path =require('path');
const router=express.Router();
var Student = require('../model/user').student;

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
router.use('/schoolOauth',isSchool,express.static(path.join(__dirname,'../frontend/SchoolOauth')));

router.use('/Oauth',isStudent,express.static(path.join(__dirname,'../frontend/Oauth')));
router.use('/',express.static(path.join(__dirname,'../frontend/withoutOauth')));

router.get('/studentSignup',isSchool ,function (req,res) {
	res.redirect('/schoolOauth/studentSignup.html')
})



router.post('/schoolSignup',passport.authenticate('school.signup',{


    failureRedirect: '/signup', // okay
    failureFlash: true

}),function (req,res) {
    console.log(req);
    res.send('school logged in');

})

router.post('/studentlogin', passport.authenticate('student.login',{


	failureRedirect: '/student-login',
	failureFlash: true

}),function (req,res) {
	res.redirect('/Oauth/studentDashboard.html');
})

router.post('/studentSignup', function(req,res){
	Student.findOne({'email':req.body.email},function (err,user) {
		if(err){
			throw err;
		}
		if(user){
			req.flash('userError', 'user already exists')
			res.redirect('/schoolOauth/schoolDashboard.html')
		}
		var newUser=new Student();
		newUser.typeOf = 'Student';

		newUser.email=req.body.email;
		newUser.password=newUser.encryptPassword(req.body.password);
		newUser.save(function (err) {
			if(err) throw (err);

			res.redirect('/schoolOauth/schoolDashboard.html')
		})
	})

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
router.get()


router.get('/logout',function (req,res) {

    req.logout();
    res.redirect('/');
})

function isSchool(req,res,next) {
	//console.log(req);
	if (req.user._doc.typeOf == 'School') { return next(); }
	res.redirect('/login') // to do
}


function isStudent(req,res,next) {

	if (req.user._doc.typeOf == 'Student') { return next(); }
    res.redirect('/student-login') // to do
}

module.exports = router;
