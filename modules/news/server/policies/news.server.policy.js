'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke News Permissions
 */
exports.invokeRolesPolicies = function() {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/news',
            permissions: '*'
        }, {
            resources: '/api/news/:newsId',
            permissions: '*'
        }]
    }, {
        roles: ['leader'],
        allows: [{
            resources: '/api/news',
            permissions: ['get', 'post']
        }, {
            resources: '/api/news/:newsId',
            permissions: ['get']
        }]
    }, {
        roles: ['member'],
        allows: [{
            resources: '/api/news',
            permissions: ['get']
        }, {
            resources: '/api/news/:newsId',
            permissions: ['get']
        }]
    }]);
};

/**
 * Check If News Policy Allows
 */
exports.isAllowed = function(req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an News is being processed and the current user created it then allow any manipulation
    if (req.news && req.user && req.news.user && req.news.user.id === req.user.id) {
        return next();
    }

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
        if (err) {
            // An authorization error occurred
            return res.status(500).send('Unexpected authorization error');
        } else {
            if (isAllowed) {
                // Access granted! Invoke next middleware
                return next();
            } else {
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};
