var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');

var userSchema=mongoose.Schema({
    firstname : {
        type:String,
	    default: null
    },
    lastname:{
        type:String,
	    default: null
    },
    class:{
        type:String,
	    default: null
    },
    section:{
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
	}


});

userSchema.methods.encryptPassword=function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password,this.password);
}

module.exports=  mongoose.model('User',userSchema);;