var mongoose = require('../config/mongoose.js');

// create schema
var movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  publishedYear: Number,
  website: {
    type: String,
    trim: true,
    get: function(url){
      if(!url) return url;

      if(url.indexOf('http://') !== 0 &&
        url.indexOf('https://') !== 0 ){
          url = 'http://'+ url;
        }

      return url;
    }
  },
  director: String,
  actor: String,
  published: {
    type: String,
    default: "MGM"
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
},
{
  timestamps: {} }
);

// register the getter
movieSchema.set('toJSON', {getters: true});

movieSchema.pre('save', function(next){

});
// register the schema
var Movie = mongoose.model('Movie', movieSchema);

// make this available to other files
module.exports = Movie;
