'use strict';

/**
 * Module dependencies
 */
var notesPolicy = require('../policies/notes.server.policy'),
  notes = require('../controllers/notes.server.controller');

module.exports = function(app) {
  // Notes Routes
  app.route('/api/notes').all(notesPolicy.isAllowed)
    .get(notes.list)
    .post(notes.create);

  app.route('/api/notes/:noteId').all(notesPolicy.isAllowed)
    .get(notes.read)
    .put(notes.update)
    .delete(notes.delete);

  // Finish by binding the Note middleware
  app.param('noteId', notes.noteByID);
};
