import {overload, complement, called, clone, comp, rest, partial, isSome, reduced, seq, equiv, IReduce} from "atomic/core";
import * as _ from "atomic/core";
import Set from "set";

export function identity(){
  return _.identity;
}

export function first(){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return reduced(xf(xf(memo, value)));
    });
  }
}

export function last(n){
  const size = n || 1;
  return function(xf){
    let prior = [];
    return overload(xf, function(memo){
      let acc = memo;
      for (var x of prior){
        acc = xf(acc, x);
      }
      return xf(acc);
    }, function(memo, value){
      prior.push(value);
      while (prior.length > size) {
        prior.shift();
      }
      return memo;
    });
  }
}

export function tee(f){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      f(value);
      return xf(memo, value);
    });
  }
}

export function scan(step, init){
  return function(xf){
    let acc = init;
    return overload(xf, xf, function(memo, value){
      acc = step(acc, value)
      return xf(memo, acc);
    });
  }
}

function best2(better, init) {
  return function(xf){
    let result = init;
    return overload(xf, function(memo){
      return reduced(xf(xf(memo, result)));
    }, function(memo, value){
      result = better(result, value)
      return memo;
    });
  }
}

function best1(better){
  return function(xf){
    return overload(xf, xf, better);
  }
}

export const best = overload(null, best1, best2);

export function constantly(value){
  return function(xf){
    return overload(xf, xf, function(memo, _){
      return xf(memo, value);
    });
  }
}

export function map(f){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return xf(memo, f(value));
    });
  }
}

export function mapSome(f, pred){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return xf(memo, pred(value) ? f(value) : value);
    });
  }
}

export function mapcat(f){
  return comp(map(f), cat);
}

export function mapIndexed(f){
  return function(xf){
    let idx = -1;
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

export const remove = comp(filter, complement);

export function detect(pred){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return pred(value) ? reduced(xf(memo, value)) : memo;
    });
  }
}

export function compact(){
  return filter(_.identity);
}

function dedupe0(){
  return dedupe1(_.identity);
}

function dedupe1(f){
  return dedupe2(f, equiv);
}

function dedupe2(f, equiv){
  return function(xf){
    let last;
    return overload(xf, xf, function(memo, value){
      const result = equiv(f(value), f(last)) ? memo : xf(memo, value);
      last = value;
      return result;
    });
  }
}

export const dedupe = overload(dedupe0, dedupe1, dedupe2);

export function take(n){
  return function(xf){
    let taking = n < 0 ? 0 : n;
    return overload(xf, xf, function(memo, value){
      switch(taking){
        case 0:
          return reduced(memo)
        case 1:
          taking--;
          return reduced(xf(memo, value));
        default:
          taking--;
          return xf(memo, value);
      }
    });
  }
}

export function drop(n){
  return function(xf){
    let dropping = n;
    return overload(xf, xf, function(memo, value){
      return dropping-- > 0 ? memo : xf(memo, value);
    });
  }
}

export function interpose(sep){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return xf(seq(memo) ? xf(memo, sep) : memo, value);
    });
  }
}

export function dropWhile(pred){
  return function(xf){
    let dropping = true;
    return overload(xf, xf, function(memo, value){
      !dropping || (dropping = pred(value));
      return dropping ? memo : xf(memo, value);
    });
  }
}

export function keep(f){
  return comp(map(f), filter(isSome));
}

export function keepIndexed(f){
  return comp(mapIndexed1(f), filter(isSome));
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
    let x = -1;
    return overload(xf, xf, function(memo, value){
      x++;
      return x === 0 || x % n === 0 ? xf(memo, value) : memo;
    });
  }
}

export function splay(f){
  return function(xf){
    return overload(xf, xf, function(memo, value){
      return xf(memo, f.apply(null, value));
    });
  }
}

export function distinct(){
  return function(xf){
    const seen = new Set();
    return overload(xf, xf, function(memo, value){
      if (seen.has(value)) {
        return memo;
      }
      seen.add(value);
      return xf(memo, value);
    });
  }
}

export function cat(xf){
  return overload(xf, xf, function(memo, value){
    return IReduce.reduce(memo, xf, value);
  });
}

export function hist(size){
  return function(xf){
    let history = new Array(size || 2);
    return overload(xf, xf, function(memo, value){
      const revised = clone(history);
      revised.unshift(value);
      revised.pop();
      history = revised;
      return xf(memo, history);
    });
  }
}

//regulates message processing so, if there are side effects, each is processed before the next begins
export function isolate(){
  return function(xf){
    let queue = [];
    return overload(xf, xf, function(memo, value){
      let acc = memo;
      const ready = queue.length === 0;
      queue.push(value);
      if (ready){
        while (queue.length) {
          try {
            acc = xf(acc, queue[0]);
          } finally {
            queue.shift();
          }
        }
      }
      return acc;
    });
  }
}