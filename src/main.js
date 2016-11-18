import {log, into, append, prepend, inc, gt, lt, some, isEvery, mapIndexed, range, constantly, conj, take, takeNth, repeat, repeatedly, chain, compose, pipe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, each, map, filter, remove, takeWhile, dropWhile, find, satisfies, concat, toArray, toObject} from './composable';
export {log, into, append, prepend, inc, gt, lt, some, isEvery, mapIndexed, range, constantly, conj, take, takeNth, repeat, repeatedly, chain, compose, pipe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, each, map, filter, remove, takeWhile, dropWhile, find, satisfies, concat, toArray, toObject} from './composable';
import * as t from './transducer';
import Reduce from './protocols/reduce';
import IndexedSeq from './types/indexed-seq';

QUnit.test("Associative", function(assert){
  assert.deepEqual(chain({lname: "Howard"}, assoc("fname", "Moe")), {fname: "Moe", lname: "Howard"});
  assert.deepEqual(chain([1,2,3], assoc(1, 0)), [1, 0, 3]);
});

QUnit.test("Lookup", function(assert){
  assert.equal(chain({fname: "Moe", lname: "Howard"}, get("fname")), "Moe");
  assert.equal(chain(["ace", "king", "queen"], get(2)), "queen");
});

QUnit.test("Sequences", function(assert){
  assert.deepEqual(chain(1, repeat, take(5), toArray), [1,1,1,1,1]);
  assert.deepEqual(chain(1, repeat, take(5), conj(0), toArray), [0,1,1,1,1,1]);
  assert.equal(some(gt(5), range(10)), 6);
  assert.notOk(isEvery(gt(5), range(10)));
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

QUnit.test("Append/Prepend", function(assert){
  assert.deepEqual(chain(["Moe"], append("Howard")), ["Moe", "Howard"]);
  assert.deepEqual(chain({lname: "Howard"}, append(['fname', "Moe"])), {fname: "Moe", lname: "Howard"});
  assert.deepEqual(chain([1, 2], append(3)), [1, 2, 3]);
  assert.deepEqual(chain([1, 2], prepend(0)), [0, 1, 2]);
});

QUnit.test("Into", function(assert){
  assert.equal(into("Marco ", "Polo"), "Marco Polo");
  assert.deepEqual(into([], "Polo"), ["P", "o", "l", "o"]);
  assert.deepEqual(into([], t.takeNth(2), range(10)), [0, 2, 4, 6, 8]);
  assert.deepEqual(into([], repeatedly(0, constantly(1))), []);
  assert.deepEqual(into([], repeatedly(10, constantly(2))), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  assert.deepEqual(into([], take(5, range(10))), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], filter(gt(5), range(10))), [6, 7, 8, 9]);
  assert.deepEqual(into([], remove(gt(5), range(10))), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(into([], takeWhile(lt(5), range(10))), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], dropWhile(gt(5), range(10))), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(into([], map(inc, range(1, 5))), [2, 3, 4, 5]);
  assert.deepEqual(into([], t.map(inc), [10, 11, 12]), [11, 12, 13]);
  assert.deepEqual(into([], compose(t.filter(gt(6)), t.map(inc), t.take(2)), [5, 6, 7, 8, 9]), [8, 9]);
  assert.deepEqual(into([], t.take(10), range(7, 15)), [7, 8, 9, 10, 11, 12, 13, 14]);
  assert.deepEqual(into([], range(5)), [0, 1, 2, 3, 4]);
  assert.deepEqual(into("", t.filter(gt(6)), [5, 6, 7, 8, 9]), "789");
  assert.deepEqual(into([], repeat(5, "X")), ["X", "X", "X", "X", "X"]);
  //assert.deepEqual(into([], concat([1, 2, 3], [4, 5, 6])), [1, 2, 3, 4, 5, 6]);
  //assert.deepEqual(into([], concat([1, 2], [3, 4], [5, 6])), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(into([], mapIndexed(function(idx, value){
    return [idx, inc(value)];
  }, [10, 11, 12])), [[0, 11], [1, 12], [2, 13]]);
});