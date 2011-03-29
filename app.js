
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

var auth = {};
auth.clientID = 'b2a663373fc24811ab2f4a59b40484b6';
auth.secret = '94f21ac62f3e434fbf682ab7063aae59';

var instagram = require('instagram').createClient(auth.clientID, auth.secret);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
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

// Routes

app.get('/', function(req, res){

    instagram.media.popular(function (images, error) {
        var imgs = [];
        for (var i=0; i < images.length; i++) {
            var gram = images[i];
            imgs.push({ "url": gram.images.thumbnail.url, 
                        "user": gram.user,
                        "id": gram.id });
        };        
        res.render('index', {
          title: 'Instagrabbed',
          images: imgs 
        });

    });

});


app.get('/picture/:id', function(req, res){
    instagram.media.id(req.params.id, function (image, error) {
        res.render('picture', {
           title:  image.caption.text,
           url: image.images.standard_resolution.url,
           user: image.user.username,
           link: image.link,
           comments: image.comments.data
         });
    }); 
});


app.get('/user/:user', function(req, res){   
    instagram.query.get('/v1/media/popular', function(images, error){
        console.log('images:', images);
    });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
