import {overload, multiarity, partial, constantly, compose, complement} from './function.js';
import {reduced} from './reduced.js';
export {reduced} from './reduced.js';
import {identity, is} from './object.js';
import {reduce} from '../protocols/reduce.js';
import {append} from '../protocols/extend.js';

export function completing(f, complete){
  return overload(f, complete || identity, f);
}

export function seeding(f, init){
  return overload(init, identity, f);
}

export const transduce = multiarity(function(xform, f, coll){
  var xf = xform(f);
  return xf(reduce(coll, xf, f()));
}, function(xform, f, seed, coll){
  return transduce(xform, seeding(f, constantly(seed)), coll);
});

export const into = multiarity(function(to, from){
  return reduce(from, append, to);
}, function(to, xform, from){
  return transduce(xform, append, to, from);
});

/*export function tap(f){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      f(value);
      return xf(memo, value);
    });
  }
}*/

export function map(f){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return xf(memo, f(value));
    });
  }
}

export function filter(pred){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return pred(value) ? xf(memo, value) : memo;
    });
  }
}

export const remove = compose(filter, complement);

export function take(n){
  return function(xf){
    var taking = n;
    return overload(xf, xf, function(memo, value){
      return taking-- > 0 ? xf(memo, value) : reduced(memo);
    });
  }
}

export function takeWhile(pred){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return pred(value) ? xf(memo, value) : reduced(memo);
    });
  }
}

export function takeNth(n){
  return function(xf){
    var x = -1;
    return overload(xf, xf, function(memo, value){
      x++;
      return x === 0 || x % n === 0 ? xf(memo, value) : memo;
    });
  }
}

export function drop(n){
  return function(xf){
    var dropping = n;
    return overload(xf, xf, function(memo, value){
      return dropping-- > 0 ? memo : xf(memo, value);
    });
  }
}

export function dropWhile(pred){
  return function(xf){
    var dropping = true;  
    return overload(xf, xf, function(memo, value){
      !dropping || (dropping = pred(value));
      return dropping ? memo : xf(memo, value);
    });
  }
}
