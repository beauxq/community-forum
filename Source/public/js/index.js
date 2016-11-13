/**
 * JavaScript for index.html
 */

var NEW_POST_URL = "/newpost";
var GET_POST_URL = "/getpost";

var app = angular.module("forums", []);

app.directive('enterPress', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.enterPress);
                });

                event.preventDefault();
            }
        });
    };
});

/**
 *  inserts into http request headers
 */
app.run(function ($http) {
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.post['dataType'] = 'json';
});

app.factory("dateUtil", function() {
    return {
        getDateString: function(date) {
            if ((typeof date) != Date) {
                date = new Date(date);
            }

            // return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            return date.toDateString();
        },
        getTimeString: function (date) {
            if ((typeof date) != Date) {
                date = new Date(date);
            }

            var pm = false;
            var hour = date.getHours();
            if (hour > 11) {
                pm = true;
                if (hour > 12) {
                    hour -= 12;
                }
            }
            if (hour == 0) {
                hour = 12;
            }

            var minute = date.getMinutes();
            if (minute < 10) {
                minute = "0" + minute;
            }

            var toReturn = hour + ":" + minute + " ";
            if (pm) {
                toReturn += "PM";
            } else {
                toReturn += "AM"
            }

            return toReturn;
        }
    };
});

// unused - used before, might decide to use it later
app.factory("currentPost", function() {
    var _currentPost;

    return {
        get: function() {
            console.log("getting");
            console.log(_currentPost);
            return _currentPost;
        },
        set: function(post) {
            _currentPost = post;
            console.log("setting");
            console.log(_currentPost);
        }
    };
});

app.controller("newPostCtrl", function ($scope, $http) {
    $scope.newPostClick = function () {
        console.log("new post click");
        console.log($scope.newPostTitle);
        console.log($scope.newPostBody);

        if ((! $scope.newPostTitle) || (! $scope.newPostBody)) {
            console.log("empty title or body");
            return;
        }

        var post = {
            title: $scope.newPostTitle,
            body: $scope.newPostBody
        };

        // erase form fields
        $scope.newPostTitle = "";
        $scope.newPostBody = "";

        $http.post(NEW_POST_URL, post).then(function(response) {
            console.log("new post response: ");
            console.log(response);
        });
    }
});

app.controller("viewPostCtrl", function ($scope) {
    $scope.$on('openViewPost', function(event, post) {
        console.log("heard openViewPost event, post:");
        console.log(post);
        // $scope.currentPost = currentPost.get();
        $scope.currentPost = post;
    });

    $scope.postReplyClick = function() {
        console.log("post reply click");
        // TODO: make form and post reply
    };
});

app.controller("forumCtrl", function($scope, $rootScope, dateUtil) {
    $scope.getDateString = dateUtil.getDateString;
    $scope.getTimeString = dateUtil.getTimeString;

    // TODO: when this list is brought in, make a summary attribute with part of the body
    $scope.visiblePosts = [
        {
            _id: "5827b821d3c13226afdf7744",
            title: 'title here',
            body: 'body here\n\nand here',
            author: 'johndoe',
            date: 1478998049074
        },
        {
            _id: "42",
            title: 'Your Life',
            body: 'body here\n\nand here',
            author: 'johndoe',
            date: 1478998049074
        }
    ];

    $scope.newPostButtonClick = function() {
        $("#newPostModal").modal("show");
    };

    $scope.postClick = function(indexClicked) {
        console.log("post clicked at index: " + indexClicked);

        // currentPost.set($scope.visiblePosts[indexClicked]);
        $rootScope.$broadcast('openViewPost', $scope.visiblePosts[indexClicked]);
        $("#viewPostModal").modal("show");
    };

    $scope.searchClick = function() {
        console.log("search clicked");
        // TODO: search
    };
});
