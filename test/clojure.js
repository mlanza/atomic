import {join, split, constantly, expansive, get, subs, map, inc, into, range, comp, cat, concat, mapIndexed, filter, remove, dedupe, distinct, partial, cycle, take, takeNth, takeWhile, repeatedly, drop, dropWhile, min, max, str, assoc, butlast, conj, interpose, repeat, keepIndexed, isEvery, selectKeys, some, detect, isOdd, isEven, gt, lt, eq, lte, gte, append, prepend, detach, query, fetch, closest, parent, addClass, hasClass, toggleClass, tag, text, show, hide} from '../src/clojure';

QUnit.test("Traverse and manipulate the dom", function(assert){
  const ul = partial(tag, 'ul'), li = partial(tag, 'li'), div = expansive(partial(tag, 'div')), span = partial(tag, 'span');
  const stooges = ul(li({id: 'moe'}, "Moe Howard"), li({id: 'curly'}, "Curly Howard"), li({id: 'larry'}, "Larry Fine"));
  const body = fetch(document, "body");
  const who = div(el => get(el, "givenName"), " ", el => get(el, "sn"));
  const moe = who(el => assoc(el, "givenName", "Moe"));
  assert.ok(body instanceof HTMLBodyElement, "Found by tag");
  assert.equal(text(moe({givenName: "Curly", sn: "Howard"})), "Moe Howard");
  assert.equal(text(who({givenName: "Curly", sn: "Howard"})), "Curly Howard");
  assert.equal(get(assoc(addClass(body, "main"), "data-tagged", "tests"), "data-tagged"), "tests");
  append(body, div({id: 'branding'}, span("Greetings!")));
  assert.ok(fetch(body, "#branding") instanceof HTMLDivElement, "Found by id");
  assert.equal(text(fetch(body, "#branding span")), "Greetings!", "Read text content");
  const greeting = fetch(document, "#branding span");
  hide(greeting);
  assert.equal(get(greeting, "style"), "display: none;", "Hidden");
  show(greeting);
  assert.equal(get(greeting, "style"), "display: inherit;", "Shown");
  const branding = fetch(body, "#branding");
  detach(branding);
  assert.equal(parent(branding), null, "Removed");
});

QUnit.test("min/max", function(assert){
  assert.equal(min(9, 0, -9), -9);
  assert.equal(max(9, 0, -9),  9);
});

QUnit.test("assoc", function(assert){
  assert.deepEqual(assoc({sn: "Howard"}, "givenName", "Moe"), {givenName: "Moe", sn: "Howard"});
  assert.deepEqual(assoc([1,2,3], 1, 0), [1, 0, 3]);
});

QUnit.test("append/prepend", function(assert){
  assert.deepEqual(append(["Moe"], "Howard"), ["Moe", "Howard"]);
  assert.deepEqual(append({sn: "Howard"}, ['givenName', "Moe"]), {givenName: "Moe", sn: "Howard"});
  assert.deepEqual(append([1, 2], 3), [1, 2, 3]);
  assert.deepEqual(prepend([1, 2], 0), [0, 1, 2]);
});

QUnit.test("strings", function(assert){
  assert.equal(str(1, 2, 3), "123");
  assert.equal(str("Hello", " ", "World"), "Hello World");
  assert.deepEqual(split("I like peanutbutter", " "), ["I", "like", "peanutbutter"]);
  assert.deepEqual(split("q1w2e3r4t5y6u7i8o9p", /\d/), ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
  assert.deepEqual(split("q1w2e3r4t5y6u7i8o9p", /\d/, 4), ["q", "w", "e", "r4t5y6u7i8o9p"]);
  assert.equal(subs("reading", 3), "ding");
  assert.equal(subs("reading", 0, 4), "read");
  assert.equal(join(", ", ["spam", null, "eggs", "", "spam"]), "spam, , eggs, , spam");
  assert.equal(join(", ", [1, 2, 3]), "1, 2, 3");
  assert.equal(join("-", ["ace", "king", "queen"]), "ace-king-queen");
  assert.equal(join(["hello", " ", "world"]), "hello world");
});

QUnit.test("sequences", function(assert){
  assert.deepEqual(into([], butlast([1, 2, 3])), [1, 2]);
  assert.deepEqual(into([], interpose("-", ["A","B","C"])), ["A", "-", "B", "-", "C"]);
  assert.deepEqual(into([], interpose("-"), ["A","B","C"]), ["A", "-", "B", "-", "C"]);
  assert.deepEqual(into([], take(5, repeat(1))), [1,1,1,1,1]);
  assert.deepEqual(into([], conj(take(5, repeat(1)), 0, -1)), [-1, 0, 1, 1, 1, 1, 1]);
  assert.deepEqual(into([], take(5, range(10))), [0, 1, 2, 3, 4]);
  assert.deepEqual(into([], range(-5, 5)), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
  assert.deepEqual(into([], range(-20, 100, 10)), [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90])
  assert.deepEqual(into([], comp(drop(3), take(3)), range(10)), [3, 4, 5]);
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
  }, [10, 11, 12])), [[0, 11], [1, 12], [2, 13]]);
});

QUnit.test("eq", function(assert){
  assert.ok(eq("Curly", "Curly"), "Equal strings");
  assert.notOk(eq("Curly", "Curlers"), "Unequal strings");
  assert.ok(eq(45, 45), "Equal numbers");
  assert.ok(eq([1, 2, 3], [1, 2, 3]), "Equal arrays");
  assert.notOk(eq([1, 2, 3], [2, 3]), "Unequal arrays");
  assert.notOk(eq([1, 2, 3], [3, 2, 1]), "Unequal arrays");
  assert.ok(eq({fname: "Moe", lname: "Howard"}, {fname: "Moe", lname: "Howard"}), "Equal objects");
  assert.notOk(eq({fname: "Moe", middle: "Harry", lname: "Howard"}, {fname: "Moe", lname: "Howard"}), "Unequal objects");
});