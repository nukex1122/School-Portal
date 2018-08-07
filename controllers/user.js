const express=require('express');
const path =require('path');
const router=express.Router();
var Student = require('../model/user').student;
var Teacher = require('../model/user').teacher;
var upload = require('../config/multer').noticeUpload;
var uploadAssignment = require('../config/multer').assignmentUpload;
var Notice = require('../model/user').notice;
var School = require('../model/user').school;
var Contact = require('../model/user').contact;
var Assignment = require('../model/user').assignment;


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'focado11@gmail.com',
		pass: 'schoolportal'
	}
});


const passport=require('passport');

router.get('/data',function (req,res) {
	res.json(req.user._doc);
})

router.get('/teacherData',isTeacher,function (req,res) {
	res.json()
})

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
router.use('/uploads',isStudent,express.static(path.join(__dirname,'../uploads')));
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

router.get('/updateSubjects', isSchool, function (req,res) {
	res.redirect('/schoolOauth/fillSubjects.html');
})

router.get('/contactStudent' , isStudent, function (req,res) {
	res.redirect('/studentOauth/contact.html');
})

router.get('/rating' , isStudent, function (req,res) {
	res.redirect('/studentOauth/rating.html');
})

router.get('/contactTeacher' , isTeacher, function (req,res) {
	res.redirect('/teacherOauth/contact.html');
})

router.get('/assignment',isTeacher, function (req,res) {
	res.redirect('/teacherOauth/uploadAssignment.html');
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
		else if(user){
			req.flash('userError', 'user already exists')
			res.redirect('/schoolOauth/schoolDashboard.html')
		}

		console.log(req);
		var newUser=new Student();
		newUser.typeOf = 'Student';
		newUser.firstname = req.body.firstname;
		newUser.lastname = req.body.lastname;
		newUser.phone = req.body.phone;
		newUser.age= req.body.age;
		newUser.admissionNumber=req.body.admissionNumber;
		newUser.rollNumber=req.body.rollNumber;
		newUser.address=req.body.address
		newUser.school = req.user._doc.name;
		newUser.email=req.body.email;
		var arr=[];
		var ans = req.body.subject;
		arr=ans.split(',');
		newUser.subject = arr;

		newUser.class_section = req.body.class_section;

		newUser.password=newUser.encryptPassword(req.body.password);
		newUser.save(function (err) {
			if(err) throw (err);

			return res.redirect('/schoolOauth/schoolDashboard.html')
		})
	})

	})


router.post('/teacherSignup', function(req,res){
	Teacher.findOne({'email':req.body.email},function (err,user) {
		if(err){
			throw err;
		}
		else if(user){
			req.flash('userError', 'user already exists')
			res.redirect('/schoolOauth/schoolDashboard.html')
		}
		console.log(req);
		var newUser=new Teacher();
		newUser.typeOf = 'Teacher';
		newUser.school = req.user._doc.name;
		newUser.email=req.body.email;
		newUser.firstname = req.body.firstname;
		newUser.lastname = req.body.lastname;
		newUser.phone = req.body.phone;
		newUser.school = req.user._doc.name;
		var arr=[];
		var ans = req.body.subject;
		arr=ans.split(',');
		newUser.subject = arr;
		var classarr =[];
		var ans1 = req.body.class_section;
		classarr = ans1.split(',');
		newUser.class_section = classarr;
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
		console.log(req);
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

router.post('/fillSubjects',isSchool, function (req,res) {
	var query = { name: req.user._doc.name };
	var arr=[];
	var ans = req.body.subject;
	arr=ans.split(',');

	School.update(query, {subject : arr}, function (err,data) {
		console.log(data);
		res.redirect('/schoolOauth/schoolDashboard.html')
	})
})


 router.get('/getNoticeSchool', isSchool, function (req,res) {
	 Notice.find({school : req.user._doc.name},function (err,data) {
	 	var arr=[];
	 	for(var i=0;i<data.length;i++){
	 		arr.push(data[i]._doc);
	    }
		res.json(arr);
	 })
 })


router.get('/getAssignment' ,function (req,res) {
	Assignment.find({school : req.user._doc.school,
		class_section : req.user._doc.class_section
	},function (err,data) {
		res.json(data);
	})

})

router.get('/getNoticeStudent', isStudent, function (req,res) {
	Notice.find({school : req.user._doc.school,
		$or:[
			{'target':'Student'}, {'target':'Student and Teacher'}
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
			{'target':'Teacher'}, {'target':'Student and Teacher'}
		]

	},function (err,data) {
		var arr=[];
		for(var i=0;i<data.length;i++){
			arr.push(data[i]._doc);
		}
		res.json(arr);
	})
})

router.post('/contact',function (req,res) {
	var contact = new Contact();
	console.log(req);
	if(req.body.tosend == 'School Administration'){
		contact.description = req.body.description;
		contact.topic = req.body.subject;
		contact.firstname = req.user._doc.firstname;
		contact.lastname = req.user._doc.lastname;
		contact.school = req.user._doc.school;
		contact.target = req.body.tosend;
		contact.typeOf = req.user._doc.typeOf;
		if(contact.typeOf == "Student"){
			contact.class_section = req.user._doc.class_section;
		}
		contact.save(function (err) {
			if(err) throw (err);
			if(req.user._doc.typeOf == 'Student'){
				res.redirect('/studentOauth/studentDashboard.html');
			}
			else{
				res.redirect('/teacherOauth/teacherDashboard.html');
			}

		})

	}
	if(req.body.tosend == 'Focado Team'){
		var mailOptions = {
			from: 'focado11@gmail.com',
			to: 'mohankukreja1@gmail.com',
			subject: req.body.subject,
			text: `firstname : ${req.user._doc.firstname},
				   lastname : ${req.user._doc.lastname},
				   school : ${req.user._doc.school}
				   description: ${req.body.description}
			`
		};

		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
				if(req.user._doc.typeOf == 'Student'){
					res.redirect('/studentOauth/studentDashboard.html');
				}
				else{
					res.redirect('/teacherOauth/teacherDashboard.html');
				}
			}
		})

	}
})



router.get('/getContact',isSchool,function (req,res) {
	Contact.find({school: req.user._doc.name},function(err,data){
		var arr=[];
		for(var i=0;i<data.length;i++){
			arr.push(data[i]._doc);
		}
		res.json(arr);
	})
})

router.post('/rating',function (req,res) {
	var query = { firstname: req.body.firstname , lastname: req.body.lastname };
	Teacher.find(query,function (err,data) {
		console.log(data);
	})
})


router.post('/uploadAssignment',function (req,res) {
	uploadAssignment(req, res, function (err) {
		if (err) {
			// An error occurred when uploading
			console.log(err);
			return;
		}
		console.log(req);
		var newAssignment = new Assignment();
		newAssignment.topic = req.body.topic;
		newAssignment.filePath = req.file.Path;
		newAssignment.deadline = req.body.deadline;
		newAssignment.description = req.body.description;
		newAssignment.teacherFirstname = req.user._doc.firstname;
		newAssignment.teacherLastname = req.user._doc.lastname;
		newAssignment.school = req.user._doc.school;
		var classarr =[];
		var ans1 = req.body.class_section;
		classarr = ans1.split(',');
		newAssignment.class_section = classarr;


		newAssignment.save(function (err) {
			if(err) throw (err);

			res.redirect('/teacherOauth/teacherDashboard.html');
		})
	})
})


router.get('/logout',function (req,res) {

    req.logout();
    res.redirect('/');
})

function isSchool(req,res,next) {
	//console.log(req);
	if(!req.user){
		return res.redirect('/login')
	}
	if (req.user._doc.typeOf == 'School') { return next(); }
	res.redirect('/login') // to do
}

function isTeacher(req,res,next){
	if(!req.user){
		return res.redirect('/teacher-login')
	}
	if (req.user._doc.typeOf == 'Teacher') { return next(); }
	res.redirect('/teacher-login') // to do
}

function isStudent(req,res,next) {
	if(!req.user){
		return res.redirect('/student-login')
	}
	if (req.user._doc.typeOf == 'Student') { return next(); }
    res.redirect('/student-login') // to do
}

module.exports = router;

//http://localhost:3000/uploads/notice_uploads/notice-1533308933304.jpg
