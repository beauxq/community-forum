/**
 * NodeJS server
 */

var PORT = 9081;

var express = require("express");

var application = express();

application.use(express.static("public"));

var server = application.listen(PORT, function() {
    console.log("server listening at http://localhost:%s", PORT);
});
