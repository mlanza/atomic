import {reduced} from './types/reduced.js';
import {overload, multiarity, constantly, complement, compose, identity} from './core.js';
import {Coll} from './protocols/coll.js';

export function seeding(f, init){
  return overload(init, identity, f);
}

export const transduce = multiarity(function(xform, f, coll){
  var xf = xform(f);
  return xf(Coll.reduce(coll, xf, f()));
}, function(xform, f, seed, coll){
  return transduce(xform, seeding(f, constantly(seed)), coll);
});

export const into = multiarity(function(to, from){
  return Coll.reduce(from, Coll.append, to);
}, function(to, xform, from){
  return transduce(xform, Coll.append, to, from);
});

export function transform(xform, coll){
  return into(Coll.empty(coll), xform, coll);
}

export function map(f){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return xf(memo, f(value));
    });
  }
}

export function mapIndexed(f){
  return function(xf){
    var idx = -1;
    return overload(xf, xf, function(memo, value){
      return xf(memo, f(++idx, value));
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

export function keep(f){
  return compose(map(f), filter(isSome));
}

export function keepIndexed(f){
  return compose(mapIndexed(f), filter(isSome));
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
