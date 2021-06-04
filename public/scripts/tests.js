define(['atomic/core', 'atomic/immutables', 'atomic/dom', 'atomic/reactives', 'atomic/validates', 'atomic/transducers', 'atomic/transients', 'qunit'], function (_, I, dom, $, vd, t, mut, QUnit) { 'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

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
  QUnit.test("router & multimethod", function (assert) {
    var _$$handler, _mut$conj, _mut, _$str, _ref, _$$handler2, _mut$conj2, _mut2, _$mult, _ref2, _mut$method, _mut$conj3, _mut3, _$str2, _ref3, _mut$method2, _mut$conj4, _mut4, _$mult2, _ref4;

    //not just for fns!
    var f = _.doto($.router(), ( //router handlers need not be (but can be) fns
    _mut = mut, _mut$conj = _mut.conj, _$$handler = $.handler(_.signature(_.isString), (_ref = _, _$str = _ref.str, function str(_argPlaceholder2) {
      return _$str.call(_ref, _argPlaceholder2, "!");
    }), _.apply), function conj(_argPlaceholder) {
      return _mut$conj.call(_mut, _argPlaceholder, _$$handler);
    }), ( //use apply to spread the message against the pred and callback
    _mut2 = mut, _mut$conj2 = _mut2.conj, _$$handler2 = $.handler(_.signature(_.isNumber), (_ref2 = _, _$mult = _ref2.mult, function mult(_argPlaceholder4) {
      return _$mult.call(_ref2, _argPlaceholder4, 2);
    }), _.apply), function conj(_argPlaceholder3) {
      return _mut$conj2.call(_mut2, _argPlaceholder3, _$$handler2);
    }));

    var g = _.doto(mut.multimethod(), ( //multimethod handlers must be fns
    _mut3 = mut, _mut$conj3 = _mut3.conj, _mut$method = mut.method(_.signature(_.isString), (_ref3 = _, _$str2 = _ref3.str, function str(_argPlaceholder6) {
      return _$str2.call(_ref3, _argPlaceholder6, "!");
    })), function conj(_argPlaceholder5) {
      return _mut$conj3.call(_mut3, _argPlaceholder5, _mut$method);
    }), ( //as a multimethod always dispatches to fns, apply is a given and need not be specified.
    _mut4 = mut, _mut$conj4 = _mut4.conj, _mut$method2 = mut.method(_.signature(_.isNumber), (_ref4 = _, _$mult2 = _ref4.mult, function mult(_argPlaceholder8) {
      return _$mult2.call(_ref4, _argPlaceholder8, 2);
    })), function conj(_argPlaceholder7) {
      return _mut$conj4.call(_mut4, _argPlaceholder7, _mut$method2);
    }));

    assert.equal($.dispatch(f, [1]), 2);
    assert.equal($.dispatch(f, ["timber"]), "timber!");
    assert.equal($.dispatch(g, [1]), 2);
    assert.equal($.dispatch(g, ["timber"]), "timber!");
    assert.equal(g(1), 2);
    assert.equal(g("timber"), "timber!");
  });
  QUnit.test("validation", function (assert) {
    var _Date, _$lt, _ref5;

    var zipCode = /^\d{5}(-\d{1,4})?$/;
    var birth = "7/10/1926";
    var past = vd.or(Date, vd.anno({
      type: "past"
    }, (_ref5 = _, _$lt = _ref5.lt, _Date = new Date(), function lt(_argPlaceholder9) {
      return _$lt.call(_ref5, _argPlaceholder9, _Date);
    })));
    var herman = {
      name: ["Herman", "Munster"],
      status: "married",
      dob: new Date(birth)
    };
    var person = vd.and(vd.required('name', vd.and(vd.collOf(String), vd.card(2, 2))), vd.optional('status', vd.and(String, vd.choice(["single", "married", "divorced"]))), vd.optional('dob', past));

    var _vd$check = vd.check(person, _.assoc(herman, "dob", birth)),
        _vd$check2 = _slicedToArray(_vd$check, 1),
        dob = _vd$check2[0];

    var _vd$check3 = vd.check(person, _.assoc(herman, "name", [1])),
        _vd$check4 = _slicedToArray(_vd$check3, 2),
        name = _vd$check4[0],
        names = _vd$check4[1];

    var _vd$check5 = vd.check(person, _.dissoc(herman, "name")),
        _vd$check6 = _slicedToArray(_vd$check5, 1),
        anon = _vd$check6[0];

    var _vd$check7 = vd.check(person, _.assoc(herman, "status", "separated")),
        _vd$check8 = _slicedToArray(_vd$check7, 1),
        status = _vd$check8[0];

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
    assert.ok(anon.constraint instanceof vd.Required);
    assert.ok(status != null); //TODO add `when` to validate conditiontionally or allow condition to be checked before registering the validation?
  });
  QUnit.test("component", function (assert) {
    var _type$args, _$$dispatch, _$, _type$args2, _$$dispatch2, _$2, _type$args3, _$$dispatch3, _$3;

    var people = _.doto($.component($.cell([]), function (accepts, raises, affects) {
      return [{
        "add": accepts("added")
      }, {
        "added": affects(_.conj)
      }];
    }), (_$ = $, _$$dispatch = _$.dispatch, _type$args = {
      type: "add",
      args: [{
        name: "Moe"
      }]
    }, function dispatch(_argPlaceholder10) {
      return _$$dispatch.call(_$, _argPlaceholder10, _type$args);
    }), (_$2 = $, _$$dispatch2 = _$2.dispatch, _type$args2 = {
      type: "add",
      args: [{
        name: "Curly"
      }]
    }, function dispatch(_argPlaceholder11) {
      return _$$dispatch2.call(_$2, _argPlaceholder11, _type$args2);
    }), (_$3 = $, _$$dispatch3 = _$3.dispatch, _type$args3 = {
      type: "add",
      args: [{
        name: "Shemp"
      }]
    }, function dispatch(_argPlaceholder12) {
      return _$$dispatch3.call(_$3, _argPlaceholder12, _type$args3);
    }));

    assert.equal(_.count(_.deref(people)), 3);
  });
  QUnit.test("dom", function (assert) {
    var _div, _dom$append, _dom, _dom$element, _dom$append2, _dom2, _$get, _ref6, _$get2, _ref7, _param, _$map, _ref8, _ref11, _stooges, _dom$sel, _dom3, _ref12, _ref13, _duo, _ref14, _ref15, _duo2, _ref16, _stooges2, _moe, _ref17, _ref18, _stooges3, _dom$sel2, _dom4, _$get3, _$map2, _ref19, _$get4, _ref20, _ref21, _givenName$surname, _mut$conj5, _mut5, _dom$attr, _dom5, _$get5, _ref22, _stooges4, _div2, _dom$append3, _dom6, _ref23, _ref24, _stooges5, _dom$sel3, _dom7, _ref25, _ref26, _stooges6, _dom$sel4, _dom8, _dom$text, _$map3, _ref27, _ref28, _stooges7, _dom$sel5, _dom9, _ref29, _greeting, _ref30, _greeting2, _$get6, _ref31, _ref32, _greeting3, _ref33, _stooges8, _dom$sel6, _dom10, _ref34, _branding;

    var _$mapa = _.mapa(_.comp(_.expands, dom.tag), ["ul", "li", "div", "span"]),
        _$mapa2 = _slicedToArray(_$mapa, 4),
        ul = _$mapa2[0],
        li = _$mapa2[1],
        div = _$mapa2[2],
        span = _$mapa2[3];

    var duo = _.doto(dom.fragment(), (_dom = dom, _dom$append = _dom.append, _div = div("Abbott"), function append(_argPlaceholder13) {
      return _dom$append.call(_dom, _argPlaceholder13, _div);
    }), (_dom2 = dom, _dom$append2 = _dom2.append, _dom$element = dom.element("div", "Costello"), function append(_argPlaceholder14) {
      return _dom$append2.call(_dom2, _argPlaceholder14, _dom$element);
    }));

    var who = div((_ref6 = _, _$get = _ref6.get, function get(_argPlaceholder15) {
      return _$get.call(_ref6, _argPlaceholder15, "givenName");
    }), " ", (_ref7 = _, _$get2 = _ref7.get, function get(_argPlaceholder16) {
      return _$get2.call(_ref7, _argPlaceholder16, "surname");
    }));
    var template = ul((_ref8 = _, _$map = _ref8.map, _param = function _param(_ref9) {
      var _ref10 = _slicedToArray(_ref9, 2),
          id = _ref10[0],
          person = _ref10[1];

      return li({
        id: id
      }, who(person));
    }, function map(_argPlaceholder17) {
      return _$map.call(_ref8, _param, _argPlaceholder17);
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
    var moe = (_ref11 = (_stooges = stooges, (_dom3 = dom, _dom$sel = _dom3.sel, function sel(_argPlaceholder18) {
      return _dom$sel.call(_dom3, "li", _argPlaceholder18);
    })(_stooges)), _.first(_ref11));
    assert.equal((_ref12 = (_ref13 = (_duo = duo, _.children(_duo)), _.first(_ref13)), dom.text(_ref12)), "Abbott");
    assert.equal((_ref14 = (_ref15 = (_duo2 = duo, _.children(_duo2)), _.second(_ref15)), dom.text(_ref14)), "Costello");
    assert.equal((_ref16 = (_stooges2 = stooges, _.leaves(_stooges2)), _.count(_ref16)), 3);
    assert.equal((_moe = moe, dom.text(_moe)), "Moe Howard", "Found by tag");
    assert.deepEqual((_ref17 = (_ref18 = (_stooges3 = stooges, (_dom4 = dom, _dom$sel2 = _dom4.sel, function sel(_argPlaceholder19) {
      return _dom$sel2.call(_dom4, "li", _argPlaceholder19);
    })(_stooges3)), (_ref19 = _, _$map2 = _ref19.map, _$get3 = (_ref20 = _, _$get4 = _ref20.get, function get(_argPlaceholder21) {
      return _$get4.call(_ref20, _argPlaceholder21, "id");
    }), function map(_argPlaceholder20) {
      return _$map2.call(_ref19, _$get3, _argPlaceholder20);
    })(_ref18)), _.toArray(_ref17)), ["moe", "curly", "larry"], "Extracted ids");
    assert.equal((_ref21 = (_givenName$surname = {
      givenName: "Curly",
      surname: "Howard"
    }, who(_givenName$surname)), dom.text(_ref21)), "Curly Howard");
    assert.deepEqual(_.fluent(moe, dom.classes, (_mut5 = mut, _mut$conj5 = _mut5.conj, function conj(_argPlaceholder22) {
      return _mut$conj5.call(_mut5, _argPlaceholder22, "main");
    }), _.deref), ["main"]);
    assert.equal(_.fluent(moe, (_dom5 = dom, _dom$attr = _dom5.attr, function attr(_argPlaceholder23) {
      return _dom$attr.call(_dom5, _argPlaceholder23, "data-tagged", "tests");
    }), (_ref22 = _, _$get5 = _ref22.get, function get(_argPlaceholder24) {
      return _$get5.call(_ref22, _argPlaceholder24, "data-tagged");
    })), "tests");
    _stooges4 = stooges, (_dom6 = dom, _dom$append3 = _dom6.append, _div2 = div({
      id: 'branding'
    }, span("Three Blind Mice")), function append(_argPlaceholder25) {
      return _dom$append3.call(_dom6, _argPlaceholder25, _div2);
    })(_stooges4);
    assert.ok((_ref23 = (_ref24 = (_stooges5 = stooges, (_dom7 = dom, _dom$sel3 = _dom7.sel, function sel(_argPlaceholder26) {
      return _dom$sel3.call(_dom7, "#branding", _argPlaceholder26);
    })(_stooges5)), _.first(_ref24)), _ref23 instanceof HTMLDivElement), "Found by id");
    assert.deepEqual((_ref25 = (_ref26 = (_stooges6 = stooges, (_dom8 = dom, _dom$sel4 = _dom8.sel, function sel(_argPlaceholder27) {
      return _dom$sel4.call(_dom8, "#branding span", _argPlaceholder27);
    })(_stooges6)), (_ref27 = _, _$map3 = _ref27.map, _dom$text = dom.text, function map(_argPlaceholder28) {
      return _$map3.call(_ref27, _dom$text, _argPlaceholder28);
    })(_ref26)), _.first(_ref25)), "Three Blind Mice", "Read text content");
    var greeting = (_ref28 = (_stooges7 = stooges, (_dom9 = dom, _dom$sel5 = _dom9.sel, function sel(_argPlaceholder29) {
      return _dom$sel5.call(_dom9, "#branding span", _argPlaceholder29);
    })(_stooges7)), _.first(_ref28));
    dom.hide(greeting);
    assert.deepEqual((_ref29 = (_greeting = greeting, dom.style(_greeting)), _.deref(_ref29)), {
      display: "none"
    }, "Hidden");
    assert.equal((_ref30 = (_greeting2 = greeting, dom.style(_greeting2)), (_ref31 = _, _$get6 = _ref31.get, function get(_argPlaceholder30) {
      return _$get6.call(_ref31, _argPlaceholder30, "display");
    })(_ref30)), "none");
    dom.show(greeting);
    assert.deepEqual((_ref32 = (_greeting3 = greeting, dom.style(_greeting3)), _.deref(_ref32)), {}, "Shown");
    var branding = (_ref33 = (_stooges8 = stooges, (_dom10 = dom, _dom$sel6 = _dom10.sel, function sel(_argPlaceholder31) {
      return _dom$sel6.call(_dom10, "#branding", _argPlaceholder31);
    })(_stooges8)), _.first(_ref33));
    dom.yank(branding);
    assert.equal((_ref34 = (_branding = branding, _.parent(_branding)), _.first(_ref34)), null, "Removed");
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
    assert.ok(_.rest(blank) instanceof _.EmptyList);
    assert.ok(_.rest(nums) instanceof _.LazySeq);
    assert.ok(_.seq(blank) == null);
    assert.ok(_.seq(nums) != null);
    assert.deepEqual(_.toArray(nums), [0, 1, 2]);
    assert.deepEqual(_.toArray(blank), []);
  });
  QUnit.test("transducers", function (assert) {
    var _ref35, _ref36, _param2, _$comp, _$into, _ref37, _ref38, _param3, _t$dedupe, _$into2, _ref39, _ref40, _param4, _t$filter, _$into3, _ref41;

    assert.deepEqual((_ref35 = (_ref36 = [1, 2, 3], _.cycle(_ref36)), (_ref37 = _, _$into = _ref37.into, _param2 = [], _$comp = _.comp(t.take(4), t.map(_.inc)), function into(_argPlaceholder32) {
      return _$into.call(_ref37, _param2, _$comp, _argPlaceholder32);
    })(_ref35)), [2, 3, 4, 2]);
    assert.deepEqual((_ref38 = [1, 3, 2, 2, 3], (_ref39 = _, _$into2 = _ref39.into, _param3 = [], _t$dedupe = t.dedupe(), function into(_argPlaceholder33) {
      return _$into2.call(_ref39, _param3, _t$dedupe, _argPlaceholder33);
    })(_ref38)), [1, 3, 2, 3]);
    assert.deepEqual((_ref40 = [1, 3, 2, 2, 3], (_ref41 = _, _$into3 = _ref41.into, _param4 = [], _t$filter = t.filter(_.isEven), function into(_argPlaceholder34) {
      return _$into3.call(_ref41, _param4, _t$filter, _argPlaceholder34);
    })(_ref40)), [2, 2]);
  });
  QUnit.test("iinclusive", function (assert) {
    var _charlie, _param5, _$includes, _ref42, _charlie2, _param6, _$includes2, _ref43;

    var charlie = {
      name: "Charlie",
      iq: 120,
      hitpoints: 30
    };
    assert.ok((_charlie = charlie, (_ref42 = _, _$includes = _ref42.includes, _param5 = ["name", "Charlie"], function includes(_argPlaceholder35) {
      return _$includes.call(_ref42, _argPlaceholder35, _param5);
    })(_charlie)));
    assert.notOk((_charlie2 = charlie, (_ref43 = _, _$includes2 = _ref43.includes, _param6 = ["name", "Charles"], function includes(_argPlaceholder36) {
      return _$includes2.call(_ref43, _argPlaceholder36, _param6);
    })(_charlie2)));
  });
  QUnit.test("ilookup", function (assert) {
    var _stooges9, _$get7, _ref44, _pieces, _$get8, _ref45, _worth, _param7, _$getIn, _ref46, _$get9, _ref47, _$assoc, _ref48, _$get10, _$get11, _$get12, _$fmap, _ref49, _$get13, _ref50, _$get14, _ref51, _$get15, _ref52, _$otherwise, _ref53, _moe2, _boris, _ref54, _ref55, _boris2, _$get16, _$get17, _$get18, _$fmap2, _ref56, _$get19, _ref57, _$get20, _ref58, _$get21, _ref59, _$otherwise2, _ref60, _boris3, _param8, _$getIn2, _ref61, _boris4, _param9, _$getIn3, _ref62, _boris5, _param10, _$assocIn, _ref63, _boris6, _param11, _$upperCase, _$updateIn, _ref64, _ref65, _$get22, _ref66;

    assert.equal((_stooges9 = stooges, (_ref44 = _, _$get7 = _ref44.get, function get(_argPlaceholder37) {
      return _$get7.call(_ref44, _argPlaceholder37, 2);
    })(_stooges9)), "Moe");
    assert.equal((_pieces = pieces, (_ref45 = _, _$get8 = _ref45.get, function get(_argPlaceholder38) {
      return _$get8.call(_ref45, _argPlaceholder38, "pawn");
    })(_pieces)), 1);
    assert.equal((_worth = worth, (_ref46 = _, _$getIn = _ref46.getIn, _param7 = ["pieces", "queen"], function getIn(_argPlaceholder39) {
      return _$getIn.call(_ref46, _argPlaceholder39, _param7);
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

    var givenName = _.overload(null, (_ref47 = _, _$get9 = _ref47.get, function get(_argPlaceholder40) {
      return _$get9.call(_ref47, _argPlaceholder40, "givenName");
    }), (_ref48 = _, _$assoc = _ref48.assoc, function assoc(_argPlaceholder41, _argPlaceholder42) {
      return _$assoc.call(_ref48, _argPlaceholder41, "givenName", _argPlaceholder42);
    })); //lens


    var getAddressLine1 = _.pipe(_.maybe, (_ref49 = _, _$fmap = _ref49.fmap, _$get10 = (_ref50 = _, _$get13 = _ref50.get, function get(_argPlaceholder44) {
      return _$get13.call(_ref50, _argPlaceholder44, "address");
    }), _$get11 = (_ref51 = _, _$get14 = _ref51.get, function get(_argPlaceholder45) {
      return _$get14.call(_ref51, _argPlaceholder45, "lines");
    }), _$get12 = (_ref52 = _, _$get15 = _ref52.get, function get(_argPlaceholder46) {
      return _$get15.call(_ref52, _argPlaceholder46, 1);
    }), function fmap(_argPlaceholder43) {
      return _$fmap.call(_ref49, _argPlaceholder43, _$get10, _$get11, _$get12);
    }), (_ref53 = _, _$otherwise = _ref53.otherwise, function otherwise(_argPlaceholder47) {
      return _$otherwise.call(_ref53, _argPlaceholder47, "");
    }));

    assert.equal((_moe2 = moe, getAddressLine1(_moe2)), "");
    assert.equal((_boris = boris, getAddressLine1(_boris)), "Suite 401");
    assert.equal((_ref54 = (_ref55 = (_boris2 = boris, _.maybe(_boris2)), (_ref56 = _, _$fmap2 = _ref56.fmap, _$get16 = (_ref57 = _, _$get19 = _ref57.get, function get(_argPlaceholder49) {
      return _$get19.call(_ref57, _argPlaceholder49, "address");
    }), _$get17 = (_ref58 = _, _$get20 = _ref58.get, function get(_argPlaceholder50) {
      return _$get20.call(_ref58, _argPlaceholder50, "lines");
    }), _$get18 = (_ref59 = _, _$get21 = _ref59.get, function get(_argPlaceholder51) {
      return _$get21.call(_ref59, _argPlaceholder51, 1);
    }), function fmap(_argPlaceholder48) {
      return _$fmap2.call(_ref56, _argPlaceholder48, _$get16, _$get17, _$get18);
    })(_ref55)), (_ref60 = _, _$otherwise2 = _ref60.otherwise, function otherwise(_argPlaceholder52) {
      return _$otherwise2.call(_ref60, _argPlaceholder52, "");
    })(_ref54)), "Suite 401");
    assert.equal((_boris3 = boris, (_ref61 = _, _$getIn2 = _ref61.getIn, _param8 = ["address", "lines", 1], function getIn(_argPlaceholder53) {
      return _$getIn2.call(_ref61, _argPlaceholder53, _param8);
    })(_boris3)), "Suite 401");
    assert.equal((_boris4 = boris, (_ref62 = _, _$getIn3 = _ref62.getIn, _param9 = ["address", "lines", 2], function getIn(_argPlaceholder54) {
      return _$getIn3.call(_ref62, _argPlaceholder54, _param9);
    })(_boris4)), null);
    assert.deepEqual((_boris5 = boris, (_ref63 = _, _$assocIn = _ref63.assocIn, _param10 = ["address", "lines", 1], function assocIn(_argPlaceholder55) {
      return _$assocIn.call(_ref63, _argPlaceholder55, _param10, "attn: Finance Dept.");
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
    assert.deepEqual((_boris6 = boris, (_ref64 = _, _$updateIn = _ref64.updateIn, _param11 = ["address", "lines", 1], _$upperCase = _.upperCase, function updateIn(_argPlaceholder56) {
      return _$updateIn.call(_ref64, _argPlaceholder56, _param11, _$upperCase);
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
    assert.equal((_ref65 = ["ace", "king", "queen"], (_ref66 = _, _$get22 = _ref66.get, function get(_argPlaceholder57) {
      return _$get22.call(_ref66, _argPlaceholder57, 2);
    })(_ref65)), "queen");
  });
  QUnit.test("iassociative", function (assert) {
    var _stooges10, _$assoc2, _ref67, _stooges11, _$assoc3, _ref68, _court, _$assoc4, _ref69, _worth2, _param12, _$assocIn2, _ref70, _worth3, _param13, _Infinity, _$assocIn3, _ref71, _court2, _$add, _$update, _ref72, _2, _$add2, _ref73, _worth4, _param14, _$add3, _$updateIn2, _ref74, _3, _$add4, _ref75, _surname, _$assoc5, _ref76, _ref77, _$assoc6, _ref78;

    assert.equal((_stooges10 = stooges, (_ref67 = _, _$assoc2 = _ref67.assoc, function assoc(_argPlaceholder58) {
      return _$assoc2.call(_ref67, _argPlaceholder58, 0, "Larry");
    })(_stooges10)), stooges, "maintain referential equivalence");
    assert.deepEqual((_stooges11 = stooges, (_ref68 = _, _$assoc3 = _ref68.assoc, function assoc(_argPlaceholder59) {
      return _$assoc3.call(_ref68, _argPlaceholder59, 0, "Shemp");
    })(_stooges11)), ["Shemp", "Curly", "Moe"]);
    assert.deepEqual((_court = court, (_ref69 = _, _$assoc4 = _ref69.assoc, function assoc(_argPlaceholder60) {
      return _$assoc4.call(_ref69, _argPlaceholder60, "ace", 14);
    })(_court)), {
      jack: 11,
      queen: 12,
      king: 13,
      ace: 14
    });
    assert.deepEqual((_worth2 = worth, (_ref70 = _, _$assocIn2 = _ref70.assocIn, _param12 = ["court", "ace"], function assocIn(_argPlaceholder61) {
      return _$assocIn2.call(_ref70, _argPlaceholder61, _param12, 1);
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
    assert.deepEqual((_worth3 = worth, (_ref71 = _, _$assocIn3 = _ref71.assocIn, _param13 = ["court", "king"], _Infinity = Infinity, function assocIn(_argPlaceholder62) {
      return _$assocIn3.call(_ref71, _argPlaceholder62, _param13, _Infinity);
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
    assert.deepEqual((_court2 = court, (_ref72 = _, _$update = _ref72.update, _$add = (_ref73 = _, _$add2 = _ref73.add, _2 = -10, function add(_argPlaceholder64) {
      return _$add2.call(_ref73, _argPlaceholder64, _2);
    }), function update(_argPlaceholder63) {
      return _$update.call(_ref72, _argPlaceholder63, "jack", _$add);
    })(_court2)), {
      jack: 1,
      queen: 12,
      king: 13
    });
    assert.deepEqual((_worth4 = worth, (_ref74 = _, _$updateIn2 = _ref74.updateIn, _param14 = ["court", "king"], _$add3 = (_ref75 = _, _$add4 = _ref75.add, _3 = -10, function add(_argPlaceholder66) {
      return _$add4.call(_ref75, _argPlaceholder66, _3);
    }), function updateIn(_argPlaceholder65) {
      return _$updateIn2.call(_ref74, _argPlaceholder65, _param14, _$add3);
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
    }, (_ref76 = _, _$assoc5 = _ref76.assoc, function assoc(_argPlaceholder67) {
      return _$assoc5.call(_ref76, _argPlaceholder67, "givenName", "Moe");
    })(_surname)), {
      givenName: "Moe",
      surname: "Howard"
    });
    assert.deepEqual((_ref77 = [1, 2, 3], (_ref78 = _, _$assoc6 = _ref78.assoc, function assoc(_argPlaceholder68) {
      return _$assoc6.call(_ref78, _argPlaceholder68, 1, 0);
    })(_ref77)), [1, 0, 3]);
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
    var _ref79, _ref80, _ref81, _param15, _$union, _ref82, _ref83, _ref84, _ref85, _param16, _$difference, _ref86, _ref87, _param17, _$superset, _ref88, _ref89, _param18, _$superset2, _ref90;

    assert.deepEqual((_ref79 = (_ref80 = (_ref81 = [1, 2, 3], (_ref82 = _, _$union = _ref82.union, _param15 = [2, 3, 4], function union(_argPlaceholder69) {
      return _$union.call(_ref82, _argPlaceholder69, _param15);
    })(_ref81)), _.sort(_ref80)), _.toArray(_ref79)), [1, 2, 3, 4]);
    assert.deepEqual((_ref83 = (_ref84 = (_ref85 = [1, 2, 3, 4, 5], (_ref86 = _, _$difference = _ref86.difference, _param16 = [5, 2, 10], function difference(_argPlaceholder70) {
      return _$difference.call(_ref86, _argPlaceholder70, _param16);
    })(_ref85)), _.sort(_ref84)), _.toArray(_ref83)), [1, 3, 4]);
    assert.ok((_ref87 = [1, 2, 3], (_ref88 = _, _$superset = _ref88.superset, _param17 = [2, 3], function superset(_argPlaceholder71) {
      return _$superset.call(_ref88, _argPlaceholder71, _param17);
    })(_ref87)));
    assert.notOk((_ref89 = [1, 2, 3], (_ref90 = _, _$superset2 = _ref90.superset, _param18 = [2, 4], function superset(_argPlaceholder72) {
      return _$superset2.call(_ref90, _argPlaceholder72, _param18);
    })(_ref89)));
  });
  QUnit.test("iappendable, iprependable", function (assert) {
    var _ref91, _$append, _ref92, _surname2, _param19, _$conj, _ref93, _ref94, _$append2, _ref95, _ref96, _$prepend, _ref97;

    assert.deepEqual((_ref91 = ["Moe"], (_ref92 = _, _$append = _ref92.append, function append(_argPlaceholder73) {
      return _$append.call(_ref92, _argPlaceholder73, "Howard");
    })(_ref91)), ["Moe", "Howard"]);
    assert.deepEqual((_surname2 = {
      surname: "Howard"
    }, (_ref93 = _, _$conj = _ref93.conj, _param19 = ['givenName', "Moe"], function conj(_argPlaceholder74) {
      return _$conj.call(_ref93, _argPlaceholder74, _param19);
    })(_surname2)), {
      givenName: "Moe",
      surname: "Howard"
    });
    assert.deepEqual((_ref94 = [1, 2], (_ref95 = _, _$append2 = _ref95.append, function append(_argPlaceholder75) {
      return _$append2.call(_ref95, _argPlaceholder75, 3);
    })(_ref94)), [1, 2, 3]);
    assert.deepEqual((_ref96 = [1, 2], (_ref97 = _, _$prepend = _ref97.prepend, function prepend(_argPlaceholder76) {
      return _$prepend.call(_ref97, _argPlaceholder76, 0);
    })(_ref96)), [0, 1, 2]);
  });
  QUnit.test("sequences", function (assert) {
    var _ref98, _ref99, _ref100, _$take, _ref101, _ref102, _$positives, _$take2, _ref103, _ref104, _ref105, _$repeatedly, _ref106, _stooges12, _param20, _$concat, _ref107, _$range, _stooges13, _ref108, _$isEven, _$some, _ref109, _ref110, _$isEven2, _$notAny, _ref111, _ref112, _$isEven3, _$every, _ref113, _ref114, _ref115, _$dropLast, _ref116, _ref117, _stooges14, _ref118, _ref119, _ref120, _ref121, _pieces2, _param21, _$selectKeys, _ref122, _ref123, _ref124, _$repeat, _$positives2, _$interleave, _ref125, _ref126, _ref127, _param22, _$interleave2, _ref128, _ref129, _$isTrue, _$some2, _ref130, _ref131, _$isFalse, _$some3, _ref132, _ref133, _$isTrue2, _$some4, _ref134, _$range2, _param23, _$detect, _ref135, _$range3, _param24, _$every2, _ref136, _ref137, _ref138, _param25, _$into4, _ref139, _ref140, _$repeat2, _$take3, _ref141, _ref142, _ref143, _ref144, _ref145, _$interpose, _ref146, _ref147, _$repeat3, _$take4, _ref148, _ref149, _ref150, _ref151, _$repeat4, _$take5, _ref152, _$conj2, _ref153, _4, _$conj3, _ref154, _ref155, _$range4, _$take6, _ref156, _$range5, _$range6, _ref157, _ref158, _$range7, _$drop, _ref159, _$take7, _ref160, _ref161, _ref162, _$inc, _$map4, _ref163, _ref164, _$isEven4, _$some5, _ref165, _ref166, _$isEven5, _$detect2, _ref167, _$range8, _param26, _$some6, _ref168, _ace$king$queen, _param27, _$selectKeys2, _ref169, _Polo, _$into5, _ref170, _ref171, _ref172, _param28, _$filter, _ref173, _$into6, _ref174, _Polo2, _ref175, _ref176, _ref177, _$take8, _ref178, _ref179, _ref180, _ref181, _ref182, _ref183, _$range9, _$takeNth, _ref184, _ref185, _ref186, _$constantly, _$take9, _ref187, _ref188, _ref189, _$constantly2, _$take10, _ref190, _ref191, _$range10, _$take11, _ref192, _ref193, _$range11, _param29, _$filter2, _ref194, _ref195, _$range12, _param30, _$remove, _ref196, _ref197, _$range13, _param31, _$takeWhile, _ref198, _ref199, _$range14, _param32, _$dropWhile, _ref200, _ref201, _$range15, _$inc2, _$map5, _ref202, _ref203, _ref204, _$inc3, _$map6, _ref205, _ref206, _ref207, _ref208, _ref209, _param33, _$filter3, _ref210, _$inc4, _$map7, _ref211, _$take12, _ref212, _ref213, _$range16, _$take13, _ref214, _$range17, _ref215, _$repeat5, _$take14, _ref216, _ref217, _ref218, _param34, _param35, _$concat2, _ref219, _ref220, _ref221, _param36, _$keepIndexed, _ref222, _ref223, _ref224, _param37, _$mapIndexed, _ref225;

    assert.deepEqual((_ref98 = (_ref99 = (_ref100 = ["A", "B", "C"], _.cycle(_ref100)), (_ref101 = _, _$take = _ref101.take, function take(_argPlaceholder77) {
      return _$take.call(_ref101, 5, _argPlaceholder77);
    })(_ref99)), _.toArray(_ref98)), ["A", "B", "C", "A", "B"]);
    assert.deepEqual((_ref102 = (_$positives = _.positives, (_ref103 = _, _$take2 = _ref103.take, function take(_argPlaceholder78) {
      return _$take2.call(_ref103, 5, _argPlaceholder78);
    })(_$positives)), _.toArray(_ref102)), [1, 2, 3, 4, 5]);
    assert.deepEqual((_ref104 = (_ref105 = ["A", "B", "C"], _.rest(_ref105)), _.toArray(_ref104)), ["B", "C"]);
    assert.deepEqual((_$repeatedly = _.repeatedly(3, _.constantly(4)), _.toArray(_$repeatedly)), [4, 4, 4]);
    assert.deepEqual((_ref106 = (_stooges12 = stooges, (_ref107 = _, _$concat = _ref107.concat, _param20 = ["Shemp", "Corey"], function concat(_argPlaceholder79) {
      return _$concat.call(_ref107, _argPlaceholder79, _param20);
    })(_stooges12)), _.toArray(_ref106)), ["Larry", "Curly", "Moe", "Shemp", "Corey"]);
    assert.deepEqual((_$range = _.range(4), _.toArray(_$range)), [0, 1, 2, 3]);
    assert.equal((_stooges13 = stooges, _.second(_stooges13)), "Curly");
    assert.equal((_ref108 = [1, 2, 3], (_ref109 = _, _$some = _ref109.some, _$isEven = _.isEven, function some(_argPlaceholder80) {
      return _$some.call(_ref109, _$isEven, _argPlaceholder80);
    })(_ref108)), true);
    assert.equal((_ref110 = [1, 2, 3], (_ref111 = _, _$notAny = _ref111.notAny, _$isEven2 = _.isEven, function notAny(_argPlaceholder81) {
      return _$notAny.call(_ref111, _$isEven2, _argPlaceholder81);
    })(_ref110)), false);
    assert.equal((_ref112 = [2, 4, 6], (_ref113 = _, _$every = _ref113.every, _$isEven3 = _.isEven, function every(_argPlaceholder82) {
      return _$every.call(_ref113, _$isEven3, _argPlaceholder82);
    })(_ref112)), true);
    assert.deepEqual((_ref114 = (_ref115 = [9, 8, 7, 6, 5, 4, 3], (_ref116 = _, _$dropLast = _ref116.dropLast, function dropLast(_argPlaceholder83) {
      return _$dropLast.call(_ref116, 3, _argPlaceholder83);
    })(_ref115)), _.toArray(_ref114)), [9, 8, 7, 6]);
    assert.deepEqual((_ref117 = (_stooges14 = stooges, _.sort(_stooges14)), _.toArray(_ref117)), ["Curly", "Larry", "Moe"]);
    assert.deepEqual((_ref118 = (_ref119 = ["A", "B", ["C", "D"], ["E", ["F", "G"]]], _.flatten(_ref119)), _.toArray(_ref118)), ["A", "B", "C", "D", "E", "F", "G"]);
    assert.deepEqual((_ref120 = (_ref121 = [null, ""], _.flatten(_ref121)), _.toArray(_ref120)), [null, ""]);
    assert.deepEqual((_pieces2 = pieces, (_ref122 = _, _$selectKeys = _ref122.selectKeys, _param21 = ["pawn", "knight"], function selectKeys(_argPlaceholder84) {
      return _$selectKeys.call(_ref122, _argPlaceholder84, _param21);
    })(_pieces2)), {
      pawn: 1,
      knight: 3
    });
    assert.deepEqual((_ref123 = (_ref124 = ["A", "B", "C", "D", "E"], (_ref125 = _, _$interleave = _ref125.interleave, _$repeat = _.repeat("="), _$positives2 = _.positives, function interleave(_argPlaceholder85) {
      return _$interleave.call(_ref125, _argPlaceholder85, _$repeat, _$positives2);
    })(_ref124)), _.toArray(_ref123)), ["A", "=", 1, "B", "=", 2, "C", "=", 3, "D", "=", 4, "E", "=", 5]);
    assert.deepEqual((_ref126 = (_ref127 = [1, 2, 3], (_ref128 = _, _$interleave2 = _ref128.interleave, _param22 = [10, 11, 12], function interleave(_argPlaceholder86) {
      return _$interleave2.call(_ref128, _argPlaceholder86, _param22);
    })(_ref127)), _.toArray(_ref126)), [1, 10, 2, 11, 3, 12]);
    assert.equal((_ref129 = [false, true], (_ref130 = _, _$some2 = _ref130.some, _$isTrue = _.isTrue, function some(_argPlaceholder87) {
      return _$some2.call(_ref130, _$isTrue, _argPlaceholder87);
    })(_ref129)), true);
    assert.equal((_ref131 = [false, true], (_ref132 = _, _$some3 = _ref132.some, _$isFalse = _.isFalse, function some(_argPlaceholder88) {
      return _$some3.call(_ref132, _$isFalse, _argPlaceholder88);
    })(_ref131)), true);
    assert.equal((_ref133 = [false, false], (_ref134 = _, _$some4 = _ref134.some, _$isTrue2 = _.isTrue, function some(_argPlaceholder89) {
      return _$some4.call(_ref134, _$isTrue2, _argPlaceholder89);
    })(_ref133)), null);
    assert.equal((_$range2 = _.range(10), (_ref135 = _, _$detect = _ref135.detect, _param23 = function _param23(x) {
      return x > 5;
    }, function detect(_argPlaceholder90) {
      return _$detect.call(_ref135, _param23, _argPlaceholder90);
    })(_$range2)), 6);
    assert.notOk((_$range3 = _.range(10), (_ref136 = _, _$every2 = _ref136.every, _param24 = function _param24(x) {
      return x > 5;
    }, function every(_argPlaceholder91) {
      return _$every2.call(_ref136, _param24, _argPlaceholder91);
    })(_$range3)));
    assert.deepEqual((_ref137 = [1, 2, 3], _.empty(_ref137)), []);
    assert.deepEqual((_ref138 = null, (_ref139 = _, _$into4 = _ref139.into, _param25 = [], function into(_argPlaceholder92) {
      return _$into4.call(_ref139, _param25, _argPlaceholder92);
    })(_ref138)), []);
    assert.deepEqual((_ref140 = (_$repeat2 = _.repeat(1), (_ref141 = _, _$take3 = _ref141.take, function take(_argPlaceholder93) {
      return _$take3.call(_ref141, 2, _argPlaceholder93);
    })(_$repeat2)), _.toArray(_ref140)), [1, 1]);
    assert.deepEqual((_ref142 = (_ref143 = [1, 2, 3], _.butlast(_ref143)), _.toArray(_ref142)), [1, 2]);
    assert.deepEqual((_ref144 = (_ref145 = ["A", "B", "C"], (_ref146 = _, _$interpose = _ref146.interpose, function interpose(_argPlaceholder94) {
      return _$interpose.call(_ref146, "-", _argPlaceholder94);
    })(_ref145)), _.toArray(_ref144)), ["A", "-", "B", "-", "C"]);
    assert.deepEqual((_ref147 = (_$repeat3 = _.repeat(1), (_ref148 = _, _$take4 = _ref148.take, function take(_argPlaceholder95) {
      return _$take4.call(_ref148, 5, _argPlaceholder95);
    })(_$repeat3)), _.toArray(_ref147)), [1, 1, 1, 1, 1]);
    assert.deepEqual((_ref149 = (_ref150 = (_ref151 = (_$repeat4 = _.repeat(1), (_ref152 = _, _$take5 = _ref152.take, function take(_argPlaceholder96) {
      return _$take5.call(_ref152, 5, _argPlaceholder96);
    })(_$repeat4)), (_ref153 = _, _$conj2 = _ref153.conj, function conj(_argPlaceholder97) {
      return _$conj2.call(_ref153, _argPlaceholder97, 0);
    })(_ref151)), (_ref154 = _, _$conj3 = _ref154.conj, _4 = -1, function conj(_argPlaceholder98) {
      return _$conj3.call(_ref154, _argPlaceholder98, _4);
    })(_ref150)), _.toArray(_ref149)), [-1, 0, 1, 1, 1, 1, 1]);
    assert.deepEqual((_ref155 = (_$range4 = _.range(10), (_ref156 = _, _$take6 = _ref156.take, function take(_argPlaceholder99) {
      return _$take6.call(_ref156, 5, _argPlaceholder99);
    })(_$range4)), _.toArray(_ref155)), [0, 1, 2, 3, 4]);
    assert.deepEqual((_$range5 = _.range(-5, 5), _.toArray(_$range5)), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
    assert.deepEqual((_$range6 = _.range(-20, 100, 10), _.toArray(_$range6)), [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
    assert.deepEqual((_ref157 = (_ref158 = (_$range7 = _.range(10), (_ref159 = _, _$drop = _ref159.drop, function drop(_argPlaceholder100) {
      return _$drop.call(_ref159, 3, _argPlaceholder100);
    })(_$range7)), (_ref160 = _, _$take7 = _ref160.take, function take(_argPlaceholder101) {
      return _$take7.call(_ref160, 3, _argPlaceholder101);
    })(_ref158)), _.toArray(_ref157)), [3, 4, 5]);
    assert.deepEqual((_ref161 = (_ref162 = [1, 2, 3], (_ref163 = _, _$map4 = _ref163.map, _$inc = _.inc, function map(_argPlaceholder102) {
      return _$map4.call(_ref163, _$inc, _argPlaceholder102);
    })(_ref162)), _.toArray(_ref161)), [2, 3, 4]);
    assert.equal((_ref164 = [1, 2, 3, 4], (_ref165 = _, _$some5 = _ref165.some, _$isEven4 = _.isEven, function some(_argPlaceholder103) {
      return _$some5.call(_ref165, _$isEven4, _argPlaceholder103);
    })(_ref164)), true);
    assert.equal((_ref166 = [1, 2, 3, 4], (_ref167 = _, _$detect2 = _ref167.detect, _$isEven5 = _.isEven, function detect(_argPlaceholder104) {
      return _$detect2.call(_ref167, _$isEven5, _argPlaceholder104);
    })(_ref166)), 2);
    assert.equal((_$range8 = _.range(10), (_ref168 = _, _$some6 = _ref168.some, _param26 = function _param26(x) {
      return x > 5;
    }, function some(_argPlaceholder105) {
      return _$some6.call(_ref168, _param26, _argPlaceholder105);
    })(_$range8)), true);
    assert.deepEqual((_ace$king$queen = {
      ace: 1,
      king: 2,
      queen: 3
    }, (_ref169 = _, _$selectKeys2 = _ref169.selectKeys, _param27 = ["ace", "king"], function selectKeys(_argPlaceholder106) {
      return _$selectKeys2.call(_ref169, _argPlaceholder106, _param27);
    })(_ace$king$queen)), {
      ace: 1,
      king: 2
    });
    assert.equal((_Polo = "Polo", (_ref170 = _, _$into5 = _ref170.into, function into(_argPlaceholder107) {
      return _$into5.call(_ref170, "Marco ", _argPlaceholder107);
    })(_Polo)), "Marco Polo");
    assert.deepEqual((_ref171 = (_ref172 = [5, 6, 7, 8, 9], (_ref173 = _, _$filter = _ref173.filter, _param28 = function _param28(x) {
      return x > 6;
    }, function filter(_argPlaceholder108) {
      return _$filter.call(_ref173, _param28, _argPlaceholder108);
    })(_ref172)), (_ref174 = _, _$into6 = _ref174.into, function into(_argPlaceholder109) {
      return _$into6.call(_ref174, "", _argPlaceholder109);
    })(_ref171)), "789");
    assert.deepEqual((_Polo2 = "Polo", _.toArray(_Polo2)), ["P", "o", "l", "o"]);
    assert.deepEqual((_ref175 = (_ref176 = (_ref177 = [1, 2, 3], _.cycle(_ref177)), (_ref178 = _, _$take8 = _ref178.take, function take(_argPlaceholder110) {
      return _$take8.call(_ref178, 7, _argPlaceholder110);
    })(_ref176)), _.toArray(_ref175)), [1, 2, 3, 1, 2, 3, 1]);
    assert.deepEqual((_ref179 = (_ref180 = [1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7], _.dedupe(_ref180)), _.toArray(_ref179)), [1, 2, 3, 4, 5, 6, 7]);
    assert.deepEqual((_ref181 = (_ref182 = [1, 2, 3, 1, 4, 3, 4, 3, 2, 2], I.distinct(_ref182)), _.toArray(_ref181)), [1, 2, 3, 4]);
    assert.deepEqual((_ref183 = (_$range9 = _.range(10), (_ref184 = _, _$takeNth = _ref184.takeNth, function takeNth(_argPlaceholder111) {
      return _$takeNth.call(_ref184, 2, _argPlaceholder111);
    })(_$range9)), _.toArray(_ref183)), [0, 2, 4, 6, 8]);
    assert.deepEqual((_ref185 = (_ref186 = (_$constantly = _.constantly(1), _.repeatedly(_$constantly)), (_ref187 = _, _$take9 = _ref187.take, function take(_argPlaceholder112) {
      return _$take9.call(_ref187, 0, _argPlaceholder112);
    })(_ref186)), _.toArray(_ref185)), []);
    assert.deepEqual((_ref188 = (_ref189 = (_$constantly2 = _.constantly(2), _.repeatedly(_$constantly2)), (_ref190 = _, _$take10 = _ref190.take, function take(_argPlaceholder113) {
      return _$take10.call(_ref190, 10, _argPlaceholder113);
    })(_ref189)), _.toArray(_ref188)), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
    assert.deepEqual((_ref191 = (_$range10 = _.range(10), (_ref192 = _, _$take11 = _ref192.take, function take(_argPlaceholder114) {
      return _$take11.call(_ref192, 5, _argPlaceholder114);
    })(_$range10)), _.toArray(_ref191)), [0, 1, 2, 3, 4]);
    assert.deepEqual((_ref193 = (_$range11 = _.range(10), (_ref194 = _, _$filter2 = _ref194.filter, _param29 = function _param29(x) {
      return x > 5;
    }, function filter(_argPlaceholder115) {
      return _$filter2.call(_ref194, _param29, _argPlaceholder115);
    })(_$range11)), _.toArray(_ref193)), [6, 7, 8, 9]);
    assert.deepEqual((_ref195 = (_$range12 = _.range(10), (_ref196 = _, _$remove = _ref196.remove, _param30 = function _param30(x) {
      return x > 5;
    }, function remove(_argPlaceholder116) {
      return _$remove.call(_ref196, _param30, _argPlaceholder116);
    })(_$range12)), _.toArray(_ref195)), [0, 1, 2, 3, 4, 5]);
    assert.deepEqual((_ref197 = (_$range13 = _.range(10), (_ref198 = _, _$takeWhile = _ref198.takeWhile, _param31 = function _param31(x) {
      return x < 5;
    }, function takeWhile(_argPlaceholder117) {
      return _$takeWhile.call(_ref198, _param31, _argPlaceholder117);
    })(_$range13)), _.toArray(_ref197)), [0, 1, 2, 3, 4]);
    assert.deepEqual((_ref199 = (_$range14 = _.range(10), (_ref200 = _, _$dropWhile = _ref200.dropWhile, _param32 = function _param32(x) {
      return x > 5;
    }, function dropWhile(_argPlaceholder118) {
      return _$dropWhile.call(_ref200, _param32, _argPlaceholder118);
    })(_$range14)), _.toArray(_ref199)), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.deepEqual((_ref201 = (_$range15 = _.range(1, 5), (_ref202 = _, _$map5 = _ref202.map, _$inc2 = _.inc, function map(_argPlaceholder119) {
      return _$map5.call(_ref202, _$inc2, _argPlaceholder119);
    })(_$range15)), _.toArray(_ref201)), [2, 3, 4, 5]);
    assert.deepEqual((_ref203 = (_ref204 = [10, 11, 12], (_ref205 = _, _$map6 = _ref205.map, _$inc3 = _.inc, function map(_argPlaceholder120) {
      return _$map6.call(_ref205, _$inc3, _argPlaceholder120);
    })(_ref204)), _.toArray(_ref203)), [11, 12, 13]);
    assert.deepEqual((_ref206 = (_ref207 = (_ref208 = (_ref209 = [5, 6, 7, 8, 9], (_ref210 = _, _$filter3 = _ref210.filter, _param33 = function _param33(x) {
      return x > 6;
    }, function filter(_argPlaceholder121) {
      return _$filter3.call(_ref210, _param33, _argPlaceholder121);
    })(_ref209)), (_ref211 = _, _$map7 = _ref211.map, _$inc4 = _.inc, function map(_argPlaceholder122) {
      return _$map7.call(_ref211, _$inc4, _argPlaceholder122);
    })(_ref208)), (_ref212 = _, _$take12 = _ref212.take, function take(_argPlaceholder123) {
      return _$take12.call(_ref212, 2, _argPlaceholder123);
    })(_ref207)), _.toArray(_ref206)), [8, 9]);
    assert.deepEqual((_ref213 = (_$range16 = _.range(7, 15), (_ref214 = _, _$take13 = _ref214.take, function take(_argPlaceholder124) {
      return _$take13.call(_ref214, 10, _argPlaceholder124);
    })(_$range16)), _.toArray(_ref213)), [7, 8, 9, 10, 11, 12, 13, 14]);
    assert.deepEqual((_$range17 = _.range(5), _.toArray(_$range17)), [0, 1, 2, 3, 4]);
    assert.deepEqual((_ref215 = (_$repeat5 = _.repeat("X"), (_ref216 = _, _$take14 = _ref216.take, function take(_argPlaceholder125) {
      return _$take14.call(_ref216, 5, _argPlaceholder125);
    })(_$repeat5)), _.toArray(_ref215)), ["X", "X", "X", "X", "X"]);
    assert.deepEqual((_ref217 = (_ref218 = [1, 2], (_ref219 = _, _$concat2 = _ref219.concat, _param34 = [3, 4], _param35 = [5, 6], function concat(_argPlaceholder126) {
      return _$concat2.call(_ref219, _argPlaceholder126, _param34, _param35);
    })(_ref218)), _.toArray(_ref217)), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual((_ref220 = (_ref221 = ["a", "b", "c", "d", "e"], (_ref222 = _, _$keepIndexed = _ref222.keepIndexed, _param36 = function _param36(idx, value) {
      return _.isOdd(idx) ? value : null;
    }, function keepIndexed(_argPlaceholder127) {
      return _$keepIndexed.call(_ref222, _param36, _argPlaceholder127);
    })(_ref221)), _.toArray(_ref220)), ["b", "d"]);
    assert.deepEqual((_ref223 = (_ref224 = [10, 11, 12], (_ref225 = _, _$mapIndexed = _ref225.mapIndexed, _param37 = function _param37(idx, value) {
      return [idx, _.inc(value)];
    }, function mapIndexed(_argPlaceholder128) {
      return _$mapIndexed.call(_ref225, _param37, _argPlaceholder128);
    })(_ref224)), _.toArray(_ref223)), [[0, 11], [1, 12], [2, 13]]);
    assert.deepEqual(_.everyPred(_.isEven, function (x) {
      return x > 10;
    })(12, 14, 16), true);
    assert.equal(_.maxKey(function (obj) {
      return obj["king"];
    }, pieces, court), pieces);
  });
  QUnit.test("add/subtract", function (assert) {
    var _$zeros, _ref226, _$zeros2, _ref227, _$zeros3, _ref228, _christmas, _newYears, _ref229, _christmas2, _$days, _$add5, _ref230, _ref231, _christmas3, _$weeks, _$add6, _ref232, _ref233, _christmas4, _$months, _$add7, _ref234, _ref235, _christmas5, _$years, _$add8, _ref236, _ref237, _christmas6, _$years2, _$subtract, _ref238;

    var christmas = _.date(2017, 11, 25);

    var newYears = _.date(2018, 0, 1);

    var mmddyyyy = _.fmt(_.comp((_ref226 = _, _$zeros = _ref226.zeros, function zeros(_argPlaceholder129) {
      return _$zeros.call(_ref226, _argPlaceholder129, 2);
    }), _.inc, _.month), "/", _.comp((_ref227 = _, _$zeros2 = _ref227.zeros, function zeros(_argPlaceholder130) {
      return _$zeros2.call(_ref227, _argPlaceholder130, 2);
    }), _.day), "/", _.comp((_ref228 = _, _$zeros3 = _ref228.zeros, function zeros(_argPlaceholder131) {
      return _$zeros3.call(_ref228, _argPlaceholder131, 4);
    }), _.year));

    assert.equal((_christmas = christmas, mmddyyyy(_christmas)), "12/25/2017");
    assert.equal((_newYears = newYears, mmddyyyy(_newYears)), "01/01/2018");
    assert.equal((_ref229 = (_christmas2 = christmas, (_ref230 = _, _$add5 = _ref230.add, _$days = _.days(1), function add(_argPlaceholder132) {
      return _$add5.call(_ref230, _argPlaceholder132, _$days);
    })(_christmas2)), _.deref(_ref229)), 1514264400000);
    assert.equal((_ref231 = (_christmas3 = christmas, (_ref232 = _, _$add6 = _ref232.add, _$weeks = _.weeks(1), function add(_argPlaceholder133) {
      return _$add6.call(_ref232, _argPlaceholder133, _$weeks);
    })(_christmas3)), _.deref(_ref231)), 1514782800000);
    assert.equal((_ref233 = (_christmas4 = christmas, (_ref234 = _, _$add7 = _ref234.add, _$months = _.months(1), function add(_argPlaceholder134) {
      return _$add7.call(_ref234, _argPlaceholder134, _$months);
    })(_christmas4)), _.deref(_ref233)), 1516856400000);
    assert.equal((_ref235 = (_christmas5 = christmas, (_ref236 = _, _$add8 = _ref236.add, _$years = _.years(1), function add(_argPlaceholder135) {
      return _$add8.call(_ref236, _argPlaceholder135, _$years);
    })(_christmas5)), _.deref(_ref235)), 1545714000000);
    assert.equal((_ref237 = (_christmas6 = christmas, (_ref238 = _, _$subtract = _ref238.subtract, _$years2 = _.years(1), function subtract(_argPlaceholder136) {
      return _$subtract.call(_ref238, _argPlaceholder136, _$years2);
    })(_christmas6)), _.deref(_ref237)), 1482642000000);
  });
  QUnit.test("duration", function (assert) {
    var _ref239, _newYearsDay, _$hours, _$divide, _ref240, _$add9, _$add10, _$add11, _$add12;

    var newYearsEve = _.date(2019, 11, 31);

    var newYearsDay = _.period(_.date(2020, 0, 1));

    assert.equal(_.divide(_.years(1), _.days(1)), 365.25);
    assert.equal(_.divide(_.days(1), _.hours(1)), 24);
    assert.equal((_ref239 = (_newYearsDay = newYearsDay, _.toDuration(_newYearsDay)), (_ref240 = _, _$divide = _ref240.divide, _$hours = _.hours(1), function divide(_argPlaceholder137) {
      return _$divide.call(_ref240, _argPlaceholder137, _$hours);
    })(_ref239)), 24);
    assert.equal((_$add9 = _.add(newYearsEve, 1), _.deref(_$add9)), 1577854800000);
    assert.equal((_$add10 = _.add(newYearsEve, _.days(1)), _.deref(_$add10)), 1577854800000);
    assert.equal((_$add11 = _.add(newYearsEve, _.years(-1)), _.deref(_$add11)), 1546232400000); //prior New Year's Eve

    assert.equal((_$add12 = _.add(newYearsEve, _.days(1), _.hours(7)), _.deref(_$add12)), 1577880000000); //7am New Year's Day
  });
  QUnit.test("record", function (assert) {
    var _robin, _$get23, _ref241, _ref242, _robin2, _$assoc7, _ref243, _$get24, _ref244, _sean, _$get25, _ref245;

    function Person(name, surname, dob) {
      this.attrs = {
        name: name,
        surname: surname,
        dob: dob
      };
    }

    _.record(Person);

    var sean = new Person("Sean", "Penn", _.date(1960, 8, 17));
    var robin = Person.create("Robin", "Wright", new Date(1966, 3, 8));
    Person.from({
      name: "Dylan",
      surname: "Penn",
      dob: _.date(1991, 4, 13)
    });
    assert.equal((_robin = robin, (_ref241 = _, _$get23 = _ref241.get, function get(_argPlaceholder138) {
      return _$get23.call(_ref241, _argPlaceholder138, "surname");
    })(_robin)), "Wright");
    assert.equal((_ref242 = (_robin2 = robin, (_ref243 = _, _$assoc7 = _ref243.assoc, function assoc(_argPlaceholder139) {
      return _$assoc7.call(_ref243, _argPlaceholder139, "surname", "Penn");
    })(_robin2)), (_ref244 = _, _$get24 = _ref244.get, function get(_argPlaceholder140) {
      return _$get24.call(_ref244, _argPlaceholder140, "surname");
    })(_ref242)), "Penn");
    assert.equal((_sean = sean, (_ref245 = _, _$get25 = _ref245.get, function get(_argPlaceholder141) {
      return _$get25.call(_ref245, _argPlaceholder141, "surname");
    })(_sean)), "Penn");
    assert.equal(_.count(robin), 3);
  });
  QUnit.test("cell", function (assert) {
    var _clicks, _source, _$inc5, _$swap, _ref246, _clicks2, _source2, _sink, _msink, _$get26, _ref247, _$lt2, _ref248, _bucket, _param38, _$$sub, _$4, _bucket2, _$conj6, _$swap3, _ref251, _$conj7, _ref252, _bucket3, _$conj8, _$swap4, _ref253, _$conj9, _ref254, _bucket5, _$assoc8, _$swap6, _ref257, _$assoc9, _ref258, _bucket6, _states2;

    var button = dom.tag('button');
    var tally = button("Tally");
    var clicks = $.cell(0);
    tally.click();
    assert.equal((_clicks = clicks, _.deref(_clicks)), 0);
    var tallied = $.click(tally);
    $.sub(tallied, function () {
      _.swap(clicks, _.inc);
    });
    $.sub(tallied, _.noop);
    tally.click();

    _.dispose(tallied);

    tally.click();
    var source = $.cell(0);
    var sink = $.signal(t.map(_.inc), source);

    var msink = _.fmap(source, _.inc);

    _source = source, (_ref246 = _, _$swap = _ref246.swap, _$inc5 = _.inc, function swap(_argPlaceholder142) {
      return _$swap.call(_ref246, _argPlaceholder142, _$inc5);
    })(_source);
    assert.equal((_clicks2 = clicks, _.deref(_clicks2)), 1);
    assert.equal((_source2 = source, _.deref(_source2)), 1);
    assert.equal((_sink = sink, _.deref(_sink)), 2);
    assert.equal((_msink = msink, _.deref(_msink)), 2);
    var bucket = $.cell([], $.broadcast(), _.pipe((_ref247 = _, _$get26 = _ref247.get, function get(_argPlaceholder143) {
      return _$get26.call(_ref247, _argPlaceholder143, 'length');
    }), (_ref248 = _, _$lt2 = _ref248.lt, function lt(_argPlaceholder144) {
      return _$lt2.call(_ref248, _argPlaceholder144, 3);
    }))),
        states = $.cell([]);
    _bucket = bucket, (_$4 = $, _$$sub = _$4.sub, _param38 = function _param38(state) {
      var _states, _$conj4, _$swap2, _ref249, _state, _$conj5, _ref250;

      return _states = states, (_ref249 = _, _$swap2 = _ref249.swap, _$conj4 = (_ref250 = _, _$conj5 = _ref250.conj, _state = state, function conj(_argPlaceholder147) {
        return _$conj5.call(_ref250, _argPlaceholder147, _state);
      }), function swap(_argPlaceholder146) {
        return _$swap2.call(_ref249, _argPlaceholder146, _$conj4);
      })(_states);
    }, function sub(_argPlaceholder145) {
      return _$$sub.call(_$4, _argPlaceholder145, _param38);
    })(_bucket);
    _bucket2 = bucket, (_ref251 = _, _$swap3 = _ref251.swap, _$conj6 = (_ref252 = _, _$conj7 = _ref252.conj, function conj(_argPlaceholder149) {
      return _$conj7.call(_ref252, _argPlaceholder149, "ice");
    }), function swap(_argPlaceholder148) {
      return _$swap3.call(_ref251, _argPlaceholder148, _$conj6);
    })(_bucket2);
    _bucket3 = bucket, (_ref253 = _, _$swap4 = _ref253.swap, _$conj8 = (_ref254 = _, _$conj9 = _ref254.conj, function conj(_argPlaceholder151) {
      return _$conj9.call(_ref254, _argPlaceholder151, "champagne");
    }), function swap(_argPlaceholder150) {
      return _$swap4.call(_ref253, _argPlaceholder150, _$conj8);
    })(_bucket3);
    assert["throws"](function () {
      var _bucket4, _$conj10, _$swap5, _ref255, _$conj11, _ref256;

      _bucket4 = bucket, (_ref255 = _, _$swap5 = _ref255.swap, _$conj10 = (_ref256 = _, _$conj11 = _ref256.conj, function conj(_argPlaceholder153) {
        return _$conj11.call(_ref256, _argPlaceholder153, "soda");
      }), function swap(_argPlaceholder152) {
        return _$swap5.call(_ref255, _argPlaceholder152, _$conj10);
      })(_bucket4);
    });
    _bucket5 = bucket, (_ref257 = _, _$swap6 = _ref257.swap, _$assoc8 = (_ref258 = _, _$assoc9 = _ref258.assoc, function assoc(_argPlaceholder155) {
      return _$assoc9.call(_ref258, _argPlaceholder155, 1, "wine");
    }), function swap(_argPlaceholder154) {
      return _$swap6.call(_ref257, _argPlaceholder154, _$assoc8);
    })(_bucket5);
    assert.deepEqual((_bucket6 = bucket, _.deref(_bucket6)), ["ice", "wine"]);
    assert.deepEqual((_states2 = states, _.deref(_states2)), [[], ["ice"], ["ice", "champagne"], ["ice", "wine"]]);
  });
  QUnit.test("immutable updates", function (assert) {
    var _$nth, _ref259, _$nth2, _ref260, _$nth3, _ref261, _param39, _$conj12, _ref262, _param40, _$assocIn4, _ref263, _param41, _$assocIn5, _ref264, _duos, _param42, _$$sub2, _$5, _duos2, _txn, _$swap8, _ref267, _ref268, _states4, _duos3, _d, _get, _$isIdentical, _ref269, _d2, _get2, _$isIdentical2, _ref270, _d3, _get3, _$isIdentical3, _ref271;

    var duos = $.cell([["Hall", "Oates"], ["Laurel", "Hardy"]]),
        get0 = _.pipe(_.deref, (_ref259 = _, _$nth = _ref259.nth, function nth(_argPlaceholder156) {
      return _$nth.call(_ref259, _argPlaceholder156, 0);
    })),
        get1 = _.pipe(_.deref, (_ref260 = _, _$nth2 = _ref260.nth, function nth(_argPlaceholder157) {
      return _$nth2.call(_ref260, _argPlaceholder157, 1);
    })),
        get2 = _.pipe(_.deref, (_ref261 = _, _$nth3 = _ref261.nth, function nth(_argPlaceholder158) {
      return _$nth3.call(_ref261, _argPlaceholder158, 2);
    })),
        d0 = get0(duos),
        d1 = get1(duos),
        d2 = get2(duos),
        states = $.cell([]),
        txn = _.pipe((_ref262 = _, _$conj12 = _ref262.conj, _param39 = ["Andrew Ridgeley", "George Michaels"], function conj(_argPlaceholder159) {
      return _$conj12.call(_ref262, _argPlaceholder159, _param39);
    }), (_ref263 = _, _$assocIn4 = _ref263.assocIn, _param40 = [0, 0], function assocIn(_argPlaceholder160) {
      return _$assocIn4.call(_ref263, _argPlaceholder160, _param40, "Daryl");
    }), (_ref264 = _, _$assocIn5 = _ref264.assocIn, _param41 = [0, 1], function assocIn(_argPlaceholder161) {
      return _$assocIn5.call(_ref264, _argPlaceholder161, _param41, "John");
    }));

    _duos = duos, (_$5 = $, _$$sub2 = _$5.sub, _param42 = function _param42(state) {
      var _states3, _$conj13, _$swap7, _ref265, _state2, _$conj14, _ref266;

      return _states3 = states, (_ref265 = _, _$swap7 = _ref265.swap, _$conj13 = (_ref266 = _, _$conj14 = _ref266.conj, _state2 = state, function conj(_argPlaceholder164) {
        return _$conj14.call(_ref266, _argPlaceholder164, _state2);
      }), function swap(_argPlaceholder163) {
        return _$swap7.call(_ref265, _argPlaceholder163, _$conj13);
      })(_states3);
    }, function sub(_argPlaceholder162) {
      return _$$sub2.call(_$5, _argPlaceholder162, _param42);
    })(_duos);
    _duos2 = duos, (_ref267 = _, _$swap8 = _ref267.swap, _txn = txn, function swap(_argPlaceholder165) {
      return _$swap8.call(_ref267, _argPlaceholder165, _txn);
    })(_duos2);
    assert.equal((_ref268 = (_states4 = states, _.deref(_states4)), _.count(_ref268)), 2, "original + transaction");
    assert.deepEqual((_duos3 = duos, _.deref(_duos3)), [["Daryl", "John"], ["Laurel", "Hardy"], ["Andrew Ridgeley", "George Michaels"]]);
    assert.notOk((_d = d0, (_ref269 = _, _$isIdentical = _ref269.isIdentical, _get = get0(duos), function isIdentical(_argPlaceholder166) {
      return _$isIdentical.call(_ref269, _argPlaceholder166, _get);
    })(_d)), "new container for");
    assert.ok((_d2 = d1, (_ref270 = _, _$isIdentical2 = _ref270.isIdentical, _get2 = get1(duos), function isIdentical(_argPlaceholder167) {
      return _$isIdentical2.call(_ref270, _argPlaceholder167, _get2);
    })(_d2)), "original container untouched");
    assert.notOk((_d3 = d2, (_ref271 = _, _$isIdentical3 = _ref271.isIdentical, _get3 = get2(duos), function isIdentical(_argPlaceholder168) {
      return _$isIdentical3.call(_ref271, _argPlaceholder168, _get3);
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
    var _ILikePeanutbutter, _$split, _ref272, _q1w2e3r4t5y6u7i8o9p, _param43, _$split2, _ref273, _q1w2e3r4t5y6u7i8o9p2, _param44, _$split3, _ref274, _reading, _$subs, _ref275, _reading2, _$subs2, _ref276, _ref277, _$join, _ref278, _ref279, _$join2, _ref280, _ref281, _$join3, _ref282, _ref283, _$join4, _ref284;

    assert.deepEqual((_ILikePeanutbutter = "I like peanutbutter", (_ref272 = _, _$split = _ref272.split, function split(_argPlaceholder169) {
      return _$split.call(_ref272, _argPlaceholder169, " ");
    })(_ILikePeanutbutter)), ["I", "like", "peanutbutter"]);
    assert.deepEqual((_q1w2e3r4t5y6u7i8o9p = "q1w2e3r4t5y6u7i8o9p", (_ref273 = _, _$split2 = _ref273.split, _param43 = /\d/, function split(_argPlaceholder170) {
      return _$split2.call(_ref273, _argPlaceholder170, _param43);
    })(_q1w2e3r4t5y6u7i8o9p)), ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
    assert.deepEqual((_q1w2e3r4t5y6u7i8o9p2 = "q1w2e3r4t5y6u7i8o9p", (_ref274 = _, _$split3 = _ref274.split, _param44 = /\d/, function split(_argPlaceholder171) {
      return _$split3.call(_ref274, _argPlaceholder171, _param44, 4);
    })(_q1w2e3r4t5y6u7i8o9p2)), ["q", "w", "e", "r4t5y6u7i8o9p"]);
    assert.equal((_reading = "reading", (_ref275 = _, _$subs = _ref275.subs, function subs(_argPlaceholder172) {
      return _$subs.call(_ref275, _argPlaceholder172, 3);
    })(_reading)), "ding");
    assert.equal((_reading2 = "reading", (_ref276 = _, _$subs2 = _ref276.subs, function subs(_argPlaceholder173) {
      return _$subs2.call(_ref276, _argPlaceholder173, 0, 4);
    })(_reading2)), "read");
    assert.equal((_ref277 = ["spam", null, "eggs", "", "spam"], (_ref278 = _, _$join = _ref278.join, function join(_argPlaceholder174) {
      return _$join.call(_ref278, ", ", _argPlaceholder174);
    })(_ref277)), "spam, , eggs, , spam");
    assert.equal((_ref279 = [1, 2, 3], (_ref280 = _, _$join2 = _ref280.join, function join(_argPlaceholder175) {
      return _$join2.call(_ref280, ", ", _argPlaceholder175);
    })(_ref279)), "1, 2, 3");
    assert.equal((_ref281 = ["ace", "king", "queen"], (_ref282 = _, _$join3 = _ref282.join, function join(_argPlaceholder176) {
      return _$join3.call(_ref282, "-", _argPlaceholder176);
    })(_ref281)), "ace-king-queen");
    assert.equal((_ref283 = ["hello", " ", "world"], (_ref284 = _, _$join4 = _ref284.join, function join(_argPlaceholder177) {
      return _$join4.call(_ref284, "", _argPlaceholder177);
    })(_ref283)), "hello world");
  });
  QUnit.test("min/max", function (assert) {
    assert.equal(_.min(-9, 9, 0), -9);
    assert.equal(_.max(-9, 9, 0), 9);
  });
  QUnit.test("indexed-seq", function (assert) {
    var _letters, _letters2, _$nth4, _ref285, _nums, _nums2, _$nth5, _ref286, _nums3, _nums4, _$IReduce, _$satisfies, _ref287, _nums5, _$add13, _$reduce, _ref288;

    var nums = _.indexedSeq([11, 12, 13, 14], 1);

    var letters = _.indexedSeq(_.split("grace", ""));

    assert.equal((_letters = letters, _.first(_letters)), "g");
    assert.equal((_letters2 = letters, (_ref285 = _, _$nth4 = _ref285.nth, function nth(_argPlaceholder178) {
      return _$nth4.call(_ref285, _argPlaceholder178, 2);
    })(_letters2)), "a");
    assert.equal((_nums = nums, _.first(_nums)), 12);
    assert.equal((_nums2 = nums, (_ref286 = _, _$nth5 = _ref286.nth, function nth(_argPlaceholder179) {
      return _$nth5.call(_ref286, _argPlaceholder179, 1);
    })(_nums2)), 13);
    assert.equal((_nums3 = nums, _.count(_nums3)), 3);
    assert.ok((_nums4 = nums, (_ref287 = _, _$satisfies = _ref287.satisfies, _$IReduce = _.IReduce, function satisfies(_argPlaceholder180) {
      return _$satisfies.call(_ref287, _$IReduce, _argPlaceholder180);
    })(_nums4)));
    assert.equal((_nums5 = nums, (_ref288 = _, _$reduce = _ref288.reduce, _$add13 = _.add, function reduce(_argPlaceholder181) {
      return _$reduce.call(_ref288, _$add13, 0, _argPlaceholder181);
    })(_nums5)), 39);
  });
  QUnit.test("equality", function (assert) {
    var _Curly, _$eq, _ref289, _Curlers, _$eq2, _ref290, _Curlers2, _$notEq, _ref291, _5, _$eq3, _ref292, _ref293, _param45, _$eq4, _ref294, _ref295, _param46, _$eq5, _ref296, _ref297, _param47, _$eq6, _ref298, _fname$lname, _fname$lname2, _$eq7, _ref299, _fname$middle$lname, _fname$lname3, _$eq8, _ref300;

    assert.ok((_Curly = "Curly", (_ref289 = _, _$eq = _ref289.eq, function eq(_argPlaceholder182) {
      return _$eq.call(_ref289, _argPlaceholder182, "Curly");
    })(_Curly)), "Equal strings");
    assert.notOk((_Curlers = "Curlers", (_ref290 = _, _$eq2 = _ref290.eq, function eq(_argPlaceholder183) {
      return _$eq2.call(_ref290, _argPlaceholder183, "Curly");
    })(_Curlers)), "Unequal strings");
    assert.ok((_Curlers2 = "Curlers", (_ref291 = _, _$notEq = _ref291.notEq, function notEq(_argPlaceholder184) {
      return _$notEq.call(_ref291, _argPlaceholder184, "Curly");
    })(_Curlers2)), "Unequal strings");

    var rng = _.range(3);

    assert.ok(_.eq(rng, rng, _.range(3), rng, [0, 1, 2], rng, _.cons(0, _.range(1, 3)), _.initial(_.range(4))), "Communicative sequences");
    assert.ok((_5 = 45, (_ref292 = _, _$eq3 = _ref292.eq, function eq(_argPlaceholder185) {
      return _$eq3.call(_ref292, _argPlaceholder185, 45);
    })(_5)), "Equal numbers");
    assert.ok((_ref293 = [1, 2, 3], (_ref294 = _, _$eq4 = _ref294.eq, _param45 = [1, 2, 3], function eq(_argPlaceholder186) {
      return _$eq4.call(_ref294, _argPlaceholder186, _param45);
    })(_ref293)), "Equal arrays");
    assert.notOk((_ref295 = [1, 2, 3], (_ref296 = _, _$eq5 = _ref296.eq, _param46 = [2, 3], function eq(_argPlaceholder187) {
      return _$eq5.call(_ref296, _argPlaceholder187, _param46);
    })(_ref295)), "Unequal arrays");
    assert.notOk((_ref297 = [1, 2, 3], (_ref298 = _, _$eq6 = _ref298.eq, _param47 = [3, 2, 1], function eq(_argPlaceholder188) {
      return _$eq6.call(_ref298, _argPlaceholder188, _param47);
    })(_ref297)), "Unequal arrays");
    assert.ok((_fname$lname = {
      fname: "Moe",
      lname: "Howard"
    }, (_ref299 = _, _$eq7 = _ref299.eq, _fname$lname2 = {
      fname: "Moe",
      lname: "Howard"
    }, function eq(_argPlaceholder189) {
      return _$eq7.call(_ref299, _argPlaceholder189, _fname$lname2);
    })(_fname$lname)), "Equal objects");
    assert.notOk((_fname$middle$lname = {
      fname: "Moe",
      middle: "Harry",
      lname: "Howard"
    }, (_ref300 = _, _$eq8 = _ref300.eq, _fname$lname3 = {
      fname: "Moe",
      lname: "Howard"
    }, function eq(_argPlaceholder190) {
      return _$eq8.call(_ref300, _argPlaceholder190, _fname$lname3);
    })(_fname$middle$lname)), "Unequal objects");
  });
  QUnit.test("coersion", function (assert) {
    var _ref301, _Moe$Curly;

    assert.deepEqual((_ref301 = [["Moe", "Howard"], ["Curly", "Howard"]], _.toObject(_ref301)), {
      Moe: "Howard",
      Curly: "Howard"
    });
    assert.deepEqual((_Moe$Curly = {
      Moe: "Howard",
      Curly: "Howard"
    }, _.toArray(_Moe$Curly)), [["Moe", "Howard"], ["Curly", "Howard"]]);
  });
  QUnit.test("predicates", function (assert) {
    var _ace$king$queen2, _ace$king, _$matches, _ref302;

    assert.ok((_ace$king$queen2 = {
      ace: 1,
      king: 2,
      queen: 3
    }, (_ref302 = _, _$matches = _ref302.matches, _ace$king = {
      ace: 1,
      king: 2
    }, function matches(_argPlaceholder191) {
      return _$matches.call(_ref302, _argPlaceholder191, _ace$king);
    })(_ace$king$queen2)));
    assert.equal(_.any(3, 1), 3);
    assert.equal(_.any(null, 1), 1);
    assert.equal(_.all(3, 1), 1);
    assert.equal(_.all(null, 1), null);
  });

});
