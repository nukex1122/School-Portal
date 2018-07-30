const express=require('express');
const path =require('path');
const router=express.Router();
var Student = require('../model/user').student;
var Teacher = require('../model/user').teacher;
var upload = require('../config/multer');
var Notice = require('../model/user').notice;

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
router.use('/schoolOauth',isSchool,express.static(path.join(__dirname,'../frontend/schoolOauth')));
router.use('/teacherOauth',isTeacher,express.static(path.join(__dirname,'../frontend/teacherOauth')));
router.use('/studentOauth',isStudent,express.static(path.join(__dirname,'../frontend/studentOauth')));
router.use('/',express.static(path.join(__dirname,'../frontend/withoutOauth')));

router.get('/studentSignup',isSchool ,function (req,res) {
	res.redirect('/schoolOauth/studentSignup.html');
})

router.get('/teacherSignup',isSchool , function (req,res) {
	res.redirect('/schoolOauth/teacherSignup.html');
})
router.get('/uploadNotice', isSchool, function (req,res) {
	res.redirect('/schoolOauth/uploadNotice.html');
})


router.post('/schoolSignup',passport.authenticate('school.signup',{


    failureRedirect: '/signup', // okay
    failureFlash: true

}),function (req,res) {
    console.log(req);
    res.send('school logged in');

})

router.post('/studentLogin', passport.authenticate('student.login',{


	failureRedirect: '/student-login',
	failureFlash: true

}),function (req,res) {
	res.redirect('/studentOauth/studentDashboard.html');
})


router.post('/teacherLogin', passport.authenticate('teacher.login',{


	failureRedirect: '/teacher-login',
	failureFlash: true

}),function (req,res) {
	res.redirect('/teacherOauth/teacherDashboard.html');
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
		newUser.school = req.user._doc.name;
		newUser.email=req.body.email;
		newUser.password=newUser.encryptPassword(req.body.password);
		newUser.save(function (err) {
			if(err) throw (err);

			res.redirect('/schoolOauth/schoolDashboard.html')
		})
	})

	})


router.post('/teacherSignup', function(req,res){
	Teacher.findOne({'email':req.body.email},function (err,user) {
		if(err){
			throw err;
		}
		if(user){
			req.flash('userError', 'user already exists')
			res.redirect('/schoolOauth/schoolDashboard.html')
		}
		var newUser=new Teacher();
		newUser.typeOf = 'Teacher';
		newUser.school = req.user._doc.name;
		newUser.email=req.body.email;
		newUser.school = req.user._doc.name;
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
	res.redirect('/schoolOauth/schoolDashboard.html')
})


router.post('/uploadNotice',(req,res)=> {
	upload(req, res, function (err) {
		if (err) {
			// An error occurred when uploading
			console.log(err);
			return;
		}

		var newNotice = new Notice();
		newNotice.topic = req.body.topic;
		newNotice.target = req.body.target;
		newNotice.date = req.body.date;
		newNotice.description = req.body.description;
		newNotice.filePath = req.file.path;
		newNotice.school = req.user._doc.name;
		newNotice.save(function (err) {
			if(err) throw (err);

			res.redirect('/schoolOauth/schoolDashboard.html')
		})
	})
});


 router.get('/getNoticeSchool', isSchool, function (req,res) {
	 Notice.find({school : req.user._doc.name},function (err,data) {
	 	var arr=[];
	 	for(var i=0;i<data.length;i++){
	 		arr.push(data[i]._doc);
	    }
		res.json(arr);
	 })
 })

router.get('/getNoticeStudent', isStudent, function (req,res) {
	Notice.find({school : req.user._doc.school,
		$or:[
			{'target':'student'}, {'target':'student and teacher'}
		]
	},function (err,data) {
		var arr=[];
		for(var i=0;i<data.length;i++){
			arr.push(data[i]._doc);
		}
		res.json(arr);
	})
})

router.get('/getNoticeTeacher', isTeacher, function (req,res) {
	Notice.find({school : req.user._doc.school,
		$or:[
			{'target':'teacher'}, {'target':'student and teacher'}
		]

	},function (err,data) {
		var arr=[];
		for(var i=0;i<data.length;i++){
			arr.push(data[i]._doc);
		}
		res.json(arr);
	})
})


router.get('/logout',function (req,res) {

    req.logout();
    res.redirect('/');
})

function isSchool(req,res,next) {
	//console.log(req);
	if (req.user._doc.typeOf == 'School') { return next(); }
	res.redirect('/login') // to do
}

function isTeacher(req,res,next){
	if (req.user._doc.typeOf == 'Teacher') { return next(); }
	res.redirect('/teacher-login') // to do
}

function isStudent(req,res,next) {

	if (req.user._doc.typeOf == 'Student') { return next(); }
    res.redirect('/student-login') // to do
}

module.exports = router;
