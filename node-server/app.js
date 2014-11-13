var util = require('util'),
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


var amqp = require('amqp');
var config = require('./config');

var connection = amqp.createConnection(config.connection, {defaultExchangeName: config.exchange});

connection.on('error', function (e) {
    console.log("error:", e);
});

connection.on('ready', function () {
    connection.queue('livementions', function (q) {
        q.bind(config.exchange, '');
        q.subscribe(function (message, headers, deliveryInfo, messageObject) {
            var json = JSON.parse(message.data.toString());

            if (json.text) {
                var txt = json.text.toLowerCase();
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
                    console.log(foundword," in: ", json.text);
                    io.sockets.emit("data", {"data": json, "foundword": foundword, "alexaitem": sitelist[foundword]});
                }
            }

        });
    });
});





var server = require('http').Server();
var io = require('socket.io')(server);
io.on('connection', function(socket){

  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
});


var port = 3000;
console.log("Listening on port", port);
server.listen(port);

