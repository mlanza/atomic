import * as dom from './dom.js';
import {first, rest, fold, concat, keys, tap, chain, curry, doto, flip, compose, constantly, multiarity, complement, partial, overload, gt, lt, repeatedly, repeat, some, isEvery, log, inc, increasingly, range, transduce, into, join, each, reduce, map, mapIndexed, take, drop, filter, remove, takeNth, takeWhile, dropWhile, get, eq, append, prepend, assoc, hasKey} from './core.js';
export {fold, concat, rest};

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
  var hidden = get("style", greeting);
  assert.ok(hidden == "display: none;", "Hidden");
  dom.show(greeting);
  var shown = get("style", greeting);
  assert.ok(shown == "display: inherit;", "Shown");
  var branding = dom.find("#branding", body);
  dom.remove(branding);
  assert.ok(branding.parentElement == null, "Removed");
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