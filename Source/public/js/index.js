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

app.controller("forumCtrl", function($scope) {
    $scope.message = "cool forumz dood";
});
