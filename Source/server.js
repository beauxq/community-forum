/**
 * NodeJS server
 */

var NEW_POST_URL = "/newpost";
var GET_POST_URL = "/getpost";
var REPLY_URL = "/reply";
var SEARCH_URL = "/search";

var PORT = 9081;
var StatusEnum = Object.freeze({
    SUCCESS: 200,
    BAD_REQUEST: 400,
    CONFLICT: 409,
    SERVER_ERROR: 500
});

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

// custom modules
var databaseInterface = require("./dbInterface.js");
var authentication = require("./authentication.js");

var application = express();

application.use(cors());
application.use(bodyParser.json());
application.use(bodyParser.urlencoded({ extended: true }));

var convertDateToStr = function(date) {
    var toReturn = "";
    toReturn += date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + " " +
                date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();
    return toReturn;
};

/**
 *  object with "title" string and "body" string
 */
application.post(NEW_POST_URL, function (req, res) {
    var post = req.body;
    // TODO: check validity of this data

    authentication.getCurrentUser(function (user) {
        post.author = user.username;
        var now = new Date();
        post.date = now.getTime();
        post.replies = [];

        console.log("newpost:");
        console.log(post);

        databaseInterface.newPost(post, function (success) {
            if (success) {
                res.write("success");
                res.end();
            }
            else {
                res.status(StatusEnum.SERVER_ERROR);
                res.write("error creating new post");
                res.end();
            }
        });
    });
});

/**
 *  object with "id" string and "reply" object
 */
application.post(REPLY_URL, function (req, res) {
    var id = req.body.id;
    var reply = req.body.reply;
    // TODO: check validity of this data

    authentication.getCurrentUser(function (user) {
        reply.author = user.username;
        var now = new Date();
        reply.date = now.getTime();

        console.log("reply:");
        console.log(reply);

        databaseInterface.replyToPost(id, reply, function (success) {
            if (success) {
                res.write("reply success");
                res.end();
            }
            else {
                res.status(StatusEnum.SERVER_ERROR);
                res.write("error creating reply");
                res.end();
            }
        });
    });
});

/**
 *  post object with "id" attribute
 */
application.post(GET_POST_URL, function (req, res) {
    var id = req.body.id;

    if (id == undefined) {
        res.status(StatusEnum.BAD_REQUEST);
        res.write("id required");
        res.end();
        return;
    }

    console.log("getpost id: " + id);
    databaseInterface.getPost(id, function(result) {
        res.write(JSON.stringify(result));
        res.end();
    });
});

/**
 *  object with "page" number and "searchParameters" string
 */
application.post(SEARCH_URL, function(req, res) {
    var searchParameters = req.body.searchParameters;
    var page = req.body.page;
    // TODO: check validity of this data

    console.log("search: " + searchParameters);
    databaseInterface.search(page, searchParameters, function(result) {
        res.write(JSON.stringify(result));
        res.end();
    });
});

application.use(express.static("public"));

var server = application.listen(PORT, function() {
    console.log("server listening at http://localhost:%s", PORT);

    // testGetOne();
});

var testGetOne = function() {
    databaseInterface.getPost("5827b821d3c13226afdf7744", function(post) {
        console.log("test getPost:");
        console.log(post);
    });
};
