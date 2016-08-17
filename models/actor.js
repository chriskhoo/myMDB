var mongoose = require('../config/mongoose.js');

var actorSchema = new mongoose.Schema({
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      index: true
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
});

// register virtual schema
actorSchema.virtual('fullName').get(function(){
  return this.firstName + ' ' + this.lastName;
});

// set getters
actorSchema.set('toJSON', {getters: true});

// register schema
var Actor = mongoose.model('Actor', actorSchema);
module.exports = Actor;
