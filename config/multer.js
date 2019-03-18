const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/notice_uploads')
	},
	filename: function(req, file, cb){
		cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

const storage2 = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/time_table_upload')
	},
	filename: function(req, file, cb){
		cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});


const storage1 = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads/assignment_uploads')
	},
	filename: function(req, file, cb){
		cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,



}).single('notice');

const upload1 = multer({
	storage: storage1,



}).single('assignment');

const upload2 = multer({
	storage: storage2,
}).single('timeTable');

var obj = {};
obj.noticeUpload = upload;
obj.assignmentUpload = upload1;
obj.timeTableUpload = upload2;
module.exports = obj;