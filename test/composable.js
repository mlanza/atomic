import {log, merge, fnil, selectKeys, keep, keepIndexed, reverse, cons, partition, partitionBy, partitionAll, keys, plus, minus, mult, div, isEven, isOdd, someFn, everyPred, str, doall, butlast, dropLast, takeLast, splitAt, splitWith, rand, scan, best, getIn, update, updateIn, assocIn, interpose, interleave, min, max, dedupe, distinct, cat, cycle, overload, toUpperCase, expansive, observable, publisher, reify, swap, reset, subscribe, publish, deref, eq, ne, into, transduce, text, hide, show, tag, tap, detach, parent, addClass, append, prepend, inc, gt, lt, some, isEvery, mapIndexed, range, constantly, conj, take, takeNth, repeat, repeatedly, chain, comp, pipe, opt, maybe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, reduceKV, each, map, filter, remove, takeWhile, dropWhile, find, satisfies, concat, flatten, toArray, toObject, or, and, any, all, partial, see} from '../composable';
import Reduce from '../protocols/reduce';
import Lookup from '../protocols/lookup';
import IndexedSeq from '../types/indexed-seq';

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