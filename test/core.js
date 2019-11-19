import * as _ from "atomic/core";
import * as I from "atomic/immutables";
import * as dom from "atomic/dom";
import * as $ from "atomic/reactives";
import * as vd from "atomic/validates";
import * as t from "atomic/transducers";
import * as mut from "atomic/transients";
import QUnit from "qunit";
import {_ as v} from "param.macro";

const stooges = ["Larry","Curly","Moe"],
      pieces  = {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity},
      court   = {jack: 11, queen: 12, king: 13},
      worth   = {pieces: pieces, court: court};

QUnit.test("router & multimethod", function(assert){ //not just for fns!
  const f = _.doto($.router(), //router handlers need not be (but can be) fns
      mut.conj(v, $.handler(_.signature(_.isString), _.str(v, "!"), _.apply)), //use apply to spread the message against the pred and callback
      mut.conj(v, $.handler(_.signature(_.isNumber), _.multiply(v, 2), _.apply)));
  const g = _.doto(mut.multimethod(), //multimethod handlers must be fns
      mut.conj(v, mut.method(_.signature(_.isString), _.str(v, "!"))), //as a multimethod always dispatches to fns, apply is a given and need not be specified.
      mut.conj(v, mut.method(_.signature(_.isNumber), _.multiply(v, 2))));
  assert.equal($.dispatch(f, [1]), 2);
  assert.equal($.dispatch(f, ["timber"]), "timber!");
  assert.equal($.dispatch(g, [1]), 2);
  assert.equal($.dispatch(g, ["timber"]), "timber!");
  assert.equal(g(1), 2);
  assert.equal(g("timber"), "timber!");
});

QUnit.test("validation", function(assert){
  const zipCode = /^\d{5}(-\d{1,4})?$/;
  const birth = "7/10/1926";
  const past = vd.or(Date, vd.anno({type: "past"}, _.lt(v, new Date())));
  const herman = {name: ["Herman", "Munster"], status: "married", dob: new Date(birth)};
  const person = vd.and(
    vd.required('name', vd.and(vd.collOf(String), vd.card(2, 2))),
    vd.optional('status', vd.and(String, vd.choice(["single", "married", "divorced"]))),
    vd.optional('dob', past));

  const [dob] = vd.check(person, _.assoc(herman, "dob", birth));
  const [name, names] = vd.check(person, _.assoc(herman, "name", [1]));
  const [anon] = vd.check(person, _.dissoc(herman, "name"));
  const [status] = vd.check(person, _.assoc(herman, "status", "separated"));

  assert.ok(vd.check(zipCode, "17055") == null);
  assert.ok(vd.check(zipCode, 17055) == null);
  assert.ok(vd.check(zipCode, "17055-0001") == null);
  assert.ok(vd.check(zipCode, "") != null);
  assert.ok(vd.check(zipCode, null) != null);
  assert.ok(vd.check(zipCode, "1705x-0001") != null);
  assert.ok(vd.check(Number, "7") != null);
  assert.ok(vd.check(Number, parseInt, "7") == null);
  assert.ok(vd.check(Date, mut.parseDate, "11/10/2019 5:45 am") == null);
  assert.ok(vd.check(Date, mut.parseDate, "d11/10/2019 5:45 am") != null);
  assert.ok(vd.check(vd.parses(mut.parseDate, past), "1/1/3000") != null);
  assert.ok(vd.check(vd.parses(mut.parseDate, past), birth) == null);
  assert.ok(vd.check(vd.parses(mut.parseDate, past), `d${birth}`) != null);
  assert.ok(vd.check(vd.range("start", "end"), {start: 1, end: 5}) == null);
  assert.ok(vd.check(vd.range("start", "end"), {start: 1, end: 1}) == null);
  assert.ok(vd.check(vd.range("start", "end"), {start: 5, end: 1}) != null);
  assert.ok(dob.constraint === Date);
  assert.ok(name.constraint === String);
  assert.ok(names != null);
  assert.ok(anon.constraint instanceof vd.Required);
  assert.ok(status != null);
  //TODO add `when` to validate conditiontionally or allow condition to be checked before registering the validation?
});

QUnit.test("component", function(assert){
  const people =
    _.doto(
      $.component($.cell([]), function(accepts, raises, affects){
        return [{
          "add": accepts("added")
        }, {
          "added": affects(_.conj)
        }]
      }),
    $.dispatch(v, {type: "add", args: [{name: "Moe"}]}),
    $.dispatch(v, {type: "add", args: [{name: "Curly"}]}),
    $.dispatch(v, {type: "add", args: [{name: "Shemp"}]}));

  assert.equal(_.count(_.deref(people)), 3);
});

QUnit.test("dom", function(assert){
  const [ul, li, div, span] = _.mapa(_.comp(_.expands, dom.tag), ["ul", "li", "div", "span"]);
  const duo = _.doto(dom.fragment(), dom.append(v, div("Abbott")), dom.append(v, dom.element("div", "Costello")));
  const who = div(_.get(v, "givenName"), " ", _.get(v, "surname"));
  const template =
    ul(
      _.map(function([id, person]){
        return li({id: id}, who(person));
      }, v));
  const stooges = template({
    moe: {givenName: "Moe", surname: "Howard"},
    curly: {givenName: "Curly", surname: "Howard"},
    larry: {givenName: "Larry", surname: "Fine"}
  });
  const moe = stooges |> dom.sel("li", v) |> _.first;

  assert.equal(duo |> _.children |> _.first  |> dom.text, "Abbott");
  assert.equal(duo |> _.children |> _.second |> dom.text, "Costello");
  assert.equal(stooges |> _.leaves |> _.count, 3);
  assert.equal(moe |> dom.text, "Moe Howard", "Found by tag");
  assert.deepEqual(stooges |> dom.sel("li", v) |> _.map(_.get(v, "id"), v) |> _.toArray, ["moe", "curly", "larry"], "Extracted ids");
  assert.equal({givenName: "Curly", surname: "Howard"} |> who |> dom.text, "Curly Howard");
  assert.deepEqual(_.fluent(moe, dom.classes, mut.conj(v, "main"), _.deref), ["main"]);
  assert.equal(_.fluent(moe, dom.attr(v, "data-tagged", "tests"), _.get(v, "data-tagged")), "tests");
  stooges |> dom.append(v, div({id: 'branding'}, span("Three Blind Mice")));
  assert.ok(stooges |> dom.sel("#branding", v) |> _.first |> (el => el instanceof HTMLDivElement), "Found by id");
  assert.deepEqual(stooges |> dom.sel("#branding span", v) |> _.map(dom.text, v) |> _.first, "Three Blind Mice", "Read text content");
  const greeting = stooges |> dom.sel("#branding span", v) |> _.first;
  dom.hide(greeting);
  assert.deepEqual(greeting |> dom.style |> _.deref, {display: "none"}, "Hidden");
  assert.equal(greeting |> dom.style |> _.get(v, "display"), "none");
  dom.show(greeting);
  assert.deepEqual(greeting |> dom.style |> _.deref, {}, "Shown");
  const branding = stooges |> dom.sel("#branding", v) |> _.first;
  dom.yank(branding);
  assert.equal(branding |> _.parent |> _.first, null, "Removed");
});

QUnit.test("lazy-seq", function(assert){
  const effects = [],
        push    = effects.push.bind(effects),
        xs      = _.map(push, _.range(10)),
        nums    = _.map(_.identity, _.range(3)),
        blank   = _.map(_.identity, _.range(0)),
        tail    = _.rest(nums);
  assert.ok(effects.length === 0);
  _.first(xs)
  assert.ok(effects.length === 1);
  _.first(xs)
  assert.ok(effects.length === 1);
  _.second(xs);
  assert.ok(effects.length === 2);
  _.doall(xs);
  assert.ok(effects.length === 10);
  assert.ok(_.blank(blank));
  assert.ok(!_.blank(nums));
  assert.ok(_.rest(blank) instanceof _.EmptyList);
  assert.ok(_.rest(nums) instanceof _.LazySeq);
  assert.ok(_.seq(blank) == null);
  assert.ok(_.seq(nums) != null);
  assert.deepEqual(_.toArray(nums), [0,1,2]);
  assert.deepEqual(_.toArray(blank), []);
});

QUnit.test("transducers", function(assert){
  assert.deepEqual([1,2,3] |> _.cycle |> _.into([], _.comp(t.take(4), t.map(_.inc)), v), [2,3,4,2]);
  assert.deepEqual([1, 3, 2, 2, 3] |> _.into([], t.dedupe(), v), [1,3,2,3]);
  assert.deepEqual([1, 3, 2, 2, 3] |> _.into([], t.filter(_.isEven), v), [2,2]);
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
  const boris = {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }};
  const moe = {givenName: "Moe", surname: "Howard"};
  const givenName = _.overload(null, _.get(v, "givenName"), _.assoc(v, "givenName", v)); //lens
  const getAddressLine1 = _.pipe(_.maybe, _.fmap(v, _.get(v, "address"), _.get(v, "lines"), _.get(v, 1)), _.otherwise(v, ""));
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
  assert.deepEqual(_.positives |> _.take(5, v) |> _.toArray, [1,2,3,4,5]);
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
  assert.deepEqual([null, ""] |> _.flatten |> _.toArray, [null, ""]);
  assert.deepEqual(pieces |> _.selectKeys(v, ["pawn", "knight"]), {pawn: 1, knight: 3});
  assert.deepEqual(["A","B","C","D","E"] |> _.interleave(v, _.repeat("="), _.positives) |> _.toArray, ["A","=",1,"B","=",2,"C","=",3,"D","=",4,"E","=",5]);
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
  assert.deepEqual([1, 2, 3, 1, 4, 3, 4, 3, 2, 2] |> I.distinct |> _.toArray, [1, 2, 3, 4]);
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
  const newYears  = _.date(2018, 1, 1);
  const mmddyyyy  =
    _.fmt(
      _.comp(_.zeros(v, 2), _.get(v, "month")), "/",
      _.comp(_.zeros(v, 2), _.get(v, "day")), "/",
      _.comp(_.zeros(v, 4), _.get(v, "year")));
  assert.equal(christmas |> mmddyyyy, "12/25/2017");
  assert.equal(newYears  |> mmddyyyy, "01/01/2018");
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

QUnit.test("cell", function(assert){
  const button = dom.tag('button');
  const tally = button("Tally");
  const clicks = $.cell(0);
  tally.click();
  assert.equal(clicks |> _.deref, 0);
  const tallied = $.click(tally);
  $.sub(tallied, function(){
    _.swap(clicks, _.inc);
  });
  $.sub(tallied, _.noop);
  tally.click();
  _.dispose(tallied);
  tally.click();
  const source = $.cell(0);
  const sink   = $.signal(t.map(_.inc), source);
  const msink  = _.fmap(source, _.inc);
  source |> _.swap(v, _.inc);
  assert.equal(clicks |> _.deref, 1);
  assert.equal(source |> _.deref, 1);
  assert.equal(sink   |> _.deref, 2);
  assert.equal(msink  |> _.deref, 2);
  const bucket = $.cell([], $.broadcast(), _.pipe(_.get(v, 'length'), _.lt(v, 3))),
        states = $.cell([]);
  bucket |> $.sub(v, state => states |> _.swap(v, _.conj(v, state)));
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
  const duos = $.cell([["Hall", "Oates"], ["Laurel", "Hardy"]]),
        get0 = _.pipe(_.deref, _.nth(v, 0)),
        get1 = _.pipe(_.deref, _.nth(v, 1)),
        get2 = _.pipe(_.deref, _.nth(v, 2)),
        d0 = get0(duos),
        d1 = get1(duos),
        d2 = get2(duos),
        states = $.cell([]),
        txn = _.pipe(
          _.conj(v, ["Andrew Ridgeley", "George Michaels"]),
          _.assocIn(v, [0, 0], "Daryl"),
          _.assocIn(v, [0, 1], "John"));
  duos |> $.sub(v, state => states |> _.swap(v, _.conj(v, state)));
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
  const letters = _.indexedSeq(_.split("grace", ""));
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
  assert.ok({ace: 1, king: 2, queen: 3} |> _.matches(v, {ace: 1, king: 2}));
  assert.equal(_.any(3, 1), 3);
  assert.equal(_.any(null, 1), 1);
  assert.equal(_.all(3, 1), 1);
  assert.equal(_.all(null, 1), null);
});