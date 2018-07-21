import {_ as v} from "param.macro";
import * as _ from "cloe";

const stooges = ["Larry","Curly","Moe"],
      pieces  = {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity},
      court   = {jack: 11, queen: 12, king: 13},
      worth   = {pieces: pieces, court: court};

QUnit.test("component", function(assert){
  const people =
    _.doto(
      _.component({}, _.observable([]), function(raise, affect){
        return [{
          "add": raise("added")
        }, {
          "added": affect(_.conj)
        }]
      }),
    _.dispatch(v, {type: "add", args: [{name: "Moe"}]}),
    _.dispatch(v, {type: "add", args: [{name: "Curly"}]}),
    _.dispatch(v, {type: "add", args: [{name: "Shemp"}]}));

  assert.equal(_.count(_.deref(people)), 3);
});

QUnit.test("dom", function(assert){
  const {ul, li, div, span} = _.tags("ul", "li", "div", "span");
  const duo = _.frag() |> _.append(v, div("Abbott")) |> _.append(v, _.tag("div", "Costello"));
  const who = div(_.get(v, "givenName"), " ", _.get(v, "surname"));
  const template = _.frag(
    ul(
      _.map(function([id, person]){
        return li({id: id}, who(person));
      }, v)));
  const stooges = template({
    moe: {givenName: "Moe", surname: "Howard"},
    curly: {givenName: "Curly", surname: "Howard"},
    larry: {givenName: "Larry", surname: "Fine"}
  });
  const moe = stooges |> _.sel("li", v) |> _.first;

  assert.equal(duo |> _.children |> _.first  |> _.text, "Abbott");
  assert.equal(duo |> _.children |> _.second |> _.text, "Costello");
  assert.equal(stooges |> _.members |>_.fpipe(_.children, _.children) |> _.ftap(_.also(_.parent, v)) |> _.count, 4);
  assert.equal(stooges |> _.leaves |> _.count, 3);
  assert.equal(moe |> _.text, "Moe Howard", "Found by tag");
  assert.deepEqual(stooges |> _.sel("li", v) |> _.map(_.get(v, "id"), v) |> _.toArray, ["moe", "curly", "larry"], "Extracted ids");
  assert.equal({givenName: "Curly", surname: "Howard"} |> who |> _.text, "Curly Howard");
  assert.deepEqual(moe |> _.classes |> _.conj(v, "main") |> _.deref, ["main"]);
  assert.equal(moe |> _.assoc(v, "data-tagged", "tests") |> _.get(v, "data-tagged"), "tests");
  stooges |> _.append(v, div({id: 'branding'}, span("Three Blind Mice")));
  assert.ok(stooges |> _.sel("#branding", v) |> _.first |> (el => el instanceof HTMLDivElement), "Found by id");
  assert.deepEqual(stooges |> _.sel("#branding span", v) |> _.map(_.text, v) |> _.first, "Three Blind Mice", "Read text content");
  const greeting = stooges |> _.sel("#branding span", v) |> _.first;
  _.hide(greeting);
  assert.deepEqual(greeting |> _.style |> _.deref, {display: "none"}, "Hidden");
  assert.equal(greeting |> _.style |> _.get(v, "display"), "none");
  _.show(greeting);
  assert.deepEqual(greeting |> _.style |> _.deref, {}, "Shown");
  const branding = stooges |> _.sel("#branding", v) |> _.first;
  _.yank(branding);
  assert.equal(branding |> _.parent |> _.first, null, "Removed");
});

QUnit.test("transducers", function(assert){
  assert.deepEqual([1,2,3] |> _.cycle |> _.into([], _.comp(_.transducers.take(4), _.transducers.map(_.inc)), v), [2,3,4,2]);
  assert.deepEqual([1, 3, 2, 2, 3] |> _.into([], _.transducers.dedupe(), v), [1,3,2,3]);
  assert.deepEqual([1, 3, 2, 2, 3] |> _.into([], _.transducers.filter(_.isEven), v), [2,2]);
});

QUnit.test("iinclusive", function(assert){
  const charlie = {name: "Charlie", iq: 120, hitpoints: 30};
  assert.ok(charlie |> _.includes(v, ["name", "Charlie"]));
  assert.notOk(charlie |> _.includes(v, ["name", "Charles"]));
});

QUnit.test("ilookup", function(assert){
  assert.equal(stooges |> _.get(v, 2), "Moe");
  assert.equal(pieces |> _.get(v, "pawn"), 1);
  assert.equal(worth |> _.getIn(v, ["pieces", "queen"]), 10);
  var boris = {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }};
  var moe = {givenName: "Moe", surname: "Howard"};
  var givenName = _.overload(null, _.get(v, "givenName"), _.assoc(v, "givenName", v)); //lens
  var getAddressLine1 = _.pipe(_.maybe, _.fmap(v, _.get(v, "address"), _.get(v, "lines"), _.get(v, 1)), _.otherwise(v, ""));
  assert.equal(moe   |> getAddressLine1, "");
  assert.equal(boris |> getAddressLine1, "Suite 401");
  assert.equal(boris |> _.maybe |> _.fmap(v, _.get(v, "address"), _.get(v, "lines"), _.get(v, 1)) |> _.otherwise(v, ""), "Suite 401");
  assert.equal(boris |> _.getIn(v, ["address", "lines", 1]), "Suite 401");
  assert.equal(boris |> _.getIn(v, ["address", "lines", 2]), null);
  assert.deepEqual(boris |> _.assocIn(v, ["address", "lines", 1], "attn: Finance Dept."), {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "attn: Finance Dept."],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }})
  assert.deepEqual(boris |> _.updateIn(v, ["address", "lines", 1], _.upperCase), {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "SUITE 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }});
  assert.deepEqual(boris, {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }});
  assert.equal(givenName(moe), "Moe");
  assert.deepEqual(givenName(moe, "Curly"), {givenName: "Curly", surname: "Howard"});
  assert.deepEqual(moe, {givenName: "Moe", surname: "Howard"}, "no lens mutation");
  assert.equal(["ace", "king", "queen"] |> _.get(v, 2), "queen");
});

QUnit.test("iassociative", function(assert){
  assert.equal(stooges |> _.assoc(v, 0, "Larry"), stooges, "maintain referential equivalence");
  assert.deepEqual(stooges |> _.assoc(v, 0, "Shemp"), ["Shemp","Curly","Moe"]);
  assert.deepEqual(court |> _.assoc(v, "ace", 14), {jack: 11, queen: 12, king: 13, ace: 14});
  assert.deepEqual(worth |> _.assocIn(v, ["court","ace"], 1), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {ace: 1, jack: 11, queen: 12, king: 13}});
  assert.deepEqual(worth |> _.assocIn(v, ["court","king"], Infinity), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: Infinity}});
  assert.deepEqual(court |> _.update(v, "jack", _.plus(v, -10)), {jack: 1, queen: 12, king: 13});
  assert.deepEqual(worth |> _.updateIn(v, ["court","king"], _.plus(v, -10)), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: 3}});
  assert.deepEqual(stooges, ["Larry","Curly","Moe"], "no mutations occurred");
  assert.deepEqual(court, {jack: 11, queen: 12, king: 13}, "no mutations occurred");
  assert.deepEqual({surname: "Howard"} |> _.assoc(v, "givenName", "Moe"), {givenName: "Moe", surname: "Howard"});
  assert.deepEqual([1, 2, 3] |> _.assoc(v, 1, 0), [1, 0, 3]);
});

QUnit.test("icompare", function(assert){
  assert.equal(_.eq(1, 1, 1), true);
  assert.equal(_.eq(1, "1", 1.0), false);
  assert.equal(_.lt(1, 2, 3, 4), true);
  assert.equal(_.lt(1, 6, 2, 3), false);
  assert.equal(_.lte(1, 1, 2, 3, 3, 3), true);
  assert.equal(_.notEq(1, 1, 2, 2, 3, 3), true);
  assert.equal(_.notEq(3, 3, 3), false);
});

QUnit.test("iset", function(assert){
  assert.deepEqual([1, 2, 3] |> _.union(v, [2, 3, 4]) |> _.sort |> _.toArray, [1, 2, 3, 4]);
  assert.deepEqual([1, 2, 3, 4, 5] |> _.difference(v, [5, 2, 10]) |> _.sort |> _.toArray, [1, 3, 4]);
  assert.ok([1, 2, 3] |> _.superset(v, [2, 3]));
  assert.notOk([1, 2, 3] |> _.superset(v, [2, 4]));
});

QUnit.test("iappendable, iprependable", function(assert){
  assert.deepEqual(["Moe"] |> _.append(v, "Howard"), ["Moe", "Howard"]);
  assert.deepEqual({surname: "Howard"} |> _.conj(v, ['givenName', "Moe"]), {givenName: "Moe", surname: "Howard"});
  assert.deepEqual([1, 2] |> _.append(v, 3), [1, 2, 3]);
  assert.deepEqual([1, 2] |> _.prepend(v, 0), [0, 1, 2]);
});

QUnit.test("sequences", function(assert){
  assert.deepEqual(["A","B","C"] |> _.cycle |> _.take(5, v) |> _.toArray, ["A","B","C","A","B"])
  assert.deepEqual(_.integers() |> _.take(5, v) |> _.toArray, [1,2,3,4,5]);
  assert.deepEqual(["A","B","C"] |> _.rest |> _.toArray, ["B", "C"]);
  assert.deepEqual(_.repeatedly(3, _.constantly(4)) |> _.toArray, [4,4,4]);
  assert.deepEqual(stooges |> _.concat(v, ["Shemp","Corey"]) |> _.toArray, ["Larry","Curly","Moe","Shemp","Corey"]);
  assert.deepEqual(_.range(4) |> _.toArray, [0,1,2,3]);
  assert.equal(stooges |> _.second, "Curly");
  assert.equal([1,2,3] |> _.some(_.isEven, v), true);
  assert.equal([1,2,3] |> _.notAny(_.isEven, v), false);
  assert.equal([2,4,6] |> _.every(_.isEven, v), true);
  assert.deepEqual([9,8,7,6,5,4,3] |> _.dropLast(3, v) |> _.toArray, [9,8,7,6]);
  assert.deepEqual(stooges |> _.sort |> _.toArray, ["Curly","Larry","Moe"])
  assert.deepEqual(["A","B",["C","D"],["E", ["F", "G"]]] |> _.flatten |> _.toArray, ["A","B","C","D","E","F","G"]);
  assert.deepEqual(pieces |> _.selectKeys(v, ["pawn", "knight"]), {pawn: 1, knight: 3});
  assert.deepEqual(["A","B","C","D","E"] |> _.interleave(v, _.repeat("="), _.integers()) |> _.toArray, ["A","=",1,"B","=",2,"C","=",3,"D","=",4,"E","=",5]);
  assert.deepEqual([1,2,3] |> _.interleave(v, [10,11,12]) |> _.toArray, [1,10,2,11,3,12]);
  assert.equal([false, true] |> _.some(_.isTrue, v), true);
  assert.equal([false, true] |> _.some(_.isFalse, v), true);
  assert.equal([false, false] |> _.some(_.isTrue, v), null);
  assert.equal(_.range(10) |> _.detect(x => x > 5, v), 6);
  assert.notOk(_.range(10) |> _.every(x => x > 5, v));
  assert.deepEqual([1, 2, 3] |> _.empty, []);
  assert.deepEqual(null |> _.into([], v), []);
  assert.deepEqual(_.repeat(1) |> _.take(2, v) |> _.toArray, [1, 1]);
  assert.deepEqual([1, 2, 3] |> _.butlast |> _.toArray, [1, 2]);
  assert.deepEqual(["A","B","C"] |> _.interpose("-", v) |> _.toArray, ["A", "-", "B", "-", "C"]);
  assert.deepEqual(_.repeat(1) |> _.take(5, v) |> _.toArray, [1,1,1,1,1]);
  assert.deepEqual(_.repeat(1) |> _.take(5, v) |> _.conj(v, 0) |> _.conj(v, -1) |> _.toArray, [-1, 0, 1, 1, 1, 1, 1]);
  assert.deepEqual(_.range(10) |> _.take(5, v) |> _.toArray, [0, 1, 2, 3, 4]);
  assert.deepEqual(_.range(-5, 5) |> _.toArray, [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
  assert.deepEqual(_.range(-20, 100, 10) |> _.toArray, [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
  assert.deepEqual(_.range(10) |> _.drop(3, v) |> _.take(3, v) |> _.toArray, [3, 4, 5]);
  assert.deepEqual([1, 2, 3] |> _.map(_.inc, v) |> _.toArray, [2, 3, 4]);
  assert.equal([1, 2, 3, 4] |> _.some(_.isEven, v), true);
  assert.equal([1, 2, 3, 4] |> _.detect(_.isEven, v), 2);
  assert.equal(_.range(10) |> _.some(x => x > 5, v), true);
  assert.deepEqual({ace: 1, king: 2, queen: 3} |> _.selectKeys(v, ["ace", "king"]), {ace: 1, king: 2});
  assert.equal("Polo" |> _.into("Marco ", v), "Marco Polo");
  assert.deepEqual([5, 6, 7, 8, 9] |> _.filter(x => x > 6, v) |> _.into("", v), "789");
  assert.deepEqual("Polo" |> _.toArray, ["P", "o", "l", "o"]);
  assert.deepEqual([1, 2, 3] |> _.cycle |> _.take(7, v) |> _.toArray, [1, 2, 3, 1, 2, 3, 1]);
  assert.deepEqual([1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7] |> _.dedupe |> _.toArray, [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual([1, 2, 3, 1, 4, 3, 4, 3, 2, 2] |> _.distinct |> _.toArray, [1, 2, 3, 4]);
  assert.deepEqual(_.range(10) |> _.takeNth(2, v) |> _.toArray, [0, 2, 4, 6, 8]);
  assert.deepEqual(_.constantly(1) |> _.repeatedly |> _.take(0, v) |> _.toArray, []);
  assert.deepEqual(_.constantly(2) |> _.repeatedly |> _.take(10, v) |> _.toArray, [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  assert.deepEqual(_.range(10) |> _.take(5, v) |> _.toArray, [0, 1, 2, 3, 4]);
  assert.deepEqual(_.range(10) |> _.filter(x => x > 5, v) |> _.toArray, [6, 7, 8, 9]);
  assert.deepEqual(_.range(10) |> _.remove(x => x > 5, v) |> _.toArray, [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(_.range(10) |> _.takeWhile(x => x < 5, v) |> _.toArray, [0, 1, 2, 3, 4]);
  assert.deepEqual(_.range(10) |> _.dropWhile(x => x > 5, v) |> _.toArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(_.range(1, 5) |> _.map(_.inc, v) |> _.toArray, [2, 3, 4, 5]);
  assert.deepEqual([10, 11, 12] |> _.map(_.inc, v) |> _.toArray, [11, 12, 13]);
  assert.deepEqual([5, 6, 7, 8, 9] |> _.filter(x => x > 6, v) |> _.map(_.inc, v) |> _.take(2, v) |> _.toArray, [8, 9]);
  assert.deepEqual(_.range(7, 15) |> _.take(10, v) |> _.toArray, [7, 8, 9, 10, 11, 12, 13, 14]);
  assert.deepEqual(_.range(5) |> _.toArray, [0, 1, 2, 3, 4]);
  assert.deepEqual(_.repeat("X") |> _.take(5, v) |> _.toArray, ["X", "X", "X", "X", "X"]);
  assert.deepEqual([1, 2] |> _.concat(v, [3, 4], [5, 6]) |> _.toArray, [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(["a", "b", "c", "d", "e"] |> _.keepIndexed((idx, value) => _.isOdd(idx) ? value : null, v) |> _.toArray, ["b", "d"]);
  assert.deepEqual([10, 11, 12] |> _.mapIndexed((idx, value) => [idx, _.inc(value)], v) |> _.toArray, [[0, 11], [1, 12], [2, 13]]);
  assert.deepEqual(_.everyPred(_.isEven, x => x > 10)(12,14,16), true);
  assert.equal(_.maxKey(obj => obj["king"], pieces, court), pieces);
});

QUnit.test("step, add, subtract", function(assert){
  const christmas = _.date(2017, 12, 25);
  assert.equal(christmas |> _.add(v, _.days(1)) |> _.deref, christmas |> _.step(_.days(1), v) |> _.deref);
  assert.equal(christmas |> _.add(v, _.days(1)) |> _.deref, 1514264400000);
  assert.equal(christmas |> _.add(v, _.weeks(1)) |> _.deref, 1514782800000);
  assert.equal(christmas |> _.add(v, _.months(1)) |> _.deref, 1516856400000);
  assert.equal(christmas |> _.add(v, _.years(1)) |> _.deref, 1545714000000);
  assert.equal(christmas |> _.subtract(v, _.years(1)) |> _.deref, 1482642000000);
});

QUnit.test("record", function(assert){
  function Person(name, surname, dob){
    this.attrs = {name, surname, dob};
  }
  _.record(Person);
  const sean  = new Person("Sean", "Penn", _.date(1960, 8, 17));
  const robin = Person.create("Robin", "Wright", new Date(1966, 3, 8));
  const dylan = Person.from({name: "Dylan", surname: "Penn", dob: _.date(1991, 4, 13)});
  assert.equal(robin |> _.get(v, "surname"), "Wright");
  assert.equal(robin |> _.assoc(v, "surname", "Penn") |> _.get(v, "surname"), "Penn");
  assert.equal(sean |> _.get(v, "surname"), "Penn");
  assert.equal(_.count(robin), 3);
});

QUnit.test("observable", function(assert){
  const button = _.tag('button');
  const tally = button("Tally");
  const clicks = _.observable(0);
  tally.click();
  assert.equal(clicks |> _.deref, 0);
  const tallied = _.click(tally);
  _.sub(tallied, function(){
    _.swap(clicks, _.inc);
  });
  _.sub(tallied, _.noop);
  tally.click();
  _.dispose(tallied);
  tally.click();
  const source = _.observable(0);
  const sink   = _.signals.signal(_.transducers.map(_.inc), source);
  const msink  = _.fmap(source, _.inc);
  source |> _.swap(v, _.inc);
  assert.equal(clicks |> _.deref, 1);
  assert.equal(source |> _.deref, 1);
  assert.equal(sink   |> _.deref, 2);
  assert.equal(msink  |> _.deref, 2);
  const bucket = _.observable([], null, _.pipe(_.get(v, 'length'), _.lt(v, 3))),
        states = _.observable([]);
  bucket |> _.sub(v, state => states |> _.swap(v, _.conj(v, state)));
  bucket |> _.swap(v, _.conj(v, "ice"));
  bucket |> _.swap(v, _.conj(v, "champagne"));
  assert.throws(function(){
    bucket |> _.swap(v, _.conj(v, "soda"));
  });
  bucket |> _.swap(v, _.assoc(v, 1, "wine"));
  assert.deepEqual(bucket |> _.deref, ["ice", "wine"]);
  assert.deepEqual(states |> _.deref, [[], ["ice"], ["ice", "champagne"], ["ice", "wine"]]);
});

QUnit.test("immutable updates", function(assert){
  const duos = _.observable([["Hall", "Oates"], ["Laurel", "Hardy"]]),
        get0 = _.pipe(_.deref, _.nth(v, 0)),
        get1 = _.pipe(_.deref, _.nth(v, 1)),
        get2 = _.pipe(_.deref, _.nth(v, 2)),
        d0 = get0(duos),
        d1 = get1(duos),
        d2 = get2(duos),
        states = _.observable([]),
        txn = _.pipe(
          _.conj(v, ["Andrew Ridgeley", "George Michaels"]),
          _.assocIn(v, [0, 0], "Daryl"),
          _.assocIn(v, [0, 1], "John"));
  duos |> _.sub(v, state => states |> _.swap(v, _.conj(v, state)));
  duos |> _.swap(v, txn);
  assert.equal(states |> _.deref |> _.count, 2, "original + transaction");
  assert.deepEqual(duos |> _.deref, [["Daryl", "John"], ["Laurel", "Hardy"], ["Andrew Ridgeley", "George Michaels"]]);
  assert.notOk(d0 |> _.isIdentical(v, get0(duos)), "new container for");
  assert.ok(d1 |> _.isIdentical(v, get1(duos)), "original container untouched");
  assert.notOk(d2 |> _.isIdentical(v, get2(duos)), "created from nothing");
  assert.notOk(d2, "non-existent");
});

QUnit.test("list", function(assert){
  assert.deepEqual(_.list() |> _.toArray, []);
  assert.deepEqual(_.list(0) |> _.toArray, [0]);
  assert.deepEqual(_.list(0, 1, 2) |> _.toArray, [0, 1, 2]);
});

QUnit.test("strings", function(assert){
  assert.deepEqual("I like peanutbutter" |> _.split(v, " "), ["I", "like", "peanutbutter"]);
  assert.deepEqual("q1w2e3r4t5y6u7i8o9p" |> _.split(v, /\d/), ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
  assert.deepEqual("q1w2e3r4t5y6u7i8o9p" |> _.split(v, /\d/, 4), ["q", "w", "e", "r4t5y6u7i8o9p"]);
  assert.equal("reading" |> _.subs(v, 3), "ding");
  assert.equal("reading" |> _.subs(v, 0, 4), "read");
  assert.equal(["spam", null, "eggs", "", "spam"] |> _.join(", ", v), "spam, , eggs, , spam");
  assert.equal([1, 2, 3] |> _.join(", ", v), "1, 2, 3");
  assert.equal(["ace", "king", "queen"] |> _.join("-", v), "ace-king-queen");
  assert.equal(["hello", " ", "world"] |> _.join("", v), "hello world");
});

QUnit.test("min/max", function(assert){
  assert.equal(_.min(-9, 9, 0), -9);
  assert.equal(_.max(-9, 9, 0),  9);
});

QUnit.test("indexed-seq", function(assert){
  const nums = _.indexedSeq([11,12,13,14], 1);
  const letters = _.indexedSeq("grace");
  assert.equal(letters |> _.first, "g");
  assert.equal(letters |> _.nth(v, 2), "a");
  assert.equal(nums |> _.first, 12);
  assert.equal(nums |> _.nth(v, 1), 13);
  assert.equal(nums |> _.count, 3);
  assert.ok(nums |> _.satisfies(_.IReduce, v));
  assert.equal(nums |> _.reduce(_.plus, 0, v), 39);
});

QUnit.test("equality", function(assert){
  assert.ok("Curly" |> _.eq(v, "Curly"), "Equal strings");
  assert.notOk("Curlers" |> _.eq(v, "Curly"), "Unequal strings");
  assert.ok("Curlers" |> _.notEq(v, "Curly"), "Unequal strings");
  assert.ok(45 |> _.eq(v, 45), "Equal numbers");
  assert.ok([1, 2, 3] |> _.eq(v, [1, 2, 3]), "Equal arrays");
  assert.notOk([1, 2, 3] |> _.eq(v, [2, 3]), "Unequal arrays");
  assert.notOk([1, 2, 3] |> _.eq(v, [3, 2, 1]), "Unequal arrays");
  assert.ok({fname: "Moe", lname: "Howard"} |> _.eq(v, {fname: "Moe", lname: "Howard"}), "Equal objects");
  assert.notOk({fname: "Moe", middle: "Harry", lname: "Howard"} |> _.eq(v, {fname: "Moe", lname: "Howard"}), "Unequal objects");
});

QUnit.test("coersion", function(assert){
  assert.deepEqual([["Moe", "Howard"], ["Curly", "Howard"]] |> _.toObject, {Moe: "Howard", Curly: "Howard"});
  assert.deepEqual({Moe: "Howard", Curly: "Howard"} |> _.toArray, [["Moe", "Howard"], ["Curly", "Howard"]]);
});

QUnit.test("predicates", function(assert){
  //assert.ok(_.chain({ace: 1, king: 2, queen: 3}, matches({ace: 1, king: 2})));
  assert.equal(_.any(3, 1), 3);
  assert.equal(_.any(null, 1), 1);
  assert.equal(_.all(3, 1), 1);
  assert.equal(_.all(null, 1), null);
});

QUnit.test("unless", function(assert){
  const odd = _.unless(_.isOdd, _.inc);
  assert.equal(odd(1), 1);
  assert.equal(odd(2), 3);
});