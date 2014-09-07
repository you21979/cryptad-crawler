var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

var createRequest = require('./create_request');
var LimitTable = require('./limit_table');

var debug = exports.debug = require('./debug');
var limitTable = exports.limitTable = new LimitTable();
exports.USER_AGENT = 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko';

var getUserAgent = function(){
    return exports.USER_AGENT;
}

var dispatch = function(opt, postdata, callback){
    var select = null;
    switch(opt.protocol){
    case "http:":
        opt.agent = false;
        select = createRequest.createHttpProtocol(opt, postdata);
        break;
    case "https:":
        opt.agent = false;
        select = createRequest.createHttpsProtocol(opt, postdata);
        break;
    }
    if(select){
        select(callback);
    }else{
        callback(new Error('unknown protocol:' + opt.protocol), null);
    }
}

var limit_request = function(urlstr, callback){
    var opt = url.parse(urlstr);
    opt.headers = {
        'User-Agent': getUserAgent(),
    };
    var check = limitTable.get(opt.hostname);
    debug.emit('limit_request', 'try', {url:urlstr});
    if(check.func()){
        debug.emit('limit_request', 'request', {url:urlstr});
        dispatch(opt, {}, function(err, val){
            debug.emit('limit_request', 'response', {url:urlstr});
            callback(err, val);
        });
    }else{
        debug.emit('limit_request', 'wait', {url:urlstr});
        setTimeout(function(){
            limit_request(urlstr, callback);
        }, check.time * 1000);
    }
}
var post_raw = exports.post_raw = function(urlstr, param, callback){
    var postdata = querystring.stringify(param);
    var opt = url.parse(urlstr);
    opt.method = 'POST';
    opt.headers = {
        'User-Agent': getUserAgent(),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postdata.length,
    };
    var check = limitTable.get(opt.hostname);
    debug.emit('limit_request', 'try', {url:urlstr});
    if(check.func()){
        debug.emit('limit_request', 'request', {url:urlstr});
        dispatch(opt, postdata, function(err, val){
            debug.emit('limit_request', 'response', {url:urlstr});
            callback(err, val);
        });
    }else{
        debug.emit('limit_request', 'wait', {url:urlstr});
        setTimeout(function(){
            limit_request(urlstr, callback);
        }, check.time * 1000);
    }
}

var request_get_raw = exports.request_get_raw = function(urlstr, callback){
    limit_request(urlstr, callback);
};
var request_get_json = exports.request_get_json = function(urlstr, callback){
    limit_request(urlstr, function(err, rawbody){
        if(err){
            debug.emit('request_get_json', 'request_error', {url:urlstr});
            return callback(err, rawbody);
        }
        var obj = null;
        try{
            obj = JSON.parse(rawbody.replace("\uFEFF", ""));
        }catch(e){
            debug.emit('request_get_json', 'json_error', {url:urlstr});
            err = e;
        }
        callback(err, obj);
    });
};
var readfile_raw = exports.readfile_raw = function(file, calllback){
    fs.readFile(file, calllback);
};
var readfile_json = exports.readfile_json = function(file, callback){
    fs.readFile(file, 'utf8', function(err, raw){
        if(err){
            return callback(err, raw);
        }
        var obj = null;
        try{
            obj = JSON.parse(raw.replace("\uFEFF", ""));
        }catch(e){
            err = e;
        }
        callback(err, obj);
    });
};

var child_process = require('child_process');
var exec_command_raw = exports.exec_command_raw = function(cmd, callback){
    child_process.exec(cmd, callback);
};
var exec_command_json = exports.exec_command_json = function(cmd, callback){
    child_process.exec(cmd, function(err, stdout, stderr){
        if(err){
            return callback(err, stdout);
        }
        var obj = null;
        try{
            obj = JSON.parse(stdout.replace("\uFEFF", ""));
        }catch(e){
            err = e;
        }
        callback(err, obj);
    });
};

var createRedis = exports.redis = require('./create_redis');
