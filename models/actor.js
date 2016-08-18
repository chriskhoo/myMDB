var mongoose = require('../config/mongoose.js');

var actorSchema = new mongoose.Schema({
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name not found"]
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: [true, "Email not found"],
      match: [/.+\@.+\..+/, "Email format is invalid"]
    },
    age: Number,
    website: {
      type: String,
      lowercase: true,
      trim: true,
      set: function(url){
        if(url.length === 0) return undefined;
        if(!url) return url;

        if(url.indexOf('http://') !== 0 &&
          url.indexOf('https://') !== 0 ){
            url = 'http://'+ url;
          }

        return url;
      },
      get: function(url){
        if(!url) return url;

        if(url.indexOf('http://') !== 0 &&
          url.indexOf('https://') !== 0 ){
            url = 'http://'+ url;
          }

        return url;
      }
    }
},
{
  timestamps: {} }
);

// register virtual schema
actorSchema.virtual('fullName')
.get(function(){
  return this.firstName + ', ' + this.lastName;
})
// .set(function(fullName){
//   var splitName = fullName.split(", ");
//   this.firstName = splitName[0];
//   this.lastName = splitName[1];
// })
;

// set getters
actorSchema.set('toJSON', {getters: true});

// custom methods
actorSchema.query = {
  byName: function(name, cb) {
      this.find({
        $or: [
          {firstName: new RegExp(name, 'i')},
          {lastName: new RegExp(name, 'i')}
        ]
      }, cb);
  }
};

// register schema
var Actor = mongoose.model('Actor', actorSchema);
module.exports = Actor;
