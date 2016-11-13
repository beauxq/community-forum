/**
 *  this module can be replaced with an interface to any authentication system
 *
 *  just implement all the functions attached to "exports"
 */

// callback parameter is object with user attributes
exports.getCurrentUser = function(callback) {
    callback({
        username: "johndoe",
        firstName: "John",
        lastName: "Doe"
    });
};

exports.signOut = function() {
    // do nothing
};

// callback parameter is boolean whether the sign in is successful
exports.signIn = function(username, passwordHash, callback) {
    callback(true);
};

// TODO: sign in status listener
