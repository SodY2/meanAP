'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rule = mongoose.model('Rule'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  rule;

/**
 * Rule routes tests
 */
describe('Rule CRUD tests', function () {

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

    // Save a user to the test db and create new Rule
    user.save(function () {
      rule = {
        name: 'Rule name'
      };

      done();
    });
  });

  it('should be able to save a Rule if logged in', function (done) {
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

        // Save a new Rule
        agent.post('/api/rules')
          .send(rule)
          .expect(200)
          .end(function (ruleSaveErr, ruleSaveRes) {
            // Handle Rule save error
            if (ruleSaveErr) {
              return done(ruleSaveErr);
            }

            // Get a list of Rules
            agent.get('/api/rules')
              .end(function (rulesGetErr, rulesGetRes) {
                // Handle Rules save error
                if (rulesGetErr) {
                  return done(rulesGetErr);
                }

                // Get Rules list
                var rules = rulesGetRes.body;

                // Set assertions
                (rules[0].user._id).should.equal(userId);
                (rules[0].name).should.match('Rule name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Rule if not logged in', function (done) {
    agent.post('/api/rules')
      .send(rule)
      .expect(403)
      .end(function (ruleSaveErr, ruleSaveRes) {
        // Call the assertion callback
        done(ruleSaveErr);
      });
  });

  it('should not be able to save an Rule if no name is provided', function (done) {
    // Invalidate name field
    rule.name = '';

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

        // Save a new Rule
        agent.post('/api/rules')
          .send(rule)
          .expect(400)
          .end(function (ruleSaveErr, ruleSaveRes) {
            // Set message assertion
            (ruleSaveRes.body.message).should.match('Please fill Rule name');

            // Handle Rule save error
            done(ruleSaveErr);
          });
      });
  });

  it('should be able to update an Rule if signed in', function (done) {
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

        // Save a new Rule
        agent.post('/api/rules')
          .send(rule)
          .expect(200)
          .end(function (ruleSaveErr, ruleSaveRes) {
            // Handle Rule save error
            if (ruleSaveErr) {
              return done(ruleSaveErr);
            }

            // Update Rule name
            rule.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Rule
            agent.put('/api/rules/' + ruleSaveRes.body._id)
              .send(rule)
              .expect(200)
              .end(function (ruleUpdateErr, ruleUpdateRes) {
                // Handle Rule update error
                if (ruleUpdateErr) {
                  return done(ruleUpdateErr);
                }

                // Set assertions
                (ruleUpdateRes.body._id).should.equal(ruleSaveRes.body._id);
                (ruleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Rules if not signed in', function (done) {
    // Create new Rule model instance
    var ruleObj = new Rule(rule);

    // Save the rule
    ruleObj.save(function () {
      // Request Rules
      request(app).get('/api/rules')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Rule if not signed in', function (done) {
    // Create new Rule model instance
    var ruleObj = new Rule(rule);

    // Save the Rule
    ruleObj.save(function () {
      request(app).get('/api/rules/' + ruleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', rule.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Rule with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/rules/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Rule is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Rule which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Rule
    request(app).get('/api/rules/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Rule with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Rule if signed in', function (done) {
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

        // Save a new Rule
        agent.post('/api/rules')
          .send(rule)
          .expect(200)
          .end(function (ruleSaveErr, ruleSaveRes) {
            // Handle Rule save error
            if (ruleSaveErr) {
              return done(ruleSaveErr);
            }

            // Delete an existing Rule
            agent.delete('/api/rules/' + ruleSaveRes.body._id)
              .send(rule)
              .expect(200)
              .end(function (ruleDeleteErr, ruleDeleteRes) {
                // Handle rule error error
                if (ruleDeleteErr) {
                  return done(ruleDeleteErr);
                }

                // Set assertions
                (ruleDeleteRes.body._id).should.equal(ruleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Rule if not signed in', function (done) {
    // Set Rule user
    rule.user = user;

    // Create new Rule model instance
    var ruleObj = new Rule(rule);

    // Save the Rule
    ruleObj.save(function () {
      // Try deleting Rule
      request(app).delete('/api/rules/' + ruleObj._id)
        .expect(403)
        .end(function (ruleDeleteErr, ruleDeleteRes) {
          // Set message assertion
          (ruleDeleteRes.body.message).should.match('User is not authorized');

          // Handle Rule error error
          done(ruleDeleteErr);
        });

    });
  });

  it('should be able to get a single Rule that has an orphaned user reference', function (done) {
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

          // Save a new Rule
          agent.post('/api/rules')
            .send(rule)
            .expect(200)
            .end(function (ruleSaveErr, ruleSaveRes) {
              // Handle Rule save error
              if (ruleSaveErr) {
                return done(ruleSaveErr);
              }

              // Set assertions on new Rule
              (ruleSaveRes.body.name).should.equal(rule.name);
              should.exist(ruleSaveRes.body.user);
              should.equal(ruleSaveRes.body.user._id, orphanId);

              // force the Rule to have an orphaned user reference
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

                    // Get the Rule
                    agent.get('/api/rules/' + ruleSaveRes.body._id)
                      .expect(200)
                      .end(function (ruleInfoErr, ruleInfoRes) {
                        // Handle Rule error
                        if (ruleInfoErr) {
                          return done(ruleInfoErr);
                        }

                        // Set assertions
                        (ruleInfoRes.body._id).should.equal(ruleSaveRes.body._id);
                        (ruleInfoRes.body.name).should.equal(rule.name);
                        should.equal(ruleInfoRes.body.user, undefined);

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
      Rule.remove().exec(done);
    });
  });
});
