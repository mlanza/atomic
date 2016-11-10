import unbind from './unbind';

export const log = console.log.bind(console);
export const slice = unbind(Array.prototype.slice);

export function reverse(xs){
  return slice(xs).reverse();
}

export function reduce(self, xf, init){
  var memo = init, len = self.length;
  for(var i = 0; i < len; i++){
    memo = xf(memo, self[i]);
  }
  return memo;
}

export function identity(value){
  return value;
}

export function curry(f, len, applied){
  return len ? function(){
    //every call to a curried function advances by at least one argument (see `undefined`).
    var args = (applied || []).concat(arguments.length === 0 ? [undefined] : slice(arguments));
    if (args.length >= len) {
      return f.apply(this, args);
    } else {
      return curry(f, len, args);
    }
  } : curry(f, f.length);
}

export const arity = function(len, f){
  return function(){
    return f.apply(this, slice(arguments, 0, len));
  }
};

export function map(self, f){
  var xs = [], len = self.length;
  for(var i = 0; i < len; i++){
    xs.push(f(self[i]));
  }
  return xs;
}

export function filter(self, pred){
  var xs = [], len = self.length;
  for(var i = 0; i < len; i++){
    if (pred(self[i]))
      xs.push(self[i]);
  }
  return xs;
}

export function find(self, pred){
  var len = self.length;
  for(var i = 0; i < len; i++){
    if (pred(self[i])) return self[i];
  }
}

export function append(self, value){
  return self.concat([value]);
}

export function flip(f, len){
  var l = len || f.length;
  return curry(arity(l, function(){
    var size = arguments.length,
        last = arguments[size - 1],
        rest = slice(arguments, 0, size - 1),
        args = [last].concat(rest);
    return f.apply(this, args);
  }), l);
}

export function chain(init){
  return reduce(slice(arguments, 1), function(value, f){
    return f(value);
  }, init);
}

export function pipe(){
  var fs = slice(arguments);
  return function(init){
    return reduce(fs, function(value, f){
      return f(value);
    }, init);
  }
}

export function compose(){
  return pipe.apply(this, chain(arguments, slice, reverse));
}

export function multimethod(dispatch){
  return function(){
    var f = dispatch.apply(this, arguments);
    return f.apply(this, arguments);
  }
}

export function always(value){
  return function(){
    return value;
  }
}

export function noop(){
}

export function add(a, b){
  return a + b;
}

export function subtract(a, b){
  return a - b;
}

export function eq(a, b){
  return a == b;
}

export function lookup(obj, key){
  return obj[key];
}

export function juxt(){
  var fs = slice(arguments);
  return function(){
    var self = this,
        args = slice(arguments);
    return map(function(f){
      return f.apply(self, args);
    }, fs);
  }
}