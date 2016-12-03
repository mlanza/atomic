import {log, slice, unless, has, inject, amplify, fst, snd, reassign, doto, isTrue, isFalse, isIdentical, matches, join, subs, split, EMPTY, empty, merge, fnil, selectKeys, keep, keepIndexed, reverse, cons, partition, partitionBy, partitionAll, keys, isEven, isOdd, someFn, everyPred, str, doall, butlast, dropLast, takeLast, scan, best, getIn, update, updateIn, assocIn, interpose, interleave, min, max, dedupe, distinct, cat, cycle, overload, toUpperCase, expansive, observable, publisher, reify, swap, reset, subscribe, publish, deref, eq, ne, into, transduce, text, hide, show, tag, tap, detach, parent, addClass, append, prepend, inc, gt, lt, some, isEvery, mapIndexed, range, constantly, conj, drop, take, takeNth, repeat, repeatedly, chain, comp, pipe, opt, maybe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, reduceKV, each, map, filter, remove, takeWhile, dropWhile, detect, satisfies, concat, flatten, toArray, toObject, or, and, partial, see} from '../src/tacit';
import Reduce from '../src/protocols/reduce';
import Lookup from '../src/protocols/lookup';
import IndexedSeq from '../src/types/indexed-seq';

QUnit.test("amplify", function(assert){
  const inp = [[[[1, 2, 3], [4, 5, 6]], [[7, 8, 9]]]];
  assert.deepEqual(chain(inp, amplify(2, cat), toArray), [[1, 2, 3], [4, 5, 6], [7, 8, 9]], "flatten by 2 levels");
  assert.deepEqual(chain(inp, amplify(3, cat), toArray), [1, 2, 3, 4, 5, 6, 7, 8, 9], "flatten by 3 levels");
});

QUnit.test("unless", function(assert){
  const oddity = unless(isOdd, inc);
  assert.equal(oddity(1), 1);
  assert.equal(oddity(2), 3);
});

QUnit.test("inject", function(assert){
  const nintynine = inject(1, [99], Array);
  assert.deepEqual(toArray(nintynine(1,2,3)), [1, 99, 2, 3]);
});

QUnit.test("reassign", function(assert){
  const heal = reassign(eq("hitpoints"), amplify(3, inc));
  assert.deepEqual(heal({name: "Charlie", iq: 120, hitpoints: 30}), {name: "Charlie", iq: 120, hitpoints: 33});
});

QUnit.test("has", function(assert){
  const charlie = {name: "Charlie", iq: 120, hitpoints: 30};
  assert.ok(has(["name", "Charlie"], charlie));
  assert.notOk(has(["name", "Charles"], charlie));
});

QUnit.test("observable", function(assert){
  const bucket = observable([], pipe(get('length'), lt(3))),
        states = observable([]);
  subscribe(function(state){
    swap(conj(state), states);
  }, bucket);
  chain(bucket, swap(conj("ice")));
  chain(bucket, swap(conj("champagne")));
  assert.throws(function(){
    chain(bucket, swap(conj("soda")));
  });
  chain(bucket, swap(assoc(1, "wine")));
  assert.deepEqual(deref(bucket), ["ice", "wine"]);
  assert.deepEqual(deref(states), [[], ["ice"], ["ice", "champagne"], ["ice", "wine"]]);
});

QUnit.test("immutable updates", function(assert){
  const duos = observable([["Hall", "Oates"], ["Laurel", "Hardy"]]),
        get0 = pipe(deref, nth(0)),
        get1 = pipe(deref, nth(1)),
        get2 = pipe(deref, nth(2)),
        d0 = get0(duos),
        d1 = get1(duos),
        d2 = get2(duos),
        states = observable([]),
        txn = pipe(
          conj(["Andrew Ridgeley", "George Michaels"]),
          assocIn([0, 0], "Daryl"),
          assocIn([0, 1], "John"));
  subscribe(function(state){
    swap(conj(state), states);
  }, duos);
  chain(duos, swap(txn));
  assert.equal(chain(states, deref, count), 2, "original + transaction");
  assert.deepEqual(deref(duos), [["Daryl", "John"], ["Laurel", "Hardy"], ["Andrew Ridgeley", "George Michaels"]]);
  assert.notOk(isIdentical(get0(duos), d0), "new container for");
  assert.ok(isIdentical(get1(duos), d1), "original container untouched");
  assert.notOk(d2, "non-existent");
  assert.notOk(isIdentical(get2(duos), d2), "created from nothing");
});

QUnit.test("traverse and manipulate the dom", function(assert){
  const ul = tag('ul'), li = tag('li'), div = expansive(tag('div')), span = tag('span');
  const stooges = ul(li({id: 'moe'}, "Moe Howard"), li({id: 'curly'}, "Curly Howard"), li({id: 'larry'}, "Larry Fine"));
  const body = fetch("body", document);
  const who = div(get("givenName"), " ", get("sn"));
  const moe = who(assoc("givenName", "Moe"));
  assert.ok(body instanceof HTMLBodyElement, "Found by tag");
  assert.equal(chain({givenName: "Curly", sn: "Howard"}, moe, text), "Moe Howard");
  assert.equal(chain({givenName: "Curly", sn: "Howard"}, who, text), "Curly Howard");
  assert.equal(chain(body, addClass("main"), assoc("data-tagged", "tests"), get("data-tagged")), "tests");
  chain(body, append(div({id: 'branding'}, span("Greetings!"))));
  assert.ok(chain(body, fetch("#branding")) instanceof HTMLDivElement, "Found by id");
  assert.equal(chain(body, fetch("#branding span"), text), "Greetings!", "Read text content");
  const greeting = fetch("#branding span", document);
  hide(greeting);
  assert.equal(chain(greeting, get("style")), "display: none;", "Hidden");
  show(greeting);
  assert.equal(chain(greeting, get("style")), "display: inherit;", "Shown");
  const branding = fetch("#branding", body);
  detach(branding);
  assert.equal(parent(branding), null, "Removed");
});

QUnit.test("predicates", function(assert){
  assert.ok(chain({ace: 1, king: 2, queen: 3}, matches({ace: 1, king: 2})));
  assert.equal(chain(3, or(1)), 3);
  assert.equal(chain(null, or(1)), 1);
  assert.equal(chain(3, and(1)), 1);
  assert.equal(chain(null, and(1)), null);
});

QUnit.test("min/max", function(assert){
  assert.equal(chain(-9, min(9, 0)), -9);
  assert.equal(chain(-9, max(9, 0)),  9);
});

QUnit.test("assoc", function(assert){
  assert.deepEqual(chain({sn: "Howard"}, assoc("givenName", "Moe")), {givenName: "Moe", sn: "Howard"});
  assert.deepEqual(chain([1, 2, 3], assoc(1, 0)), [1, 0, 3]);
});

QUnit.test("append/prepend", function(assert){
  assert.deepEqual(chain(["Moe"], append("Howard")), ["Moe", "Howard"]);
  assert.deepEqual(chain({sn: "Howard"}, append(['givenName', "Moe"])), {givenName: "Moe", sn: "Howard"});
  assert.deepEqual(chain([1, 2], append(3)), [1, 2, 3]);
  assert.deepEqual(chain([1, 2], prepend(0)), [0, 1, 2]);
});

QUnit.test("strings", function(assert){
  assert.deepEqual(chain("I like peanutbutter", split(" ")), ["I", "like", "peanutbutter"]);
  assert.deepEqual(chain("q1w2e3r4t5y6u7i8o9p", split(/\d/)), ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
  assert.deepEqual(chain("q1w2e3r4t5y6u7i8o9p", split(/\d/, 4)), ["q", "w", "e", "r4t5y6u7i8o9p"]);
  assert.equal(chain("reading", subs(3)), "ding");
  assert.equal(chain("reading", subs(0, 4)), "read");
  assert.equal(chain(["spam", null, "eggs", "", "spam"], join(", ")), "spam, , eggs, , spam");
  assert.equal(chain([1, 2, 3], join(", ")), "1, 2, 3");
  assert.equal(chain(["ace", "king", "queen"], join("-")), "ace-king-queen");
  assert.equal(chain(["hello", " ", "world"], join("")), "hello world");
});

QUnit.test("lookup", function(assert){
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

QUnit.test("indexed-seq", function(assert){
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

QUnit.test("sequences", function(assert){
  assert.deepEqual(chain([1, 2, 3], empty), []);
  assert.deepEqual(chain(null, into([])), []);
  assert.deepEqual(chain(EMPTY, into([])), []);
  assert.deepEqual(chain(repeat(1), take(2), toArray), [1, 1]);
  assert.deepEqual(chain([1, 2, 3], butlast, toArray), [1, 2]);
  assert.deepEqual(chain(["A","B","C"], interpose("-"), toArray), ["A", "-", "B", "-", "C"]);
  assert.deepEqual(chain(repeat(1), take(5), toArray), [1,1,1,1,1]);
  assert.deepEqual(chain(repeat(1), take(5), conj(0), conj(-1), toArray), [-1, 0, 1, 1, 1, 1, 1]);
  assert.deepEqual(chain(range(10), take(5), toArray), [0, 1, 2, 3, 4]);
  assert.deepEqual(chain(range(-5, 5), toArray), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
  assert.deepEqual(chain(range(-20, 100, 10), toArray), [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
  assert.deepEqual(chain(range(10), drop(3), take(3), toArray), [3, 4, 5]);
  assert.deepEqual(chain([1, 2, 3], map(inc), toArray), [2, 3, 4]);
  assert.equal(chain([1, 2, 3, 4], some(isEven)), true);
  assert.equal(chain([1, 2, 3, 4], detect(isEven)), 2);
  assert.equal(chain(range(10), some(x => x > 5)), true);
  assert.equal(chain([false, true], some(isTrue)), true);
  assert.equal(chain([false, true], some(isFalse)), true);
  assert.equal(chain([false, false], some(isTrue)), null);
  assert.equal(chain(range(10), detect(x => x > 5)), 6);
  assert.notOk(chain(range(10), isEvery(x => x > 5)));
  assert.deepEqual(chain({ace: 1, king: 2, queen: 3}, selectKeys(["ace", "king"])), {ace: 1, king: 2});
  assert.equal(chain("Polo", into("Marco ")), "Marco Polo");
  assert.deepEqual(chain([5, 6, 7, 8, 9], filter(x => x > 6), into("")), "789");
  assert.deepEqual(chain("Polo", toArray), ["P", "o", "l", "o"]);
  assert.deepEqual(chain([1, 2, 3], cycle, take(7), toArray), [1, 2, 3, 1, 2, 3, 1]);
  assert.deepEqual(chain([1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7], dedupe, toArray), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(chain([1, 2, 3, 1, 4, 3, 4, 3, 2, 2], distinct, toArray), [1, 2, 3, 4]);
  assert.deepEqual(chain(range(10), takeNth(2), toArray), [0, 2, 4, 6, 8]);
  assert.deepEqual(chain(1, constantly, repeatedly, take(0), toArray), []);
  assert.deepEqual(chain(2, constantly, repeatedly, take(10), toArray), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  assert.deepEqual(chain(range(10), take(5), toArray), [0, 1, 2, 3, 4]);
  assert.deepEqual(chain(range(10), filter(x => x > 5), toArray), [6, 7, 8, 9]);
  assert.deepEqual(chain(range(10), remove(x => x > 5), toArray), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(chain(range(10), takeWhile(x => x < 5), toArray), [0, 1, 2, 3, 4]);
  assert.deepEqual(chain(range(10), dropWhile(x => x > 5), toArray), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(chain(range(1, 5), map(inc), toArray), [2, 3, 4, 5]);
  assert.deepEqual(chain([10, 11, 12], map(inc), toArray), [11, 12, 13]);
  assert.deepEqual(chain([5, 6, 7, 8, 9], filter(x => x > 6), map(inc), take(2), toArray), [8, 9]);
  assert.deepEqual(chain(range(7, 15), take(10), toArray), [7, 8, 9, 10, 11, 12, 13, 14]);
  assert.deepEqual(chain(range(5), toArray), [0, 1, 2, 3, 4]);
  assert.deepEqual(chain("X", repeat, take(5), toArray), ["X", "X", "X", "X", "X"]);
  assert.deepEqual(chain([1, 2], concat([3, 4], [5, 6]), toArray), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(chain(["a", "b", "c", "d", "e"], keepIndexed(function(idx, value){
    if (isOdd(idx)) return value;
  }), toArray), ["b", "d"]);
  assert.deepEqual(chain([10, 11, 12], mapIndexed(function(idx, value){
    return [idx, inc(value)];
  }), toArray), [[0, 11], [1, 12], [2, 13]]);
});

QUnit.test("equality", function(assert){
  assert.ok(chain("Curly", eq("Curly")), "Equal strings");
  assert.notOk(chain("Curlers", eq("Curly")), "Unequal strings");
  assert.ok(chain("Curlers", ne("Curly")), "Unequal strings");
  assert.ok(chain(45, eq(45)), "Equal numbers");
  assert.ok(chain([1, 2, 3], eq([1, 2, 3])), "Equal arrays");
  assert.notOk(chain([1, 2, 3], eq([2, 3])), "Unequal arrays");
  assert.notOk(chain([1, 2, 3], eq([3, 2, 1])), "Unequal arrays");
  assert.ok(chain({fname: "Moe", lname: "Howard"}, eq({fname: "Moe", lname: "Howard"})), "Equal objects");
  assert.notOk(chain({fname: "Moe", middle: "Harry", lname: "Howard"}, eq({fname: "Moe", lname: "Howard"})), "Unequal objects");
});
