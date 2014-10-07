var util = require('util'),
    twitter = require('twitter'),
    alexa = require('./alexa');

var sitelist = {};
alexa.map(function (item) {
    if (item.Soc_Mac == "Y") {
        sitelist[item.Alexa_URL.toLowerCase()] = item;
        if (item.Names && item.Names.length > 0) {
            item.Names.split(",").forEach(function(name) { sitelist[name.toLowerCase()] = item; });
        }
    }
});

var twit = new twitter({
        consumer_key: 'TAiLy0AYu7LR0P6Xq1Eb9YosO',
        consumer_secret: 'h404KjmXnx1IqO0ohUXy4WqpUHSJfMnJfAUzGSxkSiyG73IuUJ',
        access_token_key: '2810403113-jjh8vYh8SC6irpNuwRURGKRJjrqisYIAhndzSh3',
        access_token_secret: 'lT6xkVFlUt9HIutjdZWMcGdhm6EERHzGkJ76rA84yyBpV'
});



var server = require('http').Server();
var io = require('socket.io')(server);
io.on('connection', function(socket){

  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
});

twit.login();
twit.stream('statuses/sample', function(stream) {
    stream.on('data', function(data) {
        if (data.text) {
            var txt = data.text.toLowerCase();
            var found = false;
            var foundword;
            Object.keys(sitelist).some(function (word) {
                if (txt.indexOf(word) !== -1) {
                    foundword = word;
                    found = true;
                }
                return found;
            });
            if (found) {
                console.log(foundword," in: ",data.text);
                io.sockets.emit("data", {"data": data, "foundword": foundword, "alexaitem": sitelist[foundword]});
            }
        }
//        console.log(util.inspect(data));
    });
});

var port = 3000;
console.log("Listening on port", port);
server.listen(port);

