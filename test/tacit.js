import {log, merge, fnil, selectKeys, keep, keepIndexed, reverse, cons, partition, partitionBy, partitionAll, keys, isEven, isOdd, someFn, everyPred, str, doall, butlast, dropLast, takeLast, scan, best, getIn, update, updateIn, assocIn, interpose, interleave, min, max, dedupe, distinct, cat, cycle, overload, toUpperCase, expansive, observable, publisher, reify, swap, reset, subscribe, publish, deref, eq, ne, into, transduce, text, hide, show, tag, tap, detach, parent, addClass, append, prepend, inc, gt, lt, some, isEvery, mapIndexed, range, constantly, conj, drop, take, takeNth, repeat, repeatedly, chain, comp, pipe, opt, maybe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, reduceKV, each, map, filter, remove, takeWhile, dropWhile, detect, satisfies, concat, flatten, toArray, toObject, or, and, partial, see} from '../src/tacit';
import Reduce from '../src/protocols/reduce';
import Lookup from '../src/protocols/lookup';
import IndexedSeq from '../src/types/indexed-seq';

QUnit.test("Predicates", function(assert){
  assert.equal(chain(3, or(1)), 3);
  assert.equal(chain(null, or(1)), 1);
  assert.equal(chain(3, and(1)), 1);
  assert.equal(chain(null, and(1)), null);
});

QUnit.test("Lookup", function(assert){
  var boris = {givenName: "Boris", sn: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }};
  var moe = {givenName: "Moe", sn: "Howard"};
  var givenName = overload(null, get("givenName"), assoc("givenName")); //lens
  var getAddressLine1 = opt(get("address"), get("lines"), get(1));
  assert.equal(chain(moe  , getAddressLine1), null);
  assert.equal(maybe(boris, get("address"), get("lines"), get(1)), "Suite 401");
  assert.equal(chain(boris, getAddressLine1), "Suite 401");
  assert.equal(chain(boris, getIn(["address", "lines", 1])), "Suite 401");
  assert.equal(chain(boris, getIn(["address", "lines", 2])), null);
  assert.deepEqual(chain(boris, assocIn(["address", "lines", 1], "attn: Finance Dept.")), {givenName: "Boris", sn: "Lasky", address: {
    lines: ["401 Mayor Ave.", "attn: Finance Dept."],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }})
  assert.deepEqual(chain(boris, updateIn(["address", "lines", 1], toUpperCase)), {givenName: "Boris", sn: "Lasky", address: {
    lines: ["401 Mayor Ave.", "SUITE 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }});
  assert.deepEqual(boris, {givenName: "Boris", sn: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }});
  assert.equal(givenName(moe), "Moe");
  assert.deepEqual(givenName("Curly", moe), {givenName: "Curly", sn: "Howard"});
  assert.deepEqual(moe, {givenName: "Moe", sn: "Howard"}, "no lens mutation");
  assert.equal(chain(["ace", "king", "queen"], get(2)), "queen");
});

QUnit.test("IndexedSeq", function(assert){
  const nums = new IndexedSeq([11,12,13,14], 1);
  const letters = new IndexedSeq("grace");
  assert.equal(chain(letters, first), "g");
  assert.equal(chain(letters, third), "a");
  assert.equal(chain(nums, first), 12);
  assert.equal(chain(nums, second), 13);
  assert.equal(chain(nums, count), 3);
  assert.ok(chain(nums, satisfies(Reduce)));
  assert.equal(chain(nums, reduce(add, 0)), 39);
});

QUnit.test("coersion", function(assert){
  assert.deepEqual(chain([["Moe", "Howard"], ["Curly", "Howard"]], toObject), {Moe: "Howard", Curly: "Howard"});
  assert.deepEqual(chain({Moe: "Howard", Curly: "Howard"}, toArray), [["Moe", "Howard"], ["Curly", "Howard"]]);
});

QUnit.test("Reify", function(assert){
  assert.equal(chain(reify(Lookup, {get: constantly("O")}), get(50)), "O");
});

QUnit.test("sequences", function(assert){
  assert.deepEqual(chain([1, 2, 3], butlast, into([])), [1, 2]);
  assert.deepEqual(chain(["A","B","C"], interpose("-"), into([])), ["A", "-", "B", "-", "C"]);
  assert.deepEqual(chain(repeat(1), take(5), into([])), [1,1,1,1,1]);
  assert.deepEqual(chain(repeat(1), take(5), conj(0), conj(-1), into([])), [-1, 0, 1, 1, 1, 1, 1]);
  assert.deepEqual(chain(range(10), take(5), into([])), [0, 1, 2, 3, 4]);
  assert.deepEqual(chain(range(-5, 5), into([])), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
  assert.deepEqual(chain(range(-20, 100, 10), into([])), [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
  assert.deepEqual(chain(range(10), drop(3), take(3), into([])), [3, 4, 5]);
  /*
  assert.deepEqual(into([], take(3, drop(3, range(10)))), [3, 4, 5]);
  assert.deepEqual(into([], map(inc, [1, 2, 3])), [2, 3, 4]);
  assert.deepEqual(into([], map(inc), [1, 2, 3]), [2, 3, 4]);
  assert.deepEqual(into([], keepIndexed(function(idx, value){
    if (isOdd(idx)) return value;
  }), ["a", "b", "c", "d", "e"]), ["b", "d"]);
  assert.equal(some(isEven, [1, 2, 3, 4]), true);
  assert.equal(detect(isEven, [1, 2, 3, 4]), 2);
  assert.equal(some(x => x > 5, range(10)), true);
  assert.equal(detect(x => x > 5, range(10)), 6);
  assert.notOk(isEvery(x => x > 5, range(10)));
  assert.deepEqual(selectKeys(["ace", "king"], {ace: 1, king: 2, queen: 3}), {ace: 1, king: 2});
  assert.equal(into("Marco ", "Polo"), "Marco Polo");
  assert.deepEqual(into("", filter(x => x > 6), [5, 6, 7, 8, 9]), "789");
  assert.deepEqual(into([], "Polo"), ["P", "o", "l", "o"]);
  assert.deepEqual(into([], take(7), cycle([1, 2, 3])), [1, 2, 3, 1, 2, 3, 1]);
  assert.deepEqual(into([], dedupe([1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7])), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(into([], dedupe(), [1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7]), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(into([], distinct([1, 2, 3, 1, 4, 3, 4, 3, 2, 2])), [1, 2, 3, 4]);
  assert.deepEqual(into([], distinct(), [1, 2, 3, 1, 4, 3, 4, 3, 2, 2]), [1, 2, 3, 4]);
  assert.deepEqual(into([], takeNth(2, range(10))), [0, 2, 4, 6, 8]);
  assert.deepEqual(into([], takeNth(2), range(10)), [0, 2, 4, 6, 8]);
  assert.deepEqual(into([], repeatedly(0, constantly(1))), []);
  assert.deepEqual(into([], repeatedly(10, constantly(2))), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  assert.deepEqual(into([], take(5, range(10))), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], filter(x => x > 5), range(10)), [6, 7, 8, 9]);
  assert.deepEqual(into([], filter(x => x > 5, range(10))), [6, 7, 8, 9]);
  assert.deepEqual(into([], remove(x => x > 5), range(10)), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(into([], remove(x => x > 5, range(10))), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(into([], takeWhile(x => x < 5), range(10)), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], takeWhile(x => x < 5, range(10))), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], dropWhile(x => x > 5), range(10)), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(into([], dropWhile(x => x > 5, range(10))), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(into([], map(inc), range(1, 5)), [2, 3, 4, 5]);
  assert.deepEqual(into([], map(inc, range(1, 5))), [2, 3, 4, 5]);
  assert.deepEqual(into([], map(inc), [10, 11, 12]), [11, 12, 13]);
  assert.deepEqual(into([], comp(filter(x => x > 6), map(inc), take(2)), [5, 6, 7, 8, 9]), [8, 9]);
  assert.deepEqual(into([], take(2, map(inc, filter(x => x > 6, [5, 6, 7, 8, 9])))), [8, 9]);
  assert.deepEqual(into([], take(10), range(7, 15)), [7, 8, 9, 10, 11, 12, 13, 14]);
  assert.deepEqual(into([], range(5)), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], repeat(5, "X")), ["X", "X", "X", "X", "X"]);
  assert.deepEqual(into([], cat([[1, 2, 3], [4, 5, 6]])), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(into([], concat([1, 2], [3, 4], [5, 6])), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(into([], mapIndexed(function(idx, value){
    return [idx, inc(value)];
  }, [10, 11, 12])), [[0, 11], [1, 12], [2, 13]]); */
});