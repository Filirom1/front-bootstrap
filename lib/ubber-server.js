var Path = require('path');
var connect = require('connect');
var jst = require('universal-jst');
var domain = require('domain');
var fs = require('fs');
var _ = require('underscore');

  env = process.env.NODE_ENV || 'dev';

module.exports = {
  start: function(options, callback){
    if(typeof options === 'function'){
      callback = options;
      options = null;
    }
    options = options || {};

    var path = Path.resolve(__dirname, '..', 'public');

    var server = connect();
    server.use(connect.favicon());

    if(env === 'dev'){
      var watch = require("chokidar").watch;

      if(options.verbose) console.log('Compile templates from ', Path.resolve(path, 'templates'), 'to', Path.resolve(path, 'js/templates.js'));

      if(options.verbose) console.log('Static files served in ', path);
      server.use(connect.static(path));

      if(options.verbose) console.log('Push State Enabled in ', path);
      server.use(pushState(path));

      var watcher = watch(path);
      watcher.on('all', _.throttle(compileTemplates.bind(this, path), 500));
      watcher.on('error', console.error.bind(console));
      callback(server);
    }else{
      var buildScript = require('no-build-conf'),
        rimraf = require('rimraf'),
        spaseoCrawler = require('spaseo/lib/crawler'),
        spaseoFile = require('spaseo/lib/file'),
        buildPath = Path.resolve(__dirname, '..', 'build'),
        buildPath2 = Path.resolve(__dirname, '..', 'build2');

      var processors = [
        require('no-build-conf/lib/processors/file/less'),
        require('no-build-conf/lib/processors/file/optipng'),
        require('no-build-conf/lib/processors/dom/script'),
        require('no-build-conf/lib/processors/dom/link'),
        require('no-build-conf/lib/processors/dom/css-b64-images'),
        require('no-build-conf/lib/processors/dom/exclude')
      ];


      if(options.verbose) console.log('compile templates');
      compileTemplates(path, function(){
        if(options.verbose) console.log('rm', buildPath);
        rimraf(buildPath, function(err){
          if(err) return callback(err);
          if(options.verbose) console.log('mkdir', buildPath);
          fs.mkdir(buildPath, function(err){
            if(err) return callback(err);
            if(options.verbose) console.log('optimize', path, 'into', buildPath);
            buildScript(path, buildPath, processors, function(err){
              if(err) return callback(err);
              options.debug = true;
              var serverDomain = domain.create();
              serverDomain.on('error', console.error.bind(console));
              serverDomain.run(function() {
                spaseoCrawler(buildPath, options, function(e, data){
                  if(e) return console.error(e);
                  spaseoFile(buildPath, buildPath2, data, function(e){
                    if(e) return console.error(e);
                    server.use(connect.static(buildPath2));

                    if(options.verbose) console.log('Push State Enabled in ', buildPath);
                    server.use(pushState(buildPath));
                    callback(server);
                  });
                });
              });
            });
          });
        });
      });
    }

  }
};

function compileTemplates(path, cb){
  jst.hbs(Path.resolve(path, 'templates'), {verbose: true}, function(err, compiledTemplates){
    if(err) return console.error(err);
    fs.writeFile(Path.resolve(path, 'js/templates.js'), compiledTemplates.join('\n'),'utf-8', cb);
  });
}

function pushState(path){
  return function(req, res) {
    fs.createReadStream( Path.resolve(path, 'index.html')).pipe(res);
  };
}

