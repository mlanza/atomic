import {log, identity, then, sort, list, intersection, isSuperset, union, difference, slice, unless, has, inject, amplify, fst, snd, reassign, doto, isTrue, isFalse, isIdentical, matches, join, subs, split, EMPTY, empty, merge, fnil, selectKeys, keep, keepIndexed, reverse, cons, partition, partitionBy, partitionAll, keys, isEven, isOdd, someFn, everyPred, str, doall, butlast, dropLast, takeLast, scan, best, getIn, update, updateIn, assocIn, interpose, interleave, min, max, dedupe, distinct, cat, cycle, overload, toUpperCase, expansive, observable, publisher, reify, swap, reset, subscribe, publish, deref, eq, ne, into, transduce, text, hide, show, tag, tap, detach, parent, addClass, append, prepend, inc, gt, lt, some, isEvery, mapIndexed, range, constantly, conj, drop, take, takeNth, repeat, repeatedly, chain, comp, pipe, opt, maybe, add, juxt, query, fetch, get, assoc, hasKey, first, second, third, rest, nth, next, count, reduce, reduceKV, each, map, filter, remove, takeWhile, dropWhile, detect, satisfies, concat, flatten, toArray, toObject, or, and, partial, see} from '../src/tacit';
import Reduce from '../src/protocols/reduce';
import Lookup from '../src/protocols/lookup';

QUnit.test("then", function(assert){
  assert.ok(chain(3, then(inc)).constructor === Promise);
});

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