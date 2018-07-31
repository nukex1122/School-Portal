var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var studentSchema=mongoose.Schema({
    admissionNumber : {
        type:String,
	    default: null
    },
	rollNumber:{
		type:String,
		default: null
	},
	school:{
		type:String,
		default: null
	},
	address:{
		type:String,
		default: null
	},
	phone:{
		type:String,
		default: null
	},
	firstname :{
		type:String,
		default: null
	},

    lastname:{
        type:String,
	    default: null
    },
    class_section:{
        type:Array,
	    default: null
    },
	email:{
		type:String,
		default: null
	},
	typeOf: {
    	type:String,
		default: null
	},
	password:{
		type:String,
		default: null
	},
	age:{
		type:String,
		default: null
	},
	rating:{
        type: Number,
		default: null
	},
	subject:{
		type:Array,
		default: null
	}


});

var teacherSchema=mongoose.Schema({
	firstname : {
		type:String,
		default: null
	},
	lastname:{
		type:String,
		default: null
	},
	phone:{
		type:String,
		default: null
	},
	email:{
		type:String,
		default: null
	},
	school:{
		type:String,
		default: null
	},
	typeOf: {
		type:String,
		default: null
	},
	class_section:{
		type:Array,
		default: null
	},
	password:{
		type:String,
		default: null
	},
	subject:{
		type:Array,
		default: null
	}


});


var schoolSchema=mongoose.Schema({
	name : {
		type:String,
		default: null
	},
	email:{
		type:String,
		default: null
	},
	typeOf: {
		type:String,
		default: null
	},

	password:{
		type:String,
		default: null
	},
	subject:{
		type:Array,
		default: null
	}


});

var teacherSchema=mongoose.Schema({
	emp_id:{
		type:String,
		default: null

	},
	email:{
		type:String,
		default: null
	},
	typeOf: {
		type:String,
		default: null
	},

	address:{
		type:String,
		default: null
	},
	phone:{
		type:String,
		default: null
	},
	firstname :{
		type:String,
		default: null
	},

	lastname:{
		type:String,
		default: null
	},
	class_section:{
		type:Array,
		default: null
	},

	password:{
		type:String,
		default: null
	},
	subject:{
		type:Array,
		default: null
	},
	school: {
		type:String,
		default: null
	}


});


var noticeSchema=mongoose.Schema({
	topic : {
		type:String,
		default: null
	},
	date:{
		type:String,
		default: null
	},
	filePath: {
		type:String,
		default: null
	},

	description:{
		type:String,
		default: null
	},
	target: {
		type:String,
		default: null
	},
	school:{
		type:String,
		default: null
	}


});

schoolSchema.methods.encryptPassword=function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

schoolSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password,this.password);
}

teacherSchema.methods.encryptPassword=function (password) {
	return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

teacherSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password,this.password);
}

studentSchema.methods.encryptPassword=function (password) {
	return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

studentSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password,this.password);
}




var obj ={};
obj.student =  mongoose.model('student',studentSchema);
obj.teacher =  mongoose.model('teacher',teacherSchema);
obj.school  =  mongoose.model('school', schoolSchema);
obj.notice  =  mongoose.model('notice', noticeSchema);

module.exports = obj;