import _ from '../lib/@atomic/core.js';
import imm from '../lib/@atomic/immutables.js';
import dom from '../lib/@atomic/dom.js';
import $ from '../lib/@atomic/reactives.js';
import sh from '../lib/@atomic/shell.js';
import vd from '../lib/@atomic/validates.js';
import t from '../lib/@atomic/transducers.js';
import mut from '../lib/@atomic/transients.js';

var stooges = ["Larry", "Curly", "Moe"],
    pieces = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 10,
  king: Infinity
},
    court = {
  jack: 11,
  queen: 12,
  king: 13
},
    worth = {
  pieces: pieces,
  court: court
};
QUnit.test("inheritance chain", function (assert) {
  var _$get, _ref;

  function Person(fname, lname) {
    this.fname = fname;
    this.lname = lname;
  }

  function name(self) {
    return "".concat(self.fname, " ").concat(self.lname);
  }

  assert.equal(_.name(Person), "Person");

  _.specify(_.INamable, {
    name: _.constantly("Human")
  }, Person); //on the constructor itself


  assert.equal(_.name(Person), "Human");
  var greg = new Person("Gregory", "Porter");
  assert.ok(!_.satisfies(_.INamable, greg));

  _.implement(_.INamable, {
    name
  }, Person);

  assert.ok(_.satisfies(_.INamable, greg));
  assert.equal(_.name(greg), "Gregory Porter");

  _.specify(_.INamable, {
    name: (_ref = _, _$get = _ref.get, function get(_argPlaceholder) {
      return _$get.call(_ref, _argPlaceholder, "fname");
    })
  }, greg);

  assert.equal(_.name(greg), "Gregory");
});
QUnit.test("keyed types", function (assert) {
  assert.ok(_.satisfies(_.IMapEntry, Array)); //e.g. from `keying`

  assert.ok(_.isArray([]));
  assert.ok(_.isObject({}));
});
QUnit.test("hashing", function (assert) {
  var _ref2, _ref3, _ref4, _imm$map, _$date, _$assoc, _ref5, _param, _$assoc2, _ref6, _blackwidow, _$assoc3, _ref7, _$assoc4, _ref8;

  var m = (_ref2 = (_ref3 = (_ref4 = (_imm$map = imm.map(), (_ref5 = _, _$assoc = _ref5.assoc, _$date = _.date(999), function assoc(_argPlaceholder2) {
    return _$assoc.call(_ref5, _argPlaceholder2, _$date, 111);
  })(_imm$map)), (_ref6 = _, _$assoc2 = _ref6.assoc, _param = [1, 7, 0, 1, 1], function assoc(_argPlaceholder3) {
    return _$assoc2.call(_ref6, _argPlaceholder3, _param, 17070);
  })(_ref4)), (_ref7 = _, _$assoc3 = _ref7.assoc, _blackwidow = {
    "blackwidow": "Avenger"
  }, function assoc(_argPlaceholder4) {
    return _$assoc3.call(_ref7, _argPlaceholder4, _blackwidow, "Natasha");
  })(_ref3)), (_ref8 = _, _$assoc4 = _ref8.assoc, function assoc(_argPlaceholder5) {
    return _$assoc4.call(_ref8, _argPlaceholder5, "mustard", "ketchup");
  })(_ref2));

  function same(x, y) {
    assert.equal(_.hash(x), _.hash(y));
    assert.equal(_.hash(x), _.hash(x));
    assert.ok(_.equiv(x, y));
  }

  var div = dom.tag("div");
  var hi = div("hi");
  assert.ok(_.hash(div("hi")) !== _.hash(div("hi")));
  assert.ok(_.hash({
    card: "ace"
  }) !== _.hash({
    card: "king"
  }));
  assert.ok(_.hash(true) !== _.hash(false));
  assert.ok(_.hash(same) !== _.hash(function () {}));
  assert.ok(_.hash(function () {}) !== _.hash(function () {}));
  same(hi, hi);
  same(same, same);
  same(true, true);
  same([1, 7, 0, 1, 1], [1, 7, 0, 1, 1]);
  same(_.date(999), _.date(999));
  same({
    blackwidow: "Avenger"
  }, {
    blackwidow: "Avenger"
  });
  same([{
    blackwidow: "Avenger"
  }, _.date(774), [1, 2]], [{
    blackwidow: "Avenger"
  }, _.date(774), [1, 2]]);
  assert.equal(_.get(m, _.date(999)), 111);
  assert.equal(_.get(m, {
    blackwidow: "Avenger"
  }), "Natasha");
  assert.equal(_.get(m, "mustard"), "ketchup");
});
QUnit.test("routing", function (assert) {
  var _$str, _ref9, _$mult, _ref10, _ref11, _$router, _$signature, _$str2, _$addRoute, _ref12, _$str3, _ref13, _$signature2, _$mult2, _$addRoute2, _ref14, _$mult3, _ref15, _param2, _$posn, _param3, _$addRoute3, _ref16, _param4, _$posn2, _param5, _$addRoute4, _ref17;

  //not just for fns!
  var c = _.coalesce(_.guard(_.signature(_.isString), (_ref9 = _, _$str = _ref9.str, function str(_argPlaceholder6) {
    return _$str.call(_ref9, _argPlaceholder6, "!");
  })), _.guard(_.signature(_.isNumber), (_ref10 = _, _$mult = _ref10.mult, function mult(_argPlaceholder7) {
    return _$mult.call(_ref10, _argPlaceholder7, 2);
  })));

  var r = (_ref11 = (_$router = _.router(), (_ref12 = _, _$addRoute = _ref12.addRoute, _$signature = _.signature(_.isString), _$str2 = (_ref13 = _, _$str3 = _ref13.str, function str(_argPlaceholder9) {
    return _$str3.call(_ref13, _argPlaceholder9, "!");
  }), function addRoute(_argPlaceholder8) {
    return _$addRoute.call(_ref12, _argPlaceholder8, _$signature, _$str2);
  })(_$router)), (_ref14 = _, _$addRoute2 = _ref14.addRoute, _$signature2 = _.signature(_.isNumber), _$mult2 = (_ref15 = _, _$mult3 = _ref15.mult, function mult(_argPlaceholder11) {
    return _$mult3.call(_ref15, _argPlaceholder11, 2);
  }), function addRoute(_argPlaceholder10) {
    return _$addRoute2.call(_ref14, _argPlaceholder10, _$signature2, _$mult2);
  })(_ref11));

  var s = _.invokable(r);

  var website = _.right(_.router(), (_ref16 = _, _$addRoute3 = _ref16.addRoute, _param2 = /users\((\d+)\)\/entries\((\d+)\)/i, _$posn = _.posn(parseInt, parseInt), _param3 = function _param3(user, entry) {
    return "showing entry ".concat(entry, " for ").concat(user);
  }, function addRoute(_argPlaceholder12) {
    return _$addRoute3.call(_ref16, _argPlaceholder12, _param2, _$posn, _param3);
  }), (_ref17 = _, _$addRoute4 = _ref17.addRoute, _param4 = /blog(\?p=\d+)/i, _$posn2 = _.posn(_.fromQueryString), _param5 = function _param5(qs) {
    return "showing pg ".concat(qs.p);
  }, function addRoute(_argPlaceholder13) {
    return _$addRoute4.call(_ref17, _argPlaceholder13, _param4, _$posn2, _param5);
  }), _.invokable);

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
QUnit.test("validation", function (assert) {
  var _Date, _$lt, _ref18;

  var zipCode = /^\d{5}(-\d{1,4})?$/;
  var birth = "7/10/1926";
  var past = vd.or(Date, vd.anno({
    type: "past"
  }, (_ref18 = _, _$lt = _ref18.lt, _Date = new Date(), function lt(_argPlaceholder14) {
    return _$lt.call(_ref18, _argPlaceholder14, _Date);
  })));
  var herman = {
    name: ["Herman", "Munster"],
    status: "married",
    dob: new Date(birth)
  };
  var person = vd.and(vd.required('name', vd.and(vd.collOf(String), vd.card(2, 2))), vd.optional('status', vd.and(String, vd.choice(["single", "married", "divorced"]))), vd.optional('dob', past));
  var [dob] = vd.check(person, _.assoc(herman, "dob", birth));
  var [name, names] = vd.check(person, _.assoc(herman, "name", [1]));
  var [anon] = vd.check(person, _.dissoc(herman, "name"));
  var [status] = vd.check(person, _.assoc(herman, "status", "separated"));
  assert.ok(vd.check(zipCode, "17055") == null);
  assert.ok(vd.check(zipCode, 17055) == null);
  assert.ok(vd.check(zipCode, "17055-0001") == null);
  assert.ok(vd.check(zipCode, "") != null);
  assert.ok(vd.check(zipCode, null) != null);
  assert.ok(vd.check(zipCode, "1705x-0001") != null);
  assert.ok(vd.check(Number, "7") != null);
  assert.ok(vd.check(Number, parseInt, "7") == null);
  assert.ok(vd.check(vd.range("start", "end"), {
    start: 1,
    end: 5
  }) == null);
  assert.ok(vd.check(vd.range("start", "end"), {
    start: 1,
    end: 1
  }) == null);
  assert.ok(vd.check(vd.range("start", "end"), {
    start: 5,
    end: 1
  }) != null);
  assert.ok(dob.constraint === Date);
  assert.ok(name.constraint === String);
  assert.ok(names != null);
  assert.ok(_.ako(anon.constraint, vd.Required));
  assert.ok(status != null); //TODO add `when` to validate conditiontionally or allow condition to be checked before registering the validation?
});
QUnit.test("component", function (assert) {
  var _type$args, _sh$dispatch, _sh, _type$args2, _sh$dispatch2, _sh2, _type$args3, _sh$dispatch3, _sh3;

  var people = _.doto(sh.component($.cell([]), function (accepts, raises, affects) {
    return [{
      "add": accepts("added")
    }, {
      "added": affects(_.conj)
    }];
  }), (_sh = sh, _sh$dispatch = _sh.dispatch, _type$args = {
    type: "add",
    args: [{
      name: "Moe"
    }]
  }, function dispatch(_argPlaceholder15) {
    return _sh$dispatch.call(_sh, _argPlaceholder15, _type$args);
  }), (_sh2 = sh, _sh$dispatch2 = _sh2.dispatch, _type$args2 = {
    type: "add",
    args: [{
      name: "Curly"
    }]
  }, function dispatch(_argPlaceholder16) {
    return _sh$dispatch2.call(_sh2, _argPlaceholder16, _type$args2);
  }), (_sh3 = sh, _sh$dispatch3 = _sh3.dispatch, _type$args3 = {
    type: "add",
    args: [{
      name: "Shemp"
    }]
  }, function dispatch(_argPlaceholder17) {
    return _sh$dispatch3.call(_sh3, _argPlaceholder17, _type$args3);
  }));

  assert.equal(_.count(_.deref(people)), 3);
});
QUnit.test("embeddables", function (assert) {
  function names(context) {
    return _.mapa(dom.text, dom.sel("li", context));
  }

  var ul = dom.tag('ul'),
      li = dom.tag('li');
  var larry = li("Larry"),
      curly = li("Curly"),
      moe = li({
    class: "boss"
  }, "Moe"),
      shemp = li("Shemp"),
      corey = li("Corey"),
      stooges = ul({
    class: "stooges"
  }, larry);
  var frag = dom.fragment(stooges);
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
QUnit.test("dom", function (assert) {
  var _div, _dom$append, _dom, _dom$element, _dom$append2, _dom2, _$get2, _ref19, _$get3, _ref20, _param6, _$map, _ref21, _ref23, _stooges, _dom$sel, _dom3, _ref24, _ref25, _duo, _ref26, _ref27, _duo2, _ref28, _stooges2, _moe, _ref29, _ref30, _stooges3, _dom$sel2, _dom4, _$get4, _$map2, _ref31, _$get5, _ref32, _ref33, _givenName$surname, _mut$conj, _mut, _dom$attr, _dom5, _$get6, _ref34, _stooges4, _div2, _dom$append3, _dom6, _ref35, _ref36, _stooges5, _dom$sel3, _dom7, _ref37, _ref38, _stooges6, _dom$sel4, _dom8, _dom$text, _$map3, _ref39, _ref40, _stooges7, _dom$sel5, _dom9, _ref41, _greeting, _ref42, _greeting2, _$get7, _ref43, _ref44, _greeting3, _ref45, _stooges8, _dom$sel6, _dom10, _ref46, _branding;

  var {
    ul,
    li,
    div,
    span
  } = dom.tags(dom.element(document), _.expands, ["ul", "li", "div", "span"]);

  var duo = _.doto(dom.fragment(), (_dom = dom, _dom$append = _dom.append, _div = div("Abbott"), function append(_argPlaceholder18) {
    return _dom$append.call(_dom, _argPlaceholder18, _div);
  }), (_dom2 = dom, _dom$append2 = _dom2.append, _dom$element = dom.element("div", "Costello"), function append(_argPlaceholder19) {
    return _dom$append2.call(_dom2, _argPlaceholder19, _dom$element);
  }));

  var who = div((_ref19 = _, _$get2 = _ref19.get, function get(_argPlaceholder20) {
    return _$get2.call(_ref19, _argPlaceholder20, "givenName");
  }), " ", (_ref20 = _, _$get3 = _ref20.get, function get(_argPlaceholder21) {
    return _$get3.call(_ref20, _argPlaceholder21, "surname");
  }));
  var template = ul((_ref21 = _, _$map = _ref21.map, _param6 = function _param6(_ref22) {
    var [id, person] = _ref22;
    return li({
      id: id
    }, who(person));
  }, function map(_argPlaceholder22) {
    return _$map.call(_ref21, _param6, _argPlaceholder22);
  }));
  var stooges = template({
    moe: {
      givenName: "Moe",
      surname: "Howard"
    },
    curly: {
      givenName: "Curly",
      surname: "Howard"
    },
    larry: {
      givenName: "Larry",
      surname: "Fine"
    }
  });
  var moe = (_ref23 = (_stooges = stooges, (_dom3 = dom, _dom$sel = _dom3.sel, function sel(_argPlaceholder23) {
    return _dom$sel.call(_dom3, "li", _argPlaceholder23);
  })(_stooges)), _.first(_ref23));
  assert.equal((_ref24 = (_ref25 = (_duo = duo, _.children(_duo)), _.first(_ref25)), dom.text(_ref24)), "Abbott");
  assert.equal((_ref26 = (_ref27 = (_duo2 = duo, _.children(_duo2)), _.second(_ref27)), dom.text(_ref26)), "Costello");
  assert.equal((_ref28 = (_stooges2 = stooges, _.leaves(_stooges2)), _.count(_ref28)), 3);
  assert.equal((_moe = moe, dom.text(_moe)), "Moe Howard", "Found by tag");
  assert.deepEqual((_ref29 = (_ref30 = (_stooges3 = stooges, (_dom4 = dom, _dom$sel2 = _dom4.sel, function sel(_argPlaceholder24) {
    return _dom$sel2.call(_dom4, "li", _argPlaceholder24);
  })(_stooges3)), (_ref31 = _, _$map2 = _ref31.map, _$get4 = (_ref32 = _, _$get5 = _ref32.get, function get(_argPlaceholder26) {
    return _$get5.call(_ref32, _argPlaceholder26, "id");
  }), function map(_argPlaceholder25) {
    return _$map2.call(_ref31, _$get4, _argPlaceholder25);
  })(_ref30)), _.toArray(_ref29)), ["moe", "curly", "larry"], "Extracted ids");
  assert.equal((_ref33 = (_givenName$surname = {
    givenName: "Curly",
    surname: "Howard"
  }, who(_givenName$surname)), dom.text(_ref33)), "Curly Howard");
  assert.deepEqual(_.fluent(moe, dom.classes, (_mut = mut, _mut$conj = _mut.conj, function conj(_argPlaceholder27) {
    return _mut$conj.call(_mut, _argPlaceholder27, "main");
  }), _.deref), ["main"]);
  assert.equal(_.fluent(moe, (_dom5 = dom, _dom$attr = _dom5.attr, function attr(_argPlaceholder28) {
    return _dom$attr.call(_dom5, _argPlaceholder28, "data-tagged", "tests");
  }), (_ref34 = _, _$get6 = _ref34.get, function get(_argPlaceholder29) {
    return _$get6.call(_ref34, _argPlaceholder29, "data-tagged");
  })), "tests");
  _stooges4 = stooges, (_dom6 = dom, _dom$append3 = _dom6.append, _div2 = div({
    id: 'branding'
  }, span("Three Blind Mice")), function append(_argPlaceholder30) {
    return _dom$append3.call(_dom6, _argPlaceholder30, _div2);
  })(_stooges4);
  assert.ok((_ref35 = (_ref36 = (_stooges5 = stooges, (_dom7 = dom, _dom$sel3 = _dom7.sel, function sel(_argPlaceholder31) {
    return _dom$sel3.call(_dom7, "#branding", _argPlaceholder31);
  })(_stooges5)), _.first(_ref36)), _.ako(_ref35, HTMLDivElement)), "Found by id");
  assert.deepEqual((_ref37 = (_ref38 = (_stooges6 = stooges, (_dom8 = dom, _dom$sel4 = _dom8.sel, function sel(_argPlaceholder32) {
    return _dom$sel4.call(_dom8, "#branding span", _argPlaceholder32);
  })(_stooges6)), (_ref39 = _, _$map3 = _ref39.map, _dom$text = dom.text, function map(_argPlaceholder33) {
    return _$map3.call(_ref39, _dom$text, _argPlaceholder33);
  })(_ref38)), _.first(_ref37)), "Three Blind Mice", "Read text content");
  var greeting = (_ref40 = (_stooges7 = stooges, (_dom9 = dom, _dom$sel5 = _dom9.sel, function sel(_argPlaceholder34) {
    return _dom$sel5.call(_dom9, "#branding span", _argPlaceholder34);
  })(_stooges7)), _.first(_ref40));
  dom.hide(greeting);
  assert.deepEqual((_ref41 = (_greeting = greeting, dom.style(_greeting)), _.deref(_ref41)), {
    display: "none"
  }, "Hidden");
  assert.equal((_ref42 = (_greeting2 = greeting, dom.style(_greeting2)), (_ref43 = _, _$get7 = _ref43.get, function get(_argPlaceholder35) {
    return _$get7.call(_ref43, _argPlaceholder35, "display");
  })(_ref42)), "none");
  dom.show(greeting);
  assert.deepEqual((_ref44 = (_greeting3 = greeting, dom.style(_greeting3)), _.deref(_ref44)), {}, "Shown");
  var branding = (_ref45 = (_stooges8 = stooges, (_dom10 = dom, _dom$sel6 = _dom10.sel, function sel(_argPlaceholder36) {
    return _dom$sel6.call(_dom10, "#branding", _argPlaceholder36);
  })(_stooges8)), _.first(_ref45));
  dom.omit(branding);
  assert.equal((_ref46 = (_branding = branding, _.parent(_branding)), _.first(_ref46)), null, "Removed");
});
QUnit.test("jQueryesque functor", function (assert) {
  var _dom$sel7, _dom11, _dom$sel8, _dom12;

  var ol = dom.tag("ol"),
      li = dom.tag("li"),
      span = dom.tag("span");

  var jq = _.members(function (els) {
    //configure members functor, it upholds the collectiveness of contents
    return dom.isElement(_.first(els)) ? imm.distinct(els) : els; //guarantee distinctness - but only for elements
  });

  var bedrock = ol({
    "id": "Bedrock"
  }, ol({
    "id": "Flintstones",
    "class": "Family"
  }, li(span("Fred"), " ", "Flintstone"), li(span("Wilma"), " ", "Flintstone")), ol({
    "id": "Rubbles",
    "class": "Family"
  }, li(span("Barney"), " ", "Rubble"), li(span("Betty"), " ", "Rubble")));
  var cavepersons = jq(bedrock, (_dom11 = dom, _dom$sel7 = _dom11.sel, function sel(_argPlaceholder37) {
    return _dom$sel7.call(_dom11, ".Family", _argPlaceholder37);
  }), (_dom12 = dom, _dom$sel8 = _dom12.sel, function sel(_argPlaceholder38) {
    return _dom$sel8.call(_dom12, "span", _argPlaceholder38);
  }), dom.text, _.lowerCase);
  assert.deepEqual(_.toArray(cavepersons), ["fred", "wilma", "barney", "betty"]);
});
QUnit.test("lazy-seq", function (assert) {
  var effects = [],
      push = effects.push.bind(effects),
      xs = _.map(push, _.range(10)),
      nums = _.map(_.identity, _.range(3)),
      blank = _.map(_.identity, _.range(0));
      _.rest(nums);

  assert.ok(effects.length === 0);

  _.first(xs);

  assert.ok(effects.length === 1);

  _.first(xs);

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
  assert.deepEqual(_.toArray(nums), [0, 1, 2]);
  assert.deepEqual(_.toArray(blank), []);
});
QUnit.test("transducers", function (assert) {
  var _ref47, _ref48, _param7, _$comp, _$into, _ref49, _ref50, _param8, _t$dedupe, _$into2, _ref51, _ref52, _param9, _t$filter, _$into3, _ref53;

  var useFeat = location.href.indexOf("feature=next") > -1;

  function compare(source, xf, expect, desc) {
    var $b = $.cell([]);
    $.sub($.toObservable(source), xf, $.collect($b));

    var a = _.transduce(xf, _.conj, [], source),
        b = _.deref($b); //compare for rough equivalence


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
  assert.deepEqual((_ref47 = (_ref48 = [1, 2, 3], _.cycle(_ref48)), (_ref49 = _, _$into = _ref49.into, _param7 = [], _$comp = _.comp(t.take(4), t.map(_.inc)), function into(_argPlaceholder39) {
    return _$into.call(_ref49, _param7, _$comp, _argPlaceholder39);
  })(_ref47)), [2, 3, 4, 2]);
  assert.deepEqual((_ref50 = [1, 3, 2, 2, 3], (_ref51 = _, _$into2 = _ref51.into, _param8 = [], _t$dedupe = t.dedupe(), function into(_argPlaceholder40) {
    return _$into2.call(_ref51, _param8, _t$dedupe, _argPlaceholder40);
  })(_ref50)), [1, 3, 2, 3]);
  assert.deepEqual((_ref52 = [1, 3, 2, 2, 3], (_ref53 = _, _$into3 = _ref53.into, _param9 = [], _t$filter = t.filter(_.isEven), function into(_argPlaceholder41) {
    return _$into3.call(_ref53, _param9, _t$filter, _argPlaceholder41);
  })(_ref52)), [2, 2]);
});
QUnit.test("iinclusive", function (assert) {
  var _charlie, _param10, _$includes, _ref54, _charlie2, _param11, _$includes2, _ref55;

  var charlie = {
    name: "Charlie",
    iq: 120,
    hitpoints: 30
  };
  assert.ok((_charlie = charlie, (_ref54 = _, _$includes = _ref54.includes, _param10 = ["name", "Charlie"], function includes(_argPlaceholder42) {
    return _$includes.call(_ref54, _argPlaceholder42, _param10);
  })(_charlie)));
  assert.notOk((_charlie2 = charlie, (_ref55 = _, _$includes2 = _ref55.includes, _param11 = ["name", "Charles"], function includes(_argPlaceholder43) {
    return _$includes2.call(_ref55, _argPlaceholder43, _param11);
  })(_charlie2)));
});
QUnit.test("ilookup", function (assert) {
  var _stooges9, _$get8, _ref56, _pieces, _$get9, _ref57, _worth, _param12, _$getIn, _ref58, _$get10, _ref59, _$assoc5, _ref60, _$get11, _$get12, _$get13, _$fmap, _ref61, _$get14, _ref62, _$get15, _ref63, _$get16, _ref64, _$otherwise, _ref65, _moe2, _boris, _ref66, _ref67, _boris2, _$get17, _$get18, _$get19, _$fmap2, _ref68, _$get20, _ref69, _$get21, _ref70, _$get22, _ref71, _$otherwise2, _ref72, _boris3, _param13, _$getIn2, _ref73, _boris4, _param14, _$getIn3, _ref74, _boris5, _param15, _$assocIn, _ref75, _boris6, _param16, _$upperCase, _$updateIn, _ref76, _ref77, _$get23, _ref78;

  assert.equal((_stooges9 = stooges, (_ref56 = _, _$get8 = _ref56.get, function get(_argPlaceholder44) {
    return _$get8.call(_ref56, _argPlaceholder44, 2);
  })(_stooges9)), "Moe");
  assert.equal((_pieces = pieces, (_ref57 = _, _$get9 = _ref57.get, function get(_argPlaceholder45) {
    return _$get9.call(_ref57, _argPlaceholder45, "pawn");
  })(_pieces)), 1);
  assert.equal((_worth = worth, (_ref58 = _, _$getIn = _ref58.getIn, _param12 = ["pieces", "queen"], function getIn(_argPlaceholder46) {
    return _$getIn.call(_ref58, _argPlaceholder46, _param12);
  })(_worth)), 10);
  var boris = {
    givenName: "Boris",
    surname: "Lasky",
    address: {
      lines: ["401 Mayor Ave.", "Suite 401"],
      city: "Mechanicsburg",
      state: "PA",
      zip: "17055"
    }
  };
  var moe = {
    givenName: "Moe",
    surname: "Howard"
  };

  var givenName = _.overload(null, (_ref59 = _, _$get10 = _ref59.get, function get(_argPlaceholder47) {
    return _$get10.call(_ref59, _argPlaceholder47, "givenName");
  }), (_ref60 = _, _$assoc5 = _ref60.assoc, function assoc(_argPlaceholder48, _argPlaceholder49) {
    return _$assoc5.call(_ref60, _argPlaceholder48, "givenName", _argPlaceholder49);
  })); //lens


  var getAddressLine1 = _.pipe(_.maybe, (_ref61 = _, _$fmap = _ref61.fmap, _$get11 = (_ref62 = _, _$get14 = _ref62.get, function get(_argPlaceholder51) {
    return _$get14.call(_ref62, _argPlaceholder51, "address");
  }), _$get12 = (_ref63 = _, _$get15 = _ref63.get, function get(_argPlaceholder52) {
    return _$get15.call(_ref63, _argPlaceholder52, "lines");
  }), _$get13 = (_ref64 = _, _$get16 = _ref64.get, function get(_argPlaceholder53) {
    return _$get16.call(_ref64, _argPlaceholder53, 1);
  }), function fmap(_argPlaceholder50) {
    return _$fmap.call(_ref61, _argPlaceholder50, _$get11, _$get12, _$get13);
  }), (_ref65 = _, _$otherwise = _ref65.otherwise, function otherwise(_argPlaceholder54) {
    return _$otherwise.call(_ref65, _argPlaceholder54, "");
  }));

  assert.equal((_moe2 = moe, getAddressLine1(_moe2)), "");
  assert.equal((_boris = boris, getAddressLine1(_boris)), "Suite 401");
  assert.equal((_ref66 = (_ref67 = (_boris2 = boris, _.maybe(_boris2)), (_ref68 = _, _$fmap2 = _ref68.fmap, _$get17 = (_ref69 = _, _$get20 = _ref69.get, function get(_argPlaceholder56) {
    return _$get20.call(_ref69, _argPlaceholder56, "address");
  }), _$get18 = (_ref70 = _, _$get21 = _ref70.get, function get(_argPlaceholder57) {
    return _$get21.call(_ref70, _argPlaceholder57, "lines");
  }), _$get19 = (_ref71 = _, _$get22 = _ref71.get, function get(_argPlaceholder58) {
    return _$get22.call(_ref71, _argPlaceholder58, 1);
  }), function fmap(_argPlaceholder55) {
    return _$fmap2.call(_ref68, _argPlaceholder55, _$get17, _$get18, _$get19);
  })(_ref67)), (_ref72 = _, _$otherwise2 = _ref72.otherwise, function otherwise(_argPlaceholder59) {
    return _$otherwise2.call(_ref72, _argPlaceholder59, "");
  })(_ref66)), "Suite 401");
  assert.equal((_boris3 = boris, (_ref73 = _, _$getIn2 = _ref73.getIn, _param13 = ["address", "lines", 1], function getIn(_argPlaceholder60) {
    return _$getIn2.call(_ref73, _argPlaceholder60, _param13);
  })(_boris3)), "Suite 401");
  assert.equal((_boris4 = boris, (_ref74 = _, _$getIn3 = _ref74.getIn, _param14 = ["address", "lines", 2], function getIn(_argPlaceholder61) {
    return _$getIn3.call(_ref74, _argPlaceholder61, _param14);
  })(_boris4)), null);
  assert.deepEqual((_boris5 = boris, (_ref75 = _, _$assocIn = _ref75.assocIn, _param15 = ["address", "lines", 1], function assocIn(_argPlaceholder62) {
    return _$assocIn.call(_ref75, _argPlaceholder62, _param15, "attn: Finance Dept.");
  })(_boris5)), {
    givenName: "Boris",
    surname: "Lasky",
    address: {
      lines: ["401 Mayor Ave.", "attn: Finance Dept."],
      city: "Mechanicsburg",
      state: "PA",
      zip: "17055"
    }
  });
  assert.deepEqual((_boris6 = boris, (_ref76 = _, _$updateIn = _ref76.updateIn, _param16 = ["address", "lines", 1], _$upperCase = _.upperCase, function updateIn(_argPlaceholder63) {
    return _$updateIn.call(_ref76, _argPlaceholder63, _param16, _$upperCase);
  })(_boris6)), {
    givenName: "Boris",
    surname: "Lasky",
    address: {
      lines: ["401 Mayor Ave.", "SUITE 401"],
      city: "Mechanicsburg",
      state: "PA",
      zip: "17055"
    }
  });
  assert.deepEqual(boris, {
    givenName: "Boris",
    surname: "Lasky",
    address: {
      lines: ["401 Mayor Ave.", "Suite 401"],
      city: "Mechanicsburg",
      state: "PA",
      zip: "17055"
    }
  });
  assert.equal(givenName(moe), "Moe");
  assert.deepEqual(givenName(moe, "Curly"), {
    givenName: "Curly",
    surname: "Howard"
  });
  assert.deepEqual(moe, {
    givenName: "Moe",
    surname: "Howard"
  }, "no lens mutation");
  assert.equal((_ref77 = ["ace", "king", "queen"], (_ref78 = _, _$get23 = _ref78.get, function get(_argPlaceholder64) {
    return _$get23.call(_ref78, _argPlaceholder64, 2);
  })(_ref77)), "queen");
});
QUnit.test("iassociative", function (assert) {
  var _stooges10, _$assoc6, _ref79, _stooges11, _$assoc7, _ref80, _court, _$assoc8, _ref81, _worth2, _param17, _$assocIn2, _ref82, _worth3, _param18, _Infinity, _$assocIn3, _ref83, _court2, _$add, _$update, _ref84, _2, _$add2, _ref85, _worth4, _param19, _$add3, _$updateIn2, _ref86, _3, _$add4, _ref87, _surname, _$assoc9, _ref88, _ref89, _$assoc10, _ref90;

  assert.equal((_stooges10 = stooges, (_ref79 = _, _$assoc6 = _ref79.assoc, function assoc(_argPlaceholder65) {
    return _$assoc6.call(_ref79, _argPlaceholder65, 0, "Larry");
  })(_stooges10)), stooges, "maintain referential equivalence");
  assert.ok(_.contains(court, "jack", 11));
  assert.ok(!_.contains(court, "ace", 14));
  assert.ok(_.includes(court, ["jack", 11], ["queen", 12]));
  assert.ok(_.excludes(court, ["deuce", 2]));
  assert.ok(_.everyPred(_.spread(_.partial(_.contains, court)))(["jack", 11], ["queen", 12]));
  assert.deepEqual((_stooges11 = stooges, (_ref80 = _, _$assoc7 = _ref80.assoc, function assoc(_argPlaceholder66) {
    return _$assoc7.call(_ref80, _argPlaceholder66, 0, "Shemp");
  })(_stooges11)), ["Shemp", "Curly", "Moe"]);
  assert.deepEqual((_court = court, (_ref81 = _, _$assoc8 = _ref81.assoc, function assoc(_argPlaceholder67) {
    return _$assoc8.call(_ref81, _argPlaceholder67, "ace", 14);
  })(_court)), {
    jack: 11,
    queen: 12,
    king: 13,
    ace: 14
  });
  assert.deepEqual((_worth2 = worth, (_ref82 = _, _$assocIn2 = _ref82.assocIn, _param17 = ["court", "ace"], function assocIn(_argPlaceholder68) {
    return _$assocIn2.call(_ref82, _argPlaceholder68, _param17, 1);
  })(_worth2)), {
    pieces: {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 10,
      king: Infinity
    },
    court: {
      ace: 1,
      jack: 11,
      queen: 12,
      king: 13
    }
  });
  assert.deepEqual((_worth3 = worth, (_ref83 = _, _$assocIn3 = _ref83.assocIn, _param18 = ["court", "king"], _Infinity = Infinity, function assocIn(_argPlaceholder69) {
    return _$assocIn3.call(_ref83, _argPlaceholder69, _param18, _Infinity);
  })(_worth3)), {
    pieces: {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 10,
      king: Infinity
    },
    court: {
      jack: 11,
      queen: 12,
      king: Infinity
    }
  });
  assert.deepEqual((_court2 = court, (_ref84 = _, _$update = _ref84.update, _$add = (_ref85 = _, _$add2 = _ref85.add, _2 = -10, function add(_argPlaceholder71) {
    return _$add2.call(_ref85, _argPlaceholder71, _2);
  }), function update(_argPlaceholder70) {
    return _$update.call(_ref84, _argPlaceholder70, "jack", _$add);
  })(_court2)), {
    jack: 1,
    queen: 12,
    king: 13
  });
  assert.deepEqual((_worth4 = worth, (_ref86 = _, _$updateIn2 = _ref86.updateIn, _param19 = ["court", "king"], _$add3 = (_ref87 = _, _$add4 = _ref87.add, _3 = -10, function add(_argPlaceholder73) {
    return _$add4.call(_ref87, _argPlaceholder73, _3);
  }), function updateIn(_argPlaceholder72) {
    return _$updateIn2.call(_ref86, _argPlaceholder72, _param19, _$add3);
  })(_worth4)), {
    pieces: {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 10,
      king: Infinity
    },
    court: {
      jack: 11,
      queen: 12,
      king: 3
    }
  });
  assert.deepEqual(stooges, ["Larry", "Curly", "Moe"], "no mutations occurred");
  assert.deepEqual(court, {
    jack: 11,
    queen: 12,
    king: 13
  }, "no mutations occurred");
  assert.deepEqual((_surname = {
    surname: "Howard"
  }, (_ref88 = _, _$assoc9 = _ref88.assoc, function assoc(_argPlaceholder74) {
    return _$assoc9.call(_ref88, _argPlaceholder74, "givenName", "Moe");
  })(_surname)), {
    givenName: "Moe",
    surname: "Howard"
  });
  assert.deepEqual((_ref89 = [1, 2, 3], (_ref90 = _, _$assoc10 = _ref90.assoc, function assoc(_argPlaceholder75) {
    return _$assoc10.call(_ref90, _argPlaceholder75, 1, 0);
  })(_ref89)), [1, 0, 3]);
});
QUnit.test("icompare", function (assert) {
  assert.equal(_.eq(1, 1, 1), true);
  assert.equal(_.eq(1, "1", 1.0), false);
  assert.equal(_.lt(1, 2, 3, 4), true);
  assert.equal(_.lt(1, 6, 2, 3), false);
  assert.equal(_.lte(1, 1, 2, 3, 3, 3), true);
  assert.equal(_.notEq(1, 1, 2, 2, 3, 3), true);
  assert.equal(_.notEq(3, 3, 3), false);
});
QUnit.test("iset", function (assert) {
  var _ref91, _ref92, _ref93, _param20, _$union, _ref94, _ref95, _ref96, _ref97, _param21, _$difference, _ref98, _ref99, _param22, _$superset, _ref100, _ref101, _param23, _$superset2, _ref102;

  assert.deepEqual((_ref91 = (_ref92 = (_ref93 = [1, 2, 3], (_ref94 = _, _$union = _ref94.union, _param20 = [2, 3, 4], function union(_argPlaceholder76) {
    return _$union.call(_ref94, _argPlaceholder76, _param20);
  })(_ref93)), _.sort(_ref92)), _.toArray(_ref91)), [1, 2, 3, 4]);
  assert.deepEqual((_ref95 = (_ref96 = (_ref97 = [1, 2, 3, 4, 5], (_ref98 = _, _$difference = _ref98.difference, _param21 = [5, 2, 10], function difference(_argPlaceholder77) {
    return _$difference.call(_ref98, _argPlaceholder77, _param21);
  })(_ref97)), _.sort(_ref96)), _.toArray(_ref95)), [1, 3, 4]);
  assert.ok((_ref99 = [1, 2, 3], (_ref100 = _, _$superset = _ref100.superset, _param22 = [2, 3], function superset(_argPlaceholder78) {
    return _$superset.call(_ref100, _argPlaceholder78, _param22);
  })(_ref99)));
  assert.notOk((_ref101 = [1, 2, 3], (_ref102 = _, _$superset2 = _ref102.superset, _param23 = [2, 4], function superset(_argPlaceholder79) {
    return _$superset2.call(_ref102, _argPlaceholder79, _param23);
  })(_ref101)));
});
QUnit.test("iappendable, iprependable", function (assert) {
  var _ref103, _$append, _ref104, _surname2, _param24, _$conj, _ref105, _ref106, _$append2, _ref107, _ref108, _$prepend, _ref109;

  assert.deepEqual((_ref103 = ["Moe"], (_ref104 = _, _$append = _ref104.append, function append(_argPlaceholder80) {
    return _$append.call(_ref104, _argPlaceholder80, "Howard");
  })(_ref103)), ["Moe", "Howard"]);
  assert.deepEqual((_surname2 = {
    surname: "Howard"
  }, (_ref105 = _, _$conj = _ref105.conj, _param24 = ['givenName', "Moe"], function conj(_argPlaceholder81) {
    return _$conj.call(_ref105, _argPlaceholder81, _param24);
  })(_surname2)), {
    givenName: "Moe",
    surname: "Howard"
  });
  assert.deepEqual((_ref106 = [1, 2], (_ref107 = _, _$append2 = _ref107.append, function append(_argPlaceholder82) {
    return _$append2.call(_ref107, _argPlaceholder82, 3);
  })(_ref106)), [1, 2, 3]);
  assert.deepEqual((_ref108 = [1, 2], (_ref109 = _, _$prepend = _ref109.prepend, function prepend(_argPlaceholder83) {
    return _$prepend.call(_ref109, _argPlaceholder83, 0);
  })(_ref108)), [0, 1, 2]);
});
QUnit.test("sequences", function (assert) {
  var _ref110, _ref111, _ref112, _$take, _ref113, _ref114, _$positives, _$take2, _ref115, _ref116, _ref117, _$repeatedly, _ref118, _stooges12, _param25, _$concat, _ref119, _$range, _stooges13, _ref120, _$isEven, _$some, _ref121, _ref122, _$isEven2, _$notAny, _ref123, _ref124, _$isEven3, _$every, _ref125, _ref126, _ref127, _$dropLast, _ref128, _ref129, _stooges14, _ref130, _ref131, _ref132, _ref133, _pieces2, _param26, _$selectKeys, _ref134, _ref135, _ref136, _$repeat, _$positives2, _$interleave, _ref137, _ref138, _ref139, _param27, _$interleave2, _ref140, _ref141, _$isTrue, _$some2, _ref142, _ref143, _$isFalse, _$some3, _ref144, _ref145, _$isTrue2, _$some4, _ref146, _$range2, _param28, _$detect, _ref147, _$range3, _param29, _$every2, _ref148, _ref149, _ref150, _param30, _$into4, _ref151, _ref152, _$repeat2, _$take3, _ref153, _ref154, _ref155, _ref156, _ref157, _$interpose, _ref158, _ref159, _$repeat3, _$take4, _ref160, _ref161, _ref162, _ref163, _$repeat4, _$take5, _ref164, _$conj2, _ref165, _4, _$conj3, _ref166, _ref167, _$range4, _$take6, _ref168, _$range5, _$range6, _ref169, _ref170, _$range7, _$drop, _ref171, _$take7, _ref172, _ref173, _ref174, _$inc, _$map4, _ref175, _ref176, _$isEven4, _$some5, _ref177, _ref178, _$isEven5, _$detect2, _ref179, _$range8, _param31, _$some6, _ref180, _ace$king$queen, _param32, _$selectKeys2, _ref181, _Polo, _$into5, _ref182, _ref183, _ref184, _param33, _$filter, _ref185, _$into6, _ref186, _Polo2, _ref187, _ref188, _ref189, _$take8, _ref190, _ref191, _ref192, _ref193, _ref194, _ref195, _$range9, _$takeNth, _ref196, _ref197, _ref198, _$constantly, _$take9, _ref199, _ref200, _ref201, _$constantly2, _$take10, _ref202, _ref203, _$range10, _$take11, _ref204, _ref205, _$range11, _param34, _$filter2, _ref206, _ref207, _$range12, _param35, _$remove, _ref208, _ref209, _$range13, _param36, _$takeWhile, _ref210, _ref211, _$range14, _param37, _$dropWhile, _ref212, _ref213, _$range15, _$inc2, _$map5, _ref214, _ref215, _ref216, _$inc3, _$map6, _ref217, _ref218, _ref219, _ref220, _ref221, _param38, _$filter3, _ref222, _$inc4, _$map7, _ref223, _$take12, _ref224, _ref225, _$range16, _$take13, _ref226, _$range17, _ref227, _$repeat5, _$take14, _ref228, _ref229, _ref230, _param39, _param40, _$concat2, _ref231, _ref232, _ref233, _param41, _$keepIndexed, _ref234, _ref235, _ref236, _param42, _$mapIndexed, _ref237;

  assert.deepEqual((_ref110 = (_ref111 = (_ref112 = ["A", "B", "C"], _.cycle(_ref112)), (_ref113 = _, _$take = _ref113.take, function take(_argPlaceholder84) {
    return _$take.call(_ref113, 5, _argPlaceholder84);
  })(_ref111)), _.toArray(_ref110)), ["A", "B", "C", "A", "B"]);
  assert.deepEqual((_ref114 = (_$positives = _.positives, (_ref115 = _, _$take2 = _ref115.take, function take(_argPlaceholder85) {
    return _$take2.call(_ref115, 5, _argPlaceholder85);
  })(_$positives)), _.toArray(_ref114)), [1, 2, 3, 4, 5]);
  assert.deepEqual((_ref116 = (_ref117 = ["A", "B", "C"], _.rest(_ref117)), _.toArray(_ref116)), ["B", "C"]);
  assert.deepEqual((_$repeatedly = _.repeatedly(3, _.constantly(4)), _.toArray(_$repeatedly)), [4, 4, 4]);
  assert.deepEqual((_ref118 = (_stooges12 = stooges, (_ref119 = _, _$concat = _ref119.concat, _param25 = ["Shemp", "Corey"], function concat(_argPlaceholder86) {
    return _$concat.call(_ref119, _argPlaceholder86, _param25);
  })(_stooges12)), _.toArray(_ref118)), ["Larry", "Curly", "Moe", "Shemp", "Corey"]);
  assert.deepEqual((_$range = _.range(4), _.toArray(_$range)), [0, 1, 2, 3]);
  assert.equal((_stooges13 = stooges, _.second(_stooges13)), "Curly");
  assert.equal((_ref120 = [1, 2, 3], (_ref121 = _, _$some = _ref121.some, _$isEven = _.isEven, function some(_argPlaceholder87) {
    return _$some.call(_ref121, _$isEven, _argPlaceholder87);
  })(_ref120)), true);
  assert.equal((_ref122 = [1, 2, 3], (_ref123 = _, _$notAny = _ref123.notAny, _$isEven2 = _.isEven, function notAny(_argPlaceholder88) {
    return _$notAny.call(_ref123, _$isEven2, _argPlaceholder88);
  })(_ref122)), false);
  assert.equal((_ref124 = [2, 4, 6], (_ref125 = _, _$every = _ref125.every, _$isEven3 = _.isEven, function every(_argPlaceholder89) {
    return _$every.call(_ref125, _$isEven3, _argPlaceholder89);
  })(_ref124)), true);
  assert.deepEqual((_ref126 = (_ref127 = [9, 8, 7, 6, 5, 4, 3], (_ref128 = _, _$dropLast = _ref128.dropLast, function dropLast(_argPlaceholder90) {
    return _$dropLast.call(_ref128, 3, _argPlaceholder90);
  })(_ref127)), _.toArray(_ref126)), [9, 8, 7, 6]);
  assert.deepEqual((_ref129 = (_stooges14 = stooges, _.sort(_stooges14)), _.toArray(_ref129)), ["Curly", "Larry", "Moe"]);
  assert.deepEqual((_ref130 = (_ref131 = ["A", "B", ["C", "D"], ["E", ["F", "G"]]], _.flatten(_ref131)), _.toArray(_ref130)), ["A", "B", "C", "D", "E", "F", "G"]);
  assert.deepEqual((_ref132 = (_ref133 = [null, ""], _.flatten(_ref133)), _.toArray(_ref132)), [null, ""]);
  assert.deepEqual((_pieces2 = pieces, (_ref134 = _, _$selectKeys = _ref134.selectKeys, _param26 = ["pawn", "knight"], function selectKeys(_argPlaceholder91) {
    return _$selectKeys.call(_ref134, _argPlaceholder91, _param26);
  })(_pieces2)), {
    pawn: 1,
    knight: 3
  });
  assert.deepEqual((_ref135 = (_ref136 = ["A", "B", "C", "D", "E"], (_ref137 = _, _$interleave = _ref137.interleave, _$repeat = _.repeat("="), _$positives2 = _.positives, function interleave(_argPlaceholder92) {
    return _$interleave.call(_ref137, _argPlaceholder92, _$repeat, _$positives2);
  })(_ref136)), _.toArray(_ref135)), ["A", "=", 1, "B", "=", 2, "C", "=", 3, "D", "=", 4, "E", "=", 5]);
  assert.deepEqual((_ref138 = (_ref139 = [1, 2, 3], (_ref140 = _, _$interleave2 = _ref140.interleave, _param27 = [10, 11, 12], function interleave(_argPlaceholder93) {
    return _$interleave2.call(_ref140, _argPlaceholder93, _param27);
  })(_ref139)), _.toArray(_ref138)), [1, 10, 2, 11, 3, 12]);
  assert.equal((_ref141 = [false, true], (_ref142 = _, _$some2 = _ref142.some, _$isTrue = _.isTrue, function some(_argPlaceholder94) {
    return _$some2.call(_ref142, _$isTrue, _argPlaceholder94);
  })(_ref141)), true);
  assert.equal((_ref143 = [false, true], (_ref144 = _, _$some3 = _ref144.some, _$isFalse = _.isFalse, function some(_argPlaceholder95) {
    return _$some3.call(_ref144, _$isFalse, _argPlaceholder95);
  })(_ref143)), true);
  assert.equal((_ref145 = [false, false], (_ref146 = _, _$some4 = _ref146.some, _$isTrue2 = _.isTrue, function some(_argPlaceholder96) {
    return _$some4.call(_ref146, _$isTrue2, _argPlaceholder96);
  })(_ref145)), null);
  assert.equal((_$range2 = _.range(10), (_ref147 = _, _$detect = _ref147.detect, _param28 = function _param28(x) {
    return x > 5;
  }, function detect(_argPlaceholder97) {
    return _$detect.call(_ref147, _param28, _argPlaceholder97);
  })(_$range2)), 6);
  assert.notOk((_$range3 = _.range(10), (_ref148 = _, _$every2 = _ref148.every, _param29 = function _param29(x) {
    return x > 5;
  }, function every(_argPlaceholder98) {
    return _$every2.call(_ref148, _param29, _argPlaceholder98);
  })(_$range3)));
  assert.deepEqual((_ref149 = [1, 2, 3], _.empty(_ref149)), []);
  assert.deepEqual((_ref150 = null, (_ref151 = _, _$into4 = _ref151.into, _param30 = [], function into(_argPlaceholder99) {
    return _$into4.call(_ref151, _param30, _argPlaceholder99);
  })(_ref150)), []);
  assert.deepEqual((_ref152 = (_$repeat2 = _.repeat(1), (_ref153 = _, _$take3 = _ref153.take, function take(_argPlaceholder100) {
    return _$take3.call(_ref153, 2, _argPlaceholder100);
  })(_$repeat2)), _.toArray(_ref152)), [1, 1]);
  assert.deepEqual((_ref154 = (_ref155 = [1, 2, 3], _.butlast(_ref155)), _.toArray(_ref154)), [1, 2]);
  assert.deepEqual((_ref156 = (_ref157 = ["A", "B", "C"], (_ref158 = _, _$interpose = _ref158.interpose, function interpose(_argPlaceholder101) {
    return _$interpose.call(_ref158, "-", _argPlaceholder101);
  })(_ref157)), _.toArray(_ref156)), ["A", "-", "B", "-", "C"]);
  assert.deepEqual((_ref159 = (_$repeat3 = _.repeat(1), (_ref160 = _, _$take4 = _ref160.take, function take(_argPlaceholder102) {
    return _$take4.call(_ref160, 5, _argPlaceholder102);
  })(_$repeat3)), _.toArray(_ref159)), [1, 1, 1, 1, 1]);
  assert.deepEqual((_ref161 = (_ref162 = (_ref163 = (_$repeat4 = _.repeat(1), (_ref164 = _, _$take5 = _ref164.take, function take(_argPlaceholder103) {
    return _$take5.call(_ref164, 5, _argPlaceholder103);
  })(_$repeat4)), (_ref165 = _, _$conj2 = _ref165.conj, function conj(_argPlaceholder104) {
    return _$conj2.call(_ref165, _argPlaceholder104, 0);
  })(_ref163)), (_ref166 = _, _$conj3 = _ref166.conj, _4 = -1, function conj(_argPlaceholder105) {
    return _$conj3.call(_ref166, _argPlaceholder105, _4);
  })(_ref162)), _.toArray(_ref161)), [-1, 0, 1, 1, 1, 1, 1]);
  assert.deepEqual((_ref167 = (_$range4 = _.range(10), (_ref168 = _, _$take6 = _ref168.take, function take(_argPlaceholder106) {
    return _$take6.call(_ref168, 5, _argPlaceholder106);
  })(_$range4)), _.toArray(_ref167)), [0, 1, 2, 3, 4]);
  assert.deepEqual((_$range5 = _.range(-5, 5), _.toArray(_$range5)), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
  assert.deepEqual((_$range6 = _.range(-20, 100, 10), _.toArray(_$range6)), [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
  assert.deepEqual((_ref169 = (_ref170 = (_$range7 = _.range(10), (_ref171 = _, _$drop = _ref171.drop, function drop(_argPlaceholder107) {
    return _$drop.call(_ref171, 3, _argPlaceholder107);
  })(_$range7)), (_ref172 = _, _$take7 = _ref172.take, function take(_argPlaceholder108) {
    return _$take7.call(_ref172, 3, _argPlaceholder108);
  })(_ref170)), _.toArray(_ref169)), [3, 4, 5]);
  assert.deepEqual((_ref173 = (_ref174 = [1, 2, 3], (_ref175 = _, _$map4 = _ref175.map, _$inc = _.inc, function map(_argPlaceholder109) {
    return _$map4.call(_ref175, _$inc, _argPlaceholder109);
  })(_ref174)), _.toArray(_ref173)), [2, 3, 4]);
  assert.equal((_ref176 = [1, 2, 3, 4], (_ref177 = _, _$some5 = _ref177.some, _$isEven4 = _.isEven, function some(_argPlaceholder110) {
    return _$some5.call(_ref177, _$isEven4, _argPlaceholder110);
  })(_ref176)), true);
  assert.equal((_ref178 = [1, 2, 3, 4], (_ref179 = _, _$detect2 = _ref179.detect, _$isEven5 = _.isEven, function detect(_argPlaceholder111) {
    return _$detect2.call(_ref179, _$isEven5, _argPlaceholder111);
  })(_ref178)), 2);
  assert.equal((_$range8 = _.range(10), (_ref180 = _, _$some6 = _ref180.some, _param31 = function _param31(x) {
    return x > 5;
  }, function some(_argPlaceholder112) {
    return _$some6.call(_ref180, _param31, _argPlaceholder112);
  })(_$range8)), true);
  assert.deepEqual((_ace$king$queen = {
    ace: 1,
    king: 2,
    queen: 3
  }, (_ref181 = _, _$selectKeys2 = _ref181.selectKeys, _param32 = ["ace", "king"], function selectKeys(_argPlaceholder113) {
    return _$selectKeys2.call(_ref181, _argPlaceholder113, _param32);
  })(_ace$king$queen)), {
    ace: 1,
    king: 2
  });
  assert.equal((_Polo = "Polo", (_ref182 = _, _$into5 = _ref182.into, function into(_argPlaceholder114) {
    return _$into5.call(_ref182, "Marco ", _argPlaceholder114);
  })(_Polo)), "Marco Polo");
  assert.deepEqual((_ref183 = (_ref184 = [5, 6, 7, 8, 9], (_ref185 = _, _$filter = _ref185.filter, _param33 = function _param33(x) {
    return x > 6;
  }, function filter(_argPlaceholder115) {
    return _$filter.call(_ref185, _param33, _argPlaceholder115);
  })(_ref184)), (_ref186 = _, _$into6 = _ref186.into, function into(_argPlaceholder116) {
    return _$into6.call(_ref186, "", _argPlaceholder116);
  })(_ref183)), "789");
  assert.deepEqual((_Polo2 = "Polo", _.toArray(_Polo2)), ["P", "o", "l", "o"]);
  assert.deepEqual((_ref187 = (_ref188 = (_ref189 = [1, 2, 3], _.cycle(_ref189)), (_ref190 = _, _$take8 = _ref190.take, function take(_argPlaceholder117) {
    return _$take8.call(_ref190, 7, _argPlaceholder117);
  })(_ref188)), _.toArray(_ref187)), [1, 2, 3, 1, 2, 3, 1]);
  assert.deepEqual((_ref191 = (_ref192 = [1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7], _.dedupe(_ref192)), _.toArray(_ref191)), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual((_ref193 = (_ref194 = [1, 2, 3, 1, 4, 3, 4, 3, 2, 2], imm.distinct(_ref194)), _.toArray(_ref193)), [1, 2, 3, 4]);
  assert.deepEqual((_ref195 = (_$range9 = _.range(10), (_ref196 = _, _$takeNth = _ref196.takeNth, function takeNth(_argPlaceholder118) {
    return _$takeNth.call(_ref196, 2, _argPlaceholder118);
  })(_$range9)), _.toArray(_ref195)), [0, 2, 4, 6, 8]);
  assert.deepEqual((_ref197 = (_ref198 = (_$constantly = _.constantly(1), _.repeatedly(_$constantly)), (_ref199 = _, _$take9 = _ref199.take, function take(_argPlaceholder119) {
    return _$take9.call(_ref199, 0, _argPlaceholder119);
  })(_ref198)), _.toArray(_ref197)), []);
  assert.deepEqual((_ref200 = (_ref201 = (_$constantly2 = _.constantly(2), _.repeatedly(_$constantly2)), (_ref202 = _, _$take10 = _ref202.take, function take(_argPlaceholder120) {
    return _$take10.call(_ref202, 10, _argPlaceholder120);
  })(_ref201)), _.toArray(_ref200)), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  assert.deepEqual((_ref203 = (_$range10 = _.range(10), (_ref204 = _, _$take11 = _ref204.take, function take(_argPlaceholder121) {
    return _$take11.call(_ref204, 5, _argPlaceholder121);
  })(_$range10)), _.toArray(_ref203)), [0, 1, 2, 3, 4]);
  assert.deepEqual((_ref205 = (_$range11 = _.range(10), (_ref206 = _, _$filter2 = _ref206.filter, _param34 = function _param34(x) {
    return x > 5;
  }, function filter(_argPlaceholder122) {
    return _$filter2.call(_ref206, _param34, _argPlaceholder122);
  })(_$range11)), _.toArray(_ref205)), [6, 7, 8, 9]);
  assert.deepEqual((_ref207 = (_$range12 = _.range(10), (_ref208 = _, _$remove = _ref208.remove, _param35 = function _param35(x) {
    return x > 5;
  }, function remove(_argPlaceholder123) {
    return _$remove.call(_ref208, _param35, _argPlaceholder123);
  })(_$range12)), _.toArray(_ref207)), [0, 1, 2, 3, 4, 5]);
  assert.deepEqual((_ref209 = (_$range13 = _.range(10), (_ref210 = _, _$takeWhile = _ref210.takeWhile, _param36 = function _param36(x) {
    return x < 5;
  }, function takeWhile(_argPlaceholder124) {
    return _$takeWhile.call(_ref210, _param36, _argPlaceholder124);
  })(_$range13)), _.toArray(_ref209)), [0, 1, 2, 3, 4]);
  assert.deepEqual((_ref211 = (_$range14 = _.range(10), (_ref212 = _, _$dropWhile = _ref212.dropWhile, _param37 = function _param37(x) {
    return x > 5;
  }, function dropWhile(_argPlaceholder125) {
    return _$dropWhile.call(_ref212, _param37, _argPlaceholder125);
  })(_$range14)), _.toArray(_ref211)), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepEqual((_ref213 = (_$range15 = _.range(1, 5), (_ref214 = _, _$map5 = _ref214.map, _$inc2 = _.inc, function map(_argPlaceholder126) {
    return _$map5.call(_ref214, _$inc2, _argPlaceholder126);
  })(_$range15)), _.toArray(_ref213)), [2, 3, 4, 5]);
  assert.deepEqual((_ref215 = (_ref216 = [10, 11, 12], (_ref217 = _, _$map6 = _ref217.map, _$inc3 = _.inc, function map(_argPlaceholder127) {
    return _$map6.call(_ref217, _$inc3, _argPlaceholder127);
  })(_ref216)), _.toArray(_ref215)), [11, 12, 13]);
  assert.deepEqual((_ref218 = (_ref219 = (_ref220 = (_ref221 = [5, 6, 7, 8, 9], (_ref222 = _, _$filter3 = _ref222.filter, _param38 = function _param38(x) {
    return x > 6;
  }, function filter(_argPlaceholder128) {
    return _$filter3.call(_ref222, _param38, _argPlaceholder128);
  })(_ref221)), (_ref223 = _, _$map7 = _ref223.map, _$inc4 = _.inc, function map(_argPlaceholder129) {
    return _$map7.call(_ref223, _$inc4, _argPlaceholder129);
  })(_ref220)), (_ref224 = _, _$take12 = _ref224.take, function take(_argPlaceholder130) {
    return _$take12.call(_ref224, 2, _argPlaceholder130);
  })(_ref219)), _.toArray(_ref218)), [8, 9]);
  assert.deepEqual((_ref225 = (_$range16 = _.range(7, 15), (_ref226 = _, _$take13 = _ref226.take, function take(_argPlaceholder131) {
    return _$take13.call(_ref226, 10, _argPlaceholder131);
  })(_$range16)), _.toArray(_ref225)), [7, 8, 9, 10, 11, 12, 13, 14]);
  assert.deepEqual((_$range17 = _.range(5), _.toArray(_$range17)), [0, 1, 2, 3, 4]);
  assert.deepEqual((_ref227 = (_$repeat5 = _.repeat("X"), (_ref228 = _, _$take14 = _ref228.take, function take(_argPlaceholder132) {
    return _$take14.call(_ref228, 5, _argPlaceholder132);
  })(_$repeat5)), _.toArray(_ref227)), ["X", "X", "X", "X", "X"]);
  assert.deepEqual((_ref229 = (_ref230 = [1, 2], (_ref231 = _, _$concat2 = _ref231.concat, _param39 = [3, 4], _param40 = [5, 6], function concat(_argPlaceholder133) {
    return _$concat2.call(_ref231, _argPlaceholder133, _param39, _param40);
  })(_ref230)), _.toArray(_ref229)), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual((_ref232 = (_ref233 = ["a", "b", "c", "d", "e"], (_ref234 = _, _$keepIndexed = _ref234.keepIndexed, _param41 = function _param41(idx, value) {
    return _.isOdd(idx) ? value : null;
  }, function keepIndexed(_argPlaceholder134) {
    return _$keepIndexed.call(_ref234, _param41, _argPlaceholder134);
  })(_ref233)), _.toArray(_ref232)), ["b", "d"]);
  assert.deepEqual((_ref235 = (_ref236 = [10, 11, 12], (_ref237 = _, _$mapIndexed = _ref237.mapIndexed, _param42 = function _param42(idx, value) {
    return [idx, _.inc(value)];
  }, function mapIndexed(_argPlaceholder135) {
    return _$mapIndexed.call(_ref237, _param42, _argPlaceholder135);
  })(_ref236)), _.toArray(_ref235)), [[0, 11], [1, 12], [2, 13]]);
  assert.ok(_.everyPred(_.isEven, function (x) {
    return x > 10;
  })(12, 14, 16));
  assert.equal(_.maxKey(function (obj) {
    return obj["king"];
  }, pieces, court), pieces);
});
QUnit.test("add/subtract", function (assert) {
  var _$zeros, _ref238, _$zeros2, _ref239, _$zeros3, _ref240, _christmas, _newYears, _ref241, _christmas2, _$days, _$add5, _ref242, _ref243, _christmas3, _$weeks, _$add6, _ref244, _ref245, _christmas4, _$months, _$add7, _ref246, _ref247, _christmas5, _$years, _$add8, _ref248, _ref249, _christmas6, _$years2, _$subtract, _ref250;

  var christmas = _.date(2017, 11, 25);

  var newYears = _.date(2018, 0, 1);

  var mmddyyyy = _.fmt(_.comp((_ref238 = _, _$zeros = _ref238.zeros, function zeros(_argPlaceholder136) {
    return _$zeros.call(_ref238, _argPlaceholder136, 2);
  }), _.inc, _.month), "/", _.comp((_ref239 = _, _$zeros2 = _ref239.zeros, function zeros(_argPlaceholder137) {
    return _$zeros2.call(_ref239, _argPlaceholder137, 2);
  }), _.day), "/", _.comp((_ref240 = _, _$zeros3 = _ref240.zeros, function zeros(_argPlaceholder138) {
    return _$zeros3.call(_ref240, _argPlaceholder138, 4);
  }), _.year));

  assert.equal((_christmas = christmas, mmddyyyy(_christmas)), "12/25/2017");
  assert.equal((_newYears = newYears, mmddyyyy(_newYears)), "01/01/2018");
  assert.equal((_ref241 = (_christmas2 = christmas, (_ref242 = _, _$add5 = _ref242.add, _$days = _.days(1), function add(_argPlaceholder139) {
    return _$add5.call(_ref242, _argPlaceholder139, _$days);
  })(_christmas2)), _.deref(_ref241)), 1514264400000);
  assert.equal((_ref243 = (_christmas3 = christmas, (_ref244 = _, _$add6 = _ref244.add, _$weeks = _.weeks(1), function add(_argPlaceholder140) {
    return _$add6.call(_ref244, _argPlaceholder140, _$weeks);
  })(_christmas3)), _.deref(_ref243)), 1514782800000);
  assert.equal((_ref245 = (_christmas4 = christmas, (_ref246 = _, _$add7 = _ref246.add, _$months = _.months(1), function add(_argPlaceholder141) {
    return _$add7.call(_ref246, _argPlaceholder141, _$months);
  })(_christmas4)), _.deref(_ref245)), 1516856400000);
  assert.equal((_ref247 = (_christmas5 = christmas, (_ref248 = _, _$add8 = _ref248.add, _$years = _.years(1), function add(_argPlaceholder142) {
    return _$add8.call(_ref248, _argPlaceholder142, _$years);
  })(_christmas5)), _.deref(_ref247)), 1545714000000);
  assert.equal((_ref249 = (_christmas6 = christmas, (_ref250 = _, _$subtract = _ref250.subtract, _$years2 = _.years(1), function subtract(_argPlaceholder143) {
    return _$subtract.call(_ref250, _argPlaceholder143, _$years2);
  })(_christmas6)), _.deref(_ref249)), 1482642000000);
});
QUnit.test("duration", function (assert) {
  var _ref251, _newYearsDay, _$hours, _$divide, _ref252, _$add9, _$add10, _$add11, _$add12;

  var newYearsEve = _.date(2019, 11, 31);

  var newYearsDay = _.period(_.date(2020, 0, 1));

  assert.equal(_.divide(_.years(1), _.days(1)), 365.25);
  assert.equal(_.divide(_.days(1), _.hours(1)), 24);
  assert.equal((_ref251 = (_newYearsDay = newYearsDay, _.toDuration(_newYearsDay)), (_ref252 = _, _$divide = _ref252.divide, _$hours = _.hours(1), function divide(_argPlaceholder144) {
    return _$divide.call(_ref252, _argPlaceholder144, _$hours);
  })(_ref251)), 24);
  assert.equal((_$add9 = _.add(newYearsEve, 1), _.deref(_$add9)), 1577854800000);
  assert.equal((_$add10 = _.add(newYearsEve, _.days(1)), _.deref(_$add10)), 1577854800000);
  assert.equal((_$add11 = _.add(newYearsEve, _.years(-1)), _.deref(_$add11)), 1546232400000); //prior New Year's Eve

  assert.equal((_$add12 = _.add(newYearsEve, _.days(1), _.hours(7)), _.deref(_$add12)), 1577880000000); //7am New Year's Day
});
QUnit.test("record", function (assert) {
  var _ref253, _$robin, _$get24, _ref254, _$assoc11, _ref255, _ref256, _$robin2, _$get25, _ref257, _ref258, _$robin3, _$get26, _ref259, _ref260, _$robin4, _$get27, _ref261, _robin, _$get28, _ref262, _ref263, _robin2, _$assoc12, _ref264, _$get29, _ref265, _sean, _$get30, _ref266;

  function Person(name, surname, dob) {
    this.attrs = {
      name,
      surname,
      dob
    };
  }

  _.record(Person);

  var sean = new Person("Sean", "Penn", _.date(1960, 8, 17));

  var person = _.constructs(Person);

  var robin = person("Robin", "Wright", new Date(1966, 3, 8));

  _.construct(Person, {
    name: "Dylan",
    surname: "Penn",
    dob: _.date(1991, 4, 13)
  });

  var $robin = $.cell(_.journal(robin));
  assert.equal((_ref253 = (_$robin = $robin, _.deref(_$robin)), (_ref254 = _, _$get24 = _ref254.get, function get(_argPlaceholder145) {
    return _$get24.call(_ref254, _argPlaceholder145, "surname");
  })(_ref253)), "Wright");

  _.swap($robin, (_ref255 = _, _$assoc11 = _ref255.assoc, function assoc(_argPlaceholder146) {
    return _$assoc11.call(_ref255, _argPlaceholder146, "surname", "Penn");
  }));

  assert.equal((_ref256 = (_$robin2 = $robin, _.deref(_$robin2)), (_ref257 = _, _$get25 = _ref257.get, function get(_argPlaceholder147) {
    return _$get25.call(_ref257, _argPlaceholder147, "surname");
  })(_ref256)), "Penn");

  _.swap($robin, _.undo);

  assert.equal((_ref258 = (_$robin3 = $robin, _.deref(_$robin3)), (_ref259 = _, _$get26 = _ref259.get, function get(_argPlaceholder148) {
    return _$get26.call(_ref259, _argPlaceholder148, "surname");
  })(_ref258)), "Wright");

  _.swap($robin, _.redo);

  assert.equal((_ref260 = (_$robin4 = $robin, _.deref(_$robin4)), (_ref261 = _, _$get27 = _ref261.get, function get(_argPlaceholder149) {
    return _$get27.call(_ref261, _argPlaceholder149, "surname");
  })(_ref260)), "Penn");
  assert.equal((_robin = robin, (_ref262 = _, _$get28 = _ref262.get, function get(_argPlaceholder150) {
    return _$get28.call(_ref262, _argPlaceholder150, "surname");
  })(_robin)), "Wright");
  assert.equal((_ref263 = (_robin2 = robin, (_ref264 = _, _$assoc12 = _ref264.assoc, function assoc(_argPlaceholder151) {
    return _$assoc12.call(_ref264, _argPlaceholder151, "surname", "Penn");
  })(_robin2)), (_ref265 = _, _$get29 = _ref265.get, function get(_argPlaceholder152) {
    return _$get29.call(_ref265, _argPlaceholder152, "surname");
  })(_ref263)), "Penn");
  assert.equal((_sean = sean, (_ref266 = _, _$get30 = _ref266.get, function get(_argPlaceholder153) {
    return _$get30.call(_ref266, _argPlaceholder153, "surname");
  })(_sean)), "Penn");
  assert.equal(_.count(robin), 3);
});
QUnit.test("observable sharing", function (assert) {
  function exec(oo, nn, desc) {
    var o = {
      ex: oo,
      result: $.cell([])
    },
        n = {
      ex: nn,
      result: $.cell([])
    };
    $.sub(o.ex, $.collect(o.result));
    $.sub(n.ex, $.collect(n.result));
    assert.deepEqual(_.deref(o.result), _.deref(n.result), desc);
    return {
      old: o,
      new: n
    };
  }

  var $double = $.cell(2);
  var $name = $.cell("Larry");

  var fn = _.pipe(_.repeat(_, _), _.toArray);

  exec($.map(fn, $double, $name), $.Observable.map(fn, $double, $name), "$.map v. $.calc with cells");
  var $triple = $.toObservable(_.range(3));
  $.cell(0);
  var $ten = $.Observable.fixed(10);
  exec($.map(_.add, $triple, $ten), $.Observable.map(_.add, $triple, $ten), "$.fixed");
  $ten = $.fixed(10);
  exec($.map(_.add, $triple, $ten), $.Observable.map(_.add, $triple, $ten), "$.map");
  var $a = $.cell(0),
      $ac = $.cell([]),
      $ao = $.cell([]);
  $.sub($a, $.collect($ac));
  $.connect($triple, $a);
  $.sub($triple, $.collect($ao));
  assert.deepEqual(_.deref($ac), _.deref($ao));
  var $b = $.cell(0),
      $bc = $.cell([]),
      $bs = $.cell([]);
  $.sub($b, $.collect($bc));
  $.connect($triple, $b);
  $.sub($triple, $.collect($bs));
  assert.deepEqual(_.deref($bc), _.deref($bs));
  var $ca = $.subject(),
      $cc = $.cell([]),
      $cs = $.cell([]),
      $cf = $.cell([]);
  var bump = t.map(_.inc);
  $.sub($.pipe($triple, bump), $.collect($cc));
  $.sub($triple, bump, $.collect($cs));
  $.sub($ca, $.collect($cf));
  $.connect($triple, bump, $ca);
  assert.ok(_.eq(_.deref($cs), _.deref($cf)), "$.sub v. $.connect");
  assert.ok(_.eq(_.deref($cs), _.deref($cc)), "$.sub v. $.pipe");
});
QUnit.test("cell", function (assert) {
  var _clicks, _dest, _$$pub, _$, _clicks2, _source, _dest2, _msinkc, _$get31, _ref267, _$lt2, _ref268, _bucket, _param43, _$$sub, _$2, _bucket2, _$conj6, _$swap2, _ref271, _$conj7, _ref272, _bucket3, _$conj8, _$swap3, _ref273, _$conj9, _ref274, _bucket5, _$assoc13, _$swap5, _ref277, _$assoc14, _ref278, _bucket6, _states2;

  var button = dom.tag('button');
  var tally = button("Tally");
  var clicks = $.cell(0);
  tally.click();
  assert.equal((_clicks = clicks, _.deref(_clicks)), 0);
  var tallied = dom.click(tally);
  var unsub = $.sub(tallied, function () {
    _.swap(clicks, _.inc);
  });
  $.sub(tallied, _.noop);
  tally.click();
  unsub();
  tally.click();
  var source = $.cell(0);
  var dest = $.cell();
  var sink = $.pipe(source, t.map(_.inc), t.tee((_$ = $, _$$pub = _$.pub, _dest = dest, function pub(_argPlaceholder154) {
    return _$$pub.call(_$, _dest, _argPlaceholder154);
  })));
  $.connect(sink, $.subject());

  var msink = _.fmap(source, _.inc);

  var msinkc = $.cell();
  $.sub(msink, msinkc);

  _.swap(source, _.inc);

  assert.equal((_clicks2 = clicks, _.deref(_clicks2)), 1);
  assert.equal((_source = source, _.deref(_source)), 1);
  assert.equal((_dest2 = dest, _.deref(_dest2)), 2);
  assert.equal((_msinkc = msinkc, _.deref(_msinkc)), 2);
  var bucket = $.cell([], $.subject(), _.pipe((_ref267 = _, _$get31 = _ref267.get, function get(_argPlaceholder155) {
    return _$get31.call(_ref267, _argPlaceholder155, 'length');
  }), (_ref268 = _, _$lt2 = _ref268.lt, function lt(_argPlaceholder156) {
    return _$lt2.call(_ref268, _argPlaceholder156, 3);
  }))),
      states = $.cell([]);
  _bucket = bucket, (_$2 = $, _$$sub = _$2.sub, _param43 = function _param43(state) {
    var _states, _$conj4, _$swap, _ref269, _state, _$conj5, _ref270;

    return _states = states, (_ref269 = _, _$swap = _ref269.swap, _$conj4 = (_ref270 = _, _$conj5 = _ref270.conj, _state = state, function conj(_argPlaceholder159) {
      return _$conj5.call(_ref270, _argPlaceholder159, _state);
    }), function swap(_argPlaceholder158) {
      return _$swap.call(_ref269, _argPlaceholder158, _$conj4);
    })(_states);
  }, function sub(_argPlaceholder157) {
    return _$$sub.call(_$2, _argPlaceholder157, _param43);
  })(_bucket);
  _bucket2 = bucket, (_ref271 = _, _$swap2 = _ref271.swap, _$conj6 = (_ref272 = _, _$conj7 = _ref272.conj, function conj(_argPlaceholder161) {
    return _$conj7.call(_ref272, _argPlaceholder161, "ice");
  }), function swap(_argPlaceholder160) {
    return _$swap2.call(_ref271, _argPlaceholder160, _$conj6);
  })(_bucket2);
  _bucket3 = bucket, (_ref273 = _, _$swap3 = _ref273.swap, _$conj8 = (_ref274 = _, _$conj9 = _ref274.conj, function conj(_argPlaceholder163) {
    return _$conj9.call(_ref274, _argPlaceholder163, "champagne");
  }), function swap(_argPlaceholder162) {
    return _$swap3.call(_ref273, _argPlaceholder162, _$conj8);
  })(_bucket3);
  assert.throws(function () {
    var _bucket4, _$conj10, _$swap4, _ref275, _$conj11, _ref276;

    _bucket4 = bucket, (_ref275 = _, _$swap4 = _ref275.swap, _$conj10 = (_ref276 = _, _$conj11 = _ref276.conj, function conj(_argPlaceholder165) {
      return _$conj11.call(_ref276, _argPlaceholder165, "soda");
    }), function swap(_argPlaceholder164) {
      return _$swap4.call(_ref275, _argPlaceholder164, _$conj10);
    })(_bucket4);
  });
  _bucket5 = bucket, (_ref277 = _, _$swap5 = _ref277.swap, _$assoc13 = (_ref278 = _, _$assoc14 = _ref278.assoc, function assoc(_argPlaceholder167) {
    return _$assoc14.call(_ref278, _argPlaceholder167, 1, "wine");
  }), function swap(_argPlaceholder166) {
    return _$swap5.call(_ref277, _argPlaceholder166, _$assoc13);
  })(_bucket5);
  assert.deepEqual((_bucket6 = bucket, _.deref(_bucket6)), ["ice", "wine"]);
  assert.deepEqual((_states2 = states, _.deref(_states2)), [[], ["ice"], ["ice", "champagne"], ["ice", "wine"]]);
});
QUnit.test("immutable updates", function (assert) {
  var _$nth, _ref279, _$nth2, _ref280, _$nth3, _ref281, _param44, _$conj12, _ref282, _param45, _$assocIn4, _ref283, _param46, _$assocIn5, _ref284, _duos, _param47, _$$sub2, _$3, _duos2, _txn, _$swap7, _ref287, _ref288, _states4, _duos3, _d, _get, _$isIdentical, _ref289, _d2, _get2, _$isIdentical2, _ref290, _d3, _get3, _$isIdentical3, _ref291;

  var duos = $.cell([["Hall", "Oates"], ["Laurel", "Hardy"]]),
      get0 = _.pipe(_.deref, (_ref279 = _, _$nth = _ref279.nth, function nth(_argPlaceholder168) {
    return _$nth.call(_ref279, _argPlaceholder168, 0);
  })),
      get1 = _.pipe(_.deref, (_ref280 = _, _$nth2 = _ref280.nth, function nth(_argPlaceholder169) {
    return _$nth2.call(_ref280, _argPlaceholder169, 1);
  })),
      get2 = _.pipe(_.deref, (_ref281 = _, _$nth3 = _ref281.nth, function nth(_argPlaceholder170) {
    return _$nth3.call(_ref281, _argPlaceholder170, 2);
  })),
      d0 = get0(duos),
      d1 = get1(duos),
      d2 = get2(duos),
      states = $.cell([]),
      txn = _.pipe((_ref282 = _, _$conj12 = _ref282.conj, _param44 = ["Andrew Ridgeley", "George Michaels"], function conj(_argPlaceholder171) {
    return _$conj12.call(_ref282, _argPlaceholder171, _param44);
  }), (_ref283 = _, _$assocIn4 = _ref283.assocIn, _param45 = [0, 0], function assocIn(_argPlaceholder172) {
    return _$assocIn4.call(_ref283, _argPlaceholder172, _param45, "Daryl");
  }), (_ref284 = _, _$assocIn5 = _ref284.assocIn, _param46 = [0, 1], function assocIn(_argPlaceholder173) {
    return _$assocIn5.call(_ref284, _argPlaceholder173, _param46, "John");
  }));

  _duos = duos, (_$3 = $, _$$sub2 = _$3.sub, _param47 = function _param47(state) {
    var _states3, _$conj13, _$swap6, _ref285, _state2, _$conj14, _ref286;

    return _states3 = states, (_ref285 = _, _$swap6 = _ref285.swap, _$conj13 = (_ref286 = _, _$conj14 = _ref286.conj, _state2 = state, function conj(_argPlaceholder176) {
      return _$conj14.call(_ref286, _argPlaceholder176, _state2);
    }), function swap(_argPlaceholder175) {
      return _$swap6.call(_ref285, _argPlaceholder175, _$conj13);
    })(_states3);
  }, function sub(_argPlaceholder174) {
    return _$$sub2.call(_$3, _argPlaceholder174, _param47);
  })(_duos);
  _duos2 = duos, (_ref287 = _, _$swap7 = _ref287.swap, _txn = txn, function swap(_argPlaceholder177) {
    return _$swap7.call(_ref287, _argPlaceholder177, _txn);
  })(_duos2);
  assert.equal((_ref288 = (_states4 = states, _.deref(_states4)), _.count(_ref288)), 2, "original + transaction");
  assert.deepEqual((_duos3 = duos, _.deref(_duos3)), [["Daryl", "John"], ["Laurel", "Hardy"], ["Andrew Ridgeley", "George Michaels"]]);
  assert.notOk((_d = d0, (_ref289 = _, _$isIdentical = _ref289.isIdentical, _get = get0(duos), function isIdentical(_argPlaceholder178) {
    return _$isIdentical.call(_ref289, _argPlaceholder178, _get);
  })(_d)), "new container for");
  assert.ok((_d2 = d1, (_ref290 = _, _$isIdentical2 = _ref290.isIdentical, _get2 = get1(duos), function isIdentical(_argPlaceholder179) {
    return _$isIdentical2.call(_ref290, _argPlaceholder179, _get2);
  })(_d2)), "original container untouched");
  assert.notOk((_d3 = d2, (_ref291 = _, _$isIdentical3 = _ref291.isIdentical, _get3 = get2(duos), function isIdentical(_argPlaceholder180) {
    return _$isIdentical3.call(_ref291, _argPlaceholder180, _get3);
  })(_d3)), "created from nothing");
  assert.notOk(d2, "non-existent");
});
QUnit.test("list", function (assert) {
  var _$list, _$list2, _$list3;

  assert.deepEqual((_$list = _.list(), _.toArray(_$list)), []);
  assert.deepEqual((_$list2 = _.list(0), _.toArray(_$list2)), [0]);
  assert.deepEqual((_$list3 = _.list(0, 1, 2), _.toArray(_$list3)), [0, 1, 2]);
});
QUnit.test("strings", function (assert) {
  var _ILikePeanutbutter, _$split, _ref292, _q1w2e3r4t5y6u7i8o9p, _param48, _$split2, _ref293, _q1w2e3r4t5y6u7i8o9p2, _param49, _$split3, _ref294, _reading, _$subs, _ref295, _reading2, _$subs2, _ref296, _ref297, _$join, _ref298, _ref299, _$join2, _ref300, _ref301, _$join3, _ref302, _ref303, _$join4, _ref304;

  assert.deepEqual((_ILikePeanutbutter = "I like peanutbutter", (_ref292 = _, _$split = _ref292.split, function split(_argPlaceholder181) {
    return _$split.call(_ref292, _argPlaceholder181, " ");
  })(_ILikePeanutbutter)), ["I", "like", "peanutbutter"]);
  assert.deepEqual((_q1w2e3r4t5y6u7i8o9p = "q1w2e3r4t5y6u7i8o9p", (_ref293 = _, _$split2 = _ref293.split, _param48 = /\d/, function split(_argPlaceholder182) {
    return _$split2.call(_ref293, _argPlaceholder182, _param48);
  })(_q1w2e3r4t5y6u7i8o9p)), ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
  assert.deepEqual((_q1w2e3r4t5y6u7i8o9p2 = "q1w2e3r4t5y6u7i8o9p", (_ref294 = _, _$split3 = _ref294.split, _param49 = /\d/, function split(_argPlaceholder183) {
    return _$split3.call(_ref294, _argPlaceholder183, _param49, 4);
  })(_q1w2e3r4t5y6u7i8o9p2)), ["q", "w", "e", "r4t5y6u7i8o9p"]);
  assert.equal((_reading = "reading", (_ref295 = _, _$subs = _ref295.subs, function subs(_argPlaceholder184) {
    return _$subs.call(_ref295, _argPlaceholder184, 3);
  })(_reading)), "ding");
  assert.equal((_reading2 = "reading", (_ref296 = _, _$subs2 = _ref296.subs, function subs(_argPlaceholder185) {
    return _$subs2.call(_ref296, _argPlaceholder185, 0, 4);
  })(_reading2)), "read");
  assert.equal((_ref297 = ["spam", null, "eggs", "", "spam"], (_ref298 = _, _$join = _ref298.join, function join(_argPlaceholder186) {
    return _$join.call(_ref298, ", ", _argPlaceholder186);
  })(_ref297)), "spam, , eggs, , spam");
  assert.equal((_ref299 = [1, 2, 3], (_ref300 = _, _$join2 = _ref300.join, function join(_argPlaceholder187) {
    return _$join2.call(_ref300, ", ", _argPlaceholder187);
  })(_ref299)), "1, 2, 3");
  assert.equal((_ref301 = ["ace", "king", "queen"], (_ref302 = _, _$join3 = _ref302.join, function join(_argPlaceholder188) {
    return _$join3.call(_ref302, "-", _argPlaceholder188);
  })(_ref301)), "ace-king-queen");
  assert.equal((_ref303 = ["hello", " ", "world"], (_ref304 = _, _$join4 = _ref304.join, function join(_argPlaceholder189) {
    return _$join4.call(_ref304, "", _argPlaceholder189);
  })(_ref303)), "hello world");
});
QUnit.test("min/max", function (assert) {
  assert.equal(_.min(-9, 9, 0), -9);
  assert.equal(_.max(-9, 9, 0), 9);
});
QUnit.test("indexed-seq", function (assert) {
  var _letters, _letters2, _$nth4, _ref305, _nums, _nums2, _$nth5, _ref306, _nums3, _nums4, _$IReducible, _$satisfies, _ref307, _nums5, _$add13, _$reduce, _ref308;

  var nums = _.indexedSeq([11, 12, 13, 14], 1);

  var letters = _.indexedSeq(_.split("grace", ""));

  assert.equal((_letters = letters, _.first(_letters)), "g");
  assert.equal((_letters2 = letters, (_ref305 = _, _$nth4 = _ref305.nth, function nth(_argPlaceholder190) {
    return _$nth4.call(_ref305, _argPlaceholder190, 2);
  })(_letters2)), "a");
  assert.equal((_nums = nums, _.first(_nums)), 12);
  assert.equal((_nums2 = nums, (_ref306 = _, _$nth5 = _ref306.nth, function nth(_argPlaceholder191) {
    return _$nth5.call(_ref306, _argPlaceholder191, 1);
  })(_nums2)), 13);
  assert.equal((_nums3 = nums, _.count(_nums3)), 3);
  assert.ok((_nums4 = nums, (_ref307 = _, _$satisfies = _ref307.satisfies, _$IReducible = _.IReducible, function satisfies(_argPlaceholder192) {
    return _$satisfies.call(_ref307, _$IReducible, _argPlaceholder192);
  })(_nums4)));
  assert.equal((_nums5 = nums, (_ref308 = _, _$reduce = _ref308.reduce, _$add13 = _.add, function reduce(_argPlaceholder193) {
    return _$reduce.call(_ref308, _$add13, 0, _argPlaceholder193);
  })(_nums5)), 39);
});
QUnit.test("equality", function (assert) {
  var _Curly, _$eq, _ref309, _Curlers, _$eq2, _ref310, _Curlers2, _$notEq, _ref311, _5, _$eq3, _ref312, _ref313, _param50, _$eq4, _ref314, _ref315, _param51, _$eq5, _ref316, _ref317, _param52, _$eq6, _ref318, _fname$lname, _fname$lname2, _$eq7, _ref319, _fname$middle$lname, _fname$lname3, _$eq8, _ref320;

  assert.ok((_Curly = "Curly", (_ref309 = _, _$eq = _ref309.eq, function eq(_argPlaceholder194) {
    return _$eq.call(_ref309, _argPlaceholder194, "Curly");
  })(_Curly)), "Equal strings");
  assert.notOk((_Curlers = "Curlers", (_ref310 = _, _$eq2 = _ref310.eq, function eq(_argPlaceholder195) {
    return _$eq2.call(_ref310, _argPlaceholder195, "Curly");
  })(_Curlers)), "Unequal strings");
  assert.ok((_Curlers2 = "Curlers", (_ref311 = _, _$notEq = _ref311.notEq, function notEq(_argPlaceholder196) {
    return _$notEq.call(_ref311, _argPlaceholder196, "Curly");
  })(_Curlers2)), "Unequal strings");

  var rng = _.range(3);

  assert.ok(_.eq(rng, rng, _.range(3), rng, [0, 1, 2], rng, _.cons(0, _.range(1, 3)), _.initial(_.range(4))), "Communicative sequences");
  assert.ok((_5 = 45, (_ref312 = _, _$eq3 = _ref312.eq, function eq(_argPlaceholder197) {
    return _$eq3.call(_ref312, _argPlaceholder197, 45);
  })(_5)), "Equal numbers");
  assert.ok((_ref313 = [1, 2, 3], (_ref314 = _, _$eq4 = _ref314.eq, _param50 = [1, 2, 3], function eq(_argPlaceholder198) {
    return _$eq4.call(_ref314, _argPlaceholder198, _param50);
  })(_ref313)), "Equal arrays");
  assert.notOk((_ref315 = [1, 2, 3], (_ref316 = _, _$eq5 = _ref316.eq, _param51 = [2, 3], function eq(_argPlaceholder199) {
    return _$eq5.call(_ref316, _argPlaceholder199, _param51);
  })(_ref315)), "Unequal arrays");
  assert.notOk((_ref317 = [1, 2, 3], (_ref318 = _, _$eq6 = _ref318.eq, _param52 = [3, 2, 1], function eq(_argPlaceholder200) {
    return _$eq6.call(_ref318, _argPlaceholder200, _param52);
  })(_ref317)), "Unequal arrays");
  assert.ok((_fname$lname = {
    fname: "Moe",
    lname: "Howard"
  }, (_ref319 = _, _$eq7 = _ref319.eq, _fname$lname2 = {
    fname: "Moe",
    lname: "Howard"
  }, function eq(_argPlaceholder201) {
    return _$eq7.call(_ref319, _argPlaceholder201, _fname$lname2);
  })(_fname$lname)), "Equal objects");
  assert.notOk((_fname$middle$lname = {
    fname: "Moe",
    middle: "Harry",
    lname: "Howard"
  }, (_ref320 = _, _$eq8 = _ref320.eq, _fname$lname3 = {
    fname: "Moe",
    lname: "Howard"
  }, function eq(_argPlaceholder202) {
    return _$eq8.call(_ref320, _argPlaceholder202, _fname$lname3);
  })(_fname$middle$lname)), "Unequal objects");
});
QUnit.test("coersion", function (assert) {
  var _ref321, _Moe$Curly;

  assert.deepEqual((_ref321 = [["Moe", "Howard"], ["Curly", "Howard"]], _.toObject(_ref321)), {
    Moe: "Howard",
    Curly: "Howard"
  });
  assert.deepEqual((_Moe$Curly = {
    Moe: "Howard",
    Curly: "Howard"
  }, _.toArray(_Moe$Curly)), [["Moe", "Howard"], ["Curly", "Howard"]]);
});
QUnit.test("predicates", function (assert) {
  var _cinco, _$includes3, _ref322, _cinco2, _$includes4, _ref323, _ace$king$queen2, _ace$king, _$subsumes, _ref324;

  //two means of running multiple tests against different arguments
  var cinco = _.range(5),
      any = _.someFn((_ref322 = _, _$includes3 = _ref322.includes, _cinco = cinco, function includes(_argPlaceholder203) {
    return _$includes3.call(_ref322, _cinco, _argPlaceholder203);
  })),
      //or
  all = _.everyPred((_ref323 = _, _$includes4 = _ref323.includes, _cinco2 = cinco, function includes(_argPlaceholder204) {
    return _$includes4.call(_ref323, _cinco2, _argPlaceholder204);
  })); //and


  assert.ok((_ace$king$queen2 = {
    ace: 1,
    king: 2,
    queen: 3
  }, (_ref324 = _, _$subsumes = _ref324.subsumes, _ace$king = {
    ace: 1,
    king: 2
  }, function subsumes(_argPlaceholder205) {
    return _$subsumes.call(_ref324, _argPlaceholder205, _ace$king);
  })(_ace$king$queen2)));
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
