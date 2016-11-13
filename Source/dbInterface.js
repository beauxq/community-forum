/**
 *  this module can be replaced with an interface to any database
 *
 *  just implement all the functions attached to "exports"
 */

var DATABASE_URL = "mongodb://beauxq:beauxq@ds051873.mlab.com:51873/tut8test";
var COLLECTION = "hackathon";

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

// callback takes boolean parameter = successful post
exports.newPost = function(post, callback) {
    MongoClient.connect(DATABASE_URL, function (err, db) {
        if (err) {
            console.log("error connecting to database for new post: ");
            console.log(err);
            callback(false);
            return;
        }

        db.collection(COLLECTION).insertOne(post, function (err) {
            if (err) {
                console.log("error inserting post:");
                console.log(err);
                callback(false);
                return;
            }

            console.log("successful insert");
            callback(true);
        })
    });
};

// callback takes the post as a parameter
exports.getPost = function (id, callback) {
    MongoClient.connect(DATABASE_URL, function(err, db) {
        if (err) {
            console.log("error connecting to database:");
            console.log(err);
            callback({});
        }

        db.collection(COLLECTION).findOne({ "_id": ObjectID(id) }, function(err, document) {
            if (err) {
                console.log("error in findOne:");
                console.log(err);
                callback({});
            }

            console.log("getPost got this post from database:");
            console.log(document);
            callback(document);
        });
    });
};

// callback has boolean parameter for success
exports.replyToPost = function(id, reply, callback) {
    exports.getPost(id, function(postToReplyTo) {
        if (! postToReplyTo.hasOwnProperty("replies")) {
            console.log("error: didn't get post with reply list");
            console.log(postToReplyTo);
            callback(false);
            return;
        }

        postToReplyTo.replies.push(reply);
        exports.updatePost(postToReplyTo, function(success) {
            callback(success);
        });
    });
};

// callback has boolean parameter for success
exports.updatePost = function (post, callback) {
    MongoClient.connect(DATABASE_URL, function (err, db) {
        if (err) {
            console.log("error connecting to database for post update:");
            console.log(err);
            callback(false);
            return;
        }

        console.log("before calling updateOne");
        console.log(post);
        console.log(typeof post._id);

        var id = post._id;
        delete post._id;

        db.collection(COLLECTION).updateOne({_id: id}, post, function (err) {
            if (err) {
                console.log("error updating post:");
                console.log(err);
                callback(false);
                return;
            }

            console.log("successful post update");
            callback(true);
        })
    });
};
