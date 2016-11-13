/**
 * JavaScript for index.html
 */

var NEW_POST_URL = "/newpost";
var GET_POST_URL = "/getpost";
var REPLY_URL = "/reply";
var SEARCH_URL = "/search";

var SUMMARY_LENGTH = 30;

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

app.factory("postList", function($http) {
    // dummy data
    var _list = [
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
        },
        {
            "_id": "58288d93172c2817700ca174",
            "title": "A post that someone can reply to",
            "body": "here is my body, and here is my spout\ntip me over, and call me a cow",
            "author": "johndoe",
            "date": 1479052690823,
            "replies": [
                {
                    "body": "reply body text blah blah",
                    "author": "johndoe",
                    "date": 1479053159241
                },
                {
                    "body": "now I can reply with ANY text!!!!1!",
                    "author": "johndoe",
                    "date": 1479053866964
                }
            ]
        }
    ];

    var _searchParameters = "";  // empty string returns all posts
    var _page = 1;

    var stopIndex;
    var _putSummariesInList = function() {
        angular.forEach(_list, function(post) {
            stopIndex = post.body.indexOf('\n');
            if (stopIndex > SUMMARY_LENGTH) {
                stopIndex = SUMMARY_LENGTH;
            }
            post.summary = post.body.substr(0, stopIndex) + "...";
        });
    };

    return {
        setPage: function(n) {
            _page = n;
        },
        setSearchParameters: function(p) {
            _searchParameters = p;
        },
        refresh: function(callback) {
            // TODO: get list from server
            var data = {
                page: _page,
                searchParameters: _searchParameters
            };

            $http.post(SEARCH_URL, data).then(function(response) {
                _list = response.data.results;
                _putSummariesInList();
                callback(_list);
            });
            /*
            _putSummariesInList();
            callback(_list);
            */
        }
    };
});

app.controller("newPostCtrl", function($scope, $http) {
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

app.controller("viewPostCtrl", function($scope, $http, dateUtil) {
    $scope.getDateString = dateUtil.getDateString;
    $scope.getTimeString = dateUtil.getTimeString;

    $scope.$on('openViewPost', function(event, post) {
        console.log("heard openViewPost event, post:");
        console.log(post);
        // $scope.currentPost = currentPost.get();
        $scope.currentPost = post;
    });

    $scope.postReplyClick = function() {
        console.log("post reply click");
        if (! $scope.newReply) {
            console.log("blank reply body");
            return;
        }

        var dataForPost = {
            id: $scope.currentPost._id,
            reply: { body: $scope.newReply }
        };

        // erase form field
        $scope.newReply = "";

        // call api to post reply
        $http.post(REPLY_URL, dataForPost).then(function(response) {
            console.log("reply post response:");
            console.log(response);

            // reload list of replies from server
            $http.post(GET_POST_URL, dataForPost).then(function(response) {
                console.log("get response:");
                console.log(response);
                $scope.currentPost = response.data;
            });
        });
    };
});

app.controller("forumCtrl", function($scope, $rootScope, dateUtil, postList) {
    $scope.getDateString = dateUtil.getDateString;
    $scope.getTimeString = dateUtil.getTimeString;

    var search = function(page, searchParameters) {
        postList.setPage(page);
        postList.setSearchParameters(searchParameters);

        postList.refresh(function(receivedList) {
            $scope.visiblePosts = receivedList;
        });
    };
    // when page is loaded, list page 1 of all posts
    search(1, "");

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
        console.log("search clicked: " + $scope.searchInput);

        if (! $scope.searchInput) {
            $scope.searchInput = "";
            console.log("empty search string - searching all posts");
        }

        search(1, $scope.searchInput);
    };
});
