$(function() {
    console.log("Sanity check")
    var socket = io(); // initiate handshake
    var $window = $(window);
    var $message = $("#message");
    var $chat = $('#chat');
    var $user = $("#user");
    var $users = $('#users');
    var $currentInput = $user.focus();
    var typing = false;
    var currentUsers;

    $window.keypress(function getChar(event) {
        if ($currentInput !== $user.focus()) {
            if (event.which === 13) {
                typing = false
                console.log("is this happening?")
                socket.emit('stop typing')
                return null // special key
            } else if (event.which != 0 && event.charCode != 0) {
                typing = true;
                console.log(String.fromCharCode(event.which));
                socket.emit('typing')
                return String.fromCharCode(event.which) // the rest
            } else {
                typing = false
                socket.emit('stop typing')
                return null // special key
            }
        }
    });

    $("#userForm").on('submit', e => {
        e.preventDefault();
        var user = $user.val();
        $("#namesWrapper").hide();
        $("#mainWrapper").show();
        socket.emit('user joined', user);
        $user.val("");
        $currentInput = $message.focus();
    });

    socket.on('users', users => {
        currentUsers = users;
        console.log("USERS: ", currentUsers)
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
        $chat.prepend(data.user + ": <div class='triangle-border left'>" + data.msg + '</div>');

    });

    socket.on('typing', data => {
        console.log("USERS at typing :", data.users)
        currentUsers = data.users;
        checkTyping()
    })

    socket.on('stop typing', data => {
        currentUsers = data.users;
        checkTyping()
    })


    function checkTyping() {
        $users.empty();
        console.log("Users in checkTyping.. ", currentUsers)
        currentUsers.forEach(user => {
            if (user.typing) {
                $users.append(user.name + " ... <br>");
            } else {
                $users.append(user.name + "<br>");
            }
        });
    }


    function updateTyping(data) {
        if (!typing) {
            typing = true;
            socket.emit('typing')
        } else {
            typing = false;
            socket.emit('stop typing')
        }
    }






});
