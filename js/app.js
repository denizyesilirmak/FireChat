var app = angular.module('chatApp', ['firebase']);


app.controller('mainController', function ($scope, $firebaseArray) {
    var me;
    var refUsers = firebase.database().ref().child('Users');
    $scope.users = $firebaseArray(refUsers);

    // login
    $scope.isLogined = true;
    $scope.login = function (a) {
        var i = 0;
        $scope.users.forEach(function () {
            if ($scope.logUsername == $scope.users[i].username) {
                if ($scope.logPassword == $scope.users[i].password) {
                    $scope.isLogined = false;
                    $scope.regPanelShow = false;
                    $scope.me = $scope.users[i];
                    me = $scope.users[i];
                    console.log("login success: " + $scope.me.$id);
                }
                else {
                    $scope.isWrong = true;
                }
            }
            i++;
        }, this);
        $scope.regPanelShow = false;

    }

    // Register - and control
    $scope.isTaken = false;;
    $scope.regPanelShow = true;
    $scope.register = function () {

        var i = 0;
        var isExist = false;
        $scope.users.forEach(function () {
            if ($scope.regUsername == $scope.users[i].username) {
                isExist = true;
                console.log('o isim alındı gülüm');
                $scope.isTaken = true;
                return;
            }
            i++;
        }, this);

        if (isExist == false) {
            $scope.users.$add({
                username: $scope.regUsername,
                password: $scope.regPassword

            });
            console.log('basarili');
            $scope.regPanelShow = false;
        }
    };

});