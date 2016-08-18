var mongoose = require('../config/mongoose.js');
var bcrypt = require('bcrypt');

// create schema
var userSchema = new mongoose.Schema({
    name: {
      type: String
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true
    },
    password: {
      type: String,
      required: true,
      validate: [
        function(password){
          return password.length >= 6;
        }, 'Password is too short'
      ]
    },


});

userSchema.pre('save', function(next){
  console.log('saving new user');
  var user = this;
  var saltRounds = 5;

  // generate the bycrpt salt
  bcrypt.genSalt(saltRounds,  function(err,salt){
    if (err) return next(err);

    // generate the hash --> plain password text + salt
    bcrypt.hash(user.password, salt ,function(err, hash){
      if(err) return res.status(400).send(err);
      // store hash in your password DB
      user.password = hash;
      next();
    });
  });
});


userSchema.methods.auth = function(posted_password, callback){
  // console.log('posted password is:' + posted_password);
  bcrypt.compare( posted_password, this.password, function(err, is_match){
    callback(null, is_match);
  });
};

// register user schema
var User = mongoose.model('User', userSchema);

module.exports = User;
