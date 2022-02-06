import * as _ from './core.js';

function identity() {
  return _.identity;
}
function first() {
  return function (rf) {
    return _.overload(rf, rf, function (memo, value) {
      return _.reduced(rf(rf(memo, value)));
    });
  };
}
function last(n) {
  const size = n || 1;
  return function (rf) {
    let prior = [];
    return _.overload(rf, function (memo) {
      let acc = memo;

      for (var x of prior) {
        acc = rf(acc, x);
      }

      return rf(acc);
    }, function (memo, value) {
      prior.push(value);

      while (prior.length > size) {
        prior.shift();
      }

      return memo;
    });
  };
}
function tee(f) {
  return function (rf) {
    return _.overload(rf, rf, function (memo, value) {
      f(value);
      return rf(memo, value);
    });
  };
}
function scan(step, init) {
  return function (rf) {
    let acc = init;
    return _.overload(rf, rf, function (memo, value) {
      acc = step(acc, value);
      return rf(memo, acc);
    });
  };
}

function best2(better, init) {
  return function (rf) {
    let result = init;
    return _.overload(rf, function (memo) {
      return _.reduced(rf(rf(memo, result)));
    }, function (memo, value) {
      result = better(result, value);
      return memo;
    });
  };
}

function best1(better) {
  return function (rf) {
    return _.overload(rf, rf, better);
  };
}

const best = _.overload(null, best1, best2);
function constantly(value) {
  return function (rf) {
    return _.overload(rf, rf, function (memo, _) {
      return rf(memo, value);
    });
  };
}
function map(f) {
  return function (rf) {
    return _.overload(rf, rf, function (memo, value) {
      return rf(memo, f(value));
    });
  };
}
function mapSome(f, pred) {
  return function (rf) {
    return _.overload(rf, rf, function (memo, value) {
      return rf(memo, pred(value) ? f(value) : value);
    });
  };
}
function mapcat(f) {
  return _.comp(map(f), cat);
}
function mapIndexed(f) {
  return function (rf) {
    let idx = -1;
    return _.overload(rf, rf, function (memo, value) {
      return rf(memo, f(++idx, value));
    });
  };
}
function filter(pred) {
  return function (rf) {
    return _.overload(rf, rf, function (memo, value) {
      return pred(value) ? rf(memo, value) : memo;
    });
  };
}
const remove = _.comp(filter, _.complement);
function detect(pred) {
  return function (rf) {
    return _.overload(rf, rf, function (memo, value) {
      return pred(value) ? _.reduced(rf(memo, value)) : memo;
    });
  };
}
function compact() {
  return filter(_.identity);
}

function dedupe0() {
  return dedupe1(_.identity);
}

function dedupe1(f) {
  return dedupe2(f, _.equiv);
}

function dedupe2(f, equiv) {
  const nil = {};
  return function (rf) {
    let last = nil;
    return _.overload(rf, rf, function (memo, value) {
      const result = last !== nil && equiv(f(value), f(last)) ? memo : rf(memo, value);
      last = value;
      return result;
    });
  };
}

const dedupe = _.overload(dedupe0, dedupe1, dedupe2);
function take(n) {
  return function (rf) {
    let taking = n < 0 ? 0 : n;
    return _.overload(rf, rf, function (memo, value) {
      switch (taking) {
        case 0:
          return _.reduced(memo);

        case 1:
          taking--;
          return _.reduced(rf(memo, value));

        default:
          taking--;
          return rf(memo, value);
      }
    });
  };
}
function drop(n) {
  return function (rf) {
    let dropping = n;
    return _.overload(rf, rf, function (memo, value) {
      return dropping-- > 0 ? memo : rf(memo, value);
    });
  };
}
function interpose(sep) {
  return function (rf) {
    return _.overload(rf, rf, function (memo, value) {
      return rf(_.seq(memo) ? rf(memo, sep) : memo, value);
    });
  };
}
function dropWhile(pred) {
  return function (rf) {
    let dropping = true;
    return _.overload(rf, rf, function (memo, value) {
      !dropping || (dropping = pred(value));
      return dropping ? memo : rf(memo, value);
    });
  };
}
function keep(f) {
  return _.comp(map(f), filter(_.isSome));
}
function keepIndexed(f) {
  return _.comp(mapIndexed1(f), filter(_.isSome));
}
function takeWhile(pred) {
  return function (rf) {
    return _.overload(rf, rf, function (memo, value) {
      return pred(value) ? rf(memo, value) : _.reduced(memo);
    });
  };
}
function takeNth(n) {
  return function (rf) {
    let x = -1;
    return _.overload(rf, rf, function (memo, value) {
      x++;
      return x === 0 || x % n === 0 ? rf(memo, value) : memo;
    });
  };
}
function splay(f) {
  return function (rf) {
    return _.overload(rf, rf, function (memo, value) {
      return rf(memo, f.apply(null, value));
    });
  };
}
function distinct() {
  return function (rf) {
    const seen = new Set();
    return _.overload(rf, rf, function (memo, value) {
      if (seen.has(value)) {
        return memo;
      }

      seen.add(value);
      return rf(memo, value);
    });
  };
}
function cat(rf) {
  return _.overload(rf, rf, function (memo, value) {
    return _.reduce(memo, rf, value);
  });
}
function hist(limit) {
  return function (rf) {
    let history = [];
    return _.overload(rf, rf, function (memo, value) {
      const revised = _.clone(history);

      revised.unshift(value);

      if (history.length > limit) {
        revised.pop();
      }

      history = revised;
      return rf(memo, history);
    });
  };
} //regulates message processing so, if there are side effects, each is processed before the next begins

function isolate() {
  return function (rf) {
    let queue = [];
    return _.overload(rf, rf, function (memo, value) {
      let acc = memo;
      const ready = queue.length === 0;
      queue.push(value);

      if (ready) {
        while (queue.length) {
          try {
            acc = rf(acc, queue[0]);
          } finally {
            queue.shift();
          }
        }
      }

      return acc;
    });
  };
}

export { best, cat, compact, constantly, dedupe, detect, distinct, drop, dropWhile, filter, first, hist, identity, interpose, isolate, keep, keepIndexed, last, map, mapIndexed, mapSome, mapcat, remove, scan, splay, take, takeNth, takeWhile, tee };
