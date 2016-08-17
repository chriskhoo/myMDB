// requiring the movie module
var Movie = require ('./models/movie');
var Actor = require ('./models/actor');

var bodyParser = require('body-parser');

// set up express
var express = require('express');
var app = express();

// setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.set('port', (process.env.PORT|| 5000));

// set routes to list all movies
app.route('/movies')
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

app.route('/movies/:movie_id')
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

app.route('/actors')
  .get(function(req,res,next){
    Actor.find({}, function(err, actors){
      if(err) return next(err);
      res.json(actors);
    });
  })

  .post(function(req, res, next){
    var new_actor = new Actor( req.body );
    new_actor.save(function(err){
      if(err) return next(err);
      res.json(new_actor);
    });
  });

  app.route('/actors/:actor_id')
  .get( function(req, res, next) {
    var actor_id = req.params.actor_id;
    // res.send('actor_id is ' + actor_id);
    Actor.findOne({
      _id: actor_id
    }, function(err, actor){
      if(err) return next(err);
      res.json(actor);
    });

    // res.json(req.params);
  })
  .put(function(req,res,next){
    var actor_id = req.params.actor_id;
    console.log(req.body);
    Actor.findByIdAndUpdate(actor_id, req.body, function(err, actor){
      if(err) return next(err);
      res.json(actor);
    } );

  })
  .delete(function(req, res, next){
    var actor_id = req.params.actor_id;
    Actor.findByIdAndRemove(actor_id, req.body ,function(err,actor){
      if(err) return next(err);
      res.send("Actor deleted!");
    });
  });


app.listen(app.get('port'), function(){
  console.log('Server running at localhost:' + app.get( 'port'));
});

module.exports = app;
