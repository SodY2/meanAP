'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  News = mongoose.model('News'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  news;

/**
 * News routes tests
 */
describe('News CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new News
    user.save(function () {
      news = {
        name: 'News name'
      };

      done();
    });
  });

  it('should be able to save a News if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new News
        agent.post('/api/news')
          .send(news)
          .expect(200)
          .end(function (newsSaveErr, newsSaveRes) {
            // Handle News save error
            if (newsSaveErr) {
              return done(newsSaveErr);
            }

            // Get a list of News
            agent.get('/api/news')
              .end(function (newsGetErr, newsGetRes) {
                // Handle News save error
                if (newsGetErr) {
                  return done(newsGetErr);
                }

                // Get News list
                var news = newsGetRes.body;

                // Set assertions
                (news[0].user._id).should.equal(userId);
                (news[0].name).should.match('News name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an News if not logged in', function (done) {
    agent.post('/api/news')
      .send(news)
      .expect(403)
      .end(function (newsSaveErr, newsSaveRes) {
        // Call the assertion callback
        done(newsSaveErr);
      });
  });

  it('should not be able to save an News if no name is provided', function (done) {
    // Invalidate name field
    news.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new News
        agent.post('/api/news')
          .send(news)
          .expect(400)
          .end(function (newsSaveErr, newsSaveRes) {
            // Set message assertion
            (newsSaveRes.body.message).should.match('Please fill News name');

            // Handle News save error
            done(newsSaveErr);
          });
      });
  });

  it('should be able to update an News if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new News
        agent.post('/api/news')
          .send(news)
          .expect(200)
          .end(function (newsSaveErr, newsSaveRes) {
            // Handle News save error
            if (newsSaveErr) {
              return done(newsSaveErr);
            }

            // Update News name
            news.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing News
            agent.put('/api/news/' + newsSaveRes.body._id)
              .send(news)
              .expect(200)
              .end(function (newsUpdateErr, newsUpdateRes) {
                // Handle News update error
                if (newsUpdateErr) {
                  return done(newsUpdateErr);
                }

                // Set assertions
                (newsUpdateRes.body._id).should.equal(newsSaveRes.body._id);
                (newsUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of News if not signed in', function (done) {
    // Create new News model instance
    var newsObj = new News(news);

    // Save the news
    newsObj.save(function () {
      // Request News
      request(app).get('/api/news')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single News if not signed in', function (done) {
    // Create new News model instance
    var newsObj = new News(news);

    // Save the News
    newsObj.save(function () {
      request(app).get('/api/news/' + newsObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', news.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single News with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/news/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'News is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single News which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent News
    request(app).get('/api/news/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No News with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an News if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new News
        agent.post('/api/news')
          .send(news)
          .expect(200)
          .end(function (newsSaveErr, newsSaveRes) {
            // Handle News save error
            if (newsSaveErr) {
              return done(newsSaveErr);
            }

            // Delete an existing News
            agent.delete('/api/news/' + newsSaveRes.body._id)
              .send(news)
              .expect(200)
              .end(function (newsDeleteErr, newsDeleteRes) {
                // Handle news error error
                if (newsDeleteErr) {
                  return done(newsDeleteErr);
                }

                // Set assertions
                (newsDeleteRes.body._id).should.equal(newsSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an News if not signed in', function (done) {
    // Set News user
    news.user = user;

    // Create new News model instance
    var newsObj = new News(news);

    // Save the News
    newsObj.save(function () {
      // Try deleting News
      request(app).delete('/api/news/' + newsObj._id)
        .expect(403)
        .end(function (newsDeleteErr, newsDeleteRes) {
          // Set message assertion
          (newsDeleteRes.body.message).should.match('User is not authorized');

          // Handle News error error
          done(newsDeleteErr);
        });

    });
  });

  it('should be able to get a single News that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new News
          agent.post('/api/news')
            .send(news)
            .expect(200)
            .end(function (newsSaveErr, newsSaveRes) {
              // Handle News save error
              if (newsSaveErr) {
                return done(newsSaveErr);
              }

              // Set assertions on new News
              (newsSaveRes.body.name).should.equal(news.name);
              should.exist(newsSaveRes.body.user);
              should.equal(newsSaveRes.body.user._id, orphanId);

              // force the News to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the News
                    agent.get('/api/news/' + newsSaveRes.body._id)
                      .expect(200)
                      .end(function (newsInfoErr, newsInfoRes) {
                        // Handle News error
                        if (newsInfoErr) {
                          return done(newsInfoErr);
                        }

                        // Set assertions
                        (newsInfoRes.body._id).should.equal(newsSaveRes.body._id);
                        (newsInfoRes.body.name).should.equal(news.name);
                        should.equal(newsInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      News.remove().exec(done);
    });
  });
});
