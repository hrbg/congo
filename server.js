
/**
 * Module dependencies.
 */

var express  = require('express');
var util     = require('util');
var nowjs    = require('now');

var app      = module.exports = express.createServer();
var everyone = nowjs.initialize(app);

var Paste    = require('./models/paste').Paste;

//// helpers

function setPrivate(value) {
  return value == 'on' ? true : false;
}

////

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
// TODO: move this routes somewhere else

/// Index pastes
app.get('/pastes', function (req, res) {
  Paste.findLastFive.run(function (err, pastes) {
    if(err) throw err.message;
    res.render('pastes/index', {title: 'Pastes', pastes: pastes});
  });
})

/// Show paste
app.get('/pastes/:code',  function (req, res) {
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
  res.render('pastes/new', {title: "New Paste", paste: paste});
});

/// Edit paste
app.get('/pastes/:code/edit', function (req, res) {
  Paste.findOne({ code: req.params.code }, function (err, paste) {
    if(paste) {
      res.render('pastes/edit', { paste: paste, title: "Edit paste" });
    }
    else {
      res.render('404', {title: "404"});
    }
  });
})

/// Create paste
app.post('/pastes', function(req, res){
  var paste = new Paste({ body: req.body.body, preview: req.body.body, private: setPrivate(req.body.private) });
  paste.save(function (err) {
    if(err) {
      console.log(err.message);
      res.redirect('/');
    }
    else {
      console.log('saved');
      path = paste.private ? '/pastes/private/'+ paste._id : '/pastes/'+ paste.code;
      everyone.now.prependPaste(paste);
      res.redirect(path);
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

// show private
app.get('/pastes/private/:id', function (req, res) {
  Paste.findOne({ _id: req.params.id}, function (err, paste) {
    if(paste) {
      res.render('pastes/show', {paste: paste, title: "Show pirvate paste"});
    }
    else {
      res.render('404', {title: "404"});
    }
  });
})

// Only listen on $ node app.js
var port = process.env.PORT || 3000

if (!module.parent) {
  app.listen(port); // nodester port => 9509
  console.log("Express server listening on port %d", app.address().port);
}
