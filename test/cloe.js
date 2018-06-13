import * as _ from "../src/main-pointfree.js";
import * as s from "../src/signals";
import * as t from "../src/transducers";
import * as p from "../src/protocols";

Object.assign(window, {_: _, s: s, t: t});

var stooges = ["Larry","Curly","Moe"],
    pieces  = {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity},
    court   = {jack: 11, queen: 12, king: 13},
    worth   = {pieces: pieces, court: court};

QUnit.test("sequences", function(assert){
  assert.deepEqual(_.chain(["A","B","C"], _.cycle, _.take(5), _.toArray), ["A","B","C","A","B"])
  assert.deepEqual(_.chain(_.integers(), _.take(5), _.toArray), [1,2,3,4,5]);
  assert.deepEqual(_.chain(["A","B","C"], _.rest, _.toArray), ["B", "C"]);
  assert.deepEqual(_.chain(_.repeatedly(3, _.constantly(4)), _.toArray), [4,4,4]);
  assert.deepEqual(_.chain(stooges, _.concat(["Shemp","Corey"]), _.toArray), ["Larry","Curly","Moe","Shemp","Corey"]);
  assert.deepEqual(_.chain(_.range(4), _.toArray), [0,1,2,3]);
  //assert.equal(_.chain(stooges, _.second), "Curly");
  assert.equal(_.chain([1,2,3], _.some(_.isEven)), true);
  assert.equal(_.chain([1,2,3], _.notAny(_.isEven)), false);
  assert.equal(_.chain([2,4,6], _.every(_.isEven)), true);
  assert.deepEqual(_.chain([9,8,7,6,5,4,3], _.dropLast(3), _.toArray), [9,8,7,6]);
  assert.deepEqual(_.chain(stooges, _.sort(), _.toArray), ["Curly","Larry","Moe"])
  assert.deepEqual(_.chain(["A","B",["C","D"],["E", ["F", "G"]]], _.flatten, _.toArray), ["A","B","C","D","E","F","G"]);
  assert.deepEqual(_.chain(pieces, _.selectKeys(["pawn", "knight"])), {pawn: 1, knight: 3});
  //assert.deepEqual(_.chain(["A","B","C","D","E"], _.interleave(_.repeat("="), _.integers()), _.toArray), ["A","=",1,"B","=",2,"C","=",3,"D","=",4,"E","=",5]);
  //assert.deepEqual(_.chain([1,2,3], _.interleave([10,11,12]), _.toArray), [1,10,2,11,3,12]);
  assert.deepEqual(_.everyPred(_.isEven, function(x){
    return x > 10;
  })(12,14,16), true);
  assert.equal(_.maxKey(function(obj){
    return obj["king"];
  }, pieces, court), pieces);
});

QUnit.test("sequences2", function(assert){
  assert.equal(_.chain([false, true], _.some(_.isTrue)), true);
  assert.equal(_.chain([false, true], _.some(_.isFalse)), true);
  assert.equal(_.chain([false, false], _.some(_.isTrue)), null);
  assert.equal(_.chain(_.range(10), _.detect(x => x > 5)), 6);
  assert.notOk(_.chain(_.range(10), _.every(x => x > 5)));
  assert.deepEqual(_.chain([1, 2, 3], _.empty), []);
  assert.deepEqual(_.chain(null, _.into([])), []);
  assert.deepEqual(_.chain(_.repeat(1), _.take(2), _.toArray), [1, 1]);
  assert.deepEqual(_.chain([1, 2, 3], _.butlast, _.toArray), [1, 2]);
  assert.deepEqual(_.chain(["A","B","C"], _.interpose("-"), _.toArray), ["A", "-", "B", "-", "C"]);
  assert.deepEqual(_.chain(_.repeat(1), _.take(5), _.toArray), [1,1,1,1,1]);
  assert.deepEqual(_.chain(_.repeat(1), _.take(5), _.conj(0), _.conj(-1), _.toArray), [-1, 0, 1, 1, 1, 1, 1]);
  assert.deepEqual(_.chain(_.range(10), _.take(5), _.toArray), [0, 1, 2, 3, 4]);
  assert.deepEqual(_.chain(_.range(-5, 5), _.toArray), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
  assert.deepEqual(_.chain(_.range(-20, 100, 10), _.toArray), [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
  assert.deepEqual(_.chain(_.range(10), _.drop(3), _.take(3), _.toArray), [3, 4, 5]);
  assert.deepEqual(_.chain([1, 2, 3], _.map(_.inc), _.toArray), [2, 3, 4]);
  assert.equal(_.chain([1, 2, 3, 4], _.some(_.isEven)), true);
  assert.equal(_.chain([1, 2, 3, 4], _.detect(_.isEven)), 2);
  assert.equal(_.chain(_.range(10), _.some(x => x > 5)), true);
  assert.deepEqual(_.chain({ace: 1, king: 2, queen: 3}, _.selectKeys(["ace", "king"])), {ace: 1, king: 2});
  assert.equal(_.chain("Polo", _.into("Marco ")), "Marco Polo");
  assert.deepEqual(_.chain([5, 6, 7, 8, 9], _.filter(x => x > 6), _.into("")), "789");
  assert.deepEqual(_.chain("Polo", _.toArray), ["P", "o", "l", "o"]);
  assert.deepEqual(_.chain([1, 2, 3], _.cycle, _.take(7), _.toArray), [1, 2, 3, 1, 2, 3, 1]);
  assert.deepEqual(_.chain([1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7], _.dedupe, _.toArray), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(_.chain([1, 2, 3, 1, 4, 3, 4, 3, 2, 2], _.distinct, _.toArray), [1, 2, 3, 4]);
  assert.deepEqual(_.chain(_.range(10), _.takeNth(2), _.toArray), [0, 2, 4, 6, 8]);
  assert.deepEqual(_.chain(1, _.constantly, _.repeatedly, _.take(0), _.toArray), []);
  assert.deepEqual(_.chain(2, _.constantly, _.repeatedly, _.take(10), _.toArray), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  assert.deepEqual(_.chain(_.range(10), _.take(5), _.toArray), [0, 1, 2, 3, 4]);
  assert.deepEqual(_.chain(_.range(10), _.filter(x => x > 5), _.toArray), [6, 7, 8, 9]);
  assert.deepEqual(_.chain(_.range(10), _.remove(x => x > 5), _.toArray), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(_.chain(_.range(10), _.takeWhile(x => x < 5), _.toArray), [0, 1, 2, 3, 4]);
  assert.deepEqual(_.chain(_.range(10), _.dropWhile(x => x > 5), _.toArray), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(_.chain(_.range(1, 5), _.map(_.inc), _.toArray), [2, 3, 4, 5]);
  assert.deepEqual(_.chain([10, 11, 12], _.map(_.inc), _.toArray), [11, 12, 13]);
  assert.deepEqual(_.chain([5, 6, 7, 8, 9], _.filter(x => x > 6), _.map(_.inc), _.take(2), _.toArray), [8, 9]);
  assert.deepEqual(_.chain(_.range(7, 15), _.take(10), _.toArray), [7, 8, 9, 10, 11, 12, 13, 14]);
  assert.deepEqual(_.chain(_.range(5), _.toArray), [0, 1, 2, 3, 4]);
  assert.deepEqual(_.chain("X", _.repeat, _.take(5), _.toArray), ["X", "X", "X", "X", "X"]);
  assert.deepEqual(_.chain([1, 2], _.concat([3, 4], [5, 6]), _.toArray), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(_.chain(["a", "b", "c", "d", "e"], _.keepIndexed(function(idx, value){
    if (_.isOdd(idx)) return value;
  }), _.toArray), ["b", "d"]);
  assert.deepEqual(_.chain([10, 11, 12], _.mapIndexed(function(idx, value){
    return [idx, _.inc(value)];
  }), _.toArray), [[0, 11], [1, 12], [2, 13]]);
});




QUnit.test("ilookup", function(assert){
  assert.equal(_.chain(stooges, _.get(2)), "Moe");
  assert.equal(_.chain(pieces, _.get("pawn")), 1);
  assert.equal(_.chain(worth, _.getIn(["pieces", "queen"])), 10);
});

QUnit.test("iassociative", function(assert){
  assert.equal(_.chain(stooges, _.assoc(0, "Larry")), stooges, "maintain referential equivalence");
  assert.deepEqual(_.chain(stooges, _.assoc(0, "Shemp")), ["Shemp","Curly","Moe"]);
  assert.deepEqual(_.chain(court, _.assoc("ace", 14)), {jack: 11, queen: 12, king: 13, ace: 14});
  assert.deepEqual(_.chain(worth, _.assocIn(["court","ace"], 1)), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {ace: 1, jack: 11, queen: 12, king: 13}});
  assert.deepEqual(_.chain(worth, _.assocIn(["court","king"], Infinity)), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: Infinity}});
  assert.deepEqual(_.chain(court, _.update("jack", _.plus(-10))), {jack: 1, queen: 12, king: 13});
  assert.deepEqual(_.chain(worth, _.updateIn(["court","king"], _.plus(-10))), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: 3}});
  assert.deepEqual(stooges, ["Larry","Curly","Moe"], "no mutations occurred");
  assert.deepEqual(court, {jack: 11, queen: 12, king: 13}, "no mutations occurred");
});

QUnit.test("comparisons", function(assert){
  assert.equal(_.chain(1, _.eq(1, 1)), true);
  assert.equal(_.chain(1, _.eq("1", 1.0)), false);
  assert.equal(_.chain(1, _.lt(2, 3, 4)), true);
  assert.equal(_.chain(1, _.lt(6, 2, 3)), false);
  assert.equal(_.chain(1, _.lte(1, 2, 3, 3, 3)), true);
  assert.equal(_.chain(1, _.notEq(1, 2, 2, 3, 3)), true);
  assert.equal(_.chain(3, _.notEq(3, 3)), false);
});

QUnit.test("transduce", function(assert){
  assert.deepEqual(_.chain([1,2,3], _.cycle, _.into([], _.comp(t.take(4), t.map(_.inc)))), [2,3,4,2]);
});

QUnit.test("step, add, subtract", function(assert){
  assert.equal(_.chain(new Date(2017, 11, 25), _.add(_.days(1)), _.deref), _.chain(new Date(2017, 11, 25), _.add(1), _.deref));
  assert.equal(_.chain(new Date(2017, 11, 25), _.add(_.days(1)), _.deref), _.chain(new Date(2017, 11, 25), _.step(_.days(1)), _.deref));
  assert.equal(_.chain(new Date(2017, 11, 25), _.add(_.days(1)), _.deref), 1514264400000);
  assert.equal(_.chain(new Date(2017, 11, 25), _.add(_.weeks(1)), _.deref), 1514782800000);
  assert.equal(_.chain(new Date(2017, 11, 25), _.add(_.months(1)), _.deref), 1516856400000);
  assert.equal(_.chain(new Date(2017, 11, 25), _.add(_.years(1)), _.deref), 1545714000000);
  assert.equal(_.chain(new Date(2017, 11, 25), _.subtract(_.years(1)), _.deref), 1482642000000);
});

QUnit.test("record", function(assert){
  function Person(name, surname, dob){
    this.attrs = {name, surname, dob};
  }
  _.record(Person);
  const sean   = new Person("Sean", "Penn", new Date(1960, 7, 17));
  const robin  = Person.create("Robin", "Wright", new Date(1966, 3, 8));
  const dylan  = Person.from({name: "Dylan", surname: "Penn", dob: new Date(1991, 3, 13)});
  assert.equal(_.chain(robin, _.get("surname")), "Wright");
  assert.equal(_.chain(robin, _.assoc("surname", "Penn"), _.get("surname")), "Penn");
  assert.equal(_.chain(sean, _.get("surname")), "Penn");
  assert.equal(_.count(robin), 3);
});

QUnit.test("observable", function(assert){
  const source = _.observable(0);
  const sink   = s.signal(t.map(_.inc), null, source);
  _.chain(source, _.swap(_.inc));
  assert.equal(_.deref(source), 1);
  assert.equal(_.deref(sink)  , 2);
  const bucket = _.observable([], null, _.pipe(_.get('length'), _.lt(3))),
        states = _.observable([]);
  _.chain(bucket, _.sub(function(state){
    _.chain(states, _.swap(_.conj(state)));
  }));
  _.chain(bucket, _.swap(_.conj("ice")));
  _.chain(bucket, _.swap(_.conj("champagne")));
  assert.throws(function(){
    _.chain(bucket, _.swap(_.conj("soda")));
  });
  _.chain(bucket, _.swap(_.assoc(1, "wine")));
  assert.deepEqual(_.deref(bucket), ["ice", "wine"]);
  assert.deepEqual(_.deref(states), [[], ["ice"], ["ice", "champagne"], ["ice", "wine"]]);
});

QUnit.test("immutable updates", function(assert){
  const duos = _.observable([["Hall", "Oates"], ["Laurel", "Hardy"]]),
        get0 = _.pipe(_.deref, _.nth(0)),
        get1 = _.pipe(_.deref, _.nth(1)),
        get2 = _.pipe(_.deref, _.nth(2)),
        d0 = get0(duos),
        d1 = get1(duos),
        d2 = get2(duos),
        states = _.observable([]),
        txn = _.pipe(
          _.conj(["Andrew Ridgeley", "George Michaels"]),
          _.assocIn([0, 0], "Daryl"),
          _.assocIn([0, 1], "John"));
  _.chain(duos, _.sub(function(state){
    _.chain(states, _.swap(_.conj(state)));
  }));
  _.chain(duos, _.swap(txn));
  assert.equal(_.chain(states, _.deref, _.count), 2, "original + transaction");
  assert.deepEqual(_.deref(duos), [["Daryl", "John"], ["Laurel", "Hardy"], ["Andrew Ridgeley", "George Michaels"]]);
  assert.notOk(_.chain(d0, _.isIdentical(get0(duos))), "new container for");
  assert.ok(_.chain(d1, _.isIdentical(get1(duos))), "original container untouched");
  assert.notOk(_.chain(d2, _.isIdentical(get2(duos))), "created from nothing");
  assert.notOk(d2, "non-existent");
});

QUnit.test("set-like operations", function(assert){
  assert.deepEqual(_.chain([1, 2, 3], _.union([2, 3, 4]), _.sort(), _.toArray), [1, 2, 3, 4]);
  assert.deepEqual(_.chain([1, 2, 3, 4, 5], _.difference([5, 2, 10]), _.sort(), _.toArray), [1, 3, 4]);
  assert.ok(_.chain([1, 2, 3], _.superset([2, 3])));
  assert.notOk(_.chain([1, 2, 3], _.superset([2, 4])));
});

QUnit.test("list", function(assert){
  assert.deepEqual(_.chain(_.list(), _.toArray), []);
  assert.deepEqual(_.chain(_.list(0), _.toArray), [0]);
  assert.deepEqual(_.chain(_.list(0, 1, 2), _.toArray), [0, 1, 2]);
});

QUnit.test("has", function(assert){
  const charlie = {name: "Charlie", iq: 120, hitpoints: 30};
  assert.ok(_.chain(charlie, _.includes(["name", "Charlie"])));
  assert.notOk(_.chain(charlie, _.includes(["name", "Charles"])));
});

QUnit.test("assoc", function(assert){
  assert.deepEqual(_.chain({sn: "Howard"}, _.assoc("givenName", "Moe")), {givenName: "Moe", sn: "Howard"});
  assert.deepEqual(_.chain([1, 2, 3], _.assoc(1, 0)), [1, 0, 3]);
});

/*QUnit.test("strings", function(assert){
  assert.deepEqual(_.chain("I like peanutbutter", _.split(" ")), ["I", "like", "peanutbutter"]);
  assert.deepEqual(_.chain("q1w2e3r4t5y6u7i8o9p", _.split(/\d/)), ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
  assert.deepEqual(_.chain("q1w2e3r4t5y6u7i8o9p", _.split(/\d/, 4)), ["q", "w", "e", "r4t5y6u7i8o9p"]);
  assert.equal(_.chain("reading", _.subs(3)), "ding");
  assert.equal(_.chain("reading", _.subs(0, 4)), "read");
  assert.equal(_.chain(["spam", null, "eggs", "", "spam"], _.join(", ")), "spam, , eggs, , spam");
  assert.equal(_.chain([1, 2, 3], _.join(", ")), "1, 2, 3");
  assert.equal(_.chain(["ace", "king", "queen"], _.join("-")), "ace-king-queen");
  assert.equal(_.chain(["hello", " ", "world"], _.join("")), "hello world");
});*/

QUnit.test("append/prepend", function(assert){
  assert.deepEqual(_.chain(["Moe"], _.append("Howard")), ["Moe", "Howard"]);
  assert.deepEqual(_.chain({sn: "Howard"}, _.conj(['givenName', "Moe"])), {givenName: "Moe", sn: "Howard"});
  assert.deepEqual(_.chain([1, 2], _.append(3)), [1, 2, 3]);
  assert.deepEqual(_.chain([1, 2], _.prepend(0)), [0, 1, 2]);
});

QUnit.test("min/max", function(assert){
  assert.equal(_.chain(-9, _.min(9, 0)), -9);
  assert.equal(_.chain(-9, _.max(9, 0)),  9);
});

QUnit.test("indexed-seq", function(assert){
  const nums = _.indexedSeq([11,12,13,14], 1);
  const letters = _.indexedSeq("grace");
  assert.equal(_.chain(letters, _.first), "g");
  assert.equal(_.chain(letters, _.nth(2)), "a");
  assert.equal(_.chain(nums, _.first), 12);
  assert.equal(_.chain(nums, _.nth(1)), 13);
  assert.equal(_.chain(nums, _.count), 3);
  assert.ok(_.chain(nums, _.satisfies(p.IReduce)));
  assert.equal(_.chain(nums, _.reduce(_.plus(), 0)), 39);
});

QUnit.test("equality", function(assert){
  assert.ok(_.chain("Curly", _.eq("Curly")), "Equal strings");
  assert.notOk(_.chain("Curlers", _.eq("Curly")), "Unequal strings");
  assert.ok(_.chain("Curlers", _.notEq("Curly")), "Unequal strings");
  assert.ok(_.chain(45, _.eq(45)), "Equal numbers");
  assert.ok(_.chain([1, 2, 3], _.eq([1, 2, 3])), "Equal arrays");
  assert.notOk(_.chain([1, 2, 3], _.eq([2, 3])), "Unequal arrays");
  assert.notOk(_.chain([1, 2, 3], _.eq([3, 2, 1])), "Unequal arrays");
  assert.ok(_.chain({fname: "Moe", lname: "Howard"}, _.eq({fname: "Moe", lname: "Howard"})), "Equal objects");
  assert.notOk(_.chain({fname: "Moe", middle: "Harry", lname: "Howard"}, _.eq({fname: "Moe", lname: "Howard"})), "Unequal objects");
});

QUnit.test("coersion", function(assert){
  assert.deepEqual(_.chain([["Moe", "Howard"], ["Curly", "Howard"]], _.toObject), {Moe: "Howard", Curly: "Howard"});
  assert.deepEqual(_.chain({Moe: "Howard", Curly: "Howard"}, _.toArray), [["Moe", "Howard"], ["Curly", "Howard"]]);
});

QUnit.test("lookup", function(assert){
  var boris = {givenName: "Boris", sn: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }};
  var moe = {givenName: "Moe", sn: "Howard"};
  var givenName = _.overload(null, _.get("givenName"), function(self, value){
    return _.assoc("givenName", value)(self);
  }); //lens
  var getAddressLine1 = _.opt(_.get("address"), _.get("lines"), _.get(1));
  assert.equal(_.chain(moe  , getAddressLine1), null);
  assert.equal(_.maybe(boris, _.get("address"), _.get("lines"), _.get(1)), "Suite 401");
  assert.equal(_.chain(boris, getAddressLine1), "Suite 401");
  assert.equal(_.chain(boris, _.getIn(["address", "lines", 1])), "Suite 401");
  assert.equal(_.chain(boris, _.getIn(["address", "lines", 2])), null);
  assert.deepEqual(_.chain(boris, _.assocIn(["address", "lines", 1], "attn: Finance Dept.")), {givenName: "Boris", sn: "Lasky", address: {
    lines: ["401 Mayor Ave.", "attn: Finance Dept."],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }})
  assert.deepEqual(_.chain(boris, _.updateIn(["address", "lines", 1], _.upperCase)), {givenName: "Boris", sn: "Lasky", address: {
    lines: ["401 Mayor Ave.", "SUITE 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }});
  assert.deepEqual(boris, {givenName: "Boris", sn: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }});
  assert.equal(givenName(moe), "Moe");
  assert.deepEqual(givenName(moe, "Curly"), {givenName: "Curly", sn: "Howard"});
  assert.deepEqual(moe, {givenName: "Moe", sn: "Howard"}, "no lens mutation");
  assert.equal(_.chain(["ace", "king", "queen"], _.get(2)), "queen");
});

QUnit.test("predicates", function(assert){
  //assert.ok(_.chain({ace: 1, king: 2, queen: 3}, matches({ace: 1, king: 2})));
  assert.equal(_.chain(3, _.any(1)), 3);
  assert.equal(_.chain(null, _.any(1)), 1);
  assert.equal(_.chain(3, _.all(1)), 1);
  assert.equal(_.chain(null, _.all(1)), null);
});


