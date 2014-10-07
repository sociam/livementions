angular.module('ng-livementions', ['btford.socket-io']) 
    .controller('main', function($scope, $rootScope) { 
        //console.log("ng-livementions main");
    }).run(function() {
        //console.log("ng-livementions run");
    }).factory('mysocket', function (socketFactory) {
        var myIoSocket = io.connect('https://public.indx.ecs.soton.ac.uk:443/');
        var socket = socketFactory({
            ioSocket: myIoSocket
        });
        //console.log("socket", socket);
        return socket;
    }).directive('livemention', function(mysocket) { 
        return {
            restrict:'E',
            replace:true,
            templateUrl: 'tmpl/livementions.html',
            controller:function($scope, $element) { 

                $scope.countries = {};
                $scope.tweets = [];

                var size = 960;

                var avalues = {};
                var counts = {};
                alexa.map(function (aitem) {
                    counts[aitem.Alexa_URL] = 0;
                    avalues[aitem.Alexa_URL] = [];
                    while (avalues[aitem.Alexa_URL].length < size) {
                        avalues[aitem.Alexa_URL].push(0);
                    }
                });

                function random(name) {
                  var value = 0,
                      values = [],
                      i = 0,
                      last;
                  return context.metric(function(start, stop, step, callback) {

                    
                    start = +start, stop = +stop;
                    if (isNaN(last)) last = start;

                    /*
                    while (last < stop) {
                      last += step;
                      value = Math.max(-10, Math.min(10, value + .8 * Math.random() - .4 + .2 * Math.cos(i += .2)));
                      values.push(value);
                    }

                    var dataslice = values.slice((start - stop) / step);
                    console.log("dataslice", dataslice);
                    callback(null, values = dataslice);
                    */
                    
                    avalues[name].shift();
                    avalues[name].push(counts[name]);

                    //console.log("counts", counts[name]);
                    //console.log("vals", avalues[name]);
                    callback(null, values = avalues[name].slice((start - stop) / step));
                  }, name);
                }

                var context = cubism.context()
                    .serverDelay(0)
                    .clientDelay(0)
                    .step(1e3)
                    .size(size);

                var examples = alexa.map(function (aitem) {
                    if (aitem.Soc_Mac == "Y"){
                        return random(aitem.Alexa_URL);
                    } else {
                        return false; // marks as false
                    }
                }).filter(function (a) { return a; }); // removes the falses

                d3.select(jQuery($element[0]).find(".visual")[0]).call(function(div) {

                  div.append("div")
                      .attr("class", "axis")
                      .call(context.axis().orient("top"));

                  var colors = [];
                  d3.scale.category20b().range().map(function(item) { colors.push(item); });
                  d3.scale.category20c().range().map(function(item) { colors.push(item); });

//                  var colors = ["#ffccff","#ff99ff","#ff66ff","#ff00ff","#ff0099","#cc0099","#990066","#660066","#666699","#ccccff","#9999ff","#9966ff","#9933ff","#9900cc","#663399","#660099","#330066","#9999cc","#99ccff","#66ccff","#3399ff","#3366ff","#0000ff","#0000cc","#000099","#000066","#cccc99","#ccffff","#99ffff","#00ffff","#00ccff","#0099ff","#0066ff","#0033ff","#003399","#cccccc","#99ffcc","#66ffcc","#66cccc","#00cccc","#009999","#006666","#336666","#003333","#ccffcc","#99ff99","#66ff66","#00ff00","#00cc00","#009900","#006600","#003300","#ffffcc","#ffff99","#ffff66","#ffff33","#ffff00","#ffcc00","#cc9900","#996633","#ffcc99","#ff9966","#ff6633","#ff6600","#ff3300","#cc3300","#993300","#663300","#ffcccc","#ff9999","#ff6666","#cc3333","#ff0000","#cc0000","#990000","#660000"];

                  div.selectAll(".horizon")
                      .data(examples)
                    .enter().append("div")
                      .attr("class", "horizon")
                      .call(context.horizon()
                            .extent([0, 200])
                            .height(50)
                            .colors(colors)
                        );

                  div.append("div")
                      .attr("class", "rule")
                      .call(context.rule());

                });


                // On mousemove, reposition the chart values to match the rule.
                /*
                context.on("focus", function(i) {
                  d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
                  d3.selectAll(".value").style("padding-left", "5px");
                });
                */

                // resolves on connection
                //console.log("mysocket", mysocket);
                mysocket.addListener("data", function (data) {
                    //console.log("data", data);
                    $scope.tweets.unshift(data.data);
                    counts[data.alexaitem.Alexa_URL]++;
                    try {
                        var country = data.data.lang;
                        if (!(country in $scope.countries)) {
                            $scope.countries[country] = {"id": country, "name": country, "checked": true, "count": 0};
                        }
                        $scope.countries[country]['count'] ++;
                    } catch (e) {
                        // in case country isn't in tweet (NBD)
                    }
                });
            }
        };
    });
