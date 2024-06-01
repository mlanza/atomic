import _ from "../dist/atomic_/core.js";
import dom from "../dist/atomic_/dom.js";
import $ from "../dist/atomic_/shell.js";
import vd from "../dist/atomic_/validates.js";
import {failed, test} from "./test.js";

const stooges = ["Larry","Curly","Moe"],
      pieces  = {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity},
      court   = {jack: 11, queen: 12, king: 13},
      worth   = {pieces, court};

failed(function(count){
  const img = document.querySelector("#icon");
  img.setAttribute("src", "./failed.svg");
  img.setAttribute("data-count", count);
});

test("inheritance chain", function({assert}){
  function Person(fname, lname){
    this.fname = fname;
    this.lname = lname;
  }
  function name(self){
    return `${self.fname} ${self.lname}`;
  }

  assert(_.name(Person) === "Person");
  _.specify(_.INamable, {name: _.constantly("Human")}, Person); //on the constructor itself
  assert(_.name(Person) === "Human");
  const greg = new Person("Gregory", "Porter");
  assert(!_.satisfies(_.INamable, greg));
  _.implement(_.INamable, {name}, Person);
  assert(_.satisfies(_.INamable, greg));
  assert(_.name(greg) === "Gregory Porter");
  _.specify(_.INamable, {name: _.get(_, "fname")}, greg);
  assert(_.name(greg) === "Gregory");
});

test("pure random", function({assert}){
  const alt = _.chance(8675309);
  const remember = alt.serialize();
  function randoms(alt){
    const uid = _.uids(5, alt.random);
    const [uid1, uid2, uid3] = _.toArray(_.repeatedly(3, uid));
    assert(uid1.id === "L4wM2");
    assert(uid2.id === "U0iFA");
    assert(uid3.id === "AHeZ8");
    const guid = _.guids(alt.random);
    const [guid1, guid2, guid3] = _.toArray(_.repeatedly(3, guid));
    assert(guid1.id === "18ebd681-151f-05d2-bebf-e9ea3fd094b5");
    assert(guid2.id === "f948e64b-f1fb-255a-52de-b3777c27201e");
    assert(guid3.id === "92803dce-b800-f706-8741-47bbe155125b");
    const [i1, i2, i3] = _.toArray(_.repeatedly(3, _.partial(_.randInt, alt.random, 100)));
    assert(i1 === 30);
    assert(i2 === 16);
    assert(i3 === 11);
    const [r1, r2, r3] = _.toArray(_.repeatedly(3, _.partial(_.rand, alt.random, 1)));
    assert(r1 === 0.6288899967912585);
    assert(r2 === 0.47766544623300433);
    assert(r3 === 0.12775464728474617);
  }
  randoms(alt);
  randoms(_.Chance.deserialize(remember));
});

test("type checks", function({assert}){
  assert(_.isArray([]));
  assert(_.isObject({}));
});

test("hashing", function({assert}){
  function same(x, y){
    assert(_.hash(x) === _.hash(y));
    assert(_.hash(x) === _.hash(x));
    assert(_.equiv(x, y));
  }
  const div = dom.tag("div");
  const hi = div("hi");
  assert(_.hash(div("hi")) !== _.hash(div("hi")));
  assert(_.hash({card: "ace"}) !== _.hash({card: "king"}));
  assert(_.hash(true) !== _.hash(false));
  assert(_.hash(same) !== _.hash(function(){}));
  assert(_.hash(function(){}) !== _.hash(function(){}));
  same(hi, hi);
  same(same, same);
  same(true, true);
  same([1, 7, 0, 1, 1], [1, 7, 0, 1, 1]);
  same(_.date(999), _.date(999));
  same({blackwidow: "Avenger"}, {blackwidow: "Avenger"});
  //same([{blackwidow: "Avenger"}, _.date(774), [1, 2]], [{blackwidow: "Avenger"}, _.date(774), [1, 2]]);
});

test("poor man's multimethod", function({assert}){
  const join = _.guard(_.signature(_.isArray), _.join("", _));
  const exclaim = _.guard(_.signature(_.isString), _.str(_, "!"));
  const double = _.guard(_.signature(_.isNumber), _.mult(_, 2));

  const c = _.coalesce(join, exclaim, double);
  assert(_.invoke(c, 1) === 2);
  assert(_.invoke(c, "timber") === "timber!");
  assert(c(1) === 2);
  assert(c("timber") === "timber!");
  assert(c(["a","c","e"]) === "ace");

  const d = _.coalesce(exclaim, double); //initial config
  const e = _.coalesce(d, join); //added later
  assert(e("timber") === "timber!");
  assert(e(["a","c","e"]) === "ace");
});

test("validation", function({assert}){
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

  assert(vd.check(zipCode, "17055") == null);
  assert(vd.check(zipCode, 17055) == null);
  assert(vd.check(zipCode, "17055-0001") == null);
  assert(vd.check(zipCode, "") != null);
  assert(vd.check(zipCode, null) != null);
  assert(vd.check(zipCode, "1705x-0001") != null);
  assert(vd.check(Number, "7") != null);
  assert(vd.check(Number, parseInt, "7") == null);
  assert(vd.check(vd.range("start", "end"), {start: 1, end: 5}) == null);
  assert(vd.check(vd.range("start", "end"), {start: 1, end: 1}) == null);
  assert(vd.check(vd.range("start", "end"), {start: 5, end: 1}) != null);
  assert(dob.constraint === Date);
  assert(name.constraint === String);
  assert(names != null);
  assert(_.ako(anon.constraint, vd.Required));
  assert(status != null);
  //TODO add `when` to validate conditiontionally or allow condition to be checked before registering the validation?
});

test("edit/plop/grab", function({assert}){
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
  assert(boo !== boo2);
  assert(_.grab(boo2, ["pouch", "name"]) == "Louie");
  assert(_.grab(boo , ["pouch", "pouch", "name"]) == "Haunch");
  assert(_.grab(boo2, ["pouch", "pouch", "name"]) == "Gloria");
  assert(_.grab(boo , ["pouch", "pouch", "pouch"]) == null);
  assert(_.grab(boo3, ["pouch", "pouch", "pouch"]) == 1);
  assert(_.grab(boo4, ["name"]) == "Foo");

  //the default implementation of clone should suffice
  function Wallaby(name, pouch){
    this.name = name;
    this.pouch = pouch;
  }

  const shy = new Wallaby("Shy", new Wallaby("Flora", new Wallaby("Victor", null)));
  const shy2 = _.plopIn(shy, ["pouch", "pouch", "name"], "Valerie");
  assert(shy !== shy2);
  assert(_.grab(shy , ["pouch", "pouch", "name"]) == "Victor");
  assert(_.grab(shy2, ["pouch", "pouch", "name"]) == "Valerie");

  const stooges2 = _.plop(stooges, 1, "Shemp");
  const stooges3 = _.plop(stooges, 3, "Corey");
  const stooges4 = _.edit(stooges, 2, _.upperCase);

  assert(_.eq(["Larry", "Curly", "Moe"], stooges));
  assert(_.eq(["Larry", "Shemp", "Moe"], stooges2));
  assert(_.eq(["Larry", "Curly", "Moe", "Corey"], stooges3));
  assert(_.eq(["Larry", "Curly", "MOE"], stooges4));
});

test("best", function({assert}){
  assert(_.best(_.lt, stooges) === "Curly");
  assert(_.best(_.mapArgs(_.count, _.lt), stooges) === "Moe");
});

test("embeddables", function({assert}){
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
  assert(dom.attr(stooges, "class") === "stooges");
  dom.append(stooges, corey);
  assert(_.eq(names(frag), ["Larry", "Corey"]));
  dom.prepend(stooges, moe);
  assert(_.eq(names(frag), ["Moe", "Larry", "Corey"]));
  dom.before(corey, curly);
  assert(_.eq(names(frag), ["Moe", "Larry", "Curly", "Corey"]));
  dom.after(curly, shemp);
  assert(_.eq(names(frag), ["Moe", "Larry", "Curly", "Shemp", "Corey"]));
});

test("dom", function({assert}){
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

  assert(_.chain(duo, _.children, _.first, dom.text) === "Abbott");
  assert(_.chain(duo, _.children, _.second, dom.text) === "Costello");
  assert(_.chain(stooges, _.leaves, _.count) === 3);
  assert(_.chain(moe, dom.text) === "Moe Howard", "Found by tag");
  assert(_.eq(_.chain(stooges, dom.sel("li", _), _.map(_.get(_, "id"), _), _.toArray), ["moe", "curly", "larry"]), "Extracted ids");
  assert(_.chain({givenName: "Curly", surname: "Howard"}, who, dom.text) === "Curly Howard");
  if (_.fluent) {
    assert(_.eq(_.fluent(moe, dom.classes, $.conj(_, "main"), _.deref), ["main"]));
    assert(_.fluent(moe, dom.attr(_, "data-tagged", "tests"), _.get(_, "data-tagged")) === "tests");
  }
  _.chain(stooges, dom.append(_, div({id: 'branding'}, span("Three Blind Mice"))));
  assert(_.chain(stooges, dom.sel("#branding", _), _.first, el => _.ako(el, HTMLDivElement)), "Found by id");
  assert(_.chain(stooges, dom.sel("#branding span", _), _.map(dom.text, _), _.first) === "Three Blind Mice", "Read text content");
  const greeting = _.chain(stooges, dom.sel("#branding span", _), _.first);
  dom.hide(greeting);
  assert(_.eq(_.chain(greeting, dom.style, _.deref), {display: "none"}), "Hidden");
  assert(_.chain(greeting, dom.style, _.get(_, "display")) === "none");
  dom.show(greeting);
  assert(_.eq(_.chain(greeting, dom.style, _.deref), {}), "Shown");
  const branding = _.chain(stooges, dom.sel("#branding", _), _.first);
  dom.omit(branding);
  assert(_.chain(branding, _.parent, _.first) == null, "Removed");
});

_.members && test("jQueryesque functor", function({assert}){
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
  assert(_.eq(_.toArray(cavepersons), ["fred", "wilma", "barney", "betty"]));
});

test("lazy-seq", function({assert}){
  const effects = [],
        push    = effects.push.bind(effects),
        xs      = _.map(push, _.range(10)),
        nums    = _.map(_.identity, _.range(3)),
        blank   = _.map(_.identity, _.range(0)),
        tail    = _.rest(nums);
  assert(effects.length === 0);
  _.first(xs)
  assert(effects.length === 1);
  _.first(xs)
  assert(effects.length === 1);
  _.second(xs);
  assert(effects.length === 2);
  $.doall(xs);
  assert(effects.length === 10);
  assert(_.blank(blank));
  assert(!_.blank(nums));
  assert(_.ako(_.rest(blank), _.EmptyList));
  assert(_.ako(_.rest(nums), _.LazySeq));
  assert(_.seq(blank) == null);
  assert(_.seq(nums) != null);
  assert(_.eq(_.toArray(nums), [0,1,2]));
  assert(_.eq(_.toArray(blank), []));
});

test("transducers", function({assert}){
  const useFeat = location.href.indexOf("feature=next") > -1;
  function compare(source, xf, expect, desc){
    const $b = $.cell([]);
    $.sub($.toObservable(source), xf, $.collect($b));
    const a = _.transduce(xf, _.conj, [], source),
          b = _.deref($b);
    //compare for rough equivalence
    assert(_.eq(a, expect), `transduce ${desc}`);
    assert(_.eq(b, expect), `observe ${desc}`);
  }
  const special = [8, 6, 7, 5, 3, 0, 9];
  useFeat && compare(special, _.first(), [8], "first");
  useFeat && compare(special, _.last(), [9], "last");
  compare(special, _.map(_.inc), [9, 7, 8, 6, 4, 1, 10], "increased");
  compare(special, _.filter(_.isOdd), [7, 5, 3, 9], "odd only");
  compare(special, _.comp(_.filter(_.isOdd), _.map(_.inc)), [8, 6, 4, 10], "odd increased");
  assert(_.eq(_.chain([1, 2, 3], _.cycle, _.into([], _.comp(_.take(4), _.map(_.inc)), _)), [2, 3, 4, 2]));
  assert(_.eq(_.chain([1, 3, 2, 2, 3], _.into([], _.dedupe(), _)), [1, 3, 2, 3]));
  assert(_.eq(_.chain([1, 3, 2, 2, 3], _.into([], _.filter(_.isEven), _)), [2, 2]));
});

test("iinclusive", function({assert}){
  const charlie = {name: "Charlie", iq: 120, hitpoints: 30};
  assert(_.chain(charlie, _.includes(_, ["name", "Charlie"])));
  assert(!_.chain(charlie, _.includes(_, ["name", "Charles"])));
});

test("ilookup", function({assert}){
  assert(_.chain(stooges, _.get(_, 2)) ===  "Moe");
  assert(_.chain(pieces, _.get(_, "pawn")) === 1);
  assert(_.chain(worth, _.getIn(_, ["pieces", "queen"])) === 10);
  const boris = {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }};
  const moe = {givenName: "Moe", surname: "Howard"};
  const givenName = _.overload(null, _.get(_, "givenName"), _.assoc(_, "givenName", _)); //lens
  const getAddressLine1 = _.pipe(_.maybe, _.fmap(_, _.get(_, "address"), _.get(_, "lines"), _.get(_, 1)), _.otherwise(_, ""));
  assert(_.chain(moe, getAddressLine1) === "");
  assert(_.chain(boris, getAddressLine1) === "Suite 401");
  assert(_.chain(boris, _.maybe, _.fmap(_, _.get(_, "address"), _.get(_, "lines"), _.get(_, 1)), _.otherwise(_, "")) === "Suite 401");
  assert(_.chain(boris, _.getIn(_, ["address", "lines", 1])) === "Suite 401");
  assert(_.chain(boris, _.getIn(_, ["address", "lines", 2])) === null);
  assert(_.eq(_.chain(boris, _.assocIn(_, ["address", "lines", 1], "attn: Finance Dept.")), {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "attn: Finance Dept."],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }}));
  assert(_.eq(_.chain(boris, _.updateIn(_, ["address", "lines", 1], _.upperCase)), {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "SUITE 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }}));
  assert(_.eq(boris, {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }}));
  assert(givenName(moe) === "Moe");
  assert(_.eq(givenName(moe, "Curly"), {givenName: "Curly", surname: "Howard"}));
  assert(_.eq(moe, {givenName: "Moe", surname: "Howard"}), "no lens mutation");
  assert(_.chain(["ace", "king", "queen"], _.get(_, 2)) === "queen");
});

test("iassociative", function({assert}){
  assert(_.chain(stooges, _.assoc(_, 0, "Larry")) === stooges, "maintain referential equivalence");
  assert(_.contains(court, "jack", 11));
  assert(!_.contains(court, "ace", 14));
  assert(_.includes(court, ["jack", 11], ["queen", 12]));
  assert(_.excludes(court, ["deuce", 2]));
  assert(_.everyPred(_.spread(_.partial(_.contains, court)))(["jack", 11], ["queen", 12]));
  assert(_.eq(_.chain(stooges, _.assoc(_, 0, "Shemp")), ["Shemp","Curly","Moe"]));
  assert(_.eq(_.chain(court, _.assoc(_, "ace", 14)), {jack: 11, queen: 12, king: 13, ace: 14}));
  assert(_.eq(_.chain(worth, _.assocIn(_, ["court","ace"], 1)), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {ace: 1, jack: 11, queen: 12, king: 13}}));
  assert(_.eq(_.chain(worth, _.assocIn(_, ["court","king"], Infinity)), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: Infinity}}));
  assert(_.eq(_.chain(court, _.update(_, "jack", _.add(_, -10))), {jack: 1, queen: 12, king: 13}));
  assert(_.eq(_.chain(worth, _.updateIn(_, ["court","king"], _.add(_, -10))), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: 3}}));
  assert(_.eq(stooges, ["Larry","Curly","Moe"]), "no mutations occurred");
  assert(_.eq(court, {jack: 11, queen: 12, king: 13}), "no mutations occurred");
  assert(_.eq(_.chain({surname: "Howard"}, _.assoc(_, "givenName", "Moe")), {givenName: "Moe", surname: "Howard"}));
  assert(_.eq(_.chain([1, 2, 3], _.assoc(_, 1, 0)), [1, 0, 3]));
});

test("icompare", function({assert}){
  assert(_.eq(1, 1, 1) === true);
  assert(_.eq(1, "1", 1.0) === false);
  assert(_.lt(1, 2, 3, 4) === true);
  assert(_.lt(1, 6, 2, 3) === false);
  assert(_.lte(1, 1, 2, 3, 3, 3) === true);
  assert(_.notEq(1, 1, 2, 2, 3, 3) === true);
  assert(_.notEq(3, 3, 3) === false);
});

test("iset", function({assert}){
  assert(_.eq(_.chain([1, 2, 3], _.union(_, [2, 3, 4]), _.sort, _.toArray), [1, 2, 3, 4]));
  assert(_.eq(_.chain([1, 2, 3, 4, 5], _.difference(_, [5, 2, 10]), _.sort, _.toArray), [1, 3, 4]));
  assert(_.chain([1, 2, 3], _.superset(_, [2, 3])));
  assert(!_.chain([1, 2, 3], _.superset(_, [2, 4])));
});

test("iappendable/iprependable", function({assert}){
  assert(_.eq(_.chain(["Moe"], _.append(_, "Howard")), ["Moe", "Howard"]));
  assert(_.eq(_.chain({surname: "Howard"}, _.conj(_, ['givenName', "Moe"])), {givenName: "Moe", surname: "Howard"}));
  assert(_.eq(_.chain([1, 2], _.append(_, 3)), [1, 2, 3]));
  assert(_.eq(_.chain([1, 2], _.prepend(_, 0)), [0, 1, 2]));
});

test("sequences", function({assert}){
  assert(_.eq(_.chain(["A","B","C"], _.cycle, _.take(5, _), _.toArray), ["A","B","C","A","B"]));
  assert(_.eq(_.chain(_.positives, _.take(5, _), _.toArray), [1,2,3,4,5]));
  assert(_.eq(_.chain(["A","B","C"], _.rest, _.toArray), ["B", "C"]));
  assert(_.eq(_.chain(_.repeatedly(3, _.constantly(4)), _.toArray), [4,4,4]));
  assert(_.eq(_.chain(stooges, _.concat(_, ["Shemp","Corey"]), _.toArray), ["Larry","Curly","Moe","Shemp","Corey"]));
  assert(_.eq(_.toArray(_.range(4)), [0,1,2,3]));
  assert(_.chain(stooges, _.second) === "Curly");
  assert(_.chain([1,2,3], _.some(_.isEven, _)) === true);
  assert(_.chain([1,2,3], _.notAny(_.isEven, _)) === false);
  assert(_.chain([2,4,6], _.every(_.isEven, _)) === true);
  assert(_.eq(_.chain([9,8,7,6,5,4,3], _.dropLast(3, _), _.toArray), [9,8,7,6]));
  assert(_.eq(_.chain(stooges, _.sort, _.toArray), ["Curly","Larry","Moe"]))
  assert(_.eq(_.chain(["A","B",["C","D"],["E", ["F", "G"]]], _.flatten, _.toArray), ["A","B","C","D","E","F","G"]));
  assert(_.eq(_.chain([null, ""], _.flatten, _.toArray), [null, ""]));
  assert(_.eq(_.chain(pieces, _.selectKeys(_, ["pawn", "knight"])), {pawn: 1, knight: 3}));
  assert(_.eq(_.chain(["A","B","C","D","E"], _.interleave(_, _.repeat("="), _.positives), _.toArray), ["A","=",1,"B","=",2,"C","=",3,"D","=",4,"E","=",5]));
  assert(_.eq(_.chain([1,2,3], _.interleave(_, [10,11,12]), _.toArray), [1,10,2,11,3,12]));
  assert(_.chain([false, true], _.some(_.isTrue, _)) === true);
  assert(_.chain([false, true], _.some(_.isFalse, _)) === true);
  assert(_.chain([false, false], _.some(_.isTrue, _)) === null);
  assert(_.chain(_.range(10), _.detect(x => x > 5, _)) === 6);
  assert(!_.chain(_.range(10), _.every(x => x > 5, _)));
  assert(_.eq(_.chain([1, 2, 3], _.empty), []));
  assert(_.eq(_.chain(null, _.into([], _)), []));
  assert(_.eq(_.chain(_.repeat(1), _.take(2, _), _.toArray), [1, 1]));
  assert(_.eq(_.chain([1, 2, 3], _.butlast, _.toArray), [1, 2]));
  assert(_.eq(_.chain(["A","B","C"], _.interpose("-", _), _.toArray), ["A", "-", "B", "-", "C"]));
  assert(_.eq(_.chain(_.repeat(1), _.take(5, _), _.toArray), [1,1,1,1,1]));
  assert(_.eq(_.chain(_.repeat(1), _.take(5, _), _.conj(_, 0), _.conj(_, -1), _.toArray), [-1, 0, 1, 1, 1, 1, 1]));
  assert(_.eq(_.chain(_.range(10), _.take(5, _), _.toArray), [0, 1, 2, 3, 4]));
  assert(_.eq(_.chain(_.range(-5, 5), _.toArray), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]));
  assert(_.eq(_.chain(_.range(-20, 100, 10), _.toArray), [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]));
  assert(_.eq(_.chain(_.range(10), _.drop(3, _), _.take(3, _), _.toArray), [3, 4, 5]));
  assert(_.eq(_.chain([1, 2, 3], _.map(_.inc, _), _.toArray), [2, 3, 4]));
  assert(_.chain([1, 2, 3, 4], _.some(_.isEven, _)) === true);
  assert(_.chain([1, 2, 3, 4], _.detect(_.isEven, _)) === 2);
  assert(_.chain(_.range(10), _.some(x => x > 5, _)) === true);
  assert(_.eq(_.chain({ace: 1, king: 2, queen: 3}, _.selectKeys(_, ["ace", "king"])), {ace: 1, king: 2}));
  assert(_.chain("Polo", _.into("Marco ", _)) === "Marco Polo");
  assert(_.chain([5, 6, 7, 8, 9], _.filter(x => x > 6, _), _.into("", _)) === "789");
  assert(_.eq(_.chain("Polo", _.toArray), ["P", "o", "l", "o"]));
  assert(_.eq(_.chain([1, 2, 3], _.cycle, _.take(7, _), _.toArray), [1, 2, 3, 1, 2, 3, 1]));
  assert(_.eq(_.chain([1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7], _.dedupe, _.toArray), [1, 2, 3, 4, 5, 6, 7]));
  assert(_.eq(_.chain([1, 2, 3, 1, 4, 3, 4, 3, 2, 2], _.distinct, _.toArray), [1, 2, 3, 4]));
  assert(_.eq(_.chain(_.range(10), _.takeNth(2, _), _.toArray), [0, 2, 4, 6, 8]));
  assert(_.eq(_.chain(_.constantly(1), _.repeatedly, _.take(0, _), _.toArray), []));
  assert(_.eq(_.chain(_.constantly(2), _.repeatedly, _.take(10, _), _.toArray), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]));
  assert(_.eq(_.chain(_.range(10), _.take(5, _), _.toArray), [0, 1, 2, 3, 4]));
  assert(_.eq(_.chain(_.range(10), _.filter(x => x > 5, _), _.toArray), [6, 7, 8, 9]));
  assert(_.eq(_.chain(_.range(10), _.remove(x => x > 5, _), _.toArray), [0, 1, 2, 3, 4, 5]));
  assert(_.eq(_.chain(_.range(10), _.takeWhile(x => x < 5, _), _.toArray), [0, 1, 2, 3, 4]));
  assert(_.eq(_.chain(_.range(10), _.dropWhile(x => x > 5, _), _.toArray), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
  assert(_.eq(_.chain(_.range(1, 5), _.map(_.inc, _), _.toArray), [2, 3, 4, 5]));
  assert(_.eq(_.chain([10, 11, 12], _.map(_.inc, _), _.toArray), [11, 12, 13]));
  assert(_.eq(_.chain([5, 6, 7, 8, 9], _.filter(x => x > 6, _), _.map(_.inc, _), _.take(2, _), _.toArray), [8, 9]));
  assert(_.eq(_.chain(_.range(7, 15), _.take(10, _), _.toArray), [7, 8, 9, 10, 11, 12, 13, 14]));
  assert(_.eq(_.chain(_.range(5), _.toArray), [0, 1, 2, 3, 4]));
  assert(_.eq(_.chain(_.repeat("X"), _.take(5, _), _.toArray), ["X", "X", "X", "X", "X"]));
  assert(_.eq(_.chain([1, 2], _.concat(_, [3, 4], [5, 6]), _.toArray), [1, 2, 3, 4, 5, 6]));
  assert(_.eq(_.chain(["a", "b", "c", "d", "e"], _.keepIndexed((idx, value) => _.isOdd(idx) ? value : null, _), _.toArray), ["b", "d"]));
  assert(_.eq(_.chain([10, 11, 12], _.mapIndexed((idx, value) => [idx, _.inc(value)], _), _.toArray), [[0, 11], [1, 12], [2, 13]]));
  assert(_.everyPred(_.isEven, x => x > 10)(12,14,16));
  assert(_.maxKey(obj => obj["king"], pieces, court) === pieces);
});

test("add/subtract", function({assert}){
  const christmas = _.date(2017, 11, 25);
  const newYears  = _.date(2018, 0, 1);
  const mmddyyyy  =
    _.fmt(
      _.comp(_.zeros(_, 2), _.inc, _.month), "/",
      _.comp(_.zeros(_, 2), _.day), "/",
      _.comp(_.zeros(_, 4), _.year));
  assert(_.chain(christmas, mmddyyyy) === "12/25/2017");
  assert(_.chain(newYears, mmddyyyy) === "01/01/2018");
  assert(_.chain(christmas, _.add(_, _.days(1)), _.deref) === 1514264400000);
  assert(_.chain(christmas, _.add(_, _.weeks(1)), _.deref) === 1514782800000);
  assert(_.chain(christmas, _.add(_, _.months(1)), _.deref) === 1516856400000);
  assert(_.chain(christmas, _.add(_, _.years(1)), _.deref) === 1545714000000);
  assert(_.chain(christmas, _.subtract(_, _.years(1)), _.deref) === 1482642000000);
});

test("duration", function({assert}){
  const newYearsEve = _.date(2019, 11, 31);
  const newYearsDay = _.period(_.date(2020, 0, 1));
  assert(_.divide(_.years(1), _.days(1)) === 365.25);
  assert(_.divide(_.days(1), _.hours(1)) === 24);
  assert(_.chain(newYearsDay, _.toDuration, _.divide(_, _.hours(1))) === 24);
  assert(_.deref(_.add(newYearsEve, 1)) === 1577854800000);
  assert(_.deref(_.add(newYearsEve, _.days(1))) === 1577854800000);
  assert(_.deref(_.add(newYearsEve, _.years(-1))) === 1546232400000);  //prior New Year's Eve
  assert(_.deref(_.add(newYearsEve, _.days(1), _.hours(7))) === 1577880000000);  //7am New Year's Day
});

//protocols as discriminated unions: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
test("area:polymorphism", function({assert}){
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
  assert(area(s) === 49);
  assert(area(c) === 201.06192982974676);
});

test("coercion", function({assert}){
  assert(_.eq(_.coerce(_.range(3), Array), Array.from(_.range(3)), _.toArray(_.range(3)), _.coerce([0,1,2], Array)));
  assert(_.eq(_.coerce(_.set([2,4,2,5]), Array), [2,4,5]));
  assert(_.eq(_.coerce([2,5,2,4], Set), _.set([2,4,5])));
  assert(_.eq(_.coerce(_.concat(_.range(3), _.range(2)), Array), [0,1,2,0,1]));
  assert(_.eq(_.coerce(_.cons(1, _.cons(2)), Array), _.coerce(_.list(1, 2), Array), [1,2]));
  assert(_.eq(_.cons(1, _.cons(2)), _.list(1, 2)));
  assert(_.eq(_.coerce(null, Array), []));
  assert(_.eq(_.coerce("eggs", Array), Array.from(_.seq("eggs")), ["e","g","g","s"]));
});

test("record", function({assert}){
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
  assert(_.chain($robin, _.deref, _.deref, _.get(_, "surname")) === "Wright");
  $.swap($robin, _.fmap(_, _.assoc(_, "surname", "Penn")));
  assert(_.chain($robin, _.deref, _.deref, _.get(_, "surname")) === "Penn");
  $.swap($robin, _.undo);
  assert(_.chain($robin, _.deref, _.deref, _.get(_, "surname")) === "Wright");
  $.swap($robin, _.redo);
  assert(_.chain($robin, _.deref, _.deref, _.get(_, "surname")), "Penn");
  assert(_.chain(robin, _.get(_, "surname")) === "Wright");
  assert(_.chain(robin, _.assoc(_, "surname", "Penn"), _.get(_, "surname")) === "Penn");
  assert(_.chain(sean, _.get(_, "surname")) === "Penn");
  assert(_.chain(dylan, _.get(_, "surname")) === "Penn");
  assert(_.chain(dylan, _.assoc(_, "surname", "McDermott"), _.get(_, "surname")) === "McDermott");
  assert(_.count(robin) === 3);
});

test("multirecord", function({assert}){
  function Person(name, surname, dob){
    this.name = name;
    this.surname = surname;
    this.dob = dob;
  }
  const person = _.record(Person, {defaults: _.constantly([]), multiple: _.constantly(true)});
  const robin = person([["name", "Robin"], ["surname", "Wright"], ["surname", "Penn"], ["dob", new Date(1966, 3, 8)]]);
  const entries = _.chain(robin, _.seq, _.toArray);
  assert(_.eq(entries, [["name", "Robin"], ["surname", "Wright"], ["surname","Penn"], ["dob",new Date(1966, 3, 8)]]));
  const robbie = _.assert(robin, "name", "Robbie");
  assert(_.eq(_.get(robbie, "name"), ["Robin", "Robbie"]));
  assert(_.verify(robbie, "name", "Robin"));
  assert(_.verify(robbie, "name", "Robbie"));
  const robbie2 = _.chain(robbie,
      _.retract(_, "name", "Robin"),
      _.retract(_, "dob"));
  const name2 = _.get(robbie2, "name");
  assert(_.eq(name2, ["Robbie"]));
});

test("observable sharing", function({assert}){
  function exec(oo, nn, desc){
    var o = {ex: oo, result: $.cell([])},
        n = {ex: nn, result: $.cell([])};
    $.sub(o.ex, $.collect(o.result));
    $.sub(n.ex, $.collect(n.result));
    assert(_.eq(_.deref(o.result), _.deref(n.result)), desc);
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
  assert(_.eq(_.deref($ac), _.deref($ao)));

  const $b  = $.cell(0),
        $bc = $.cell([]),
        $bs = $.cell([]);
  $.sub($b, $.collect($bc));
  $.connect($triple, $b);
  $.sub($triple, $.collect($bs));
  assert(_.eq(_.deref($bc), _.deref($bs)));

  const $ca = $.subject(),
        $cc = $.cell([]),
        $cs = $.cell([]),
        $cf = $.cell([]);
  const bump = _.map(_.inc);
  $.sub($.pipe($triple, bump), $.collect($cc));
  $.sub($triple, bump, $.collect($cs));
  $.sub($ca, $.collect($cf));
  $.connect($triple, bump, $ca);
  assert(_.eq(_.deref($cs), _.deref($cf)), "$.sub v. $.connect");
  assert(_.eq(_.deref($cs), _.deref($cc)), "$.sub v. $.pipe");
});

test("cell", function({assert, throws}){
  const button = dom.tag('button');
  const tally = button("Tally");
  const clicks = $.cell(0);
  tally.click();
  assert(_.deref(clicks) === 0);
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
  assert(_.deref(clicks) === 1);
  assert(_.deref(source) === 1);
  assert(_.deref(dest) === 2);
  assert(_.deref(msinkc) === 2);
  const bucket = $.cell([], $.subject(), _.pipe(_.get(_, 'length'), _.lt(_, 3))),
        states = $.cell([]);
  _.chain(bucket, $.sub(_, state => _.chain(states, $.swap(_, _.conj(_, state)))));
  _.chain(bucket, $.swap(_, _.conj(_, "ice")));
  _.chain(bucket, $.swap(_, _.conj(_, "champagne")));
  throws(() => _.chain(bucket, $.swap(_, _.conj(_, "soda"))));
  _.chain(bucket, $.swap(_, _.assoc(_, 1, "wine")));
  assert(_.eq(_.chain(bucket, _.deref), ["ice", "wine"]));
  assert(_.eq(_.chain(states, _.deref), [[], ["ice"], ["ice", "champagne"], ["ice", "wine"]]));
});

test("immutable updates", function({assert}){
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
  assert(_.chain(states, _.deref, _.count) === 2, "original + transaction");
  assert(_.eq(_.chain(duos, _.deref), [["Daryl", "John"], ["Laurel", "Hardy"], ["Andrew Ridgeley", "George Michaels"]]));
  assert(!_.chain(d0, _.isIdentical(_, get0(duos))), "new container for");
  assert(_.chain(d1, _.isIdentical(_, get1(duos))), "original container untouched");
  assert(!_.chain(d2, _.isIdentical(_, get2(duos))), "created from nothing");
  assert(d2 !== "non-existent");
});

test("list", function({assert}){
  assert(_.eq(_.toArray(_.list()), []));
  assert(_.eq(_.toArray(_.list(0)), [0]));
  assert(_.eq(_.toArray(_.list(0, 1, 2)), [0, 1, 2]));
});

test("strings", function({assert}){
  assert(_.eq(_.chain("I like peanutbutter", _.split(_, " ")), ["I", "like", "peanutbutter"]));
  assert(_.eq(_.chain("q1w2e3r4t5y6u7i8o9p", _.split(_, /\d/)), ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]));
  assert(_.eq(_.chain("q1w2e3r4t5y6u7i8o9p", _.split(_, /\d/, 4)), ["q", "w", "e", "r4t5y6u7i8o9p"]));
  assert(_.chain("reading", _.subs(_, 3)) === "ding");
  assert(_.chain("reading", _.subs(_, 0, 4)) === "read");
  assert(_.chain(["spam", null, "eggs", "", "spam"], _.join(", ", _)) === "spam, , eggs, , spam");
  assert(_.chain([1, 2, 3], _.join(", ", _)) === "1, 2, 3");
  assert(_.chain(["ace", "king", "queen"], _.join("-", _)) === "ace-king-queen");
  assert(_.chain(["hello", " ", "world"], _.join("", _)) === "hello world");
});

test("min/max", function({assert}){
  assert(_.min(-9, 9, 0) === -9);
  assert(_.max(-9, 9, 0) ===  9);
});

test("indexed-seq", function({assert}){
  const nums = _.indexedSeq([11,12,13,14], 1);
  const letters = _.indexedSeq(_.split("grace", ""));
  assert(_.chain(letters, _.first) === "g");
  assert(_.chain(letters, _.nth(_, 2)) === "a");
  assert(_.chain(nums, _.first) === 12);
  assert(_.chain(nums, _.nth(_, 1)) === 13);
  assert(_.chain(nums, _.count) === 3);
  assert(_.chain(nums, _.satisfies(_.IReducible, _)));
  assert(_.chain(nums, _.reduce(_.add, 0, _)) === 39);
});

test("equality", function({assert}){
  assert(_.chain("Curly", _.eq(_, "Curly")), "Equal strings");
  assert(!_.chain("Curlers", _.eq(_, "Curly")), "Unequal strings");
  assert(_.chain("Curlers", _.notEq(_, "Curly")), "Unequal strings");
  const rng = _.range(3);
  assert(_.eq(rng, rng, _.range(3), rng, [0,1,2], rng, _.cons(0, _.range(1,3)), _.initial(_.range(4))), "Communicative sequences");
  assert(_.chain(45, _.eq(_, 45)), "Equal numbers");
  assert(_.chain([1, 2, 3], _.eq(_, [1, 2, 3])), "Equal arrays");
  assert(!_.chain([1, 2, 3], _.eq(_, [2, 3])), "Unequal arrays");
  assert(!_.chain([1, 2, 3], _.eq(_, [3, 2, 1])), "Unequal arrays per order");
  assert(_.chain({fname: "Moe", lname: "Howard"}, _.eq(_, {fname: "Moe", lname: "Howard"})), "Equal objects");
  assert(!_.chain({fname: "Moe", middle: "Harry", lname: "Howard"}, _.eq(_, {fname: "Moe", lname: "Howard"})), "Unequal objects");
});

test("coersion", function({assert}){
  assert(_.eq(_.chain([["Moe", "Howard"], ["Curly", "Howard"]], _.toObject), {Moe: "Howard", Curly: "Howard"}));
  assert(_.eq(_.chain({Moe: "Howard", Curly: "Howard"}, _.toArray), [["Moe", "Howard"], ["Curly", "Howard"]]));
});

test("predicates", function({assert}){
  //two means of running multiple tests against different arguments
  const cinco = _.range(5),
        any = _.someFn(_.includes(cinco, _)), //or
        all = _.everyPred(_.includes(cinco, _)); //and
  assert(_.chain({ace: 1, king: 2, queen: 3}, _.subsumes(_, {ace: 1, king: 2})));
  assert(_.any(3, 1) === 3);
  assert(_.any(null, 1) === 1);
  assert(_.all(3, 1) === 1);
  assert(_.all(null, 1) === null);
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
