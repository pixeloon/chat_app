$(function() {
    console.log("Sanity check")
    var socket = io(); // initiate handshake
    var $message = $("#message");
    var $chat = $('#chat');
    var $user = $("#user");
    var $users = $('#users');

    $("#userForm").on('submit', e => {
        e.preventDefault();
        var user = $user.val();
        $("#namesWrapper").hide();
        $("#mainWrapper").show();
        socket.emit('user joined', user);
        $user.val("");
    });

    socket.on('users', users => {
        $users.empty();
        users.forEach(user => {
            $users.append(user.name + "<br>");
        });
    });

    $("#messageForm").on('submit', e => {
        e.preventDefault();
        var msg = $message.val();

        socket.emit('chat message', msg);
        $message.val("");
    });

    socket.on('chat message', data => {
        $chat.append(data.user + ": " + data.msg + '<br>');

    });




});
