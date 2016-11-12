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

        $http.post(NEW_POST_URL, post).then(function(response) {
            console.log("new post response: ");
            console.log(response);
        });
    }
});

app.controller("forumCtrl", function($scope) {
    $scope.message = "cool forumz dood";

    $scope.newPostButtonClick = function() {
        $("#newPostModal").modal("show");
    };
});
