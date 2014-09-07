#!/usr/bin/env node
var crawler = require('./crawler');
var finput = __dirname + '/input';
var foutput = __dirname + '/output';
crawler.exec_command_raw('/usr/bin/node ' + finput, function(err, val){
    crawler.exec_command_raw('/usr/bin/node ' + foutput, function(err, val){
    });
});
