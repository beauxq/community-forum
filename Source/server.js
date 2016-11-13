/**
 * NodeJS server
 */

var NEW_POST_URL = "/newpost";
var GET_POST_URL = "/getpost";
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

application.post(NEW_POST_URL, function (req, res) {
    var post = req.body;
    // TODO: check validity of this data

    authentication.getCurrentUser(function (user) {
        post.author = user.username;
        var now = new Date();
        post.date = now.getTime();

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

application.use(express.static("public"));

var server = application.listen(PORT, function() {
    console.log("server listening at http://localhost:%s", PORT);
});
