import * as dom from './dom.js';
import {first, rest, fold, concat, keys, tap, chain, curry, doto, flip, compose, constantly, multiarity, complement, partial, overload, gt, lt, repeatedly, repeat, some, isEvery, log, inc, increasingly, range, transduce, into, join, each, reduce, map, mapIndexed, take, drop, filter, remove, takeNth, takeWhile, dropWhile, get, eq, append, prepend, assoc, hasKey} from './core.js';
export {fold, concat, rest};

QUnit.test("Equality", function(assert){
  assert.ok(eq("Curly", "Curly"), "Equal strings");
  assert.notOk(eq("Curly", "Curlers"), "Unequal strings");
  assert.ok(eq(45, 45), "Equal numbers");
  assert.ok(eq([1, 2, 3], [1, 2, 3]), "Equal arrays");
  assert.notOk(eq([1, 2, 3], [2, 3]), "Unequal arrays");
  assert.notOk(eq([1, 2, 3], [3, 2, 1]), "Unequal arrays");
  assert.ok(eq({fname: "Moe", lname: "Howard"}, {fname: "Moe", lname: "Howard"}), "Equal objects");
  assert.notOk(eq({fname: "Moe", middle: "Harry", lname: "Howard"}, {fname: "Moe", lname: "Howard"}), "Unequal objects");
});