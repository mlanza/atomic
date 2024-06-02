import _ from "../dist/atomic_/core.js";
import dom from "../dist/atomic_/dom.js";
import $ from "../dist/atomic_/shell.js";
import vd from "../dist/atomic_/validates.js";
import {failed, adding, test} from "./test.js";
import "../dist/cmd.js";

const stooges = ["Larry","Curly","Moe"],
      pieces  = {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity},
      court   = {jack: 11, queen: 12, king: 13},
      worth   = {pieces, court};

failed(function(count){
  const img = document.querySelector("#icon");
  img.setAttribute("src", "./failed.svg");
  img.setAttribute("data-count", count);
});

adding(function({check, compare}){
  const eq = compare(_.eq);
  const notEq = compare(_.notEq);
  const ako = compare(_.ako);
  const isSome = check(_.isSome, {reason: "expected something"});
  const isNil = check(_.isNil, {reason: "expected nothing"});
  return {eq, notEq, ako, isSome, isNil};
});

test("inheritance chain", function({assert, equals}){
  function Person(fname, lname){
    this.fname = fname;
    this.lname = lname;
  }
  function name(self){
    return `${self.fname} ${self.lname}`;
  }

  equals(_.name(Person), "Person");
  _.specify(_.INamable, {name: _.constantly("Human")}, Person); //on the constructor itself
  equals(_.name(Person), "Human");
  const greg = new Person("Gregory", "Porter");
  assert(!_.satisfies(_.INamable, greg));
  _.implement(_.INamable, {name}, Person);
  assert(_.satisfies(_.INamable, greg));
  equals(_.name(greg), "Gregory Porter");
  _.specify(_.INamable, {name: _.get(_, "fname")}, greg);
  equals(_.name(greg), "Gregory");
});

test("pure random", function({equals}){
  const alt = _.chance(8675309);
  const remember = alt.serialize();
  function randoms(alt){
    const uid = _.uids(5, alt.random);
    const [uid1, uid2, uid3] = _.toArray(_.repeatedly(3, uid));
    equals(uid1.id, "L4wM2");
    equals(uid2.id, "U0iFA");
    equals(uid3.id, "AHeZ8");
    const guid = _.guids(alt.random);
    const [guid1, guid2, guid3] = _.toArray(_.repeatedly(3, guid));
    equals(guid1.id, "18ebd681-151f-05d2-bebf-e9ea3fd094b5");
    equals(guid2.id, "f948e64b-f1fb-255a-52de-b3777c27201e");
    equals(guid3.id, "92803dce-b800-f706-8741-47bbe155125b");
    const [i1, i2, i3] = _.toArray(_.repeatedly(3, _.partial(_.randInt, alt.random, 100)));
    equals(i1, 30);
    equals(i2, 16);
    equals(i3, 11);
    const [r1, r2, r3] = _.toArray(_.repeatedly(3, _.partial(_.rand, alt.random, 1)));
    equals(r1, 0.6288899967912585);
    equals(r2, 0.47766544623300433);
    equals(r3, 0.12775464728474617);
  }
  randoms(alt);
  randoms(_.Chance.deserialize(remember));
});

test("type checks", function({assert}){
  assert(_.isArray([]));
  assert(_.isObject({}));
});

test("hashing", function({assert, equals, notEquals}){
  function same(x, y){
    equals(_.hash(x), _.hash(y));
    equals(_.hash(x), _.hash(x));
    assert(_.equiv(x, y));
  }
  const div = dom.tag("div");
  const hi = div("hi");
  notEquals(_.hash(div("hi")), _.hash(div("hi")));
  notEquals(_.hash({card: "ace"}), _.hash({card: "king"}));
  notEquals(_.hash(true), _.hash(false));
  notEquals(_.hash(same), _.hash(function(){}));
  notEquals(_.hash(function(){}), _.hash(function(){}));
  same(hi, hi);
  same(same, same);
  same(true, true);
  same([1, 7, 0, 1, 1], [1, 7, 0, 1, 1]);
  same(_.date(999), _.date(999));
  same({blackwidow: "Avenger"}, {blackwidow: "Avenger"});
  //same([{blackwidow: "Avenger"}, _.date(774), [1, 2]], [{blackwidow: "Avenger"}, _.date(774), [1, 2]]);
});

test("multimethods", function({equals}){ //https://www.braveclojure.com/multimethods-records-protocols/
  const fullMoon = _.multimethod(_.get(_, "wereType"),
    ({name}) => `${name} will stay up all night fantasy footballing`);
  _.addMethod(fullMoon, "wolf", ({name}) => `${name} will howl and murder`);
  _.addMethod(fullMoon, "simmons", ({name}) => `${name} will encourage people and sweat to the oldies`);
  _.addMethod(fullMoon, "bill murray", ({name}) => `${name} will be the most likeable celebrity`);
  _.addMethod(fullMoon, null, ({name}) => `${name} will stay at home and eat ice cream`);

  equals(fullMoon({wereType: "office worker", name: "Jimmy from sales"}), "Jimmy from sales will stay up all night fantasy footballing");
  equals(fullMoon({wereType: "wolf", name: "Rachel from next door"}), "Rachel from next door will howl and murder");
  equals(fullMoon({wereType: "simmons", name: "Andy the baker"}), "Andy the baker will encourage people and sweat to the oldies");
  equals(fullMoon({wereType: "bill murray", name: "Laura the intern"}), "Laura the intern will be the most likeable celebrity");
  equals(fullMoon({wereType: null, name: "Martin the nurse"}), "Martin the nurse will stay at home and eat ice cream");
  equals(fullMoon({name: "Jocco the vet"}), "Jocco the vet will stay at home and eat ice cream"); //undefined/null is nil

  const types = _.multimethod((x, y) => [typeof x, typeof y]);
  _.addMethod(types, ["string", "string"], ()=> "Two strings!");

  equals(types("String 1", "String 2"), "Two strings!");
});

test("protcols", function({equals}){ //https://www.braveclojure.com/multimethods-records-protocols/
  const IPsychodynamics = _.protocol({
    thoughts: (x) =>  "The data type's innermost thoughts",
    feelingsAbout: () => "Feelings about self or other"
  });
  const {thoughts, feelingsAbout} = IPsychodynamics;

  (function(){
    function feelingsAbout1(x){
      return _.str(x, " is longing for a simpler way of life");
    }
    function feelingsAbout2(x, y){
      return _.str(x, " is envious of ", y, "'s simpler way of life");
    }
    const feelingsAbout = _.overload(null, feelingsAbout1, feelingsAbout2);
    const thoughts = (x) => _.str(x, " thinks, 'Truly, the character defines the data type'");

    _.doto(String,
      _.implement(IPsychodynamics, {
        thoughts,
        feelingsAbout
      }));
  })();

  equals(thoughts("blorb"), "blorb thinks, 'Truly, the character defines the data type'");
  equals(feelingsAbout("schmorb"), "schmorb is longing for a simpler way of life");
  equals(feelingsAbout("schmorb", 2), "schmorb is envious of 2's simpler way of life");

  const behave = (function(){
    function feelingsAbout1(x){
      return "meh";
    }
    function feelingsAbout2(x, y){
      return _.str("meh about ", y);
    }
    const feelingsAbout = _.overload(null, feelingsAbout1, feelingsAbout2);
    const thoughts = () => "Maybe the Internet is just a vector for toxoplasmosis";

    return _.does(
      _.implement(IPsychodynamics, {
        thoughts,
        feelingsAbout
      }));
  })();

  //before Number is extended, falling back on defaults
  equals(thoughts(3), "The data type's innermost thoughts");
  equals(feelingsAbout(3), "Feelings about self or other");
  equals(feelingsAbout(3, "blorb"), "Feelings about self or other");

  behave(Number);

  //after Number is extended
  equals(thoughts(3), "Maybe the Internet is just a vector for toxoplasmosis");
  equals(feelingsAbout(3), "meh");
  equals(feelingsAbout(3, "blorb"), "meh about blorb");
});

test("poor man's multimethod", function({equals}){
  const join = _.guard(_.signature(_.isArray), _.join("", _));
  const exclaim = _.guard(_.signature(_.isString), _.str(_, "!"));
  const double = _.guard(_.signature(_.isNumber), _.mult(_, 2));

  const c = _.coalesce(join, exclaim, double);
  equals(_.invoke(c, 1), 2);
  equals(_.invoke(c, "timber"), "timber!");
  equals(c(1), 2);
  equals(c("timber"), "timber!");
  equals(c(["a","c","e"]), "ace");

  const d = _.coalesce(exclaim, double); //initial config
  const e = _.coalesce(d, join); //added later
  equals(e("timber"), "timber!");
  equals(e(["a","c","e"]), "ace");
});

test("validation", function({assert, ako, equals, notEquals, isNil, isSome}){
  const zipCode = /^\d{5}(-\d{1,4})?$/;
  const birth = "7/10/1926";
  const past = vd.or(Date, vd.anno({type: "past"}, _.lt(_, new Date())));
  const herman = {name: ["Herman", "Munster"], status: "married", dob: new Date(birth)};
  const person = vd.and(
    vd.required('name', vd.and(vd.collOf(String), vd.card(2, 2))),
    vd.optional('status', vd.and(String, vd.choice(["single", "married", "divorced"]))),
    vd.optional('dob', past));

  const [dob] = vd.check(person, _.assoc(herman, "dob", birth));
  const [name, names] = vd.check(person, _.assoc(herman, "name", [1]));
  const [anon] = vd.check(person, _.dissoc(herman, "name"));
  const [status] = vd.check(person, _.assoc(herman, "status", "separated"));

  isNil(vd.check(zipCode, "17055"));
  isNil(vd.check(zipCode, 17055));
  isNil(vd.check(zipCode, "17055-0001"));
  isSome(vd.check(zipCode, ""));
  isSome(vd.check(zipCode, null));
  isSome(vd.check(zipCode, "1705x-0001"));
  isSome(vd.check(Number, "7"));
  isNil(vd.check(Number, parseInt, "7"));
  isNil(vd.check(vd.range("start", "end"), {start: 1, end: 5}));
  isNil(vd.check(vd.range("start", "end"), {start: 1, end: 1}));
  isSome(vd.check(vd.range("start", "end"), {start: 5, end: 1}));
  equals(dob.constraint, Date);
  equals(name.constraint, String);
  isSome(names);
  ako(anon.constraint, vd.Required);
  isSome(status);
  //TODO add `when` to validate conditiontionally or allow condition to be checked before registering the validation?
});

test("edit/plop/grab", function({assert, isNil, notEquals, equals, eq}){
  function Kangaroo(name, pouch) {
    this.name = name;
    this.pouch = pouch;
  }

  function clone(self){
    return new Kangaroo(self.name, self.pouch);
  }

  // `edit` and `plop` provide addressable data but depend only on `ICloneable`, not `ILookup` and `IAssociative`.
  _.doto(Kangaroo, _.implement(_.ICloneable, {clone}));

  const boo = new Kangaroo("Boo", new Kangaroo("Louie", new Kangaroo("Haunch", null)));
  const boo2 = _.plopIn(boo, ["pouch", "pouch", "name"], "Gloria");
  const boo3 = _.editIn(boo, ["pouch", "pouch"], function(kangaroo){
    kangaroo.pouch = 1;
  });
  const boo4 = _.plop(boo, "name", "Foo");
  notEquals(boo, boo2);
  equals(_.grab(boo2, ["pouch", "name"]), "Louie");
  equals(_.grab(boo , ["pouch", "pouch", "name"]), "Haunch");
  equals(_.grab(boo2, ["pouch", "pouch", "name"]), "Gloria");
  isNil(_.grab(boo , ["pouch", "pouch", "pouch"]));
  equals(_.grab(boo3, ["pouch", "pouch", "pouch"]), 1);
  equals(_.grab(boo4, ["name"]), "Foo");

  //the default implementation of clone should suffice
  function Wallaby(name, pouch){
    this.name = name;
    this.pouch = pouch;
  }

  const shy = new Wallaby("Shy", new Wallaby("Flora", new Wallaby("Victor", null)));
  const shy2 = _.plopIn(shy, ["pouch", "pouch", "name"], "Valerie");
  notEquals(shy, shy2);
  equals(_.grab(shy , ["pouch", "pouch", "name"]), "Victor");
  equals(_.grab(shy2, ["pouch", "pouch", "name"]), "Valerie");

  const stooges2 = _.plop(stooges, 1, "Shemp");
  const stooges3 = _.plop(stooges, 3, "Corey");
  const stooges4 = _.edit(stooges, 2, _.upperCase);

  eq(["Larry", "Curly", "Moe"], stooges);
  eq(["Larry", "Shemp", "Moe"], stooges2);
  eq(["Larry", "Curly", "Moe", "Corey"], stooges3);
  eq(["Larry", "Curly", "MOE"], stooges4);
});

test("best", function({equals}){
  equals(_.best(_.lt, stooges), "Curly");
  equals(_.best(_.mapArgs(_.count, _.lt), stooges), "Moe");
});

test("embeddables", function({assert, eq, equals}){
  function names(context){
    return _.mapa(dom.text, dom.sel("li", context));
  }
  const {ul, li} = dom.tags(['ul', 'li']);
  const larry = li("Larry"),
        curly = li("Curly"),
        moe = li({class: "boss"}, "Moe"),
        shemp = li("Shemp"),
        corey = li("Corey"),
        stooges = ul({class: "stooges"}, larry);
  const frag = dom.fragment(stooges);
  equals(dom.attr(stooges, "class"), "stooges");
  dom.append(stooges, corey);
  eq(names(frag), ["Larry", "Corey"]);
  dom.prepend(stooges, moe);
  eq(names(frag), ["Moe", "Larry", "Corey"]);
  dom.before(corey, curly);
  eq(names(frag), ["Moe", "Larry", "Curly", "Corey"]);
  dom.after(curly, shemp);
  eq(names(frag), ["Moe", "Larry", "Curly", "Shemp", "Corey"]);
});

test("dom", function({assert, eq, equals, ako}){
  const {ul, li, div, span} = dom.tags(dom.element(document), _.expands, ["ul", "li", "div", "span"]);
  const duo = _.doto(
    dom.fragment(),
      dom.append(_, div("Abbott")),
      dom.append(_, dom.element("div", "Costello")));
  const who = div(_.get(_, "givenName"), " ", _.get(_, "surname"));
  const template = ul(_.map(function([id, person]){
    return li({id: id}, who(person));
  }, _));
  const stooges = template({
    moe: {givenName: "Moe", surname: "Howard"},
    curly: {givenName: "Curly", surname: "Howard"},
    larry: {givenName: "Larry", surname: "Fine"}
  });
  const moe = _.chain(stooges, dom.sel("li", _), _.first);

  equals(_.chain(duo, _.children, _.first, dom.text), "Abbott");
  equals(_.chain(duo, _.children, _.second, dom.text), "Costello");
  equals(_.chain(stooges, _.leaves, _.count), 3);
  equals(_.chain(moe, dom.text), "Moe Howard", "Found by tag");
  eq(_.chain(stooges, dom.sel("li", _), _.map(_.get(_, "id"), _), _.toArray), ["moe", "curly", "larry"], "Extracted ids");
  equals(_.chain({givenName: "Curly", surname: "Howard"}, who, dom.text), "Curly Howard");
  if (_.fluent) {
    eq(_.fluent(moe, dom.classes, $.conj(_, "main"), _.deref), ["main"]);
    equals(_.fluent(moe, dom.attr(_, "data-tagged", "tests"), _.get(_, "data-tagged")), "tests");
  }
  _.chain(stooges, dom.append(_, div({id: 'branding'}, span("Three Blind Mice"))));
  ako(_.chain(stooges, dom.sel("#branding", _), _.first), HTMLDivElement, "Found by id");
  equals(_.chain(stooges, dom.sel("#branding span", _), _.map(dom.text, _), _.first), "Three Blind Mice", "Read text content");
  const greeting = _.chain(stooges, dom.sel("#branding span", _), _.first);
  dom.hide(greeting);
  eq(_.chain(greeting, dom.style, _.deref), {display: "none"}, "Hidden");
  equals(_.chain(greeting, dom.style, _.get(_, "display")), "none");
  dom.show(greeting);
  eq(_.chain(greeting, dom.style, _.deref), {}, "Shown");
  const branding = _.chain(stooges, dom.sel("#branding", _), _.first);
  dom.omit(branding);
  equals(_.chain(branding, _.parent, _.first), null, "Removed");
});

_.members && test("jQueryesque functor", function({assert, eq}){
  const {ol, li, span} = dom.tags(["ol", "li", "span"]);
  const jq = _.members(function(els){ //configure members functor, it upholds the collectiveness of contents
    return dom.isElement(_.first(els)) ? _.distinct(els) : els; //guarantee distinctness - but only for elements
  });
  const bedrock =
    ol({"id": "Bedrock"},
      ol({"id": "Flintstones", "class": "Family"},
        li(span("Fred"), " ", "Flintstone"),
        li(span("Wilma"), " ", "Flintstone")),
      ol({"id": "Rubbles", "class": "Family"},
        li(span("Barney"), " ", "Rubble"),
        li(span("Betty"), " ", "Rubble")));
  const cavepersons = jq(bedrock, dom.sel(".Family", _), dom.sel("span", _), dom.text, _.lowerCase);
  eq(_.toArray(cavepersons), ["fred", "wilma", "barney", "betty"]);
});

test("lazy-seq", function({assert, equals, notEquals, eq, ako}){
  const effects = [],
        push    = effects.push.bind(effects),
        xs      = _.map(push, _.range(10)),
        nums    = _.map(_.identity, _.range(3)),
        blank   = _.map(_.identity, _.range(0)),
        tail    = _.rest(nums);
  equals(effects.length, 0);
  _.first(xs)
  equals(effects.length, 1);
  _.first(xs)
  equals(effects.length, 1);
  _.second(xs);
  equals(effects.length, 2);
  $.doall(xs);
  equals(effects.length, 10);
  assert(_.blank(blank));
  assert(!_.blank(nums));
  ako(_.rest(blank), _.EmptyList);
  ako(_.rest(nums), _.LazySeq);
  equals(_.seq(blank), null);
  notEquals(_.seq(nums), null);
  eq(_.toArray(nums), [0,1,2]);
  eq(_.toArray(blank), []);
});

test("transducers", function({assert, eq}){
  const useFeat = location.href.indexOf("feature=next") > -1;
  function compare(source, xf, expect, desc){
    const $b = $.cell([]);
    $.sub($.toObservable(source), xf, $.collect($b));
    const a = _.transduce(xf, _.conj, [], source),
          b = _.deref($b);
    //compare for rough equivalence
    eq(a, expect, `transduce ${desc}`);
    eq(b, expect, `observe ${desc}`);
  }
  const special = [8, 6, 7, 5, 3, 0, 9];
  useFeat && compare(special, _.first(), [8], "first");
  useFeat && compare(special, _.last(), [9], "last");
  compare(special, _.map(_.inc), [9, 7, 8, 6, 4, 1, 10], "increased");
  compare(special, _.filter(_.isOdd), [7, 5, 3, 9], "odd only");
  compare(special, _.comp(_.filter(_.isOdd), _.map(_.inc)), [8, 6, 4, 10], "odd increased");
  eq(_.chain([1, 2, 3], _.cycle, _.into([], _.comp(_.take(4), _.map(_.inc)), _)), [2, 3, 4, 2]);
  eq(_.chain([1, 3, 2, 2, 3], _.into([], _.dedupe(), _)), [1, 3, 2, 3]);
  eq(_.chain([1, 3, 2, 2, 3], _.into([], _.filter(_.isEven), _)), [2, 2]);
});

test("iinclusive", function({assert}){
  const charlie = {name: "Charlie", iq: 120, hitpoints: 30};
  assert(_.chain(charlie, _.includes(_, ["name", "Charlie"])));
  assert(!_.chain(charlie, _.includes(_, ["name", "Charles"])));
});

test("ilookup", function({assert, equals, eq, isNil}){
  equals(_.chain(stooges, _.get(_, 2)),  "Moe");
  equals(_.chain(pieces, _.get(_, "pawn")), 1);
  equals(_.chain(worth, _.getIn(_, ["pieces", "queen"])), 10);
  const boris = {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }};
  const moe = {givenName: "Moe", surname: "Howard"};
  const givenName = _.overload(null, _.get(_, "givenName"), _.assoc(_, "givenName", _)); //lens
  const getAddressLine1 = _.pipe(_.maybe, _.fmap(_, _.get(_, "address"), _.get(_, "lines"), _.get(_, 1)), _.otherwise(_, ""));
  equals(_.chain(moe, getAddressLine1), "");
  equals(_.chain(boris, getAddressLine1), "Suite 401");
  equals(_.chain(boris, _.maybe, _.fmap(_, _.get(_, "address"), _.get(_, "lines"), _.get(_, 1)), _.otherwise(_, "")), "Suite 401");
  equals(_.chain(boris, _.getIn(_, ["address", "lines", 1])), "Suite 401");
  isNil(_.chain(boris, _.getIn(_, ["address", "lines", 2])));
  eq(_.chain(boris, _.assocIn(_, ["address", "lines", 1], "attn: Finance Dept.")), {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "attn: Finance Dept."],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }});
  eq(_.chain(boris, _.updateIn(_, ["address", "lines", 1], _.upperCase)), {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "SUITE 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }});
  eq(boris, {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }});
  equals(givenName(moe), "Moe");
  eq(givenName(moe, "Curly"), {givenName: "Curly", surname: "Howard"});
  eq(moe, {givenName: "Moe", surname: "Howard"}, "no lens mutation");
  equals(_.chain(["ace", "king", "queen"], _.get(_, 2)), "queen");
});

test("iassociative", function({assert, eq, equals}){
  equals(_.chain(stooges, _.assoc(_, 0, "Larry")), stooges, "maintain referential equivalence");
  assert(_.contains(court, "jack", 11));
  assert(!_.contains(court, "ace", 14));
  assert(_.includes(court, ["jack", 11], ["queen", 12]));
  assert(_.excludes(court, ["deuce", 2]));
  assert(_.everyPred(_.spread(_.partial(_.contains, court)))(["jack", 11], ["queen", 12]));
  eq(_.chain(stooges, _.assoc(_, 0, "Shemp")), ["Shemp","Curly","Moe"]);
  eq(_.chain(court, _.assoc(_, "ace", 14)), {jack: 11, queen: 12, king: 13, ace: 14});
  eq(_.chain(worth, _.assocIn(_, ["court","ace"], 1)), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {ace: 1, jack: 11, queen: 12, king: 13}});
  eq(_.chain(worth, _.assocIn(_, ["court","king"], Infinity)), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: Infinity}});
  eq(_.chain(court, _.update(_, "jack", _.add(_, -10))), {jack: 1, queen: 12, king: 13});
  eq(_.chain(worth, _.updateIn(_, ["court","king"], _.add(_, -10))), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: 3}});
  eq(stooges, ["Larry","Curly","Moe"], "no mutations occurred");
  eq(court, {jack: 11, queen: 12, king: 13}, "no mutations occurred");
  eq(_.chain({surname: "Howard"}, _.assoc(_, "givenName", "Moe")), {givenName: "Moe", surname: "Howard"});
  eq(_.chain([1, 2, 3], _.assoc(_, 1, 0)), [1, 0, 3]);
});

test("icompare", function({assert}){
  assert(_.eq(1, 1, 1));
  assert(!_.eq(1, "1", 1.0));
  assert(_.lt(1, 2, 3, 4));
  assert(!_.lt(1, 6, 2, 3));
  assert(_.lte(1, 1, 2, 3, 3, 3));
  assert(_.notEq(1, 1, 2, 2, 3, 3));
  assert(!_.notEq(3, 3, 3));
});

test("iset", function({assert, eq}){
  eq(_.chain([1, 2, 3], _.union(_, [2, 3, 4]), _.sort, _.toArray), [1, 2, 3, 4]);
  eq(_.chain([1, 2, 3, 4, 5], _.difference(_, [5, 2, 10]), _.sort, _.toArray), [1, 3, 4]);
  assert(_.chain([1, 2, 3], _.superset(_, [2, 3])));
  assert(!_.chain([1, 2, 3], _.superset(_, [2, 4])));
});

test("iappendable/iprependable", function({eq}){
  eq(_.chain(["Moe"], _.append(_, "Howard")), ["Moe", "Howard"]);
  eq(_.chain({surname: "Howard"}, _.conj(_, ['givenName', "Moe"])), {givenName: "Moe", surname: "Howard"});
  eq(_.chain([1, 2], _.append(_, 3)), [1, 2, 3]);
  eq(_.chain([1, 2], _.prepend(_, 0)), [0, 1, 2]);
});

test("sequences", function({assert, equals, eq, isNil}){
  eq(_.chain(["A","B","C"], _.cycle, _.take(5, _), _.toArray), ["A","B","C","A","B"]);
  eq(_.chain(_.positives, _.take(5, _), _.toArray), [1,2,3,4,5]);
  eq(_.chain(["A","B","C"], _.rest, _.toArray), ["B", "C"]);
  eq(_.chain(_.repeatedly(3, _.constantly(4)), _.toArray), [4,4,4]);
  eq(_.chain(stooges, _.concat(_, ["Shemp","Corey"]), _.toArray), ["Larry","Curly","Moe","Shemp","Corey"]);
  eq(_.toArray(_.range(4)), [0,1,2,3]);
  equals(_.chain(stooges, _.second), "Curly");
  assert(_.chain([1,2,3], _.some(_.isEven, _)));
  assert(!_.chain([1,2,3], _.notAny(_.isEven, _)));
  assert(_.chain([2,4,6], _.every(_.isEven, _)));
  eq(_.chain([9,8,7,6,5,4,3], _.dropLast(3, _), _.toArray), [9,8,7,6]);
  eq(_.chain(stooges, _.sort, _.toArray), ["Curly","Larry","Moe"]);
  eq(_.chain(["A","B",["C","D"],["E", ["F", "G"]]], _.flatten, _.toArray), ["A","B","C","D","E","F","G"]);
  eq(_.chain([null, ""], _.flatten, _.toArray), [null, ""]);
  eq(_.chain(pieces, _.selectKeys(_, ["pawn", "knight"])), {pawn: 1, knight: 3});
  eq(_.chain(["A","B","C","D","E"], _.interleave(_, _.repeat("="), _.positives), _.toArray), ["A","=",1,"B","=",2,"C","=",3,"D","=",4,"E","=",5]);
  eq(_.chain([1,2,3], _.interleave(_, [10,11,12]), _.toArray), [1,10,2,11,3,12]);
  assert(_.chain([false, true], _.some(_.isTrue, _)));
  assert(_.chain([false, true], _.some(_.isFalse, _)));
  isNil(_.chain([false, false], _.some(_.isTrue, _)));
  equals(_.chain(_.range(10), _.detect(x => x > 5, _)), 6);
  assert(!_.chain(_.range(10), _.every(x => x > 5, _)));
  eq(_.chain([1, 2, 3], _.empty), []);
  eq(_.chain(null, _.into([], _)), []);
  eq(_.chain(_.repeat(1), _.take(2, _), _.toArray), [1, 1]);
  eq(_.chain([1, 2, 3], _.butlast, _.toArray), [1, 2]);
  eq(_.chain(["A","B","C"], _.interpose("-", _), _.toArray), ["A", "-", "B", "-", "C"]);
  eq(_.chain(_.repeat(1), _.take(5, _), _.toArray), [1,1,1,1,1]);
  eq(_.chain(_.repeat(1), _.take(5, _), _.conj(_, 0), _.conj(_, -1), _.toArray), [-1, 0, 1, 1, 1, 1, 1]);
  eq(_.chain(_.range(10), _.take(5, _), _.toArray), [0, 1, 2, 3, 4]);
  eq(_.chain(_.range(-5, 5), _.toArray), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
  eq(_.chain(_.range(-20, 100, 10), _.toArray), [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
  eq(_.chain(_.range(10), _.drop(3, _), _.take(3, _), _.toArray), [3, 4, 5]);
  eq(_.chain([1, 2, 3], _.map(_.inc, _), _.toArray), [2, 3, 4]);
  assert(_.chain([1, 2, 3, 4], _.some(_.isEven, _)));
  equals(_.chain([1, 2, 3, 4], _.detect(_.isEven, _)), 2);
  assert(_.chain(_.range(10), _.some(x => x > 5, _)));
  eq(_.chain({ace: 1, king: 2, queen: 3}, _.selectKeys(_, ["ace", "king"])), {ace: 1, king: 2});
  equals(_.chain("Polo", _.into("Marco ", _)), "Marco Polo");
  equals(_.chain([5, 6, 7, 8, 9], _.filter(x => x > 6, _), _.into("", _)), "789");
  eq(_.chain("Polo", _.toArray), ["P", "o", "l", "o"]);
  eq(_.chain([1, 2, 3], _.cycle, _.take(7, _), _.toArray), [1, 2, 3, 1, 2, 3, 1]);
  eq(_.chain([1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7], _.dedupe, _.toArray), [1, 2, 3, 4, 5, 6, 7]);
  eq(_.chain([1, 2, 3, 1, 4, 3, 4, 3, 2, 2], _.distinct, _.toArray), [1, 2, 3, 4]);
  eq(_.chain(_.range(10), _.takeNth(2, _), _.toArray), [0, 2, 4, 6, 8]);
  eq(_.chain(_.constantly(1), _.repeatedly, _.take(0, _), _.toArray), []);
  eq(_.chain(_.constantly(2), _.repeatedly, _.take(10, _), _.toArray), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  eq(_.chain(_.range(10), _.take(5, _), _.toArray), [0, 1, 2, 3, 4]);
  eq(_.chain(_.range(10), _.filter(x => x > 5, _), _.toArray), [6, 7, 8, 9]);
  eq(_.chain(_.range(10), _.remove(x => x > 5, _), _.toArray), [0, 1, 2, 3, 4, 5]);
  eq(_.chain(_.range(10), _.takeWhile(x => x < 5, _), _.toArray), [0, 1, 2, 3, 4]);
  eq(_.chain(_.range(10), _.dropWhile(x => x > 5, _), _.toArray), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  eq(_.chain(_.range(1, 5), _.map(_.inc, _), _.toArray), [2, 3, 4, 5]);
  eq(_.chain([10, 11, 12], _.map(_.inc, _), _.toArray), [11, 12, 13]);
  eq(_.chain([5, 6, 7, 8, 9], _.filter(x => x > 6, _), _.map(_.inc, _), _.take(2, _), _.toArray), [8, 9]);
  eq(_.chain(_.range(7, 15), _.take(10, _), _.toArray), [7, 8, 9, 10, 11, 12, 13, 14]);
  eq(_.chain(_.range(5), _.toArray), [0, 1, 2, 3, 4]);
  eq(_.chain(_.repeat("X"), _.take(5, _), _.toArray), ["X", "X", "X", "X", "X"]);
  eq(_.chain([1, 2], _.concat(_, [3, 4], [5, 6]), _.toArray), [1, 2, 3, 4, 5, 6]);
  eq(_.chain(["a", "b", "c", "d", "e"], _.keepIndexed((idx, value) => _.isOdd(idx) ? value : null, _), _.toArray), ["b", "d"]);
  eq(_.chain([10, 11, 12], _.mapIndexed((idx, value) => [idx, _.inc(value)], _), _.toArray), [[0, 11], [1, 12], [2, 13]]);
  assert(_.everyPred(_.isEven, x => x > 10)(12,14,16));
  equals(_.maxKey(obj => obj["king"], pieces, court), pieces);
});

test("add/subtract", function({assert, equals}){
  const christmas = _.date(2017, 11, 25);
  const newYears  = _.date(2018, 0, 1);
  const mmddyyyy  =
    _.fmt(
      _.comp(_.zeros(_, 2), _.inc, _.month), "/",
      _.comp(_.zeros(_, 2), _.day), "/",
      _.comp(_.zeros(_, 4), _.year));
  equals(_.chain(christmas, mmddyyyy), "12/25/2017");
  equals(_.chain(newYears, mmddyyyy), "01/01/2018");
  equals(_.chain(christmas, _.add(_, _.days(1)), _.deref), 1514264400000);
  equals(_.chain(christmas, _.add(_, _.weeks(1)), _.deref), 1514782800000);
  equals(_.chain(christmas, _.add(_, _.months(1)), _.deref), 1516856400000);
  equals(_.chain(christmas, _.add(_, _.years(1)), _.deref), 1545714000000);
  equals(_.chain(christmas, _.subtract(_, _.years(1)), _.deref), 1482642000000);
});

test("duration", function({assert, equals}){
  const newYearsEve = _.date(2019, 11, 31);
  const newYearsDay = _.period(_.date(2020, 0, 1));
  equals(_.divide(_.years(1), _.days(1)), 365.25);
  equals(_.divide(_.days(1), _.hours(1)), 24);
  equals(_.chain(newYearsDay, _.toDuration, _.divide(_, _.hours(1))), 24);
  equals(_.deref(_.add(newYearsEve, 1)), 1577854800000);
  equals(_.deref(_.add(newYearsEve, _.days(1))), 1577854800000);
  equals(_.deref(_.add(newYearsEve, _.years(-1))), 1546232400000);  //prior New Year's Eve
  equals(_.deref(_.add(newYearsEve, _.days(1), _.hours(7))), 1577880000000);  //7am New Year's Day
});

//protocols as discriminated unions: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
test("area:polymorphism", function({equals}){
  function Circle(radius){
    this.radius = radius;
  }
  function Square(sideLength){
    this.sideLength = sideLength;
  }
  const IArea = _.protocol({
    area: null
  });
  const circle = _.constructs(Circle),
        square = _.constructs(Square),
        area = IArea.area;
  {
    function area(circle){
      return circle.radius * circle.radius * Math.PI;
    }
    _.doto(Circle, _.implement(IArea, {area}));
  }
  {
    function area(square){
      return square.sideLength * square.sideLength;
    }
    _.doto(Square, _.implement(IArea, {area}));
  }
  const s = square(7),
        c = circle(8);
  equals(area(s), 49);
  equals(area(c), 201.06192982974676);
});

test("coercion", function({eq}){
  eq(_.coerce(_.range(3), Array), Array.from(_.range(3)), _.toArray(_.range(3)), _.coerce([0,1,2], Array));
  eq(_.coerce(_.set([2,4,2,5]), Array), [2,4,5]);
  eq(_.coerce([2,5,2,4], Set), _.set([2,4,5]));
  eq(_.coerce(_.concat(_.range(3), _.range(2)), Array), [0,1,2,0,1]);
  eq(_.coerce(_.cons(1, _.cons(2)), Array), _.coerce(_.list(1, 2), Array), [1,2]);
  eq(_.cons(1, _.cons(2)), _.list(1, 2));
  eq(_.coerce(null, Array), []);
  eq(_.coerce("eggs", Array), Array.from(_.seq("eggs")), ["e","g","g","s"]);
});

test("records", function({assert, eq, equals}){
  function WereWolf(name, title){
    this.name = name;
    this.title = title;
  }
  const wereWolf = _.record(WereWolf);
  const david = wereWolf("David", "London Tourist");
  const jacob = wereWolf("Jacob", "Lead Shirt Discarder");
  const lucian = wereWolf({name: "Lucian", title: "CEO of Melodrama"});

  equals(_.get(jacob, "name"), "Jacob");
  eq(jacob, wereWolf("Jacob", "Lead Shirt Discarder"));
});

test("record", function({assert, equals}){
  function Person(name, surname, dob){
    this.name = name;
    this.surname = surname;
    this.dob = dob;
  }
  const person = _.record(Person);
  const dylan = person({name: "Dylan", surname: "Penn", dob: _.date(1991, 4, 13)});
  const sean = person([["name", "Sean"], ["surname", "Penn"], ["dob", _.date(1960, 8, 17)]]);
  const robin = person("Robin", "Wright", new Date(1966, 3, 8));
  const $robin = $.cell(_.journal(robin));
  const dylanp = _.coerce({name: "Dylan", surname: "Penn", dob: _.date(1991, 4, 13)}, Person);
  const robino = _.coerce(robin, Object);
  equals(_.chain($robin, _.deref, _.deref, _.get(_, "surname")), "Wright");
  $.swap($robin, _.fmap(_, _.assoc(_, "surname", "Penn")));
  equals(_.chain($robin, _.deref, _.deref, _.get(_, "surname")), "Penn");
  $.swap($robin, _.undo);
  equals(_.chain($robin, _.deref, _.deref, _.get(_, "surname")), "Wright");
  $.swap($robin, _.redo);
  assert(_.chain($robin, _.deref, _.deref, _.get(_, "surname")), "Penn");
  equals(_.chain(robin, _.get(_, "surname")), "Wright");
  equals(_.chain(robin, _.assoc(_, "surname", "Penn"), _.get(_, "surname")), "Penn");
  equals(_.chain(sean, _.get(_, "surname")), "Penn");
  equals(_.chain(dylan, _.get(_, "surname")), "Penn");
  equals(_.chain(dylan, _.assoc(_, "surname", "McDermott"), _.get(_, "surname")), "McDermott");
  equals(_.count(robin), 3);
});

test("multirecord", function({assert, eq}){
  function Person(name, surname, dob){
    this.name = name;
    this.surname = surname;
    this.dob = dob;
  }
  const person = _.record(Person, {defaults: _.constantly([]), multiple: _.constantly(true)});
  const robin = person([["name", "Robin"], ["surname", "Wright"], ["surname", "Penn"], ["dob", new Date(1966, 3, 8)]]);
  const entries = _.chain(robin, _.seq, _.toArray);
  eq(entries, [["name", "Robin"], ["surname", "Wright"], ["surname","Penn"], ["dob",new Date(1966, 3, 8)]]);
  const robbie = _.assert(robin, "name", "Robbie");
  eq(_.get(robbie, "name"), ["Robin", "Robbie"]);
  assert(_.verify(robbie, "name", "Robin"));
  assert(_.verify(robbie, "name", "Robbie"));
  const robbie2 = _.chain(robbie,
      _.retract(_, "name", "Robin"),
      _.retract(_, "dob"));
  const name2 = _.get(robbie2, "name");
  eq(name2, ["Robbie"]);
});

test("observable sharing", function({eq, assert}){
  function exec(oo, nn, desc){
    var o = {ex: oo, result: $.cell([])},
        n = {ex: nn, result: $.cell([])};
    $.sub(o.ex, $.collect(o.result));
    $.sub(n.ex, $.collect(n.result));
    eq(_.deref(o.result), _.deref(n.result), desc);
    return {old: o, new: n};
  }

  const $double = $.cell(2);
  const $name = $.cell("Larry");
  const fn = _.pipe(_.repeat(_, _), _.toArray);
  exec($.map(fn, $double, $name), $.Observable.map(fn, $double, $name), "$.map v. $.calc with cells");

  const $triple = $.toObservable(_.range(3));
  const $thrice = $.cell(0);
  let $ten = $.Observable.fixed(10);
  exec($.map(_.add, $triple, $ten), $.Observable.map(_.add, $triple, $ten), "$.fixed");
  $ten = $.fixed(10);
  exec($.map(_.add, $triple, $ten), $.Observable.map(_.add, $triple, $ten), "$.map");

  const $a  = $.cell(0),
        $ac = $.cell([]),
        $ao = $.cell([]);
  $.sub($a, $.collect($ac));
  $.connect($triple, $a);
  $.sub($triple, $.collect($ao));
  eq(_.deref($ac), _.deref($ao));

  const $b  = $.cell(0),
        $bc = $.cell([]),
        $bs = $.cell([]);
  $.sub($b, $.collect($bc));
  $.connect($triple, $b);
  $.sub($triple, $.collect($bs));
  eq(_.deref($bc), _.deref($bs));

  const $ca = $.subject(),
        $cc = $.cell([]),
        $cs = $.cell([]),
        $cf = $.cell([]);
  const bump = _.map(_.inc);
  $.sub($.pipe($triple, bump), $.collect($cc));
  $.sub($triple, bump, $.collect($cs));
  $.sub($ca, $.collect($cf));
  $.connect($triple, bump, $ca);
  eq(_.deref($cs), _.deref($cf), "$.sub v. $.connect");
  eq(_.deref($cs), _.deref($cc), "$.sub v. $.pipe");
});

test("cell", function({assert, eq, equals, throws}){
  const button = dom.tag('button');
  const tally = button("Tally");
  const clicks = $.cell(0);
  tally.click();
  equals(_.deref(clicks), 0);
  const tallied = dom.click(tally);
  var unsub = $.sub(tallied, function(){
    $.swap(clicks, _.inc);
  });
  $.sub(tallied, _.noop);
  tally.click();
  unsub();
  tally.click();
  const source = $.cell(0);
  const dest = $.cell();
  const sink   = $.pipe(source, _.map(_.inc), _.map($.tee($.pub(dest, _))));
  $.connect(sink, $.subject());
  const msink  = _.fmap(source, _.inc);
  const msinkc = $.cell();
  $.sub(msink, msinkc);
  $.swap(source, _.inc);
  equals(_.deref(clicks), 1);
  equals(_.deref(source), 1);
  equals(_.deref(dest), 2);
  equals(_.deref(msinkc), 2);
  const bucket = $.cell([], $.subject(), _.pipe(_.get(_, 'length'), _.lt(_, 3))),
        states = $.cell([]);
  _.chain(bucket, $.sub(_, state => _.chain(states, $.swap(_, _.conj(_, state)))));
  _.chain(bucket, $.swap(_, _.conj(_, "ice")));
  _.chain(bucket, $.swap(_, _.conj(_, "champagne")));
  throws(() => _.chain(bucket, $.swap(_, _.conj(_, "soda"))));
  _.chain(bucket, $.swap(_, _.assoc(_, 1, "wine")));
  eq(_.chain(bucket, _.deref), ["ice", "wine"]);
  eq(_.chain(states, _.deref), [[], ["ice"], ["ice", "champagne"], ["ice", "wine"]]);
});

test("immutable updates", function({eq, equals, notEquals, assert}){
  const duos = $.cell([["Hall", "Oates"], ["Laurel", "Hardy"]]),
        get0 = _.pipe(_.deref, _.nth(_, 0)),
        get1 = _.pipe(_.deref, _.nth(_, 1)),
        get2 = _.pipe(_.deref, _.nth(_, 2)),
        d0 = get0(duos),
        d1 = get1(duos),
        d2 = get2(duos),
        states = $.cell([]),
        txn = _.pipe(
          _.conj(_, ["Andrew Ridgeley", "George Michaels"]),
          _.assocIn(_, [0, 0], "Daryl"),
          _.assocIn(_, [0, 1], "John"));
  _.chain(duos, $.sub(_, state => _.chain(states, $.swap(_, _.conj(_, state)))));
  _.chain(duos, $.swap(_, txn));
  equals(_.chain(states, _.deref, _.count), 2, "original + transaction");
  eq(_.chain(duos, _.deref), [["Daryl", "John"], ["Laurel", "Hardy"], ["Andrew Ridgeley", "George Michaels"]]);
  assert(!_.chain(d0, _.isIdentical(_, get0(duos))), "new container for");
  assert(_.chain(d1, _.isIdentical(_, get1(duos))), "original container untouched");
  assert(!_.chain(d2, _.isIdentical(_, get2(duos))), "created from nothing");
  notEquals(d2, "non-existent");
});

test("list", function({eq}){
  eq(_.toArray(_.list()), []);
  eq(_.toArray(_.list(0)), [0]);
  eq(_.toArray(_.list(0, 1, 2)), [0, 1, 2]);
});

test("strings", function({eq, equals}){
  eq(_.chain("I like peanutbutter", _.split(_, " ")), ["I", "like", "peanutbutter"]);
  eq(_.chain("q1w2e3r4t5y6u7i8o9p", _.split(_, /\d/)), ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
  eq(_.chain("q1w2e3r4t5y6u7i8o9p", _.split(_, /\d/, 4)), ["q", "w", "e", "r4t5y6u7i8o9p"]);
  equals(_.chain("reading", _.subs(_, 3)), "ding");
  equals(_.chain("reading", _.subs(_, 0, 4)), "read");
  equals(_.chain(["spam", null, "eggs", "", "spam"], _.join(", ", _)), "spam, , eggs, , spam");
  equals(_.chain([1, 2, 3], _.join(", ", _)), "1, 2, 3");
  equals(_.chain(["ace", "king", "queen"], _.join("-", _)), "ace-king-queen");
  equals(_.chain(["hello", " ", "world"], _.join("", _)), "hello world");
});

test("min/max", function({equals}){
  equals(_.min(-9, 9, 0), -9);
  equals(_.max(-9, 9, 0), 9);
});

test("indexed-seq", function({assert, equals}){
  const nums = _.indexedSeq([11,12,13,14], 1);
  const letters = _.indexedSeq(_.split("grace", ""));
  equals(_.chain(letters, _.first), "g");
  equals(_.chain(letters, _.nth(_, 2)), "a");
  equals(_.chain(nums, _.first), 12);
  equals(_.chain(nums, _.nth(_, 1)), 13);
  equals(_.chain(nums, _.count), 3);
  assert(_.chain(nums, _.satisfies(_.IReducible, _)));
  equals(_.chain(nums, _.reduce(_.add, 0, _)), 39);
});

test("equality", function({eq, assert}){
  assert(_.chain("Curly", _.eq(_, "Curly")), "Equal strings");
  assert(!_.chain("Curlers", _.eq(_, "Curly")), "Unequal strings");
  assert(_.chain("Curlers", _.notEq(_, "Curly")), "Unequal strings");
  const rng = _.range(3);
  eq(rng, rng, _.range(3), rng, [0,1,2], rng, _.cons(0, _.range(1,3)), _.initial(_.range(4)), "Communicative sequences");
  assert(_.chain(45, _.eq(_, 45)), "Equal numbers");
  assert(_.chain([1, 2, 3], _.eq(_, [1, 2, 3])), "Equal arrays");
  assert(!_.chain([1, 2, 3], _.eq(_, [2, 3])), "Unequal arrays");
  assert(!_.chain([1, 2, 3], _.eq(_, [3, 2, 1])), "Unequal arrays per order");
  assert(_.chain({fname: "Moe", lname: "Howard"}, _.eq(_, {fname: "Moe", lname: "Howard"})), "Equal objects");
  assert(!_.chain({fname: "Moe", middle: "Harry", lname: "Howard"}, _.eq(_, {fname: "Moe", lname: "Howard"})), "Unequal objects");
});

test("coersion", function({eq}){
  eq(_.chain([["Moe", "Howard"], ["Curly", "Howard"]], _.toObject), {Moe: "Howard", Curly: "Howard"});
  eq(_.chain({Moe: "Howard", Curly: "Howard"}, _.toArray), [["Moe", "Howard"], ["Curly", "Howard"]]);
});

test("predicates", function({assert, equals}){
  //two means of running multiple tests against different arguments
  const cinco = _.range(5),
        any = _.someFn(_.includes(cinco, _)), //or
        all = _.everyPred(_.includes(cinco, _)); //and
  assert(_.chain({ace: 1, king: 2, queen: 3}, _.subsumes(_, {ace: 1, king: 2})));
  equals(_.any(3, 1), 3);
  equals(_.any(null, 1), 1);
  equals(_.all(3, 1), 1);
  equals(_.all(null, 1), null);
  assert(any(1, 2, 3));
  assert(all(1, 2, 3));
  assert(any(-1, -2, 3));
  assert(!all(1, 2, -3));
  assert(!all(-1, -2, -3));
  assert(!_.includes(cinco, 1, 2, -3)); //same functionality built in
  assert(!_.excludes(cinco, 1, 2, -3));
  assert(_.excludes(cinco, 11, 5, -3));
  assert(!_.includes(cinco, -1, -2, -3));
});
