import {log, eq, into, text, hide, show, tag, tap, detach, parent, addClass, append, prepend, inc, gt, lt, some, isEvery, mapIndexed, range, constantly, conj, take, takeNth, repeat, repeatedly, chain, compose, pipe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, each, map, filter, remove, takeWhile, dropWhile, find, satisfies, concat, flatten, toArray, toObject} from './composable';
export {log, eq, into, text, hide, show, tag, tap, detach, parent, addClass, append, prepend, inc, gt, lt, some, isEvery, mapIndexed, range, constantly, conj, take, takeNth, repeat, repeatedly, chain, compose, pipe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, each, map, filter, remove, takeWhile, dropWhile, find, satisfies, concat, flatten, toArray, toObject} from './composable';
import Reduce from './protocols/reduce';
import IndexedSeq from './types/indexed-seq';

QUnit.test("Traverse and manipulate the dom", function(assert){
  const ul = tag('ul'), li = tag('li'), div = tag('div'), span = tag('span');
  const stooges = ul(li({id: 'moe'}, "Moe Howard"), li({id: 'curly'}, "Curly Howard"), li({id: 'larry'}, "Larry Fine"));
  const body = fetch("body", document);
  chain(stooges, query("li"), tap(each(addClass("stooge"))), log);
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

QUnit.test("Associative", function(assert){
  assert.deepEqual(chain({lname: "Howard"}, assoc("fname", "Moe")), {fname: "Moe", lname: "Howard"});
  assert.deepEqual(chain([1,2,3], assoc(1, 0)), [1, 0, 3]);
});

QUnit.test("Lookup", function(assert){
  assert.equal(chain({fname: "Moe", lname: "Howard"}, get("fname")), "Moe");
  assert.equal(chain(["ace", "king", "queen"], get(2)), "queen");
});

QUnit.test("Sequences", function(assert){
  assert.deepEqual(chain(take(5, repeat(1)), toArray), [1,1,1,1,1]);
  assert.deepEqual(chain(take(5, repeat(1)), conj(0), toArray), [0,1,1,1,1,1]);
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
  assert.deepEqual(into("", filter(gt(6)), [5, 6, 7, 8, 9]), "789");
  assert.deepEqual(into([], "Polo"), ["P", "o", "l", "o"]);
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
  assert.deepEqual(into([], compose(filter(gt(6)), map(inc), take(2)), [5, 6, 7, 8, 9]), [8, 9]);
  assert.deepEqual(into([], take(10), range(7, 15)), [7, 8, 9, 10, 11, 12, 13, 14]);
  assert.deepEqual(into([], range(5)), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], repeat(5, "X")), ["X", "X", "X", "X", "X"]);
  //assert.deepEqual(into([], concat([1, 2, 3], [4, 5, 6])), [1, 2, 3, 4, 5, 6]);
  //assert.deepEqual(into([], concat([1, 2], [3, 4], [5, 6])), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(into([], mapIndexed(function(idx, value){
    return [idx, inc(value)];
  }, [10, 11, 12])), [[0, 11], [1, 12], [2, 13]]);
});