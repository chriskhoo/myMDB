var app = require('../app');
var supertest = require('supertest');

describe('Express Server API', function(){
    describe("should return movies json on get /movies", function(){
      it("returns status code 200", function(done){
        supertest(app)
        .get('/movies')
        // .set('Accept', 'text/html')
        .expect('Content-Type', /json/)
        .expect(200, done);
      });
    });

});
