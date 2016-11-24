import {log, reverse, cons, partition, partitionBy, partitionAll, keys, plus, minus, mult, div, isEven, isOdd, someFn, everyPred, str, doall, butlast, dropLast, takeLast, splitAt, splitWith, rand, scan, best, getIn, update, updateIn, interpose, interleave, min, max, and, or, dedupe, distinct, cat, cycle, overload, toUpperCase, expansive, observable, publisher, reify, swap, reset, subscribe, publish, deref, eq, ne, into, transduce, text, hide, show, tag, tap, detach, parent, addClass, append, prepend, inc, gt, lt, some, isEvery, mapIndexed, range, constantly, conj, take, takeNth, repeat, repeatedly, chain, comp, pipe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, each, map, filter, remove, takeWhile, dropWhile, find, satisfies, concat, flatten, toArray, toObject} from './composable';
export {log, reverse, cons, partition, partitionBy, partitionAll, keys, plus, minus, mult, div, isEven, isOdd, someFn, everyPred, str, doall, butlast, dropLast, takeLast, splitAt, splitWith, rand, scan, best, getIn, update, updateIn, interpose, interleave, min, max, and, or, dedupe, distinct, cat, cycle, overload, toUpperCase, expansive, observable, publisher, reify, swap, reset, subscribe, publish, deref, eq, ne, into, transduce, text, hide, show, tag, tap, detach, parent, addClass, append, prepend, inc, gt, lt, some, isEvery, mapIndexed, range, constantly, conj, take, takeNth, repeat, repeatedly, chain, comp, pipe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, each, map, filter, remove, takeWhile, dropWhile, find, satisfies, concat, flatten, toArray, toObject} from './composable';
import Reduce from './protocols/reduce';
import Lookup from './protocols/lookup';
import IndexedSeq from './types/indexed-seq';

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

QUnit.test("Predicates", function(assert){
  assert.equal(chain(3, or(1)), 3);
  assert.equal(chain(null, or(1)), 1);
  assert.equal(chain(3, and(1)), 1);
  assert.equal(chain(null, and(1)), null);
});

QUnit.test("Traverse and manipulate the dom", function(assert){
  const ul = tag('ul'), li = tag('li'), div = expansive(tag('div')), span = tag('span');
  const stooges = ul(li({id: 'moe'}, "Moe Howard"), li({id: 'curly'}, "Curly Howard"), li({id: 'larry'}, "Larry Fine"));
  const body = fetch("body", document);
  const who = div(get("givenName"), " ", get("sn"));
  const moe = who(assoc("givenName", "Moe"));
  assert.equal(chain({givenName: "Curly", sn: "Howard"}, moe, text), "Moe Howard");
  assert.equal(chain({givenName: "Curly", sn: "Howard"}, who, text), "Curly Howard");
  assert.equal(chain(body, addClass("main"), assoc("data-tagged", "tests"), get("data-tagged")), "tests");
  assert.ok(body instanceof HTMLBodyElement, "Found by tag");
  append(div({id: 'branding'}, span("Greetings!")), body);
  assert.ok(fetch("#branding", body) instanceof HTMLDivElement, "Found by id");
  assert.equal(chain(fetch("#branding span", body), text), "Greetings!", "Read text content");
  const greeting = fetch("#branding span", document);
  hide(greeting);
  const hidden = get("style", greeting);
  assert.equal(hidden, "display: none;", "Hidden");
  show(greeting);
  const shown = get("style", greeting);
  assert.equal(shown, "display: inherit;", "Shown");
  const branding = fetch("#branding", body);
  detach(branding);
  assert.equal(parent(branding), null, "Removed");
});

QUnit.test("String", function(assert){
  assert.equal(str(1, 2, 3), "123");
  assert.equal(str("Hello", " ", "World"), "Hello World");
});

QUnit.test("Associative", function(assert){
  assert.deepEqual(chain({sn: "Howard"}, assoc("givenName", "Moe")), {givenName: "Moe", sn: "Howard"});
  assert.deepEqual(chain([1,2,3], assoc(1, 0)), [1, 0, 3]);
});

QUnit.test("Lookup", function(assert){
  var boris = {givenName: "Boris", sn: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }};
  var moe = {givenName: "Moe", sn: "Howard"};
  var givenName = overload(null, get("givenName"), assoc("givenName")); //lens
  assert.equal(chain(boris, getIn(["address", "lines", 1])), "Suite 401");
  assert.equal(chain(boris, getIn(["address", "lines", 2])), null);
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

QUnit.test("Sequences", function(assert){
  assert.deepEqual(chain([1,2,3], butlast, toArray), [1,2]);
  assert.deepEqual(chain(interpose("-", ["A","B","C"]), toArray), ["A", "-", "B", "-", "C"]);
  assert.deepEqual(into([], interpose("-"), ["A","B","C"]), ["A", "-", "B", "-", "C"]);
  assert.deepEqual(chain(take(5, repeat(1)), toArray), [1,1,1,1,1]);
  assert.deepEqual(chain(take(5, repeat(1)), conj(0), toArray), [0,1,1,1,1,1]);
  assert.deepEqual(toArray(take(5, range(10))), [0, 1, 2, 3, 4]);
  assert.deepEqual(toArray(range(-5, 5)), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
  assert.deepEqual(toArray(range(-20, 100, 10)), [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
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
  assert.deepEqual(chain({sn: "Howard"}, append(['givenName', "Moe"])), {givenName: "Moe", sn: "Howard"});
  assert.deepEqual(chain([1, 2], append(3)), [1, 2, 3]);
  assert.deepEqual(chain([1, 2], prepend(0)), [0, 1, 2]);
});

QUnit.test("Into", function(assert){
  assert.equal(into("Marco ", "Polo"), "Marco Polo");
  assert.deepEqual(into("", filter(gt(6)), [5, 6, 7, 8, 9]), "789");
  assert.deepEqual(into([], "Polo"), ["P", "o", "l", "o"]);
  assert.deepEqual(into([], take(7), cycle([1, 2, 3])), [1, 2, 3, 1, 2, 3, 1]);
  assert.deepEqual(into([], dedupe(), [1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7]), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(toArray(distinct([1, 2, 3, 1, 4, 3, 4, 3, 2, 2])), [1, 2, 3, 4]);
  //assert.deepEqual(into([], distinct(), [1, 2, 3, 1, 4, 3, 4, 3, 2, 2]), [1, 2, 3, 4]);
  assert.deepEqual(into([], takeNth(2), range(10)), [0, 2, 4, 6, 8]);
  assert.deepEqual(into([], repeatedly(0, constantly(1))), []);
  assert.deepEqual(into([], repeatedly(10, constantly(2))), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  assert.deepEqual(into([], take(5, range(10))), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], filter(gt(5), range(10))), [6, 7, 8, 9]);
  assert.deepEqual(into([], remove(gt(5), range(10))), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(into([], takeWhile(lt(5), range(10))), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], dropWhile(gt(5), range(10))), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(into([], map(inc, range(1, 5))), [2, 3, 4, 5]);
  assert.deepEqual(into([], map(inc), [10, 11, 12]), [11, 12, 13]);
  assert.deepEqual(into([], comp(filter(gt(6)), map(inc), take(2)), [5, 6, 7, 8, 9]), [8, 9]);
  assert.deepEqual(into([], take(10), range(7, 15)), [7, 8, 9, 10, 11, 12, 13, 14]);
  assert.deepEqual(into([], range(5)), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], repeat(5, "X")), ["X", "X", "X", "X", "X"]);
  assert.deepEqual(into([], cat([[1, 2, 3], [4, 5, 6]])), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(into([], concat([1, 2], [3, 4], [5, 6])), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(into([], mapIndexed(function(idx, value){
    return [idx, inc(value)];
  }, [10, 11, 12])), [[0, 11], [1, 12], [2, 13]]);
});

QUnit.test("Reify", function(assert){
  assert.equal(chain(reify(Lookup, {get: constantly("O")}), get(50)), "O");
});