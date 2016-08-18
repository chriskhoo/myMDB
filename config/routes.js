var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var jwt_secret = 'whenwhywhowhatwherehow';

// Movie MDB API Models list
// requiring the movie module
var Movie = require ('../models/movie');
var Actor = require ('../models/actor');
var User = require ('../models/user');

// sign up routes
router.post('/signup', function(req,res){
  // res.send(req.body);

  // set var for the posted requests
  var user_object = req.body;
  // set new user object
  var new_user = new User(user_object);

  // save the new user Object
  new_user.save(function(err, user){
    if(err) return res.status(400).send(err);

    return res.status(200).send({
      'message': 'user created'
    });

  });
});

router.post('/login', function(req, res){
  // take in the email from req.body
  var user_login = req.body;


  // find user based on that email
  User.findOne({ email: user_login.email }, function(err, found_user){
    if(err) return res.status(400).send(err);

    if(found_user){
      // get password based on that user
      // compare it with req.body.password
        found_user.auth(
          user_login.password,
          function(err, is_match_password){
            if(err) return res.status(500).send(err);

            if(is_match_password){
              var payload = {
                id: found_user.id,
                email: found_user.email
              };
              var expiryObj = {
                expiresIn: "7d"
              };
              var jwt_token = jwt.sign( payload, jwt_secret, expiryObj );

              return res.status(200).send(jwt_token);
            } else {
              return res.status(401).send({message: 'invalid password'});
            }
        });

    }else{
      return res.status(401).send("Cannot find user email");
    }

  });

  // User.findOne(
  //   user_login,
  //   function(err,found_user){
  //   // error from the server or mongoose
  //   if(err) return res.status(400).send(err);
  //
  //   // results based on search
  //   // note that if there are no returns, find will return empty array which is truthy, findOne gives null
  //   if(found_user){
  //     var payload = {
  //       id: found_user.id
  //     };
  //     var expiryObj = {
  //       expiresIn: "7d"
  //     };
  //     var jwt_token = jwt.sign( payload, jwt_secret, expiryObj );
  //
  //     return res.status(200).send(jwt_token);
  //   } else{
  //     return res.status(400).send("Invalid user email and password");
  //   }
  // });
});


// set routes to list all movies
router.route('/movies')
  .get(function(req, res, next){
    Movie.find({}, function(err, movies){
      if(err) return next(err);
      res.json(movies);
    });
  })
  .post( function(req, res, next){
    console.log(req.body);
    var new_movie = new Movie( req.body );

    new_movie.save(function(err){
      if(err) return next(err);
      res.json(new_movie);
    });

  });

router.route('/movies/:movie_id')
  .get(function(req,res, next){
    var movie_id = req.params.movie_id;
      Movie.findOne({
        _id: movie_id
      }, function(err, movie){
        if(err) return next(err);
        res.json(movie);
      });
  })
  .put(function(req, res, next){
    var movie_id = req.params.movie_id;
    Movie.findByIdAndUpdate(movie_id, req.body ,function(err,movie){
      if(err) return next(err);
      res.json(movie);
    });
  })
  .delete(function(req, res, next){
    var movie_id = req.params.movie_id;
    Movie.findByIdAndRemove(movie_id, req.body ,function(err,movie){
      if(err) return next(err);
      res.send("Movie deleted!");
    });
  });

router.route('/actors')
  .get(function(req,res,next){
    Actor.find({}, function(err, actors){
      if(err) return next(err);
      res.json(actors);
    });
  })
  .post(function(req, res, next){
    var new_actor = new Actor( req.body );
    new_actor.save(function(err){
      // if(err) return res.status(400).send(err);
      // next(err);
      var err_msg_array = {};
      var error_message =  Object.keys(err.errors).forEach(function(each){
        err_msg_array[each] = err.errors[each].message;
      });
      if(err) {
        return res.status(400).send(err_msg_array);
      }

      res.json(new_actor);
    });
  });

  // router.route('/actors/:actor_id')
  // .get( function(req, res, next) {
  //   var actor_id = req.params.actor_id;
  //   // res.send('actor_id is ' + actor_id);
  //   Actor.findOne({
  //     _id: actor_id
  //   }, function(err, actor){
  //     if(err) return next(err);
  //     res.json(actor);
  //   });
  //
  //   // res.json(req.params);
  // })
  // .put(function(req,res,next){
  //   var actor_id = req.params.actor_id;
  //   console.log(req.body);
  //   Actor.findByIdAndUpdate(actor_id, req.body, function(err, actor){
  //     if(err) return next(err);
  //     res.json(actor);
  //   } );
  //
  // })
  // .delete(function(req, res, next){
  //   var actor_id = req.params.actor_id;
  //   Actor.findByIdAndRemove(actor_id, req.body ,function(err,actor){
  //     if(err) return next(err);
  //     res.send("Actor deleted!");
  //   });
  // });
  router.route('/actors/:actor_name')
  .get( function(req, res, next) {
    var actor_name = req.params.actor_name;
    // res.send('actor_id is ' + actor_id);
    Actor.find({}).byName(actor_name, function(err, actor){
      if(err) return next(err);
      res.json(actor);
    });
  });

module.exports = router;
