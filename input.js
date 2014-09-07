var crawler = require('./crawler');
var redis = require('redis');

var REDIS_KEY_BASE = 'cryptad.com|';
var URL_CMLIST = "https://cryptad.com/json/hot_cm.json";
var URL_POST_BASE = "https://cryptad.com/ign/cm/view";
var PATH_CONFIG = __dirname + '/config.json';
var log = console.error;

var read_config = function(callback){
    crawler.readfile_json(PATH_CONFIG, function(err, val){
        callback(err, val);
    });
}

var write = function(config, v){
    if(!(v.cryptocurrency_type in config.recv_address)){
        log('unknown address type %s', v.cryptocurrency_type);
        return;
    }
    var address = config.recv_address[v.cryptocurrency_type];
    var key = REDIS_KEY_BASE + v.cm_id;
    var url = URL_POST_BASE + '/' + v.cm_id + '/';
    var param = {
        cm_id : v.cm_id,
        bitcoin_address : address,
        mail : config.email_address,
    };
    var data = {
        url : url,
        param : param,
        register : false,
        created : new Date()/1000|0
    };
    var cl = redis.createClient();
    cl.hgetall(key, function(err, val){
        if(!val){
            log(v);
            Object.keys(data).forEach(function(name){
                cl.hset(key,name,JSON.stringify(data[name]));
            });
        }
        cl.quit();
    });
}

var input = function(config){
    crawler.request_get_json(URL_CMLIST, function(err, list){
        if(err){
            log('www err');
            return;
        }
        list.forEach(function(v){
            write(config, v);
        });
    });
}

var main = function(){
    read_config(function(err, config){
        if(err) return;
        input(config);
    });
}
main();

