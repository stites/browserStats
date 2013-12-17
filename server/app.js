
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , request = require('request')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// app.get('/', routes.index);
// app.get('/users', user.list);

app.get('/', function () {
  console.log('received get request')
});
app.post('/', function(req, res) {
  // var url = path.
  request(req.body.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var bodySlice = body.split(/<script>[\w\W]+<\/script>/).join('');
      var text = bodySlice.replace(/<[^>]*>/g, "");
      console.log(text);
    }
  })
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
