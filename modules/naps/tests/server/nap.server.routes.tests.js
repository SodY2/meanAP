'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Nap = mongoose.model('Nap'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  nap;

/**
 * Nap routes tests
 */
describe('Nap CRUD tests', function () {

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

    // Save a user to the test db and create new Nap
    user.save(function () {
      nap = {
        name: 'Nap name'
      };

      done();
    });
  });

  it('should be able to save a Nap if logged in', function (done) {
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

        // Save a new Nap
        agent.post('/api/naps')
          .send(nap)
          .expect(200)
          .end(function (napSaveErr, napSaveRes) {
            // Handle Nap save error
            if (napSaveErr) {
              return done(napSaveErr);
            }

            // Get a list of Naps
            agent.get('/api/naps')
              .end(function (napsGetErr, napsGetRes) {
                // Handle Naps save error
                if (napsGetErr) {
                  return done(napsGetErr);
                }

                // Get Naps list
                var naps = napsGetRes.body;

                // Set assertions
                (naps[0].user._id).should.equal(userId);
                (naps[0].name).should.match('Nap name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Nap if not logged in', function (done) {
    agent.post('/api/naps')
      .send(nap)
      .expect(403)
      .end(function (napSaveErr, napSaveRes) {
        // Call the assertion callback
        done(napSaveErr);
      });
  });

  it('should not be able to save an Nap if no name is provided', function (done) {
    // Invalidate name field
    nap.name = '';

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

        // Save a new Nap
        agent.post('/api/naps')
          .send(nap)
          .expect(400)
          .end(function (napSaveErr, napSaveRes) {
            // Set message assertion
            (napSaveRes.body.message).should.match('Please fill Nap name');

            // Handle Nap save error
            done(napSaveErr);
          });
      });
  });

  it('should be able to update an Nap if signed in', function (done) {
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

        // Save a new Nap
        agent.post('/api/naps')
          .send(nap)
          .expect(200)
          .end(function (napSaveErr, napSaveRes) {
            // Handle Nap save error
            if (napSaveErr) {
              return done(napSaveErr);
            }

            // Update Nap name
            nap.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Nap
            agent.put('/api/naps/' + napSaveRes.body._id)
              .send(nap)
              .expect(200)
              .end(function (napUpdateErr, napUpdateRes) {
                // Handle Nap update error
                if (napUpdateErr) {
                  return done(napUpdateErr);
                }

                // Set assertions
                (napUpdateRes.body._id).should.equal(napSaveRes.body._id);
                (napUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Naps if not signed in', function (done) {
    // Create new Nap model instance
    var napObj = new Nap(nap);

    // Save the nap
    napObj.save(function () {
      // Request Naps
      request(app).get('/api/naps')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Nap if not signed in', function (done) {
    // Create new Nap model instance
    var napObj = new Nap(nap);

    // Save the Nap
    napObj.save(function () {
      request(app).get('/api/naps/' + napObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', nap.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Nap with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/naps/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Nap is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Nap which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Nap
    request(app).get('/api/naps/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Nap with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Nap if signed in', function (done) {
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

        // Save a new Nap
        agent.post('/api/naps')
          .send(nap)
          .expect(200)
          .end(function (napSaveErr, napSaveRes) {
            // Handle Nap save error
            if (napSaveErr) {
              return done(napSaveErr);
            }

            // Delete an existing Nap
            agent.delete('/api/naps/' + napSaveRes.body._id)
              .send(nap)
              .expect(200)
              .end(function (napDeleteErr, napDeleteRes) {
                // Handle nap error error
                if (napDeleteErr) {
                  return done(napDeleteErr);
                }

                // Set assertions
                (napDeleteRes.body._id).should.equal(napSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Nap if not signed in', function (done) {
    // Set Nap user
    nap.user = user;

    // Create new Nap model instance
    var napObj = new Nap(nap);

    // Save the Nap
    napObj.save(function () {
      // Try deleting Nap
      request(app).delete('/api/naps/' + napObj._id)
        .expect(403)
        .end(function (napDeleteErr, napDeleteRes) {
          // Set message assertion
          (napDeleteRes.body.message).should.match('User is not authorized');

          // Handle Nap error error
          done(napDeleteErr);
        });

    });
  });

  it('should be able to get a single Nap that has an orphaned user reference', function (done) {
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

          // Save a new Nap
          agent.post('/api/naps')
            .send(nap)
            .expect(200)
            .end(function (napSaveErr, napSaveRes) {
              // Handle Nap save error
              if (napSaveErr) {
                return done(napSaveErr);
              }

              // Set assertions on new Nap
              (napSaveRes.body.name).should.equal(nap.name);
              should.exist(napSaveRes.body.user);
              should.equal(napSaveRes.body.user._id, orphanId);

              // force the Nap to have an orphaned user reference
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

                    // Get the Nap
                    agent.get('/api/naps/' + napSaveRes.body._id)
                      .expect(200)
                      .end(function (napInfoErr, napInfoRes) {
                        // Handle Nap error
                        if (napInfoErr) {
                          return done(napInfoErr);
                        }

                        // Set assertions
                        (napInfoRes.body._id).should.equal(napSaveRes.body._id);
                        (napInfoRes.body.name).should.equal(nap.name);
                        should.equal(napInfoRes.body.user, undefined);

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
      Nap.remove().exec(done);
    });
  });
});
