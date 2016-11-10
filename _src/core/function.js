export {unbind} from './core.js';
import {reduce, each, slice, splice, reverse, concat, head, tail, last} from './core.js';
import {constructs} from './core.js';

const assign  = Object.assign;

export function noop(){
}

export function curry(self, len, applied){
  if (arguments.length === 1)
    len = self.length;
  return function(){
    //a call without args applies a single undefined arg potentially allowing the curried function to substitute a default value.
    var args = (applied || []).concat(arguments.length === 0 ? [undefined] : slice(arguments));
    if (args.length >= len) {
      return self.apply(this, args);
    } else {
      return curry(self, len, args);
    }
  }
}

export function complement(f){
  return function(){
    return !f.apply(this, arguments);
  }
}

function arities(lkp, fallback){
  return assign(function(){
    var f = lkp[arguments.length] || fallback;
    return f.apply(this, arguments);
  }, lkp);
}

export function multiarity(){
  return arities(reduce(arguments, function(memo, f){
    memo[f.length] = f;
    return memo;
  }, {}));
}

export function overload(){
  return arities(arguments, last(arguments));
}

export function flip(self, len){
  var at = (len || 2) - 1;
  return function(){
    var args = concat(slice(arguments, at, len), concat(head(arguments, at), tail(arguments, len)));
    return self.apply(this, args);
  }
}

export function subj(self, len){
  var length = len || self.length;
  return length > 1 ? curry(flip(self, length), length) : self;
}

export function pipe(){
  var fs = slice(arguments); //TODO could slice be part of the Seq protocol?
  return function(value){
    return reduce(fs, function(value, self){
      return self(value);
    }, value);
  }
}

export function chain(target){
  return pipe.apply(this, rest(arguments))(target);
}

export function compose(){
  return pipe.apply(this, reverse(slice(arguments)));
}

export function tap(){
  var f = pipe.apply(this, arguments);
  return function(value){
    f(value);
    return value;
  }
}

export function invokeWith(){
  var args = arguments;
  return function(self){
    return self.apply(this, args);
  }
}

export function doto(){
  var fs = arguments;
  return (fs.length === 0) ? noop : (fs.length === 1) ? fs[0] : function(){
    each(fs, invokeWith.apply(this, arguments).bind(this));
  }
}

export function multimethod(dispatch){
  return function(){
    var f = dispatch.apply(this, arguments);
    return f.apply(this, arguments);
  }
}

export function method(defaultFn){
  var dispatcher = new Map(),
      dispatch   = function(value){
        if (value == null) return defaultFn;
        return dispatcher.get(constructs(value)) || defaultFn;
      };
  return assign(multimethod(dispatch), {dispatcher: dispatcher, dispatch: dispatch});
}

export function extend(self, constructor, f){
  self.dispatcher.set(constructor, f);
  return self;
}

export const handles = method(function(c, f){
  return f.dispatcher.get(c);
});

export function constantly(value){
  return function(){
    return value;
  }
}

export function partial(f){
  var applied = rest(arguments);
  return function(){
    return f.apply(this, concat(applied, slice(arguments)));
  }
}

//TODO implement Extend protocol?
