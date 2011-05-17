
/**
 * Module dependencies.
 */

var express  = require('express');
var util     = require('util');

var app   = module.exports = express.createServer();
var Paste = require('./models/paste').Paste;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// ROUTES

/// Index pastes
app.get('/pastes', function (req, res) {
  Paste.findLastFive.run(function (err, pastes) {
    if(err) throw err.message;
    res.render('pastes/index', {title: 'Pastes', pastes: pastes});
  });
})

/// Show paste
app.get('/pastes/:code', function (req, res) {
  Paste.findOne({ code: req.params.code}, function (err, paste) {
    if(paste) {
      res.render('pastes/show', {paste: paste, title: "Show paste"});
    }
    else {
      res.render('404', {title: "404"});
    }
  });
})

/// New paste
app.get('/', function(req, res){
  var paste = new Paste();
  res.render('index', {title: "New Paste", paste: paste});
});

/// Edit paste
app.get('/pastes/:code/edit', function (req, res) {
  Paste.findOne({ code: req.params.code }, function (err, paste) {
    if(paste) {
      res.render('pastes/edit', {paste: paste, title: "Edit paste"});
    }
    else {
      res.render('404', {title: "404"});
    }
  });
})

/// Create paste
app.post('/pastes', function(req, res){
  var paste = new Paste();
  paste.body = req.body.body;
  paste.save(function (err) {
    if(err) {
      // throw err
      console.log(err.message);
      res.redirect('/');
    }
    else {
      console.log('saved');
      res.redirect('/pastes/'+ paste.code);
    }
  })
});

// FIXME: Use mongoose update
/// Upadate paste 
app.put('/pastes/:code', function (req,res) {
  Paste.findOne({ code: req.params.code}, function (err, paste) {
    if(paste) {
      paste.body = req.body.body;
      paste.save(function (err) {
        if(err) res.render('pastes/'+ paste.code +'/edit', {paste: paste, title: "Edit paste"});
        else res.redirect('pastes/'+ paste.code);
      })
    }
    else {
      res.render('404', {title: "404"});
    }
  });
})
// Only listen on $ node app.js

if (!module.parent) {
  app.listen(4000); // nodester port => 9509
  console.log("Express server listening on port %d", app.address().port);
}
