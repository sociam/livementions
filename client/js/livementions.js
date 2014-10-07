angular.module('ng-livementions', ['btford.socket-io']) 
    .controller('main', function($scope, $rootScope) { 
        //console.log("ng-livementions main");
    }).run(function() {
        //console.log("ng-livementions run");
    }).factory('mysocket', function (socketFactory) {
        var myIoSocket = io.connect('http://localhost:3000/');
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

                d3.select($element[0]).call(function(div) {

                  div.append("div")
                      .attr("class", "axis")
                      .call(context.axis().orient("top"));

                  div.selectAll(".horizon")
                      .data(examples)
                    .enter().append("div")
                      .attr("class", "horizon")
                      .call(context.horizon()
                            .extent([-50, 50])
                            .height(50)
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
                    counts[data.alexaitem.Alexa_URL]++;
                });
            }
        };
    });
