var cache = {};
var toString = Object.prototype.toString;

// refactor to drop dependencies
var isEqual = require('./isEqual');

function dispose(inst){
  if(inst && inst.dispose) return inst.dispose.call(this);
}

module.exports = function(app){
  app = app || {};
  if(app.compose) return app;
  
  app.compose = function(name, constr, params, options){
    if(arguments.length == 0) return cache;
    if(arguments.length == 1) return cache[name] && cache[name].inst;
    if(params && toString.call(params) !== '[object Array]') params = [params];
    // if already exists
    if(cache[name]){
      var prevConstr = cache[name].constr;
      var prevParams = cache[name].params;
      var prevInst = cache[name].inst;
      //if constr is a react class
      if(toString.call(constr) == '[object Function]'){
        //different classes
        if(constr !== prevConstr){
          dispose.call(this, prevInst);
          cache[name] = {
            constr: constr,
            inst: constr.apply(this, params),
            params: params
          }
          // trigger new
          return cache[name].inst;
        }
        //if params are the same return same component
        if(isEqual(cache[name].params, params)){
          // not changed
          return cache[name].inst;
        }
        cache[name].inst = constr.apply(this, params);
        // trigger after update
        cache[name].params = params;
        return cache[name].inst;
      }

      if(constr == Object(constr) || toString.call(constr) == '[object String]'){
        if(isEqual(cache[name].constr, constr)){
          return cache[name].constr;
        }
        cache[name].constr = constr;
        // trigger after update
        return constr;
      }
    } else {
      if(toString.call(constr) == '[object Function]'){
        cache[name] = {
          constr: constr,
          inst: constr.apply(this, params),
          params: params
        }
        return cache[name].inst;
      }
      if(constr == Object(constr) || toString.call(constr) == '[object String]'){
        // trigger new
        cache[name].inst = constr;
        return constr;
      }
    }
  }
  return app;
}

module.exports.mixin = { 
  componentWillMount: function() {
    module.exports(this);
  },
  insert: function(){
    return this.compose.apply(this, arguments);
  }
}