var crawler = require('./crawler');
var redis = require('redis');

var REDIS_KEY_BASE = 'cryptad.com|';
var KEYMATCH = REDIS_KEY_BASE + '*';

var log = console.error;

var cl = redis.createClient();
cl.keys(KEYMATCH, function(err, list){
    if(err){
        log(err);
        cl.quit();
        return;
    }
    list.forEach(function(key){
        cl.hgetall(key, function(err, obj){
            if(err){
                log(err);
                return;
            }
            if(JSON.parse(obj.register)){
                log('registerd');
                return;
            }
            var url = JSON.parse(obj.url);
            var param = JSON.parse(obj.param);
            crawler.post_raw(url, param, function(err,raw){
                if(err){
                    log(err);
                    return;
                }
                var wcl = redis.createClient();
                wcl.hset(key, 'register', JSON.stringify(true));
                wcl.hset(key, 'modified', JSON.stringify(new Date()/1000|0));
                wcl.quit();
                console.log(raw);
            });
        });
    });
    cl.quit();
});
