
/**
 * Module dependencies.
 */

 var headers = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
   "Access-Control-Allow-Headers": "Content-Type, Accept, X-Parse-Application-Id, X-Parse-REST-API-Key",
   "Access-Control-Max-Age": 10,
   'Content-Type': "text/plain"
 };

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , request = require('request')
  , path = require('path')
  , urlUtil = require('url');

// clean urls:
var sanitizer = require("sanitizer");

function stripHTML(html) {
    var clean = sanitizer.sanitize(html, function (str) {
        return str;
    });
    clean = clean.replace(/<(?:.|\n)*?>/gm, "");
    clean = clean.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/ig, "\n");

    return clean.trim();
}

// THIS IS NOT WORKING RBEWKALJSAFKJL:!!!!
// function getKeywords(html) {
//     var meta = html.match(/<meta[\s]+name=['"]keywords['"][\s\S]*content=['"]([\s\S]*)['"]>[\s\S]+/m);
//     console.log('take1');
//     if( (meta) && (meta.length>1) ){
//       meta = sanitizer.sanitize(meta[1], function (str) {return str;});
//       console.log('sent1!');
//       return meta.trim();
//     } else {
//       meta = html.match(/<meta[\s]+name=['"]description['"][\s\S]*content=['"]([\s\S]*)['"]>([\s\S]+)$/m);
//       console.log('take2');
//       if( (meta) && (meta.length>1) ){
//         console.log(meta[1]);
//         meta = sanitizer.sanitize(meta[1], function (str) {return str;});
//         return meta.trim();
//       }
//     }
// }

var natural = require('natural'),
  tokenizer = new natural.WordTokenizer();

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

app.post('/', function(req, res) {
  // fix url operators
  var url = urlUtil.parse(req.body.url).href;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var text = stripHTML(body);
      // var keywords = getKeywords(body);
      natural.LancasterStemmer.attach();
      var tokens = text.tokenizeAndStem();
      var freq = {}, importantWord = '', importantFreq = 0;

      for (var i = 0; i < tokens.length; i++) {
        if (/[\d]+/.test(tokens[i]) || tokens[i]==='undefined' || tokens[i]==='nbsp' || tokens[i].length > 40) break;
        freq[tokens[i]] = freq[tokens[i]] || 0;
        freq[tokens[i]]++;
      };

      for (var i = 0; i < tokens.length; i++) {
        if (freq[tokens[i]] > importantFreq){
          importantWord = tokens[i];
          importantFreq = freq[tokens[i]];
        }
      };
      res.writeHead(200, headers);
      res.end(importantWord);
    }
  })
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
