import Seqable from './protocols/seqable';
import Reduced from './types/reduced';
import {overload, complement, comp, isSome} from './core';
import {into} from './coll';

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

export function dedupe(){
  return function(xf){
    var last = {};
    return overload(xf, xf, function(memo, value){
      var result = value === last ? memo : xf(memo, value);
      last = value;
      return result;
    });
  }
}

export function interpose(sep){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return xf(Seqable.seq(memo) ? xf(memo, sep) : memo, value);
    });
  }
}

export function distinct(){
  return function(xf){
    return overload(function(){
      return new Set();
    }, function(xs){
      var coll = Seqable.seq(xs);
      return coll ? into([], coll) : EMPTY;
    }, xf);
  }
}

export function filter(pred){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return pred(value) ? xf(memo, value) : memo;
    });
  }
}

export function find(pred){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return pred(value) ? new Reduced(value) : null;
    });
  }
}

export function keep(f){
  return comp(map(f), filter(isSome));
}

export function keepIndexed(f){
  return comp(mapIndexed(f), filter(isSome));
}

export const remove = comp(filter, complement);

export function take(n){
  return function(xf){
    var taking = n;
    return overload(xf, xf, function(memo, value){
      return taking-- > 0 ? xf(memo, value) : new Reduced(memo);
    });
  }
}

export function takeWhile(pred){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return pred(value) ? xf(memo, value) : new Reduced(memo);
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