import {unbind, overload, fold, does} from "../../core.js";
import {Protocol} from "./construct.js";

export const extend    = unbind(Protocol.prototype.extend);
export const satisfies = unbind(Protocol.prototype.satisfies);
export const specify   = unbind(Protocol.prototype.specify);
export const unspecify = unbind(Protocol.prototype.unspecify);
export const implement = unbind(Protocol.prototype.implement);

export function reifiable(properties){
  function Reifiable(properties){
    Object.assign(this, properties);
  }
  return new Reifiable(properties || {});
}

export function behaves(behaviors, env, callback){
  for(var key in behaviors) {
    if (key in env) {
      const type = env[key],
            behave = behaviors[key];
      callback && callback(type, key, behave); //for logging
      behave(type);
    }
  }
}

function forward1(key){
  return function forward(f){
    return function(self, ...args){
      return f.apply(this, [self[key], ...args]);
    }
  }
}

function forwardN(target, ...protocols){
  const fwd = forward1(target);
  const behavior = fold(function(memo, protocol){
    memo.push(implement(protocol, fold(function(memo, key){
      memo[key] = fwd(protocol[key]);
      return memo;
    }, {}, protocol.keys() || [])));
    return memo;
  }, [], protocols);
  return does(...behavior);
}

export const forward = overload(null, forward1, forwardN);
