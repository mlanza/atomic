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

export function identity(x){
  return x;
}

export function constantly(x){
  return function(){
    return x;
  }
}

export function effect(...effects){
  return function(obj){
    effects.forEach(function(effect){
      effect(obj);
    }, effects);
    return obj;
  }
}

export function doto(obj, ...effects){
  return effect(...effects)(obj);
}

export function isInstance(x, constructor){
  return x instanceof constructor;
}