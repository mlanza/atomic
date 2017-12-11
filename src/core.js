import Reduced from './types/reduced';

export const unbind    = Function.call.bind(Function.bind, Function.call);
export const slice     = unbind(Array.prototype.slice);
export const lowerCase = unbind(String.prototype.toLowerCase);
export const upperCase = unbind(String.prototype.toUpperCase);
export const trim      = unbind(String.prototype.trim);

export function reduce(xs, xf, init, from){
  var memo = init, len = xs.length;
  for(var i = from || 0; i < len; i++){
    if (memo instanceof Reduced)
      break;
    memo = xf(memo, xs[i]);
  }
  return memo instanceof Reduced ? memo.valueOf() : memo;
}

export function overload(){
  var fs = arguments;
  return function(){
    var f = fs[arguments.length] || fs[fs.length - 1];
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

export function partial(f){
  var applied = Array.prototype.slice.call(arguments, 1);
  return function(){
    return f.apply(this, applied.concat(Array.prototype.slice.call(arguments)));
  }
}

export function reducing(rf){
  return function r(x, ...tail){
    return tail.length ? rf(x, r.apply(null, tail)) : x;
  }
}

export function complement(f){
  return function(){
    return !f.apply(this, arguments);
  }
}

export function subj(f){
  return function(){
    const args = slice(arguments);
    return function(obj){
      return f.apply(this, [obj].concat(args));
    }
  }
}

export function reversed(f){
  return function(){
    return f.apply(this, slice(arguments).reverse());
  }
}

export function chain(init){
  return reduce(arguments, function(value, f){
    return f(value);
  }, init, 1);
}

function pipeN(f){
  var fs = slice(arguments, 1);
  return function(){
    return reduce(fs, function(memo, rf){
      return rf(memo);
    }, f.apply(this, arguments))
  }
}

export const pipe = overload(null, identity, pipeN);
export const comp = reversed(pipe);

export function multimethod(dispatch){
  return function(){
    const f = dispatch.apply(this, arguments);
    return f.apply(this, arguments);
  }
}