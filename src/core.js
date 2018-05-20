export const unbind = Function.call.bind(Function.bind, Function.call);
export const log    = console.log.bind(console);

export function noop(){
}

export function counter(init){
  let memo = init || 0;
  return function(){
    return memo++;
  }
}

function s4() {
  return Math.floor((1 + rand()) * 0x10000).toString(16).substring(1);
}

export function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function type(self){
  return self == null ? null : self.constructor;
}

export function overload(){
  var fs = arguments, fallback = fs[fs.length - 1];
  return function(){
    var f = fs[arguments.length] || fallback;
    return f.apply(this, arguments);
  }
}

export function subj(f){ //subjective
  return function(...args){
    return function(obj){
      return f.apply(null, [obj].concat(args));
    }
  }
}

export function obj(f){ //objective
  return function(...args){
    return function(obj){
      return f.apply(null, [args].concat(obj));
    }
  }
}

export function identity(x){
  return x;
}

export function constantly(x){
  return function(){
    return x;
  }
}

export function doto(obj, ...effects){
  effects.forEach(function(effect){
    effect(obj);
  }, effects);
  return obj;
}

export const effect = subj(doto);

export function isInstance(x, constructor){
  return x instanceof constructor;
}