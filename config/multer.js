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



}).single('file');

const upload1 = multer({
	storage: storage1,



}).single('file');

var obj = {};
obj.noticeUpload = upload;
obj.assignmentUpload = upload1;

module.exports = obj;