import mongoose from 'mongoose';
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
    adhar_id : {type: String, require :true},
    name : {type: String, require :true},
    role : {type: String, require :true},
    password : {type: String, require :true}
});

userSchema.pre(save, function(next) {
    var user = this;
// only hash the password if it has been modified (or is new)
if (!user.isModified('password')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});

});

userSchema.methods.authenticate = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

module.exports  = User;


