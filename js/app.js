var app = angular.module('chatApp', ['firebase']);


app.controller('mainController', function ($scope, $firebaseArray) {
    var me;
    $scope.currentConversation = "---";
    var groupUserIDs = [];

    //User ref
    var refUsers = firebase.database().ref().child('Users');
    $scope.users = $firebaseArray(refUsers);
    //Conversation ref
    var refConversations = firebase.database().ref().child('Conversations');
    $scope.conversations = $firebaseArray(refConversations);
    //Messages ref
    var refMessages = firebase.database().ref().child('Messages');
    $scope.messages = $firebaseArray(refMessages);

    $scope.createConversation = function (selectedUserID, userName) {
        var isConversationExist = false;
        $scope.conversations.forEach(function (a) {
            console.log(JSON.stringify(a.userids));
            console.log(JSON.stringify(b));
            var b = [me.$id, selectedUserID];
            var c = [selectedUserID, me.$id];
            if (JSON.stringify(a.userids) === JSON.stringify(b) || JSON.stringify(a.userids) === JSON.stringify(c)) {
                console.log('buldum');
                isConversationExist = true;
                console.log("var");
                $scope.currentConversation = a.$id;
            }
        });
        if (isConversationExist == false) {
            console.log("yok");
            $scope.conversations.$add({
                userids: [
                    selectedUserID, me.$id
                ]
            }).then(function (p) {
                $scope.currentConversation = p['path']['o'][1];
            });
        }

        $scope.reciever = userName;
    }

    $scope.sendMessage = function () {
        $scope.messages.$add({
            conversationID: $scope.currentConversation,
            body: $scope.me.username + " : " + $scope.messageText,
            date: Date.now(),
            sender: $scope.me.$id
        });

        $scope.messageText = "";
    }

    var groupUserNames = [];
    $scope.pickGroupUsers = function (id, username) {
        if (groupUserIDs.indexOf(id) != -1) {
            console.log(groupUserIDs.indexOf(id));
        }
        else {
            groupUserIDs.push(id);
            groupUserNames.push(username);
        }
        console.log(groupUserIDs);
    }

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


    $scope.startGroupChat = function () {

        groupUserIDs.push($scope.me.$id);
        
        var allusersName = "";
        groupUserNames.forEach(function (username) {
            allusersName += username + " - ";
        });
        allusersName += $scope.me.username;

        $scope.conversations.$add({
            userids: groupUserIDs,
            isGroup: true,
            usernames: allusersName
        }).then(function (p) {
            $scope.reciever = allusersName;
            $scope.currentConversation = p['path']['o'][1];
        });
    }

    $scope.openGroupChat = function(groupID){
        $scope.conversations.forEach(function(group){
            if(group.$id == groupID){
                $scope.reciever = group.usernames;
                $scope.currentConversation = groupID;
                return;
            }
        });
    }
    // Register and control
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
