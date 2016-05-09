var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var users = [];


io.on('connection', function(socket) {

    socket.on('user joined', function(new_user){
            socket.user = new_user;
            users.push({name: socket.user, id: socket.id});
            console.log("User array after push: ", users)
            updateUsers();
        });

    // Update Users 
    function updateUsers(){
        io.emit('users', users);
    }

    //identify user
    function idUser(){

    };

    socket.on('chat message', function(msg) {
        var userAtIndex = users.findIndex(function(el) {
            return el.id === socket.id
        });
        var user = users[userAtIndex].name;
        var data = {msg: msg, user: user}
        io.emit('chat message', data);
    });

        socket.on('disconnect', function(state) {
        var indexToDisconnect = users.findIndex(function(el) {
            return el.id === socket.id;
        });
        users.splice(indexToDisconnect,1);
        updateUsers();

    });

    socket.on('typing', data => {
        var userAtIndex = users.findIndex(function(el) {
            return el.id === socket.id
        });
        var user = users[userAtIndex].name;
        users[userAtIndex].typing = true

        var data = {users: users}
        console.log("DATA (typing): ", data)
        io.emit('typing', data);

    })

        socket.on('stop typing', data => {
        var userAtIndex = users.findIndex(function(el) {
            return el.id === socket.id
        });
        var user = users[userAtIndex].name;
        users[userAtIndex].typing =  false

        var data = {users: users}
        console.log("DATA (Stop typing): ", data)
        io.emit('stop typing', data);

    })

});


app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index', { users: users });
});

server.listen(3000, function() {
    console.log('listening on localhost:3000');
});



