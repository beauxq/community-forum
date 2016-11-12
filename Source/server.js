/**
 * NodeJS server
 */

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

var application = express();

application.use(cors());
application.use(bodyParser.json());
application.use(bodyParser.urlencoded({ extended: true }));

application.post("/newpost", function (req, res) {
    var post = req.body;

    console.log("newpost: " + post);

    res.write("success");
    res.end();
});

/**
 *  post object with "id" attribute
 */
application.post("/getpost", function (req, res) {
    var id = req.body.id;

    if (id == undefined) {
        res.status(StatusEnum.BAD_REQUEST);
        res.write("id required");
        res.end();
        return;
    }

    console.log("getpost id: " + id);

    res.write( JSON.stringify({'text': "Hi"}) );
    res.end();
});

application.use(express.static("public"));

var server = application.listen(PORT, function() {
    console.log("server listening at http://localhost:%s", PORT);
});
