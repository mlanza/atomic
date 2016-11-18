import Reduced from './types/reduced.js';
import {overload, complement, compose, isSome} from './core.js';

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

export function find(pred){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return pred(value) ? new Reduced(value) : null;
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