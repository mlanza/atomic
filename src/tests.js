import _ from "@atomic/core";
import imm from "@atomic/immutables";
import dom from "@atomic/dom";
import $ from "@atomic/reactives";
import sh from "@atomic/shell";
import vd from "@atomic/validates";
import t from "@atomic/transducers";
import mut from "@atomic/transients";

const stooges = ["Larry","Curly","Moe"],
      pieces  = {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity},
      court   = {jack: 11, queen: 12, king: 13},
      worth   = {pieces: pieces, court: court};

QUnit.test("inheritance chain", function(assert){
  function Person(fname, lname){
    this.fname = fname;
    this.lname = lname;
  }
  function name(self){
    return `${self.fname} ${self.lname}`;
  }

  assert.equal(_.name(Person), "Person");
  _.specify(_.INamable, {name: _.constantly("Human")}, Person); //on the constructor itself
  assert.equal(_.name(Person), "Human");
  var greg = new Person("Gregory", "Porter");
  assert.ok(!_.satisfies(_.INamable, greg));
  _.implement(_.INamable, {name}, Person);
  assert.ok(_.satisfies(_.INamable, greg));
  assert.equal(_.name(greg), "Gregory Porter");
  _.specify(_.INamable, {name: _.get(?, "fname")}, greg);
  assert.equal(_.name(greg), "Gregory");
});

QUnit.test("keyed types", function(assert){
  assert.ok(_.satisfies(_.IMapEntry, Array)); //e.g. from `keying`
  assert.ok(_.isArray([]));
  assert.ok(_.isObject({}));
});

QUnit.test("hashing", function(assert){
  const m = imm.map()
    |> _.assoc(?, _.date(999), 111)
    |> _.assoc(?, [1, 7, 0, 1, 1], 17070)
    |> _.assoc(?, {"blackwidow": "Avenger"}, "Natasha")
    |> _.assoc(?, "mustard", "ketchup");

  function same(x, y){
    assert.equal(_.hash(x), _.hash(y));
    assert.equal(_.hash(x), _.hash(x));
    assert.ok(_.equiv(x, y));
  }
  const div = dom.tag("div");
  const hi = div("hi");
  assert.ok(_.hash(div("hi")) !== _.hash(div("hi")));
  assert.ok(_.hash({card: "ace"}) !== _.hash({card: "king"}));
  assert.ok(_.hash(true) !== _.hash(false));
  assert.ok(_.hash(same) !== _.hash(function(){}));
  assert.ok(_.hash(function(){}) !== _.hash(function(){}));
  same(hi, hi);
  same(same, same);
  same(true, true);
  same([1, 7, 0, 1, 1], [1, 7, 0, 1, 1]);
  same(_.date(999), _.date(999));
  same({blackwidow: "Avenger"}, {blackwidow: "Avenger"});
  same([{blackwidow: "Avenger"}, _.date(774), [1, 2]], [{blackwidow: "Avenger"}, _.date(774), [1, 2]]);
  assert.equal(_.get(m, _.date(999)), 111);
  assert.equal(_.get(m, {blackwidow: "Avenger"}), "Natasha");
  assert.equal(_.get(m, "mustard"), "ketchup");
});

QUnit.test("routing", function(assert){ //not just for fns!
  const c = _.coalesce(
    _.guard(_.signature(_.isString), _.str(?, "!")),
    _.guard(_.signature(_.isNumber), _.mult(?, 2)));

  const r = _.router()
    |> _.addRoute(?, _.signature(_.isString), _.str(?, "!"))
    |> _.addRoute(?, _.signature(_.isNumber), _.mult(?, 2))

  const s = _.invokable(r);

  const website = _.right(
    _.router(),
    _.addRoute(?, /users\((\d+)\)\/entries\((\d+)\)/i, _.posn(parseInt, parseInt), function(user, entry){
      return `showing entry ${entry} for ${user}`;
    }),
    _.addRoute(?, /blog(\?p=\d+)/i, _.posn(_.fromQueryString), function(qs){
      return `showing pg ${qs.p}`;
    }),
    _.invokable);

  assert.equal(_.invoke(c, 1), 2);
  assert.equal(_.invoke(c, "timber"), "timber!");
  assert.equal(c(1), 2);
  assert.equal(c("timber"), "timber!");
  assert.equal(_.invoke(r, 1), 2);
  assert.equal(_.invoke(r, "timber"), "timber!");
  assert.equal(s(1), 2);
  assert.equal(s("timber"), "timber!");
  assert.equal(website("users(11)/entries(3)"), "showing entry 3 for 11");
  assert.equal(website("blog?p=99"), "showing pg 99");

});

QUnit.test("validation", function(assert){
  const zipCode = /^\d{5}(-\d{1,4})?$/;
  const birth = "7/10/1926";
  const past = vd.or(Date, vd.anno({type: "past"}, _.lt(?, new Date())));
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
  assert.ok(vd.check(vd.range("start", "end"), {start: 1, end: 5}) == null);
  assert.ok(vd.check(vd.range("start", "end"), {start: 1, end: 1}) == null);
  assert.ok(vd.check(vd.range("start", "end"), {start: 5, end: 1}) != null);
  assert.ok(dob.constraint === Date);
  assert.ok(name.constraint === String);
  assert.ok(names != null);
  assert.ok(_.ako(anon.constraint, vd.Required));
  assert.ok(status != null);
  //TODO add `when` to validate conditiontionally or allow condition to be checked before registering the validation?
});

QUnit.test("component", function(assert){
  const people =
    _.doto(
      sh.component($.cell([]), function(accepts, raises, affects){
        return [{
          "add": accepts("added")
        }, {
          "added": affects(_.conj)
        }]
      }),
    sh.dispatch(?, {type: "add", args: [{name: "Moe"}]}),
    sh.dispatch(?, {type: "add", args: [{name: "Curly"}]}),
    sh.dispatch(?, {type: "add", args: [{name: "Shemp"}]}));

  assert.equal(_.count(_.deref(people)), 3);
});

QUnit.test("embeddables", function(assert){
  function names(context){
    return _.mapa(dom.text, dom.sel("li", context));
  }
  const ul = dom.tag('ul'),
        li = dom.tag('li');
  const larry = li("Larry"),
        curly = li("Curly"),
        moe = li({class: "boss"}, "Moe"),
        shemp = li("Shemp"),
        corey = li("Corey"),
        stooges = ul({class: "stooges"}, larry);
  const frag = dom.fragment(stooges);
  assert.equal(dom.attr(stooges, "class"), "stooges");
  dom.append(stooges, corey);
  assert.deepEqual(names(frag), ["Larry", "Corey"]);
  dom.prepend(stooges, moe);
  assert.deepEqual(names(frag), ["Moe", "Larry", "Corey"]);
  dom.before(corey, curly);
  assert.deepEqual(names(frag), ["Moe", "Larry", "Curly", "Corey"]);
  dom.after(curly, shemp);
  assert.deepEqual(names(frag), ["Moe", "Larry", "Curly", "Shemp", "Corey"]);
});

QUnit.test("dom", function(assert){
  const {ul, li, div, span} = dom.tags(dom.element(document), _.expands, ["ul", "li", "div", "span"]);
  const duo = _.doto(dom.fragment(), dom.append(?, div("Abbott")), dom.append(?, dom.element("div", "Costello")));
  const who = div(_.get(?, "givenName"), " ", _.get(?, "surname"));
  const template = ul(_.map(function([id, person]){
    return li({id: id}, who(person));
  }, ?));
  const stooges = template({
    moe: {givenName: "Moe", surname: "Howard"},
    curly: {givenName: "Curly", surname: "Howard"},
    larry: {givenName: "Larry", surname: "Fine"}
  });
  const moe = stooges |> dom.sel("li", ?) |> _.first;

  assert.equal(duo |> _.children |> _.first  |> dom.text, "Abbott");
  assert.equal(duo |> _.children |> _.second |> dom.text, "Costello");
  assert.equal(stooges |> _.leaves |> _.count, 3);
  assert.equal(moe |> dom.text, "Moe Howard", "Found by tag");
  assert.deepEqual(stooges |> dom.sel("li", ?) |> _.map(_.get(?, "id"), ?) |> _.toArray, ["moe", "curly", "larry"], "Extracted ids");
  assert.equal({givenName: "Curly", surname: "Howard"} |> who |> dom.text, "Curly Howard");
  assert.deepEqual(_.fluent(moe, dom.classes, mut.conj(?, "main"), _.deref), ["main"]);
  assert.equal(_.fluent(moe, dom.attr(?, "data-tagged", "tests"), _.get(?, "data-tagged")), "tests");
  stooges |> dom.append(?, div({id: 'branding'}, span("Three Blind Mice")));
  assert.ok(stooges |> dom.sel("#branding", ?) |> _.first |> (el => _.ako(el, HTMLDivElement)), "Found by id");
  assert.deepEqual(stooges |> dom.sel("#branding span", ?) |> _.map(dom.text, ?) |> _.first, "Three Blind Mice", "Read text content");
  const greeting = stooges |> dom.sel("#branding span", ?) |> _.first;
  dom.hide(greeting);
  assert.deepEqual(greeting |> dom.style |> _.deref, {display: "none"}, "Hidden");
  assert.equal(greeting |> dom.style |> _.get(?, "display"), "none");
  dom.show(greeting);
  assert.deepEqual(greeting |> dom.style |> _.deref, {}, "Shown");
  const branding = stooges |> dom.sel("#branding", ?) |> _.first;
  dom.omit(branding);
  assert.equal(branding |> _.parent |> _.first, null, "Removed");
});

QUnit.test("jQueryesque functor", function(assert){
  const ol = dom.tag("ol"),
        li = dom.tag("li"),
        span = dom.tag("span");
  const jq = _.members(function(els){ //configure members functor, it upholds the collectiveness of contents
    return dom.isElement(_.first(els)) ? imm.distinct(els) : els; //guarantee distinctness - but only for elements
  });
  const bedrock =
    ol({"id": "Bedrock"},
      ol({"id": "Flintstones", "class": "Family"},
        li(span("Fred"), " ", "Flintstone"),
        li(span("Wilma"), " ", "Flintstone")),
      ol({"id": "Rubbles", "class": "Family"},
        li(span("Barney"), " ", "Rubble"),
        li(span("Betty"), " ", "Rubble")));
  const cavepersons = jq(bedrock, dom.sel(".Family", ?), dom.sel("span", ?), dom.text, _.lowerCase);
  assert.deepEqual(_.toArray(cavepersons), ["fred", "wilma", "barney", "betty"]);
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
  assert.ok(_.ako(_.rest(blank), _.EmptyList));
  assert.ok(_.ako(_.rest(nums), _.LazySeq));
  assert.ok(_.seq(blank) == null);
  assert.ok(_.seq(nums) != null);
  assert.deepEqual(_.toArray(nums), [0,1,2]);
  assert.deepEqual(_.toArray(blank), []);
});

QUnit.test("transducers", function(assert){
  var useFeat = location.href.indexOf("feature=next") > -1;
  function compare(source, xf, expect, desc){
    var $b = $.cell([]);
    $.sub($.toObservable(source), xf, $.collect($b));
    var a = _.transduce(xf, _.conj, [], source),
        b = _.deref($b);
    //compare for rough equivalence
    assert.deepEqual(a, expect, "transduce " + desc);
    assert.deepEqual(b, expect, "observe " + desc);
  }
  var special = [8, 6, 7, 5, 3, 0, 9];
  useFeat && compare(special, t.first(), [8], "first");
  useFeat && compare(special, t.last(), [9], "last");
  useFeat && compare(special, t.last(2), [0, 9], "last 2");
  compare(special, t.map(_.inc), [9, 7, 8, 6, 4, 1, 10], "increased");
  compare(special, t.filter(_.isOdd), [7, 5, 3, 9], "odd only");
  compare(special, _.comp(t.filter(_.isOdd), t.map(_.inc)), [8, 6, 4, 10], "odd increased");
  assert.deepEqual([1, 2, 3] |> _.cycle |> _.into([], _.comp(t.take(4), t.map(_.inc)), ?), [2, 3, 4, 2]);
  assert.deepEqual([1, 3, 2, 2, 3] |> _.into([], t.dedupe(), ?), [1, 3, 2, 3]);
  assert.deepEqual([1, 3, 2, 2, 3] |> _.into([], t.filter(_.isEven), ?), [2, 2]);
});

QUnit.test("iinclusive", function(assert){
  const charlie = {name: "Charlie", iq: 120, hitpoints: 30};
  assert.ok(charlie |> _.includes(?, ["name", "Charlie"]));
  assert.notOk(charlie |> _.includes(?, ["name", "Charles"]));
});

QUnit.test("ilookup", function(assert){
  assert.equal(stooges |> _.get(?, 2), "Moe");
  assert.equal(pieces |> _.get(?, "pawn"), 1);
  assert.equal(worth |> _.getIn(?, ["pieces", "queen"]), 10);
  const boris = {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "Suite 401"],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }};
  const moe = {givenName: "Moe", surname: "Howard"};
  const givenName = _.overload(null, _.get(?, "givenName"), _.assoc(?, "givenName", ?)); //lens
  const getAddressLine1 = _.pipe(_.maybe, _.fmap(?, _.get(?, "address"), _.get(?, "lines"), _.get(?, 1)), _.otherwise(?, ""));
  assert.equal(moe   |> getAddressLine1, "");
  assert.equal(boris |> getAddressLine1, "Suite 401");
  assert.equal(boris |> _.maybe |> _.fmap(?, _.get(?, "address"), _.get(?, "lines"), _.get(?, 1)) |> _.otherwise(?, ""), "Suite 401");
  assert.equal(boris |> _.getIn(?, ["address", "lines", 1]), "Suite 401");
  assert.equal(boris |> _.getIn(?, ["address", "lines", 2]), null);
  assert.deepEqual(boris |> _.assocIn(?, ["address", "lines", 1], "attn: Finance Dept."), {givenName: "Boris", surname: "Lasky", address: {
    lines: ["401 Mayor Ave.", "attn: Finance Dept."],
    city: "Mechanicsburg", state: "PA", zip: "17055"
  }})
  assert.deepEqual(boris |> _.updateIn(?, ["address", "lines", 1], _.upperCase), {givenName: "Boris", surname: "Lasky", address: {
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
  assert.equal(["ace", "king", "queen"] |> _.get(?, 2), "queen");
});

QUnit.test("iassociative", function(assert){
  assert.equal(stooges |> _.assoc(?, 0, "Larry"), stooges, "maintain referential equivalence");
  assert.ok(_.contains(court, "jack", 11));
  assert.ok(!_.contains(court, "ace", 14));
  assert.ok(_.includes(court, ["jack", 11], ["queen", 12]));
  assert.ok(_.excludes(court, ["deuce", 2]));
  assert.ok(_.everyPred(_.spread(_.partial(_.contains, court)))(["jack", 11], ["queen", 12]));
  assert.deepEqual(stooges |> _.assoc(?, 0, "Shemp"), ["Shemp","Curly","Moe"]);
  assert.deepEqual(court |> _.assoc(?, "ace", 14), {jack: 11, queen: 12, king: 13, ace: 14});
  assert.deepEqual(worth |> _.assocIn(?, ["court","ace"], 1), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {ace: 1, jack: 11, queen: 12, king: 13}});
  assert.deepEqual(worth |> _.assocIn(?, ["court","king"], Infinity), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: Infinity}});
  assert.deepEqual(court |> _.update(?, "jack", _.add(?, -10)), {jack: 1, queen: 12, king: 13});
  assert.deepEqual(worth |> _.updateIn(?, ["court","king"], _.add(?, -10)), {pieces: {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 10, king: Infinity}, court: {jack: 11, queen: 12, king: 3}});
  assert.deepEqual(stooges, ["Larry","Curly","Moe"], "no mutations occurred");
  assert.deepEqual(court, {jack: 11, queen: 12, king: 13}, "no mutations occurred");
  assert.deepEqual({surname: "Howard"} |> _.assoc(?, "givenName", "Moe"), {givenName: "Moe", surname: "Howard"});
  assert.deepEqual([1, 2, 3] |> _.assoc(?, 1, 0), [1, 0, 3]);
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
  assert.deepEqual([1, 2, 3] |> _.union(?, [2, 3, 4]) |> _.sort |> _.toArray, [1, 2, 3, 4]);
  assert.deepEqual([1, 2, 3, 4, 5] |> _.difference(?, [5, 2, 10]) |> _.sort |> _.toArray, [1, 3, 4]);
  assert.ok([1, 2, 3] |> _.superset(?, [2, 3]));
  assert.notOk([1, 2, 3] |> _.superset(?, [2, 4]));
});

QUnit.test("iappendable, iprependable", function(assert){
  assert.deepEqual(["Moe"] |> _.append(?, "Howard"), ["Moe", "Howard"]);
  assert.deepEqual({surname: "Howard"} |> _.conj(?, ['givenName', "Moe"]), {givenName: "Moe", surname: "Howard"});
  assert.deepEqual([1, 2] |> _.append(?, 3), [1, 2, 3]);
  assert.deepEqual([1, 2] |> _.prepend(?, 0), [0, 1, 2]);
});

QUnit.test("sequences", function(assert){
  assert.deepEqual(["A","B","C"] |> _.cycle |> _.take(5, ?) |> _.toArray, ["A","B","C","A","B"])
  assert.deepEqual(_.positives |> _.take(5, ?) |> _.toArray, [1,2,3,4,5]);
  assert.deepEqual(["A","B","C"] |> _.rest |> _.toArray, ["B", "C"]);
  assert.deepEqual(_.repeatedly(3, _.constantly(4)) |> _.toArray, [4,4,4]);
  assert.deepEqual(stooges |> _.concat(?, ["Shemp","Corey"]) |> _.toArray, ["Larry","Curly","Moe","Shemp","Corey"]);
  assert.deepEqual(_.range(4) |> _.toArray, [0,1,2,3]);
  assert.equal(stooges |> _.second, "Curly");
  assert.equal([1,2,3] |> _.some(_.isEven, ?), true);
  assert.equal([1,2,3] |> _.notAny(_.isEven, ?), false);
  assert.equal([2,4,6] |> _.every(_.isEven, ?), true);
  assert.deepEqual([9,8,7,6,5,4,3] |> _.dropLast(3, ?) |> _.toArray, [9,8,7,6]);
  assert.deepEqual(stooges |> _.sort |> _.toArray, ["Curly","Larry","Moe"])
  assert.deepEqual(["A","B",["C","D"],["E", ["F", "G"]]] |> _.flatten |> _.toArray, ["A","B","C","D","E","F","G"]);
  assert.deepEqual([null, ""] |> _.flatten |> _.toArray, [null, ""]);
  assert.deepEqual(pieces |> _.selectKeys(?, ["pawn", "knight"]), {pawn: 1, knight: 3});
  assert.deepEqual(["A","B","C","D","E"] |> _.interleave(?, _.repeat("="), _.positives) |> _.toArray, ["A","=",1,"B","=",2,"C","=",3,"D","=",4,"E","=",5]);
  assert.deepEqual([1,2,3] |> _.interleave(?, [10,11,12]) |> _.toArray, [1,10,2,11,3,12]);
  assert.equal([false, true] |> _.some(_.isTrue, ?), true);
  assert.equal([false, true] |> _.some(_.isFalse, ?), true);
  assert.equal([false, false] |> _.some(_.isTrue, ?), null);
  assert.equal(_.range(10) |> _.detect(x => x > 5, ?), 6);
  assert.notOk(_.range(10) |> _.every(x => x > 5, ?));
  assert.deepEqual([1, 2, 3] |> _.empty, []);
  assert.deepEqual(null |> _.into([], ?), []);
  assert.deepEqual(_.repeat(1) |> _.take(2, ?) |> _.toArray, [1, 1]);
  assert.deepEqual([1, 2, 3] |> _.butlast |> _.toArray, [1, 2]);
  assert.deepEqual(["A","B","C"] |> _.interpose("-", ?) |> _.toArray, ["A", "-", "B", "-", "C"]);
  assert.deepEqual(_.repeat(1) |> _.take(5, ?) |> _.toArray, [1,1,1,1,1]);
  assert.deepEqual(_.repeat(1) |> _.take(5, ?) |> _.conj(?, 0) |> _.conj(?, -1) |> _.toArray, [-1, 0, 1, 1, 1, 1, 1]);
  assert.deepEqual(_.range(10) |> _.take(5, ?) |> _.toArray, [0, 1, 2, 3, 4]);
  assert.deepEqual(_.range(-5, 5) |> _.toArray, [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
  assert.deepEqual(_.range(-20, 100, 10) |> _.toArray, [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
  assert.deepEqual(_.range(10) |> _.drop(3, ?) |> _.take(3, ?) |> _.toArray, [3, 4, 5]);
  assert.deepEqual([1, 2, 3] |> _.map(_.inc, ?) |> _.toArray, [2, 3, 4]);
  assert.equal([1, 2, 3, 4] |> _.some(_.isEven, ?), true);
  assert.equal([1, 2, 3, 4] |> _.detect(_.isEven, ?), 2);
  assert.equal(_.range(10) |> _.some(x => x > 5, ?), true);
  assert.deepEqual({ace: 1, king: 2, queen: 3} |> _.selectKeys(?, ["ace", "king"]), {ace: 1, king: 2});
  assert.equal("Polo" |> _.into("Marco ", ?), "Marco Polo");
  assert.deepEqual([5, 6, 7, 8, 9] |> _.filter(x => x > 6, ?) |> _.into("", ?), "789");
  assert.deepEqual("Polo" |> _.toArray, ["P", "o", "l", "o"]);
  assert.deepEqual([1, 2, 3] |> _.cycle |> _.take(7, ?) |> _.toArray, [1, 2, 3, 1, 2, 3, 1]);
  assert.deepEqual([1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7] |> _.dedupe |> _.toArray, [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual([1, 2, 3, 1, 4, 3, 4, 3, 2, 2] |> imm.distinct |> _.toArray, [1, 2, 3, 4]);
  assert.deepEqual(_.range(10) |> _.takeNth(2, ?) |> _.toArray, [0, 2, 4, 6, 8]);
  assert.deepEqual(_.constantly(1) |> _.repeatedly |> _.take(0, ?) |> _.toArray, []);
  assert.deepEqual(_.constantly(2) |> _.repeatedly |> _.take(10, ?) |> _.toArray, [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  assert.deepEqual(_.range(10) |> _.take(5, ?) |> _.toArray, [0, 1, 2, 3, 4]);
  assert.deepEqual(_.range(10) |> _.filter(x => x > 5, ?) |> _.toArray, [6, 7, 8, 9]);
  assert.deepEqual(_.range(10) |> _.remove(x => x > 5, ?) |> _.toArray, [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(_.range(10) |> _.takeWhile(x => x < 5, ?) |> _.toArray, [0, 1, 2, 3, 4]);
  assert.deepEqual(_.range(10) |> _.dropWhile(x => x > 5, ?) |> _.toArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual(_.range(1, 5) |> _.map(_.inc, ?) |> _.toArray, [2, 3, 4, 5]);
  assert.deepEqual([10, 11, 12] |> _.map(_.inc, ?) |> _.toArray, [11, 12, 13]);
  assert.deepEqual([5, 6, 7, 8, 9] |> _.filter(x => x > 6, ?) |> _.map(_.inc, ?) |> _.take(2, ?) |> _.toArray, [8, 9]);
  assert.deepEqual(_.range(7, 15) |> _.take(10, ?) |> _.toArray, [7, 8, 9, 10, 11, 12, 13, 14]);
  assert.deepEqual(_.range(5) |> _.toArray, [0, 1, 2, 3, 4]);
  assert.deepEqual(_.repeat("X") |> _.take(5, ?) |> _.toArray, ["X", "X", "X", "X", "X"]);
  assert.deepEqual([1, 2] |> _.concat(?, [3, 4], [5, 6]) |> _.toArray, [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(["a", "b", "c", "d", "e"] |> _.keepIndexed((idx, value) => _.isOdd(idx) ? value : null, ?) |> _.toArray, ["b", "d"]);
  assert.deepEqual([10, 11, 12] |> _.mapIndexed((idx, value) => [idx, _.inc(value)], ?) |> _.toArray, [[0, 11], [1, 12], [2, 13]]);
  assert.ok(_.everyPred(_.isEven, x => x > 10)(12,14,16));
  assert.equal(_.maxKey(obj => obj["king"], pieces, court), pieces);
});

QUnit.test("add/subtract", function(assert){
  const christmas = _.date(2017, 11, 25);
  const newYears  = _.date(2018, 0, 1);
  const mmddyyyy  =
    _.fmt(
      _.comp(_.zeros(?, 2), _.inc, _.month), "/",
      _.comp(_.zeros(?, 2), _.day), "/",
      _.comp(_.zeros(?, 4), _.year));
  assert.equal(christmas |> mmddyyyy, "12/25/2017");
  assert.equal(newYears  |> mmddyyyy, "01/01/2018");
  assert.equal(christmas |> _.add(?, _.days(1)) |> _.deref, 1514264400000);
  assert.equal(christmas |> _.add(?, _.weeks(1)) |> _.deref, 1514782800000);
  assert.equal(christmas |> _.add(?, _.months(1)) |> _.deref, 1516856400000);
  assert.equal(christmas |> _.add(?, _.years(1)) |> _.deref, 1545714000000);
  assert.equal(christmas |> _.subtract(?, _.years(1)) |> _.deref, 1482642000000);
});

QUnit.test("duration", function(assert){
  const newYearsEve = _.date(2019, 11, 31);
  const newYearsDay = _.period(_.date(2020, 0, 1));
  assert.equal(_.divide(_.years(1), _.days(1)), 365.25);
  assert.equal(_.divide(_.days(1), _.hours(1)), 24);
  assert.equal(newYearsDay |> _.toDuration |> _.divide(?, _.hours(1)), 24);
  assert.equal(_.add(newYearsEve, 1) |> _.deref, 1577854800000);
  assert.equal(_.add(newYearsEve, _.days(1)) |> _.deref, 1577854800000);
  assert.equal(_.add(newYearsEve, _.years(-1)) |> _.deref, 1546232400000);  //prior New Year's Eve
  assert.equal(_.add(newYearsEve, _.days(1), _.hours(7)) |> _.deref, 1577880000000);  //7am New Year's Day

});

QUnit.test("record", function(assert){
  function Person(name, surname, dob){
    this.attrs = {name, surname, dob};
  }
  _.record(Person);
  const sean  = new Person("Sean", "Penn", _.date(1960, 8, 17));
  const person = _.constructs(Person);
  const robin = person("Robin", "Wright", new Date(1966, 3, 8));
  const dylan = _.construct(Person, {name: "Dylan", surname: "Penn", dob: _.date(1991, 4, 13)});
  const $robin = $.cell(_.journal(robin));
  assert.equal($robin |> _.deref |> _.get(?, "surname"), "Wright");
  _.swap($robin, _.assoc(?, "surname", "Penn"));
  assert.equal($robin |> _.deref |> _.get(?, "surname"), "Penn");
  _.swap($robin, _.undo);
  assert.equal($robin |> _.deref |> _.get(?, "surname"), "Wright");
  _.swap($robin, _.redo);
  assert.equal($robin |> _.deref |> _.get(?, "surname"), "Penn");
  assert.equal(robin |> _.get(?, "surname"), "Wright");
  assert.equal(robin |> _.assoc(?, "surname", "Penn") |> _.get(?, "surname"), "Penn");
  assert.equal(sean |> _.get(?, "surname"), "Penn");
  assert.equal(_.count(robin), 3);
});

QUnit.test("observable sharing", function(assert){
  function exec(oo, nn, desc){
    var o = {ex: oo, result: $.cell([])},
        n = {ex: nn, result: $.cell([])};
    $.sub(o.ex, $.collect(o.result));
    $.sub(n.ex, $.collect(n.result));
    assert.deepEqual(_.deref(o.result), _.deref(n.result), desc);
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
  assert.deepEqual(_.deref($ac), _.deref($ao));

  const $b  = $.cell(0),
        $bc = $.cell([]),
        $bs = $.cell([]);
  $.sub($b, $.collect($bc));
  $.connect($triple, $b);
  $.sub($triple, $.collect($bs));
  assert.deepEqual(_.deref($bc), _.deref($bs));

  const $ca = $.subject(),
        $cc = $.cell([]),
        $cs = $.cell([]),
        $cf = $.cell([]);
  const bump = t.map(_.inc);
  $.sub($.pipe($triple, bump), $.collect($cc));
  $.sub($triple, bump, $.collect($cs));
  $.sub($ca, $.collect($cf));
  $.connect($triple, bump, $ca);
  assert.ok(_.eq(_.deref($cs), _.deref($cf)), "$.sub v. $.connect");
  assert.ok(_.eq(_.deref($cs), _.deref($cc)), "$.sub v. $.pipe");

});

QUnit.test("cell", function(assert){
  const button = dom.tag('button');
  const tally = button("Tally");
  const clicks = $.cell(0);
  tally.click();
  assert.equal(clicks |> _.deref, 0);
  const tallied = dom.click(tally);
  var unsub = $.sub(tallied, function(){
    _.swap(clicks, _.inc);
  });
  $.sub(tallied, _.noop);
  tally.click();
  unsub();
  tally.click();
  const source = $.cell(0);
  const dest = $.cell();
  const sink   = $.pipe(source, t.map(_.inc), t.tee($.pub(dest, ?)));
  $.connect(sink, $.subject());
  const msink  = _.fmap(source, _.inc);
  const msinkc = $.cell();
  $.sub(msink, msinkc);
  _.swap(source, _.inc);
  assert.equal(clicks |> _.deref, 1);
  assert.equal(source |> _.deref, 1);
  assert.equal(dest   |> _.deref, 2);
  assert.equal(msinkc |> _.deref, 2);
  const bucket = $.cell([], $.subject(), _.pipe(_.get(?, 'length'), _.lt(?, 3))),
        states = $.cell([]);
  bucket |> $.sub(?, state => states |> _.swap(?, _.conj(?, state)));
  bucket |> _.swap(?, _.conj(?, "ice"));
  bucket |> _.swap(?, _.conj(?, "champagne"));
  assert.throws(function(){
    bucket |> _.swap(?, _.conj(?, "soda"));
  });
  bucket |> _.swap(?, _.assoc(?, 1, "wine"));
  assert.deepEqual(bucket |> _.deref, ["ice", "wine"]);
  assert.deepEqual(states |> _.deref, [[], ["ice"], ["ice", "champagne"], ["ice", "wine"]]);
});

QUnit.test("immutable updates", function(assert){
  const duos = $.cell([["Hall", "Oates"], ["Laurel", "Hardy"]]),
        get0 = _.pipe(_.deref, _.nth(?, 0)),
        get1 = _.pipe(_.deref, _.nth(?, 1)),
        get2 = _.pipe(_.deref, _.nth(?, 2)),
        d0 = get0(duos),
        d1 = get1(duos),
        d2 = get2(duos),
        states = $.cell([]),
        txn = _.pipe(
          _.conj(?, ["Andrew Ridgeley", "George Michaels"]),
          _.assocIn(?, [0, 0], "Daryl"),
          _.assocIn(?, [0, 1], "John"));
  duos |> $.sub(?, state => states |> _.swap(?, _.conj(?, state)));
  duos |> _.swap(?, txn);
  assert.equal(states |> _.deref |> _.count, 2, "original + transaction");
  assert.deepEqual(duos |> _.deref, [["Daryl", "John"], ["Laurel", "Hardy"], ["Andrew Ridgeley", "George Michaels"]]);
  assert.notOk(d0 |> _.isIdentical(?, get0(duos)), "new container for");
  assert.ok(d1 |> _.isIdentical(?, get1(duos)), "original container untouched");
  assert.notOk(d2 |> _.isIdentical(?, get2(duos)), "created from nothing");
  assert.notOk(d2, "non-existent");
});

QUnit.test("list", function(assert){
  assert.deepEqual(_.list() |> _.toArray, []);
  assert.deepEqual(_.list(0) |> _.toArray, [0]);
  assert.deepEqual(_.list(0, 1, 2) |> _.toArray, [0, 1, 2]);
});

QUnit.test("strings", function(assert){
  assert.deepEqual("I like peanutbutter" |> _.split(?, " "), ["I", "like", "peanutbutter"]);
  assert.deepEqual("q1w2e3r4t5y6u7i8o9p" |> _.split(?, /\d/), ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
  assert.deepEqual("q1w2e3r4t5y6u7i8o9p" |> _.split(?, /\d/, 4), ["q", "w", "e", "r4t5y6u7i8o9p"]);
  assert.equal("reading" |> _.subs(?, 3), "ding");
  assert.equal("reading" |> _.subs(?, 0, 4), "read");
  assert.equal(["spam", null, "eggs", "", "spam"] |> _.join(", ", ?), "spam, , eggs, , spam");
  assert.equal([1, 2, 3] |> _.join(", ", ?), "1, 2, 3");
  assert.equal(["ace", "king", "queen"] |> _.join("-", ?), "ace-king-queen");
  assert.equal(["hello", " ", "world"] |> _.join("", ?), "hello world");
});

QUnit.test("min/max", function(assert){
  assert.equal(_.min(-9, 9, 0), -9);
  assert.equal(_.max(-9, 9, 0),  9);
});

QUnit.test("indexed-seq", function(assert){
  const nums = _.indexedSeq([11,12,13,14], 1);
  const letters = _.indexedSeq(_.split("grace", ""));
  assert.equal(letters |> _.first, "g");
  assert.equal(letters |> _.nth(?, 2), "a");
  assert.equal(nums |> _.first, 12);
  assert.equal(nums |> _.nth(?, 1), 13);
  assert.equal(nums |> _.count, 3);
  assert.ok(nums |> _.satisfies(_.IReducible, ?));
  assert.equal(nums |> _.reduce(_.add, 0, ?), 39);
});

QUnit.test("equality", function(assert){
  assert.ok("Curly" |> _.eq(?, "Curly"), "Equal strings");
  assert.notOk("Curlers" |> _.eq(?, "Curly"), "Unequal strings");
  assert.ok("Curlers" |> _.notEq(?, "Curly"), "Unequal strings");
  const rng = _.range(3);
  assert.ok(_.eq(rng, rng, _.range(3), rng, [0,1,2], rng, _.cons(0, _.range(1,3)), _.initial(_.range(4))), "Communicative sequences");
  assert.ok(45 |> _.eq(?, 45), "Equal numbers");
  assert.ok([1, 2, 3] |> _.eq(?, [1, 2, 3]), "Equal arrays");
  assert.notOk([1, 2, 3] |> _.eq(?, [2, 3]), "Unequal arrays");
  assert.notOk([1, 2, 3] |> _.eq(?, [3, 2, 1]), "Unequal arrays");
  assert.ok({fname: "Moe", lname: "Howard"} |> _.eq(?, {fname: "Moe", lname: "Howard"}), "Equal objects");
  assert.notOk({fname: "Moe", middle: "Harry", lname: "Howard"} |> _.eq(?, {fname: "Moe", lname: "Howard"}), "Unequal objects");
});

QUnit.test("coersion", function(assert){
  assert.deepEqual([["Moe", "Howard"], ["Curly", "Howard"]] |> _.toObject, {Moe: "Howard", Curly: "Howard"});
  assert.deepEqual({Moe: "Howard", Curly: "Howard"} |> _.toArray, [["Moe", "Howard"], ["Curly", "Howard"]]);
});

QUnit.test("predicates", function(assert){
  //two means of running multiple tests against different arguments
  const cinco = _.range(5),
        any = _.someFn(_.includes(cinco, ?)), //or
        all = _.everyPred(_.includes(cinco, ?)); //and
  assert.ok({ace: 1, king: 2, queen: 3} |> _.subsumes(?, {ace: 1, king: 2}));
  assert.equal(_.any(3, 1), 3);
  assert.equal(_.any(null, 1), 1);
  assert.equal(_.all(3, 1), 1);
  assert.equal(_.all(null, 1), null);
  assert.ok(any(1, 2, 3));
  assert.ok(all(1, 2, 3));
  assert.ok(any(-1, -2, 3));
  assert.ok(!all(1, 2, -3));
  assert.ok(!all(-1, -2, -3));
  assert.ok(!_.includes(cinco, 1, 2, -3)); //same functionality built in
  assert.ok(!_.excludes(cinco, 1, 2, -3));
  assert.ok(_.excludes(cinco, 11, 5, -3));
  assert.ok(!_.includes(cinco, -1, -2, -3));
});
