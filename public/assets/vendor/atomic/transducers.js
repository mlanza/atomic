define(['exports', 'atomic/core', 'set'], function (exports, _, Set) { 'use strict';

  function identity() {
    return _.identity;
  }
  function tee(f) {
    return function (xf) {
      return _.overload(xf, xf, function (memo, value) {
        f(value);
        return xf(memo, value);
      });
    };
  }
  function tap(other) {
    return function (xf) {
      return _.overload(xf, xf, function (memo, value) {
        xf(other, value);
        return xf(memo, value);
      });
    };
  }
  function map(f) {
    return function (xf) {
      return _.overload(xf, xf, function (memo, value) {
        return xf(memo, f(value));
      });
    };
  }
  function mapSome(f, pred) {
    return function (xf) {
      return _.overload(xf, xf, function (memo, value) {
        return xf(memo, pred(value) ? f(value) : value);
      });
    };
  }
  function mapcat(f) {
    return _.comp(map(f), cat);
  }
  function mapIndexed(f) {
    return function (xf) {
      var idx = -1;
      return _.overload(xf, xf, function (memo, value) {
        return xf(memo, f(++idx, value));
      });
    };
  }
  function filter(pred) {
    return function (xf) {
      return _.overload(xf, xf, function (memo, value) {
        return pred(value) ? xf(memo, value) : memo;
      });
    };
  }
  var remove = _.comp(filter, _.complement);
  function detect(pred) {
    return function (xf) {
      return _.overload(xf, xf, function (memo, value) {
        return pred(value) ? _.reduced(xf(memo, value)) : memo;
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
    return function (xf) {
      var last;
      return _.overload(xf, xf, function (memo, value) {
        var result = equiv(f(value), f(last)) ? memo : xf(memo, value);
        last = value;
        return result;
      });
    };
  }

  var dedupe = _.overload(dedupe0, dedupe1, dedupe2);
  function take(n) {
    return function (xf) {
      var taking = n < 0 ? 0 : n;
      return _.overload(xf, xf, function (memo, value) {
        switch (taking) {
          case 0:
            return _.reduced(memo);

          case 1:
            taking--;
            return _.reduced(xf(memo, value));

          default:
            taking--;
            return xf(memo, value);
        }
      });
    };
  }
  function drop(n) {
    return function (xf) {
      var dropping = n;
      return _.overload(xf, xf, function (memo, value) {
        return dropping-- > 0 ? memo : xf(memo, value);
      });
    };
  }
  function interpose(sep) {
    return function (xf) {
      return _.overload(xf, xf, function (memo, value) {
        return xf(_.seq(memo) ? xf(memo, sep) : memo, value);
      });
    };
  }
  function dropWhile(pred) {
    return function (xf) {
      var dropping = true;
      return _.overload(xf, xf, function (memo, value) {
        !dropping || (dropping = pred(value));
        return dropping ? memo : xf(memo, value);
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
    return function (xf) {
      return _.overload(xf, xf, function (memo, value) {
        return pred(value) ? xf(memo, value) : _.reduced(memo);
      });
    };
  }
  function takeNth(n) {
    return function (xf) {
      var x = -1;
      return _.overload(xf, xf, function (memo, value) {
        x++;
        return x === 0 || x % n === 0 ? xf(memo, value) : memo;
      });
    };
  }
  function splay(f) {
    return function (xf) {
      return _.overload(xf, xf, function (memo, value) {
        return xf(memo, f.apply(null, value));
      });
    };
  }
  function distinct() {
    return function (xf) {
      var seen = new Set();
      return _.overload(xf, xf, function (memo, value) {
        if (seen.has(value)) {
          return memo;
        }

        seen.add(value);
        return xf(memo, value);
      });
    };
  }
  function cat(xf) {
    return _.overload(xf, xf, function (memo, value) {
      return _.IReduce.reduce(memo, xf, value);
    });
  }

  exports.cat = cat;
  exports.compact = compact;
  exports.dedupe = dedupe;
  exports.detect = detect;
  exports.distinct = distinct;
  exports.drop = drop;
  exports.dropWhile = dropWhile;
  exports.filter = filter;
  exports.identity = identity;
  exports.interpose = interpose;
  exports.keep = keep;
  exports.keepIndexed = keepIndexed;
  exports.map = map;
  exports.mapIndexed = mapIndexed;
  exports.mapSome = mapSome;
  exports.mapcat = mapcat;
  exports.remove = remove;
  exports.splay = splay;
  exports.take = take;
  exports.takeNth = takeNth;
  exports.takeWhile = takeWhile;
  exports.tap = tap;
  exports.tee = tee;

  Object.defineProperty(exports, '__esModule', { value: true });

});
