var mongo_url = 'mongodb://localhost:27017/mymdb';
var mongoose = require('mongoose');
mongoose.connect(mongo_url);

module.exports = mongoose;
