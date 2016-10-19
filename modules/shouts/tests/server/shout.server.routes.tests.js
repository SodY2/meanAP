'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shout = mongoose.model('Shout'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  shout;

/**
 * Shout routes tests
 */
describe('Shout CRUD tests', function () {

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

    // Save a user to the test db and create new Shout
    user.save(function () {
      shout = {
        name: 'Shout name'
      };

      done();
    });
  });

  it('should be able to save a Shout if logged in', function (done) {
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

        // Save a new Shout
        agent.post('/api/shouts')
          .send(shout)
          .expect(200)
          .end(function (shoutSaveErr, shoutSaveRes) {
            // Handle Shout save error
            if (shoutSaveErr) {
              return done(shoutSaveErr);
            }

            // Get a list of Shouts
            agent.get('/api/shouts')
              .end(function (shoutsGetErr, shoutsGetRes) {
                // Handle Shouts save error
                if (shoutsGetErr) {
                  return done(shoutsGetErr);
                }

                // Get Shouts list
                var shouts = shoutsGetRes.body;

                // Set assertions
                (shouts[0].user._id).should.equal(userId);
                (shouts[0].name).should.match('Shout name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Shout if not logged in', function (done) {
    agent.post('/api/shouts')
      .send(shout)
      .expect(403)
      .end(function (shoutSaveErr, shoutSaveRes) {
        // Call the assertion callback
        done(shoutSaveErr);
      });
  });

  it('should not be able to save an Shout if no name is provided', function (done) {
    // Invalidate name field
    shout.name = '';

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

        // Save a new Shout
        agent.post('/api/shouts')
          .send(shout)
          .expect(400)
          .end(function (shoutSaveErr, shoutSaveRes) {
            // Set message assertion
            (shoutSaveRes.body.message).should.match('Please fill Shout name');

            // Handle Shout save error
            done(shoutSaveErr);
          });
      });
  });

  it('should be able to update an Shout if signed in', function (done) {
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

        // Save a new Shout
        agent.post('/api/shouts')
          .send(shout)
          .expect(200)
          .end(function (shoutSaveErr, shoutSaveRes) {
            // Handle Shout save error
            if (shoutSaveErr) {
              return done(shoutSaveErr);
            }

            // Update Shout name
            shout.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Shout
            agent.put('/api/shouts/' + shoutSaveRes.body._id)
              .send(shout)
              .expect(200)
              .end(function (shoutUpdateErr, shoutUpdateRes) {
                // Handle Shout update error
                if (shoutUpdateErr) {
                  return done(shoutUpdateErr);
                }

                // Set assertions
                (shoutUpdateRes.body._id).should.equal(shoutSaveRes.body._id);
                (shoutUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Shouts if not signed in', function (done) {
    // Create new Shout model instance
    var shoutObj = new Shout(shout);

    // Save the shout
    shoutObj.save(function () {
      // Request Shouts
      request(app).get('/api/shouts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Shout if not signed in', function (done) {
    // Create new Shout model instance
    var shoutObj = new Shout(shout);

    // Save the Shout
    shoutObj.save(function () {
      request(app).get('/api/shouts/' + shoutObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', shout.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Shout with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/shouts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Shout is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Shout which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Shout
    request(app).get('/api/shouts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Shout with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Shout if signed in', function (done) {
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

        // Save a new Shout
        agent.post('/api/shouts')
          .send(shout)
          .expect(200)
          .end(function (shoutSaveErr, shoutSaveRes) {
            // Handle Shout save error
            if (shoutSaveErr) {
              return done(shoutSaveErr);
            }

            // Delete an existing Shout
            agent.delete('/api/shouts/' + shoutSaveRes.body._id)
              .send(shout)
              .expect(200)
              .end(function (shoutDeleteErr, shoutDeleteRes) {
                // Handle shout error error
                if (shoutDeleteErr) {
                  return done(shoutDeleteErr);
                }

                // Set assertions
                (shoutDeleteRes.body._id).should.equal(shoutSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Shout if not signed in', function (done) {
    // Set Shout user
    shout.user = user;

    // Create new Shout model instance
    var shoutObj = new Shout(shout);

    // Save the Shout
    shoutObj.save(function () {
      // Try deleting Shout
      request(app).delete('/api/shouts/' + shoutObj._id)
        .expect(403)
        .end(function (shoutDeleteErr, shoutDeleteRes) {
          // Set message assertion
          (shoutDeleteRes.body.message).should.match('User is not authorized');

          // Handle Shout error error
          done(shoutDeleteErr);
        });

    });
  });

  it('should be able to get a single Shout that has an orphaned user reference', function (done) {
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

          // Save a new Shout
          agent.post('/api/shouts')
            .send(shout)
            .expect(200)
            .end(function (shoutSaveErr, shoutSaveRes) {
              // Handle Shout save error
              if (shoutSaveErr) {
                return done(shoutSaveErr);
              }

              // Set assertions on new Shout
              (shoutSaveRes.body.name).should.equal(shout.name);
              should.exist(shoutSaveRes.body.user);
              should.equal(shoutSaveRes.body.user._id, orphanId);

              // force the Shout to have an orphaned user reference
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

                    // Get the Shout
                    agent.get('/api/shouts/' + shoutSaveRes.body._id)
                      .expect(200)
                      .end(function (shoutInfoErr, shoutInfoRes) {
                        // Handle Shout error
                        if (shoutInfoErr) {
                          return done(shoutInfoErr);
                        }

                        // Set assertions
                        (shoutInfoRes.body._id).should.equal(shoutSaveRes.body._id);
                        (shoutInfoRes.body.name).should.equal(shout.name);
                        should.equal(shoutInfoRes.body.user, undefined);

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
      Shout.remove().exec(done);
    });
  });
});
