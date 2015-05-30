var livereload = require('livereload');
var server = livereload.createServer({exts: ['js','jade','css']});
console.log(__dirname);
server.watch(__dirname);