var env = process.env.NODE_ENV || 'development';
config = require('./env/'+env+'.js');

var mongo_url = config.db;
var mongoose = require('mongoose');
mongoose.connect(mongo_url);

module.exports = mongoose;
