var Emitter = require('./libs/emitter');

// instance: 
// params:
var cache = {};
var toString = Object.prototype.toString;

var isEqual = _.isEqual;

function dispose(inst){
  if(inst && inst.dispose) return inst.dispose.call(this);
}

module.exports = function(app){
  app = app || {};
  app = Emitter(app);
  app.compose = function(name, constr, params, options){
    if(arguments.length == 0) return cache;
    if(arguments.length == 1) return cache[name];

    if(params && toString.call(params) !== '[object Array]') params = [params];
    
    // if already exists
    if(cache[name]){
      var prevConstr = cache[name].constr;
      var prevParams = cache[name].params;
      var prevInst = cache[name].inst;
      //if constr is a react class
      if(constr.getDOMNode || toString.call(constr) == '[object Function]'){
        //different classes
        if(constr !== prevConstr){
          dispose.call(this, prevInst);
          cache[name] = {
            constr: constr,
            inst: constr.apply(this, params),
            params: params
          }
          // trigger new
          app.emit(name + ':new');
          return cache[name].inst;
        }
        //if params are the same return same component
        if(isEqual(cache[name].params, params)){
          // not changed
          return cache[name].inst;
        } 
      }
      if(constr.getDOMNode){
        cache[name].inst.replaceProps(params[0]);
        // trigger after update
        cache[name].params = params;
        app.emit(name + ':update', constr);
        return cache[name].inst;
      }
      console.log(1);
      if(toString.call(constr) == '[object Function]'){
        cache[name].inst = constr.apply(this, params);
        // trigger after update
        cache[name].params = params;
        app.emit(name + ':update', this); 
        return cache[name].inst;
      }
      if(constr == Object(constr) || toString.call(constr) == '[object String]'){
        if(isEqual(cache[name].constr, constr)){
          return cache[name].constr;
        }
        cache[name].constr = constr;
        // trigger after update
        app.emit(name + ':update');
        return constr;
      }
    } else {
      if(constr.getDOMNode || toString.call(constr) == '[object Function]'){
        cache[name] = {
          constr: constr,
          inst: constr.apply(this, params),
          params: params
        }
        console.log('new ' + name);
        app.emit(name + ':new');
        return cache[name].inst;
      }
      if(constr == Object(constr) || toString.call(constr) == '[object String]'){
        // trigger new
        cache[name].inst = constr;
        app.emit(name + ':new');
        return constr;
      }
    }
  }
  app.watch = function(name){
    var watch =  {
      on: function(action, callback){
        app.on(name + ":" + action, callback);
        return watch

      },
      off: function(action, callback){
        app.off(name + ":" + action, callback);
        return watch;
      }
    }
    return watch;
  }
  return app;
}