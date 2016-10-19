'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Note = mongoose.model('Note'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  note;

/**
 * Note routes tests
 */
describe('Note CRUD tests', function () {

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

    // Save a user to the test db and create new Note
    user.save(function () {
      note = {
        name: 'Note name'
      };

      done();
    });
  });

  it('should be able to save a Note if logged in', function (done) {
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

        // Save a new Note
        agent.post('/api/notes')
          .send(note)
          .expect(200)
          .end(function (noteSaveErr, noteSaveRes) {
            // Handle Note save error
            if (noteSaveErr) {
              return done(noteSaveErr);
            }

            // Get a list of Notes
            agent.get('/api/notes')
              .end(function (notesGetErr, notesGetRes) {
                // Handle Notes save error
                if (notesGetErr) {
                  return done(notesGetErr);
                }

                // Get Notes list
                var notes = notesGetRes.body;

                // Set assertions
                (notes[0].user._id).should.equal(userId);
                (notes[0].name).should.match('Note name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Note if not logged in', function (done) {
    agent.post('/api/notes')
      .send(note)
      .expect(403)
      .end(function (noteSaveErr, noteSaveRes) {
        // Call the assertion callback
        done(noteSaveErr);
      });
  });

  it('should not be able to save an Note if no name is provided', function (done) {
    // Invalidate name field
    note.name = '';

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

        // Save a new Note
        agent.post('/api/notes')
          .send(note)
          .expect(400)
          .end(function (noteSaveErr, noteSaveRes) {
            // Set message assertion
            (noteSaveRes.body.message).should.match('Please fill Note name');

            // Handle Note save error
            done(noteSaveErr);
          });
      });
  });

  it('should be able to update an Note if signed in', function (done) {
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

        // Save a new Note
        agent.post('/api/notes')
          .send(note)
          .expect(200)
          .end(function (noteSaveErr, noteSaveRes) {
            // Handle Note save error
            if (noteSaveErr) {
              return done(noteSaveErr);
            }

            // Update Note name
            note.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Note
            agent.put('/api/notes/' + noteSaveRes.body._id)
              .send(note)
              .expect(200)
              .end(function (noteUpdateErr, noteUpdateRes) {
                // Handle Note update error
                if (noteUpdateErr) {
                  return done(noteUpdateErr);
                }

                // Set assertions
                (noteUpdateRes.body._id).should.equal(noteSaveRes.body._id);
                (noteUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Notes if not signed in', function (done) {
    // Create new Note model instance
    var noteObj = new Note(note);

    // Save the note
    noteObj.save(function () {
      // Request Notes
      request(app).get('/api/notes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Note if not signed in', function (done) {
    // Create new Note model instance
    var noteObj = new Note(note);

    // Save the Note
    noteObj.save(function () {
      request(app).get('/api/notes/' + noteObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', note.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Note with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/notes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Note is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Note which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Note
    request(app).get('/api/notes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Note with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Note if signed in', function (done) {
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

        // Save a new Note
        agent.post('/api/notes')
          .send(note)
          .expect(200)
          .end(function (noteSaveErr, noteSaveRes) {
            // Handle Note save error
            if (noteSaveErr) {
              return done(noteSaveErr);
            }

            // Delete an existing Note
            agent.delete('/api/notes/' + noteSaveRes.body._id)
              .send(note)
              .expect(200)
              .end(function (noteDeleteErr, noteDeleteRes) {
                // Handle note error error
                if (noteDeleteErr) {
                  return done(noteDeleteErr);
                }

                // Set assertions
                (noteDeleteRes.body._id).should.equal(noteSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Note if not signed in', function (done) {
    // Set Note user
    note.user = user;

    // Create new Note model instance
    var noteObj = new Note(note);

    // Save the Note
    noteObj.save(function () {
      // Try deleting Note
      request(app).delete('/api/notes/' + noteObj._id)
        .expect(403)
        .end(function (noteDeleteErr, noteDeleteRes) {
          // Set message assertion
          (noteDeleteRes.body.message).should.match('User is not authorized');

          // Handle Note error error
          done(noteDeleteErr);
        });

    });
  });

  it('should be able to get a single Note that has an orphaned user reference', function (done) {
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

          // Save a new Note
          agent.post('/api/notes')
            .send(note)
            .expect(200)
            .end(function (noteSaveErr, noteSaveRes) {
              // Handle Note save error
              if (noteSaveErr) {
                return done(noteSaveErr);
              }

              // Set assertions on new Note
              (noteSaveRes.body.name).should.equal(note.name);
              should.exist(noteSaveRes.body.user);
              should.equal(noteSaveRes.body.user._id, orphanId);

              // force the Note to have an orphaned user reference
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

                    // Get the Note
                    agent.get('/api/notes/' + noteSaveRes.body._id)
                      .expect(200)
                      .end(function (noteInfoErr, noteInfoRes) {
                        // Handle Note error
                        if (noteInfoErr) {
                          return done(noteInfoErr);
                        }

                        // Set assertions
                        (noteInfoRes.body._id).should.equal(noteSaveRes.body._id);
                        (noteInfoRes.body.name).should.equal(note.name);
                        should.equal(noteInfoRes.body.user, undefined);

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
      Note.remove().exec(done);
    });
  });
});
