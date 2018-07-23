const passport=require('passport');
var LocalStratergy=require('passport-local');

var User = require('../model/user');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});


passport.use('local.signup',new LocalStratergy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
},function (req,email,password, done) {

    User.findOne({'email':email},function (err,user) {
        if(err){
            return done(err);
        }
        if(user){
            req.flash('userError', 'user already exists')
            return done(null,false);
        }
        var newUser=new User();
        newUser.typeOf = req.body.type;
        newUser.fullname= req.body.name;
        newUser.email=req.body.email;
        newUser.password=newUser.encryptPassword(req.body.password);
        newUser.save(function (err) {
            if(err) return done(err);

            return done(null,newUser);
        })
    })
}));

passport.use('local.login',new LocalStratergy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
},function (req,email,password, done) {

    User.findOne({'email':email},function (err,user) {
        if(err){
            return done(err);
        }
        if(!user){
            req.flash('loggingError', 'user email not found')
            return done(null,false);
        }
        if(!user.validPassword(req.body.password)){
            req.flash('passworderror', 'incorrect password')
            return done(null,false);
        }
        return done(null,user);
    })

}));