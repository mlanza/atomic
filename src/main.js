import * as dom from './dom.js';
import {tap, chain, curry, doto, flip, compose, constantly, multiarity, complement, partial, overload, gt, lt, repeatedly, repeat, some, isEvery, log, inc, increasingly, range, transduce, into, join, each, reduce, map, take, drop, filter, remove, takeNth, takeWhile, dropWhile, get, eq, append, prepend, assoc, hasKey} from './core.js';

QUnit.test("Traverse and manipulate the dom", function(assert){
  let ul = dom.tag('ul'), li = dom.tag('li');
  var stooges = ul(li({id: 'moe'}, "Moe Howard"), li({id: 'curly'}, "Curly Howard"), li({id: 'larry'}, "Larry Fine")); 
  let div  = dom.tag('div'), 
      span = dom.tag('span');
  var body = dom.find("body", document);
  chain(stooges, tap(dom.query("li"), each(dom.addClass("stooge"))), log);
  assert.equal(chain(body, dom.addClass("main"), assoc("data-tagged", "tests"), get("data-tagged")), "tests");
  assert.ok(body instanceof HTMLBodyElement, "Found by tag");
  append(div({id: 'branding'}, span("Greetings!")), body);  
  assert.ok(dom.find("#branding", body) instanceof HTMLDivElement, "Found by id");
  assert.ok(chain(dom.find("#branding span", body), dom.text, eq("Greetings!")), "Read text content");
  var greeting = dom.find("#branding span", document);
  dom.hide(greeting);
  var hidden = dom.getAttr("style", greeting);
  assert.ok(hidden == "display: none;", "Hidden");
  dom.show(greeting);
  var shown = dom.getAttr("style", greeting);
  assert.ok(shown == "display: inherit;", "Shown");
  var branding = dom.find("#branding", body);
  dom.remove(branding);
  assert.ok(branding.parentElement == null, "Removed");
});

QUnit.test("Append/Prepend", function(assert){
  assert.equal(chain(["Moe"], append("Howard"), join(" ")), "Moe Howard", "String append");
  var moe = append({fname: "Moe"}, {lname: "Howard"}),
      ks  = Object.keys(moe);
  assert.ok(ks.length === 2 && ks.indexOf("fname") > -1 && ks.indexOf("lname") > -1, "Object append");
  assert.deepEqual(append(3, [1, 2]), [1, 2, 3]);
  assert.deepEqual(prepend(0, [1, 2]), [0, 1, 2]);
});

QUnit.test("Assoc", function(assert){
  assert.deepEqual(chain({lname: "Howard"}, assoc("fname", "Moe")), {fname: "Moe", lname: "Howard"});
  assert.deepEqual(chain([1,2,3], assoc(1, 0)), [1, 0, 3]);
});

QUnit.test("Get", function(assert){
  assert.equal(chain({fname: "Moe", lname: "Howard"}, get("fname")), "Moe");
  assert.equal(chain(["ace", "king", "queen"], get(2)), "queen");
});

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

QUnit.test("Into", function(assert){
  assert.equal(into("Marco ", "Polo"), "Marco Polo");
  assert.deepEqual(into([], "Polo"), ["P", "o", "l", "o"]);
  assert.deepEqual(into([], takeNth(2), range(10)), [0, 2, 4, 6, 8]);
  assert.deepEqual(into([], repeatedly(0, constantly(1))), []);
  assert.deepEqual(into([], repeatedly(10, constantly(2))), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  assert.deepEqual(into([], take(5, range(10))), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], filter(gt(5), range(10))), [6, 7, 8, 9]);
  assert.deepEqual(into([], remove(gt(5), range(10))), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(into([], takeWhile(lt(5), range(10))), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], dropWhile(gt(5), range(10))), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(into([], take(5), increasingly(0)), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], map(inc, range(1, 5))), [2, 3, 4, 5]);
  assert.deepEqual(into([], map(inc), [10, 11, 12]), [11, 12, 13]);
  assert.deepEqual(into([], compose(filter(gt(6)), map(inc), take(2)), [5, 6, 7, 8, 9]), [8, 9]);
  assert.deepEqual(into([], take(10), range(7, 15)), [7, 8, 9, 10, 11, 12, 13, 14]);
  assert.deepEqual(into([], range(5)), [0, 1, 2, 3, 4]);
  assert.deepEqual(into("", filter(gt(6)), [5, 6, 7, 8, 9]), "789");
  assert.deepEqual(into([], repeat(5, "X")), ["X", "X", "X", "X", "X"]);
});

QUnit.test("Sequences", function(assert){
  assert.equal(some(gt(5), range(10)), 6);
  assert.notOk(isEvery(gt(5), range(10)));
});
