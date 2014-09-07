var create_spin_wait = exports.create_spin_wait = function(callback){
    var log = function(){};
    var errorlog = console.error;
    var count = 0;
    var isCallbacked = false;
    var items = [];
    var cb = function(err){
        if(!isCallbacked){
            isCallbacked = true;
            callback(err, items);
        }else{
            errorlog('multiple callback');
        }
    }
    return {
        enter : function(name){
            if(!name) name = '';
            log('enter', name);
            ++count;
        },
        leave : function(err, data, name){
            if(!name) name = '';
            log('leave', name);
            items.push({err:err, data:data, name:name});
            --count;
            if(count < 0){
                cb(new Error('over called, leave method ' + name));
            }else if(count === 0){
                cb(null);
            }
        },
        log : function(f){
            log = f;
        },
    }
}
