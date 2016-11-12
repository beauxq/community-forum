/**
 * JavaScript for index.html
 */

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

app.controller("newPostCtrl", function ($scope) {
    $scope.newPostClick = function () {
        console.log("new post click");
    }
});

app.controller("forumCtrl", function($scope) {
    $scope.message = "cool forumz dood";

    $scope.newPostButtonClick = function() {
        $("#newPostModal").modal("show");
    };
});
