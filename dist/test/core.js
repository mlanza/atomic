define(['atomic/core', 'atomic/immutables', 'atomic/dom', 'atomic/reactives', 'atomic/validates', 'atomic/transducers', 'atomic/transients', 'qunit'], function (_, I, dom, $, vd, t, mut, QUnit) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var ___namespace = /*#__PURE__*/_interopNamespace(_);
  var I__namespace = /*#__PURE__*/_interopNamespace(I);
  var dom__namespace = /*#__PURE__*/_interopNamespace(dom);
  var $__namespace = /*#__PURE__*/_interopNamespace($);
  var vd__namespace = /*#__PURE__*/_interopNamespace(vd);
  var t__namespace = /*#__PURE__*/_interopNamespace(t);
  var mut__namespace = /*#__PURE__*/_interopNamespace(mut);
  var QUnit__default = /*#__PURE__*/_interopDefaultLegacy(QUnit);

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
  QUnit__default['default'].test("router & multimethod", function (assert) {
    var _$$handler, _mut$conj, _mut, _$str, _ref, _$$handler2, _mut$conj2, _mut2, _$mult, _ref2, _mut$method, _mut$conj3, _mut3, _$str2, _ref3, _mut$method2, _mut$conj4, _mut4, _$mult2, _ref4;

    //not just for fns!
    var f = ___namespace.doto($__namespace.router(), ( //router handlers need not be (but can be) fns
    _mut = mut__namespace, _mut$conj = _mut.conj, _$$handler = $__namespace.handler(___namespace.signature(___namespace.isString), (_ref = ___namespace, _$str = _ref.str, function str(_argPlaceholder2) {
      return _$str.call(_ref, _argPlaceholder2, "!");
    }), ___namespace.apply), function conj(_argPlaceholder) {
      return _mut$conj.call(_mut, _argPlaceholder, _$$handler);
    }), ( //use apply to spread the message against the pred and callback
    _mut2 = mut__namespace, _mut$conj2 = _mut2.conj, _$$handler2 = $__namespace.handler(___namespace.signature(___namespace.isNumber), (_ref2 = ___namespace, _$mult = _ref2.mult, function mult(_argPlaceholder4) {
      return _$mult.call(_ref2, _argPlaceholder4, 2);
    }), ___namespace.apply), function conj(_argPlaceholder3) {
      return _mut$conj2.call(_mut2, _argPlaceholder3, _$$handler2);
    }));

    var g = ___namespace.doto(mut__namespace.multimethod(), ( //multimethod handlers must be fns
    _mut3 = mut__namespace, _mut$conj3 = _mut3.conj, _mut$method = mut__namespace.method(___namespace.signature(___namespace.isString), (_ref3 = ___namespace, _$str2 = _ref3.str, function str(_argPlaceholder6) {
      return _$str2.call(_ref3, _argPlaceholder6, "!");
    })), function conj(_argPlaceholder5) {
      return _mut$conj3.call(_mut3, _argPlaceholder5, _mut$method);
    }), ( //as a multimethod always dispatches to fns, apply is a given and need not be specified.
    _mut4 = mut__namespace, _mut$conj4 = _mut4.conj, _mut$method2 = mut__namespace.method(___namespace.signature(___namespace.isNumber), (_ref4 = ___namespace, _$mult2 = _ref4.mult, function mult(_argPlaceholder8) {
      return _$mult2.call(_ref4, _argPlaceholder8, 2);
    })), function conj(_argPlaceholder7) {
      return _mut$conj4.call(_mut4, _argPlaceholder7, _mut$method2);
    }));

    assert.equal($__namespace.dispatch(f, [1]), 2);
    assert.equal($__namespace.dispatch(f, ["timber"]), "timber!");
    assert.equal($__namespace.dispatch(g, [1]), 2);
    assert.equal($__namespace.dispatch(g, ["timber"]), "timber!");
    assert.equal(g(1), 2);
    assert.equal(g("timber"), "timber!");
  });
  QUnit__default['default'].test("validation", function (assert) {
    var _Date, _$lt, _ref5;

    var zipCode = /^\d{5}(-\d{1,4})?$/;
    var birth = "7/10/1926";
    var past = vd__namespace.or(Date, vd__namespace.anno({
      type: "past"
    }, (_ref5 = ___namespace, _$lt = _ref5.lt, _Date = new Date(), function lt(_argPlaceholder9) {
      return _$lt.call(_ref5, _argPlaceholder9, _Date);
    })));
    var herman = {
      name: ["Herman", "Munster"],
      status: "married",
      dob: new Date(birth)
    };
    var person = vd__namespace.and(vd__namespace.required('name', vd__namespace.and(vd__namespace.collOf(String), vd__namespace.card(2, 2))), vd__namespace.optional('status', vd__namespace.and(String, vd__namespace.choice(["single", "married", "divorced"]))), vd__namespace.optional('dob', past));

    var _vd$check = vd__namespace.check(person, ___namespace.assoc(herman, "dob", birth)),
        _vd$check2 = _slicedToArray(_vd$check, 1),
        dob = _vd$check2[0];

    var _vd$check3 = vd__namespace.check(person, ___namespace.assoc(herman, "name", [1])),
        _vd$check4 = _slicedToArray(_vd$check3, 2),
        name = _vd$check4[0],
        names = _vd$check4[1];

    var _vd$check5 = vd__namespace.check(person, ___namespace.dissoc(herman, "name")),
        _vd$check6 = _slicedToArray(_vd$check5, 1),
        anon = _vd$check6[0];

    var _vd$check7 = vd__namespace.check(person, ___namespace.assoc(herman, "status", "separated")),
        _vd$check8 = _slicedToArray(_vd$check7, 1),
        status = _vd$check8[0];

    assert.ok(vd__namespace.check(zipCode, "17055") == null);
    assert.ok(vd__namespace.check(zipCode, 17055) == null);
    assert.ok(vd__namespace.check(zipCode, "17055-0001") == null);
    assert.ok(vd__namespace.check(zipCode, "") != null);
    assert.ok(vd__namespace.check(zipCode, null) != null);
    assert.ok(vd__namespace.check(zipCode, "1705x-0001") != null);
    assert.ok(vd__namespace.check(Number, "7") != null);
    assert.ok(vd__namespace.check(Number, parseInt, "7") == null);
    assert.ok(vd__namespace.check(vd__namespace.range("start", "end"), {
      start: 1,
      end: 5
    }) == null);
    assert.ok(vd__namespace.check(vd__namespace.range("start", "end"), {
      start: 1,
      end: 1
    }) == null);
    assert.ok(vd__namespace.check(vd__namespace.range("start", "end"), {
      start: 5,
      end: 1
    }) != null);
    assert.ok(dob.constraint === Date);
    assert.ok(name.constraint === String);
    assert.ok(names != null);
    assert.ok(anon.constraint instanceof vd__namespace.Required);
    assert.ok(status != null); //TODO add `when` to validate conditiontionally or allow condition to be checked before registering the validation?
  });
  QUnit__default['default'].test("component", function (assert) {
    var _type$args, _$$dispatch, _$, _type$args2, _$$dispatch2, _$2, _type$args3, _$$dispatch3, _$3;

    var people = ___namespace.doto($__namespace.component($__namespace.cell([]), function (accepts, raises, affects) {
      return [{
        "add": accepts("added")
      }, {
        "added": affects(___namespace.conj)
      }];
    }), (_$ = $__namespace, _$$dispatch = _$.dispatch, _type$args = {
      type: "add",
      args: [{
        name: "Moe"
      }]
    }, function dispatch(_argPlaceholder10) {
      return _$$dispatch.call(_$, _argPlaceholder10, _type$args);
    }), (_$2 = $__namespace, _$$dispatch2 = _$2.dispatch, _type$args2 = {
      type: "add",
      args: [{
        name: "Curly"
      }]
    }, function dispatch(_argPlaceholder11) {
      return _$$dispatch2.call(_$2, _argPlaceholder11, _type$args2);
    }), (_$3 = $__namespace, _$$dispatch3 = _$3.dispatch, _type$args3 = {
      type: "add",
      args: [{
        name: "Shemp"
      }]
    }, function dispatch(_argPlaceholder12) {
      return _$$dispatch3.call(_$3, _argPlaceholder12, _type$args3);
    }));

    assert.equal(___namespace.count(___namespace.deref(people)), 3);
  });
  QUnit__default['default'].test("dom", function (assert) {
    var _div, _dom$append, _dom, _dom$element, _dom$append2, _dom2, _$get, _ref6, _$get2, _ref7, _param, _$map, _ref8, _ref11, _stooges, _dom$sel, _dom3, _ref12, _ref13, _duo, _ref14, _ref15, _duo2, _ref16, _stooges2, _moe, _ref17, _ref18, _stooges3, _dom$sel2, _dom4, _$get3, _$map2, _ref19, _$get4, _ref20, _ref21, _givenName$surname, _mut$conj5, _mut5, _dom$attr, _dom5, _$get5, _ref22, _stooges4, _div2, _dom$append3, _dom6, _ref23, _ref24, _stooges5, _dom$sel3, _dom7, _ref25, _ref26, _stooges6, _dom$sel4, _dom8, _dom$text, _$map3, _ref27, _ref28, _stooges7, _dom$sel5, _dom9, _ref29, _greeting, _ref30, _greeting2, _$get6, _ref31, _ref32, _greeting3, _ref33, _stooges8, _dom$sel6, _dom10, _ref34, _branding;

    var _$mapa = ___namespace.mapa(___namespace.comp(___namespace.expands, dom__namespace.tag), ["ul", "li", "div", "span"]),
        _$mapa2 = _slicedToArray(_$mapa, 4),
        ul = _$mapa2[0],
        li = _$mapa2[1],
        div = _$mapa2[2],
        span = _$mapa2[3];

    var duo = ___namespace.doto(dom__namespace.fragment(), (_dom = dom__namespace, _dom$append = _dom.append, _div = div("Abbott"), function append(_argPlaceholder13) {
      return _dom$append.call(_dom, _argPlaceholder13, _div);
    }), (_dom2 = dom__namespace, _dom$append2 = _dom2.append, _dom$element = dom__namespace.element("div", "Costello"), function append(_argPlaceholder14) {
      return _dom$append2.call(_dom2, _argPlaceholder14, _dom$element);
    }));

    var who = div((_ref6 = ___namespace, _$get = _ref6.get, function get(_argPlaceholder15) {
      return _$get.call(_ref6, _argPlaceholder15, "givenName");
    }), " ", (_ref7 = ___namespace, _$get2 = _ref7.get, function get(_argPlaceholder16) {
      return _$get2.call(_ref7, _argPlaceholder16, "surname");
    }));
    var template = ul((_ref8 = ___namespace, _$map = _ref8.map, _param = function _param(_ref9) {
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
    var moe = (_ref11 = (_stooges = stooges, (_dom3 = dom__namespace, _dom$sel = _dom3.sel, function sel(_argPlaceholder18) {
      return _dom$sel.call(_dom3, "li", _argPlaceholder18);
    })(_stooges)), ___namespace.first(_ref11));
    assert.equal((_ref12 = (_ref13 = (_duo = duo, ___namespace.children(_duo)), ___namespace.first(_ref13)), dom__namespace.text(_ref12)), "Abbott");
    assert.equal((_ref14 = (_ref15 = (_duo2 = duo, ___namespace.children(_duo2)), ___namespace.second(_ref15)), dom__namespace.text(_ref14)), "Costello");
    assert.equal((_ref16 = (_stooges2 = stooges, ___namespace.leaves(_stooges2)), ___namespace.count(_ref16)), 3);
    assert.equal((_moe = moe, dom__namespace.text(_moe)), "Moe Howard", "Found by tag");
    assert.deepEqual((_ref17 = (_ref18 = (_stooges3 = stooges, (_dom4 = dom__namespace, _dom$sel2 = _dom4.sel, function sel(_argPlaceholder19) {
      return _dom$sel2.call(_dom4, "li", _argPlaceholder19);
    })(_stooges3)), (_ref19 = ___namespace, _$map2 = _ref19.map, _$get3 = (_ref20 = ___namespace, _$get4 = _ref20.get, function get(_argPlaceholder21) {
      return _$get4.call(_ref20, _argPlaceholder21, "id");
    }), function map(_argPlaceholder20) {
      return _$map2.call(_ref19, _$get3, _argPlaceholder20);
    })(_ref18)), ___namespace.toArray(_ref17)), ["moe", "curly", "larry"], "Extracted ids");
    assert.equal((_ref21 = (_givenName$surname = {
      givenName: "Curly",
      surname: "Howard"
    }, who(_givenName$surname)), dom__namespace.text(_ref21)), "Curly Howard");
    assert.deepEqual(___namespace.fluent(moe, dom__namespace.classes, (_mut5 = mut__namespace, _mut$conj5 = _mut5.conj, function conj(_argPlaceholder22) {
      return _mut$conj5.call(_mut5, _argPlaceholder22, "main");
    }), ___namespace.deref), ["main"]);
    assert.equal(___namespace.fluent(moe, (_dom5 = dom__namespace, _dom$attr = _dom5.attr, function attr(_argPlaceholder23) {
      return _dom$attr.call(_dom5, _argPlaceholder23, "data-tagged", "tests");
    }), (_ref22 = ___namespace, _$get5 = _ref22.get, function get(_argPlaceholder24) {
      return _$get5.call(_ref22, _argPlaceholder24, "data-tagged");
    })), "tests");
    _stooges4 = stooges, (_dom6 = dom__namespace, _dom$append3 = _dom6.append, _div2 = div({
      id: 'branding'
    }, span("Three Blind Mice")), function append(_argPlaceholder25) {
      return _dom$append3.call(_dom6, _argPlaceholder25, _div2);
    })(_stooges4);
    assert.ok((_ref23 = (_ref24 = (_stooges5 = stooges, (_dom7 = dom__namespace, _dom$sel3 = _dom7.sel, function sel(_argPlaceholder26) {
      return _dom$sel3.call(_dom7, "#branding", _argPlaceholder26);
    })(_stooges5)), ___namespace.first(_ref24)), _ref23 instanceof HTMLDivElement), "Found by id");
    assert.deepEqual((_ref25 = (_ref26 = (_stooges6 = stooges, (_dom8 = dom__namespace, _dom$sel4 = _dom8.sel, function sel(_argPlaceholder27) {
      return _dom$sel4.call(_dom8, "#branding span", _argPlaceholder27);
    })(_stooges6)), (_ref27 = ___namespace, _$map3 = _ref27.map, _dom$text = dom__namespace.text, function map(_argPlaceholder28) {
      return _$map3.call(_ref27, _dom$text, _argPlaceholder28);
    })(_ref26)), ___namespace.first(_ref25)), "Three Blind Mice", "Read text content");
    var greeting = (_ref28 = (_stooges7 = stooges, (_dom9 = dom__namespace, _dom$sel5 = _dom9.sel, function sel(_argPlaceholder29) {
      return _dom$sel5.call(_dom9, "#branding span", _argPlaceholder29);
    })(_stooges7)), ___namespace.first(_ref28));
    dom__namespace.hide(greeting);
    assert.deepEqual((_ref29 = (_greeting = greeting, dom__namespace.style(_greeting)), ___namespace.deref(_ref29)), {
      display: "none"
    }, "Hidden");
    assert.equal((_ref30 = (_greeting2 = greeting, dom__namespace.style(_greeting2)), (_ref31 = ___namespace, _$get6 = _ref31.get, function get(_argPlaceholder30) {
      return _$get6.call(_ref31, _argPlaceholder30, "display");
    })(_ref30)), "none");
    dom__namespace.show(greeting);
    assert.deepEqual((_ref32 = (_greeting3 = greeting, dom__namespace.style(_greeting3)), ___namespace.deref(_ref32)), {}, "Shown");
    var branding = (_ref33 = (_stooges8 = stooges, (_dom10 = dom__namespace, _dom$sel6 = _dom10.sel, function sel(_argPlaceholder31) {
      return _dom$sel6.call(_dom10, "#branding", _argPlaceholder31);
    })(_stooges8)), ___namespace.first(_ref33));
    dom__namespace.yank(branding);
    assert.equal((_ref34 = (_branding = branding, ___namespace.parent(_branding)), ___namespace.first(_ref34)), null, "Removed");
  });
  QUnit__default['default'].test("lazy-seq", function (assert) {
    var effects = [],
        push = effects.push.bind(effects),
        xs = ___namespace.map(push, ___namespace.range(10)),
        nums = ___namespace.map(___namespace.identity, ___namespace.range(3)),
        blank = ___namespace.map(___namespace.identity, ___namespace.range(0));
        ___namespace.rest(nums);

    assert.ok(effects.length === 0);

    ___namespace.first(xs);

    assert.ok(effects.length === 1);

    ___namespace.first(xs);

    assert.ok(effects.length === 1);

    ___namespace.second(xs);

    assert.ok(effects.length === 2);

    ___namespace.doall(xs);

    assert.ok(effects.length === 10);
    assert.ok(___namespace.blank(blank));
    assert.ok(!___namespace.blank(nums));
    assert.ok(___namespace.rest(blank) instanceof ___namespace.EmptyList);
    assert.ok(___namespace.rest(nums) instanceof ___namespace.LazySeq);
    assert.ok(___namespace.seq(blank) == null);
    assert.ok(___namespace.seq(nums) != null);
    assert.deepEqual(___namespace.toArray(nums), [0, 1, 2]);
    assert.deepEqual(___namespace.toArray(blank), []);
  });
  QUnit__default['default'].test("transducers", function (assert) {
    var _ref35, _ref36, _param2, _$comp, _$into, _ref37, _ref38, _param3, _t$dedupe, _$into2, _ref39, _ref40, _param4, _t$filter, _$into3, _ref41;

    assert.deepEqual((_ref35 = (_ref36 = [1, 2, 3], ___namespace.cycle(_ref36)), (_ref37 = ___namespace, _$into = _ref37.into, _param2 = [], _$comp = ___namespace.comp(t__namespace.take(4), t__namespace.map(___namespace.inc)), function into(_argPlaceholder32) {
      return _$into.call(_ref37, _param2, _$comp, _argPlaceholder32);
    })(_ref35)), [2, 3, 4, 2]);
    assert.deepEqual((_ref38 = [1, 3, 2, 2, 3], (_ref39 = ___namespace, _$into2 = _ref39.into, _param3 = [], _t$dedupe = t__namespace.dedupe(), function into(_argPlaceholder33) {
      return _$into2.call(_ref39, _param3, _t$dedupe, _argPlaceholder33);
    })(_ref38)), [1, 3, 2, 3]);
    assert.deepEqual((_ref40 = [1, 3, 2, 2, 3], (_ref41 = ___namespace, _$into3 = _ref41.into, _param4 = [], _t$filter = t__namespace.filter(___namespace.isEven), function into(_argPlaceholder34) {
      return _$into3.call(_ref41, _param4, _t$filter, _argPlaceholder34);
    })(_ref40)), [2, 2]);
  });
  QUnit__default['default'].test("iinclusive", function (assert) {
    var _charlie, _param5, _$includes, _ref42, _charlie2, _param6, _$includes2, _ref43;

    var charlie = {
      name: "Charlie",
      iq: 120,
      hitpoints: 30
    };
    assert.ok((_charlie = charlie, (_ref42 = ___namespace, _$includes = _ref42.includes, _param5 = ["name", "Charlie"], function includes(_argPlaceholder35) {
      return _$includes.call(_ref42, _argPlaceholder35, _param5);
    })(_charlie)));
    assert.notOk((_charlie2 = charlie, (_ref43 = ___namespace, _$includes2 = _ref43.includes, _param6 = ["name", "Charles"], function includes(_argPlaceholder36) {
      return _$includes2.call(_ref43, _argPlaceholder36, _param6);
    })(_charlie2)));
  });
  QUnit__default['default'].test("ilookup", function (assert) {
    var _stooges9, _$get7, _ref44, _pieces, _$get8, _ref45, _worth, _param7, _$getIn, _ref46, _$get9, _ref47, _$assoc, _ref48, _$get10, _$get11, _$get12, _$fmap, _ref49, _$get13, _ref50, _$get14, _ref51, _$get15, _ref52, _$otherwise, _ref53, _moe2, _boris, _ref54, _ref55, _boris2, _$get16, _$get17, _$get18, _$fmap2, _ref56, _$get19, _ref57, _$get20, _ref58, _$get21, _ref59, _$otherwise2, _ref60, _boris3, _param8, _$getIn2, _ref61, _boris4, _param9, _$getIn3, _ref62, _boris5, _param10, _$assocIn, _ref63, _boris6, _param11, _$upperCase, _$updateIn, _ref64, _ref65, _$get22, _ref66;

    assert.equal((_stooges9 = stooges, (_ref44 = ___namespace, _$get7 = _ref44.get, function get(_argPlaceholder37) {
      return _$get7.call(_ref44, _argPlaceholder37, 2);
    })(_stooges9)), "Moe");
    assert.equal((_pieces = pieces, (_ref45 = ___namespace, _$get8 = _ref45.get, function get(_argPlaceholder38) {
      return _$get8.call(_ref45, _argPlaceholder38, "pawn");
    })(_pieces)), 1);
    assert.equal((_worth = worth, (_ref46 = ___namespace, _$getIn = _ref46.getIn, _param7 = ["pieces", "queen"], function getIn(_argPlaceholder39) {
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

    var givenName = ___namespace.overload(null, (_ref47 = ___namespace, _$get9 = _ref47.get, function get(_argPlaceholder40) {
      return _$get9.call(_ref47, _argPlaceholder40, "givenName");
    }), (_ref48 = ___namespace, _$assoc = _ref48.assoc, function assoc(_argPlaceholder41, _argPlaceholder42) {
      return _$assoc.call(_ref48, _argPlaceholder41, "givenName", _argPlaceholder42);
    })); //lens


    var getAddressLine1 = ___namespace.pipe(___namespace.maybe, (_ref49 = ___namespace, _$fmap = _ref49.fmap, _$get10 = (_ref50 = ___namespace, _$get13 = _ref50.get, function get(_argPlaceholder44) {
      return _$get13.call(_ref50, _argPlaceholder44, "address");
    }), _$get11 = (_ref51 = ___namespace, _$get14 = _ref51.get, function get(_argPlaceholder45) {
      return _$get14.call(_ref51, _argPlaceholder45, "lines");
    }), _$get12 = (_ref52 = ___namespace, _$get15 = _ref52.get, function get(_argPlaceholder46) {
      return _$get15.call(_ref52, _argPlaceholder46, 1);
    }), function fmap(_argPlaceholder43) {
      return _$fmap.call(_ref49, _argPlaceholder43, _$get10, _$get11, _$get12);
    }), (_ref53 = ___namespace, _$otherwise = _ref53.otherwise, function otherwise(_argPlaceholder47) {
      return _$otherwise.call(_ref53, _argPlaceholder47, "");
    }));

    assert.equal((_moe2 = moe, getAddressLine1(_moe2)), "");
    assert.equal((_boris = boris, getAddressLine1(_boris)), "Suite 401");
    assert.equal((_ref54 = (_ref55 = (_boris2 = boris, ___namespace.maybe(_boris2)), (_ref56 = ___namespace, _$fmap2 = _ref56.fmap, _$get16 = (_ref57 = ___namespace, _$get19 = _ref57.get, function get(_argPlaceholder49) {
      return _$get19.call(_ref57, _argPlaceholder49, "address");
    }), _$get17 = (_ref58 = ___namespace, _$get20 = _ref58.get, function get(_argPlaceholder50) {
      return _$get20.call(_ref58, _argPlaceholder50, "lines");
    }), _$get18 = (_ref59 = ___namespace, _$get21 = _ref59.get, function get(_argPlaceholder51) {
      return _$get21.call(_ref59, _argPlaceholder51, 1);
    }), function fmap(_argPlaceholder48) {
      return _$fmap2.call(_ref56, _argPlaceholder48, _$get16, _$get17, _$get18);
    })(_ref55)), (_ref60 = ___namespace, _$otherwise2 = _ref60.otherwise, function otherwise(_argPlaceholder52) {
      return _$otherwise2.call(_ref60, _argPlaceholder52, "");
    })(_ref54)), "Suite 401");
    assert.equal((_boris3 = boris, (_ref61 = ___namespace, _$getIn2 = _ref61.getIn, _param8 = ["address", "lines", 1], function getIn(_argPlaceholder53) {
      return _$getIn2.call(_ref61, _argPlaceholder53, _param8);
    })(_boris3)), "Suite 401");
    assert.equal((_boris4 = boris, (_ref62 = ___namespace, _$getIn3 = _ref62.getIn, _param9 = ["address", "lines", 2], function getIn(_argPlaceholder54) {
      return _$getIn3.call(_ref62, _argPlaceholder54, _param9);
    })(_boris4)), null);
    assert.deepEqual((_boris5 = boris, (_ref63 = ___namespace, _$assocIn = _ref63.assocIn, _param10 = ["address", "lines", 1], function assocIn(_argPlaceholder55) {
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
    assert.deepEqual((_boris6 = boris, (_ref64 = ___namespace, _$updateIn = _ref64.updateIn, _param11 = ["address", "lines", 1], _$upperCase = ___namespace.upperCase, function updateIn(_argPlaceholder56) {
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
    assert.equal((_ref65 = ["ace", "king", "queen"], (_ref66 = ___namespace, _$get22 = _ref66.get, function get(_argPlaceholder57) {
      return _$get22.call(_ref66, _argPlaceholder57, 2);
    })(_ref65)), "queen");
  });
  QUnit__default['default'].test("iassociative", function (assert) {
    var _stooges10, _$assoc2, _ref67, _stooges11, _$assoc3, _ref68, _court, _$assoc4, _ref69, _worth2, _param12, _$assocIn2, _ref70, _worth3, _param13, _Infinity, _$assocIn3, _ref71, _court2, _$add, _$update, _ref72, _2, _$add2, _ref73, _worth4, _param14, _$add3, _$updateIn2, _ref74, _3, _$add4, _ref75, _surname, _$assoc5, _ref76, _ref77, _$assoc6, _ref78;

    assert.equal((_stooges10 = stooges, (_ref67 = ___namespace, _$assoc2 = _ref67.assoc, function assoc(_argPlaceholder58) {
      return _$assoc2.call(_ref67, _argPlaceholder58, 0, "Larry");
    })(_stooges10)), stooges, "maintain referential equivalence");
    assert.deepEqual((_stooges11 = stooges, (_ref68 = ___namespace, _$assoc3 = _ref68.assoc, function assoc(_argPlaceholder59) {
      return _$assoc3.call(_ref68, _argPlaceholder59, 0, "Shemp");
    })(_stooges11)), ["Shemp", "Curly", "Moe"]);
    assert.deepEqual((_court = court, (_ref69 = ___namespace, _$assoc4 = _ref69.assoc, function assoc(_argPlaceholder60) {
      return _$assoc4.call(_ref69, _argPlaceholder60, "ace", 14);
    })(_court)), {
      jack: 11,
      queen: 12,
      king: 13,
      ace: 14
    });
    assert.deepEqual((_worth2 = worth, (_ref70 = ___namespace, _$assocIn2 = _ref70.assocIn, _param12 = ["court", "ace"], function assocIn(_argPlaceholder61) {
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
    assert.deepEqual((_worth3 = worth, (_ref71 = ___namespace, _$assocIn3 = _ref71.assocIn, _param13 = ["court", "king"], _Infinity = Infinity, function assocIn(_argPlaceholder62) {
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
    assert.deepEqual((_court2 = court, (_ref72 = ___namespace, _$update = _ref72.update, _$add = (_ref73 = ___namespace, _$add2 = _ref73.add, _2 = -10, function add(_argPlaceholder64) {
      return _$add2.call(_ref73, _argPlaceholder64, _2);
    }), function update(_argPlaceholder63) {
      return _$update.call(_ref72, _argPlaceholder63, "jack", _$add);
    })(_court2)), {
      jack: 1,
      queen: 12,
      king: 13
    });
    assert.deepEqual((_worth4 = worth, (_ref74 = ___namespace, _$updateIn2 = _ref74.updateIn, _param14 = ["court", "king"], _$add3 = (_ref75 = ___namespace, _$add4 = _ref75.add, _3 = -10, function add(_argPlaceholder66) {
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
    }, (_ref76 = ___namespace, _$assoc5 = _ref76.assoc, function assoc(_argPlaceholder67) {
      return _$assoc5.call(_ref76, _argPlaceholder67, "givenName", "Moe");
    })(_surname)), {
      givenName: "Moe",
      surname: "Howard"
    });
    assert.deepEqual((_ref77 = [1, 2, 3], (_ref78 = ___namespace, _$assoc6 = _ref78.assoc, function assoc(_argPlaceholder68) {
      return _$assoc6.call(_ref78, _argPlaceholder68, 1, 0);
    })(_ref77)), [1, 0, 3]);
  });
  QUnit__default['default'].test("icompare", function (assert) {
    assert.equal(___namespace.eq(1, 1, 1), true);
    assert.equal(___namespace.eq(1, "1", 1.0), false);
    assert.equal(___namespace.lt(1, 2, 3, 4), true);
    assert.equal(___namespace.lt(1, 6, 2, 3), false);
    assert.equal(___namespace.lte(1, 1, 2, 3, 3, 3), true);
    assert.equal(___namespace.notEq(1, 1, 2, 2, 3, 3), true);
    assert.equal(___namespace.notEq(3, 3, 3), false);
  });
  QUnit__default['default'].test("iset", function (assert) {
    var _ref79, _ref80, _ref81, _param15, _$union, _ref82, _ref83, _ref84, _ref85, _param16, _$difference, _ref86, _ref87, _param17, _$superset, _ref88, _ref89, _param18, _$superset2, _ref90;

    assert.deepEqual((_ref79 = (_ref80 = (_ref81 = [1, 2, 3], (_ref82 = ___namespace, _$union = _ref82.union, _param15 = [2, 3, 4], function union(_argPlaceholder69) {
      return _$union.call(_ref82, _argPlaceholder69, _param15);
    })(_ref81)), ___namespace.sort(_ref80)), ___namespace.toArray(_ref79)), [1, 2, 3, 4]);
    assert.deepEqual((_ref83 = (_ref84 = (_ref85 = [1, 2, 3, 4, 5], (_ref86 = ___namespace, _$difference = _ref86.difference, _param16 = [5, 2, 10], function difference(_argPlaceholder70) {
      return _$difference.call(_ref86, _argPlaceholder70, _param16);
    })(_ref85)), ___namespace.sort(_ref84)), ___namespace.toArray(_ref83)), [1, 3, 4]);
    assert.ok((_ref87 = [1, 2, 3], (_ref88 = ___namespace, _$superset = _ref88.superset, _param17 = [2, 3], function superset(_argPlaceholder71) {
      return _$superset.call(_ref88, _argPlaceholder71, _param17);
    })(_ref87)));
    assert.notOk((_ref89 = [1, 2, 3], (_ref90 = ___namespace, _$superset2 = _ref90.superset, _param18 = [2, 4], function superset(_argPlaceholder72) {
      return _$superset2.call(_ref90, _argPlaceholder72, _param18);
    })(_ref89)));
  });
  QUnit__default['default'].test("iappendable, iprependable", function (assert) {
    var _ref91, _$append, _ref92, _surname2, _param19, _$conj, _ref93, _ref94, _$append2, _ref95, _ref96, _$prepend, _ref97;

    assert.deepEqual((_ref91 = ["Moe"], (_ref92 = ___namespace, _$append = _ref92.append, function append(_argPlaceholder73) {
      return _$append.call(_ref92, _argPlaceholder73, "Howard");
    })(_ref91)), ["Moe", "Howard"]);
    assert.deepEqual((_surname2 = {
      surname: "Howard"
    }, (_ref93 = ___namespace, _$conj = _ref93.conj, _param19 = ['givenName', "Moe"], function conj(_argPlaceholder74) {
      return _$conj.call(_ref93, _argPlaceholder74, _param19);
    })(_surname2)), {
      givenName: "Moe",
      surname: "Howard"
    });
    assert.deepEqual((_ref94 = [1, 2], (_ref95 = ___namespace, _$append2 = _ref95.append, function append(_argPlaceholder75) {
      return _$append2.call(_ref95, _argPlaceholder75, 3);
    })(_ref94)), [1, 2, 3]);
    assert.deepEqual((_ref96 = [1, 2], (_ref97 = ___namespace, _$prepend = _ref97.prepend, function prepend(_argPlaceholder76) {
      return _$prepend.call(_ref97, _argPlaceholder76, 0);
    })(_ref96)), [0, 1, 2]);
  });
  QUnit__default['default'].test("sequences", function (assert) {
    var _ref98, _ref99, _ref100, _$take, _ref101, _ref102, _$positives, _$take2, _ref103, _ref104, _ref105, _$repeatedly, _ref106, _stooges12, _param20, _$concat, _ref107, _$range, _stooges13, _ref108, _$isEven, _$some, _ref109, _ref110, _$isEven2, _$notAny, _ref111, _ref112, _$isEven3, _$every, _ref113, _ref114, _ref115, _$dropLast, _ref116, _ref117, _stooges14, _ref118, _ref119, _ref120, _ref121, _pieces2, _param21, _$selectKeys, _ref122, _ref123, _ref124, _$repeat, _$positives2, _$interleave, _ref125, _ref126, _ref127, _param22, _$interleave2, _ref128, _ref129, _$isTrue, _$some2, _ref130, _ref131, _$isFalse, _$some3, _ref132, _ref133, _$isTrue2, _$some4, _ref134, _$range2, _param23, _$detect, _ref135, _$range3, _param24, _$every2, _ref136, _ref137, _ref138, _param25, _$into4, _ref139, _ref140, _$repeat2, _$take3, _ref141, _ref142, _ref143, _ref144, _ref145, _$interpose, _ref146, _ref147, _$repeat3, _$take4, _ref148, _ref149, _ref150, _ref151, _$repeat4, _$take5, _ref152, _$conj2, _ref153, _4, _$conj3, _ref154, _ref155, _$range4, _$take6, _ref156, _$range5, _$range6, _ref157, _ref158, _$range7, _$drop, _ref159, _$take7, _ref160, _ref161, _ref162, _$inc, _$map4, _ref163, _ref164, _$isEven4, _$some5, _ref165, _ref166, _$isEven5, _$detect2, _ref167, _$range8, _param26, _$some6, _ref168, _ace$king$queen, _param27, _$selectKeys2, _ref169, _Polo, _$into5, _ref170, _ref171, _ref172, _param28, _$filter, _ref173, _$into6, _ref174, _Polo2, _ref175, _ref176, _ref177, _$take8, _ref178, _ref179, _ref180, _ref181, _ref182, _ref183, _$range9, _$takeNth, _ref184, _ref185, _ref186, _$constantly, _$take9, _ref187, _ref188, _ref189, _$constantly2, _$take10, _ref190, _ref191, _$range10, _$take11, _ref192, _ref193, _$range11, _param29, _$filter2, _ref194, _ref195, _$range12, _param30, _$remove, _ref196, _ref197, _$range13, _param31, _$takeWhile, _ref198, _ref199, _$range14, _param32, _$dropWhile, _ref200, _ref201, _$range15, _$inc2, _$map5, _ref202, _ref203, _ref204, _$inc3, _$map6, _ref205, _ref206, _ref207, _ref208, _ref209, _param33, _$filter3, _ref210, _$inc4, _$map7, _ref211, _$take12, _ref212, _ref213, _$range16, _$take13, _ref214, _$range17, _ref215, _$repeat5, _$take14, _ref216, _ref217, _ref218, _param34, _param35, _$concat2, _ref219, _ref220, _ref221, _param36, _$keepIndexed, _ref222, _ref223, _ref224, _param37, _$mapIndexed, _ref225;

    assert.deepEqual((_ref98 = (_ref99 = (_ref100 = ["A", "B", "C"], ___namespace.cycle(_ref100)), (_ref101 = ___namespace, _$take = _ref101.take, function take(_argPlaceholder77) {
      return _$take.call(_ref101, 5, _argPlaceholder77);
    })(_ref99)), ___namespace.toArray(_ref98)), ["A", "B", "C", "A", "B"]);
    assert.deepEqual((_ref102 = (_$positives = ___namespace.positives, (_ref103 = ___namespace, _$take2 = _ref103.take, function take(_argPlaceholder78) {
      return _$take2.call(_ref103, 5, _argPlaceholder78);
    })(_$positives)), ___namespace.toArray(_ref102)), [1, 2, 3, 4, 5]);
    assert.deepEqual((_ref104 = (_ref105 = ["A", "B", "C"], ___namespace.rest(_ref105)), ___namespace.toArray(_ref104)), ["B", "C"]);
    assert.deepEqual((_$repeatedly = ___namespace.repeatedly(3, ___namespace.constantly(4)), ___namespace.toArray(_$repeatedly)), [4, 4, 4]);
    assert.deepEqual((_ref106 = (_stooges12 = stooges, (_ref107 = ___namespace, _$concat = _ref107.concat, _param20 = ["Shemp", "Corey"], function concat(_argPlaceholder79) {
      return _$concat.call(_ref107, _argPlaceholder79, _param20);
    })(_stooges12)), ___namespace.toArray(_ref106)), ["Larry", "Curly", "Moe", "Shemp", "Corey"]);
    assert.deepEqual((_$range = ___namespace.range(4), ___namespace.toArray(_$range)), [0, 1, 2, 3]);
    assert.equal((_stooges13 = stooges, ___namespace.second(_stooges13)), "Curly");
    assert.equal((_ref108 = [1, 2, 3], (_ref109 = ___namespace, _$some = _ref109.some, _$isEven = ___namespace.isEven, function some(_argPlaceholder80) {
      return _$some.call(_ref109, _$isEven, _argPlaceholder80);
    })(_ref108)), true);
    assert.equal((_ref110 = [1, 2, 3], (_ref111 = ___namespace, _$notAny = _ref111.notAny, _$isEven2 = ___namespace.isEven, function notAny(_argPlaceholder81) {
      return _$notAny.call(_ref111, _$isEven2, _argPlaceholder81);
    })(_ref110)), false);
    assert.equal((_ref112 = [2, 4, 6], (_ref113 = ___namespace, _$every = _ref113.every, _$isEven3 = ___namespace.isEven, function every(_argPlaceholder82) {
      return _$every.call(_ref113, _$isEven3, _argPlaceholder82);
    })(_ref112)), true);
    assert.deepEqual((_ref114 = (_ref115 = [9, 8, 7, 6, 5, 4, 3], (_ref116 = ___namespace, _$dropLast = _ref116.dropLast, function dropLast(_argPlaceholder83) {
      return _$dropLast.call(_ref116, 3, _argPlaceholder83);
    })(_ref115)), ___namespace.toArray(_ref114)), [9, 8, 7, 6]);
    assert.deepEqual((_ref117 = (_stooges14 = stooges, ___namespace.sort(_stooges14)), ___namespace.toArray(_ref117)), ["Curly", "Larry", "Moe"]);
    assert.deepEqual((_ref118 = (_ref119 = ["A", "B", ["C", "D"], ["E", ["F", "G"]]], ___namespace.flatten(_ref119)), ___namespace.toArray(_ref118)), ["A", "B", "C", "D", "E", "F", "G"]);
    assert.deepEqual((_ref120 = (_ref121 = [null, ""], ___namespace.flatten(_ref121)), ___namespace.toArray(_ref120)), [null, ""]);
    assert.deepEqual((_pieces2 = pieces, (_ref122 = ___namespace, _$selectKeys = _ref122.selectKeys, _param21 = ["pawn", "knight"], function selectKeys(_argPlaceholder84) {
      return _$selectKeys.call(_ref122, _argPlaceholder84, _param21);
    })(_pieces2)), {
      pawn: 1,
      knight: 3
    });
    assert.deepEqual((_ref123 = (_ref124 = ["A", "B", "C", "D", "E"], (_ref125 = ___namespace, _$interleave = _ref125.interleave, _$repeat = ___namespace.repeat("="), _$positives2 = ___namespace.positives, function interleave(_argPlaceholder85) {
      return _$interleave.call(_ref125, _argPlaceholder85, _$repeat, _$positives2);
    })(_ref124)), ___namespace.toArray(_ref123)), ["A", "=", 1, "B", "=", 2, "C", "=", 3, "D", "=", 4, "E", "=", 5]);
    assert.deepEqual((_ref126 = (_ref127 = [1, 2, 3], (_ref128 = ___namespace, _$interleave2 = _ref128.interleave, _param22 = [10, 11, 12], function interleave(_argPlaceholder86) {
      return _$interleave2.call(_ref128, _argPlaceholder86, _param22);
    })(_ref127)), ___namespace.toArray(_ref126)), [1, 10, 2, 11, 3, 12]);
    assert.equal((_ref129 = [false, true], (_ref130 = ___namespace, _$some2 = _ref130.some, _$isTrue = ___namespace.isTrue, function some(_argPlaceholder87) {
      return _$some2.call(_ref130, _$isTrue, _argPlaceholder87);
    })(_ref129)), true);
    assert.equal((_ref131 = [false, true], (_ref132 = ___namespace, _$some3 = _ref132.some, _$isFalse = ___namespace.isFalse, function some(_argPlaceholder88) {
      return _$some3.call(_ref132, _$isFalse, _argPlaceholder88);
    })(_ref131)), true);
    assert.equal((_ref133 = [false, false], (_ref134 = ___namespace, _$some4 = _ref134.some, _$isTrue2 = ___namespace.isTrue, function some(_argPlaceholder89) {
      return _$some4.call(_ref134, _$isTrue2, _argPlaceholder89);
    })(_ref133)), null);
    assert.equal((_$range2 = ___namespace.range(10), (_ref135 = ___namespace, _$detect = _ref135.detect, _param23 = function _param23(x) {
      return x > 5;
    }, function detect(_argPlaceholder90) {
      return _$detect.call(_ref135, _param23, _argPlaceholder90);
    })(_$range2)), 6);
    assert.notOk((_$range3 = ___namespace.range(10), (_ref136 = ___namespace, _$every2 = _ref136.every, _param24 = function _param24(x) {
      return x > 5;
    }, function every(_argPlaceholder91) {
      return _$every2.call(_ref136, _param24, _argPlaceholder91);
    })(_$range3)));
    assert.deepEqual((_ref137 = [1, 2, 3], ___namespace.empty(_ref137)), []);
    assert.deepEqual((_ref138 = null, (_ref139 = ___namespace, _$into4 = _ref139.into, _param25 = [], function into(_argPlaceholder92) {
      return _$into4.call(_ref139, _param25, _argPlaceholder92);
    })(_ref138)), []);
    assert.deepEqual((_ref140 = (_$repeat2 = ___namespace.repeat(1), (_ref141 = ___namespace, _$take3 = _ref141.take, function take(_argPlaceholder93) {
      return _$take3.call(_ref141, 2, _argPlaceholder93);
    })(_$repeat2)), ___namespace.toArray(_ref140)), [1, 1]);
    assert.deepEqual((_ref142 = (_ref143 = [1, 2, 3], ___namespace.butlast(_ref143)), ___namespace.toArray(_ref142)), [1, 2]);
    assert.deepEqual((_ref144 = (_ref145 = ["A", "B", "C"], (_ref146 = ___namespace, _$interpose = _ref146.interpose, function interpose(_argPlaceholder94) {
      return _$interpose.call(_ref146, "-", _argPlaceholder94);
    })(_ref145)), ___namespace.toArray(_ref144)), ["A", "-", "B", "-", "C"]);
    assert.deepEqual((_ref147 = (_$repeat3 = ___namespace.repeat(1), (_ref148 = ___namespace, _$take4 = _ref148.take, function take(_argPlaceholder95) {
      return _$take4.call(_ref148, 5, _argPlaceholder95);
    })(_$repeat3)), ___namespace.toArray(_ref147)), [1, 1, 1, 1, 1]);
    assert.deepEqual((_ref149 = (_ref150 = (_ref151 = (_$repeat4 = ___namespace.repeat(1), (_ref152 = ___namespace, _$take5 = _ref152.take, function take(_argPlaceholder96) {
      return _$take5.call(_ref152, 5, _argPlaceholder96);
    })(_$repeat4)), (_ref153 = ___namespace, _$conj2 = _ref153.conj, function conj(_argPlaceholder97) {
      return _$conj2.call(_ref153, _argPlaceholder97, 0);
    })(_ref151)), (_ref154 = ___namespace, _$conj3 = _ref154.conj, _4 = -1, function conj(_argPlaceholder98) {
      return _$conj3.call(_ref154, _argPlaceholder98, _4);
    })(_ref150)), ___namespace.toArray(_ref149)), [-1, 0, 1, 1, 1, 1, 1]);
    assert.deepEqual((_ref155 = (_$range4 = ___namespace.range(10), (_ref156 = ___namespace, _$take6 = _ref156.take, function take(_argPlaceholder99) {
      return _$take6.call(_ref156, 5, _argPlaceholder99);
    })(_$range4)), ___namespace.toArray(_ref155)), [0, 1, 2, 3, 4]);
    assert.deepEqual((_$range5 = ___namespace.range(-5, 5), ___namespace.toArray(_$range5)), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
    assert.deepEqual((_$range6 = ___namespace.range(-20, 100, 10), ___namespace.toArray(_$range6)), [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90]);
    assert.deepEqual((_ref157 = (_ref158 = (_$range7 = ___namespace.range(10), (_ref159 = ___namespace, _$drop = _ref159.drop, function drop(_argPlaceholder100) {
      return _$drop.call(_ref159, 3, _argPlaceholder100);
    })(_$range7)), (_ref160 = ___namespace, _$take7 = _ref160.take, function take(_argPlaceholder101) {
      return _$take7.call(_ref160, 3, _argPlaceholder101);
    })(_ref158)), ___namespace.toArray(_ref157)), [3, 4, 5]);
    assert.deepEqual((_ref161 = (_ref162 = [1, 2, 3], (_ref163 = ___namespace, _$map4 = _ref163.map, _$inc = ___namespace.inc, function map(_argPlaceholder102) {
      return _$map4.call(_ref163, _$inc, _argPlaceholder102);
    })(_ref162)), ___namespace.toArray(_ref161)), [2, 3, 4]);
    assert.equal((_ref164 = [1, 2, 3, 4], (_ref165 = ___namespace, _$some5 = _ref165.some, _$isEven4 = ___namespace.isEven, function some(_argPlaceholder103) {
      return _$some5.call(_ref165, _$isEven4, _argPlaceholder103);
    })(_ref164)), true);
    assert.equal((_ref166 = [1, 2, 3, 4], (_ref167 = ___namespace, _$detect2 = _ref167.detect, _$isEven5 = ___namespace.isEven, function detect(_argPlaceholder104) {
      return _$detect2.call(_ref167, _$isEven5, _argPlaceholder104);
    })(_ref166)), 2);
    assert.equal((_$range8 = ___namespace.range(10), (_ref168 = ___namespace, _$some6 = _ref168.some, _param26 = function _param26(x) {
      return x > 5;
    }, function some(_argPlaceholder105) {
      return _$some6.call(_ref168, _param26, _argPlaceholder105);
    })(_$range8)), true);
    assert.deepEqual((_ace$king$queen = {
      ace: 1,
      king: 2,
      queen: 3
    }, (_ref169 = ___namespace, _$selectKeys2 = _ref169.selectKeys, _param27 = ["ace", "king"], function selectKeys(_argPlaceholder106) {
      return _$selectKeys2.call(_ref169, _argPlaceholder106, _param27);
    })(_ace$king$queen)), {
      ace: 1,
      king: 2
    });
    assert.equal((_Polo = "Polo", (_ref170 = ___namespace, _$into5 = _ref170.into, function into(_argPlaceholder107) {
      return _$into5.call(_ref170, "Marco ", _argPlaceholder107);
    })(_Polo)), "Marco Polo");
    assert.deepEqual((_ref171 = (_ref172 = [5, 6, 7, 8, 9], (_ref173 = ___namespace, _$filter = _ref173.filter, _param28 = function _param28(x) {
      return x > 6;
    }, function filter(_argPlaceholder108) {
      return _$filter.call(_ref173, _param28, _argPlaceholder108);
    })(_ref172)), (_ref174 = ___namespace, _$into6 = _ref174.into, function into(_argPlaceholder109) {
      return _$into6.call(_ref174, "", _argPlaceholder109);
    })(_ref171)), "789");
    assert.deepEqual((_Polo2 = "Polo", ___namespace.toArray(_Polo2)), ["P", "o", "l", "o"]);
    assert.deepEqual((_ref175 = (_ref176 = (_ref177 = [1, 2, 3], ___namespace.cycle(_ref177)), (_ref178 = ___namespace, _$take8 = _ref178.take, function take(_argPlaceholder110) {
      return _$take8.call(_ref178, 7, _argPlaceholder110);
    })(_ref176)), ___namespace.toArray(_ref175)), [1, 2, 3, 1, 2, 3, 1]);
    assert.deepEqual((_ref179 = (_ref180 = [1, 2, 3, 3, 4, 4, 4, 5, 6, 6, 7], ___namespace.dedupe(_ref180)), ___namespace.toArray(_ref179)), [1, 2, 3, 4, 5, 6, 7]);
    assert.deepEqual((_ref181 = (_ref182 = [1, 2, 3, 1, 4, 3, 4, 3, 2, 2], I__namespace.distinct(_ref182)), ___namespace.toArray(_ref181)), [1, 2, 3, 4]);
    assert.deepEqual((_ref183 = (_$range9 = ___namespace.range(10), (_ref184 = ___namespace, _$takeNth = _ref184.takeNth, function takeNth(_argPlaceholder111) {
      return _$takeNth.call(_ref184, 2, _argPlaceholder111);
    })(_$range9)), ___namespace.toArray(_ref183)), [0, 2, 4, 6, 8]);
    assert.deepEqual((_ref185 = (_ref186 = (_$constantly = ___namespace.constantly(1), ___namespace.repeatedly(_$constantly)), (_ref187 = ___namespace, _$take9 = _ref187.take, function take(_argPlaceholder112) {
      return _$take9.call(_ref187, 0, _argPlaceholder112);
    })(_ref186)), ___namespace.toArray(_ref185)), []);
    assert.deepEqual((_ref188 = (_ref189 = (_$constantly2 = ___namespace.constantly(2), ___namespace.repeatedly(_$constantly2)), (_ref190 = ___namespace, _$take10 = _ref190.take, function take(_argPlaceholder113) {
      return _$take10.call(_ref190, 10, _argPlaceholder113);
    })(_ref189)), ___namespace.toArray(_ref188)), [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
    assert.deepEqual((_ref191 = (_$range10 = ___namespace.range(10), (_ref192 = ___namespace, _$take11 = _ref192.take, function take(_argPlaceholder114) {
      return _$take11.call(_ref192, 5, _argPlaceholder114);
    })(_$range10)), ___namespace.toArray(_ref191)), [0, 1, 2, 3, 4]);
    assert.deepEqual((_ref193 = (_$range11 = ___namespace.range(10), (_ref194 = ___namespace, _$filter2 = _ref194.filter, _param29 = function _param29(x) {
      return x > 5;
    }, function filter(_argPlaceholder115) {
      return _$filter2.call(_ref194, _param29, _argPlaceholder115);
    })(_$range11)), ___namespace.toArray(_ref193)), [6, 7, 8, 9]);
    assert.deepEqual((_ref195 = (_$range12 = ___namespace.range(10), (_ref196 = ___namespace, _$remove = _ref196.remove, _param30 = function _param30(x) {
      return x > 5;
    }, function remove(_argPlaceholder116) {
      return _$remove.call(_ref196, _param30, _argPlaceholder116);
    })(_$range12)), ___namespace.toArray(_ref195)), [0, 1, 2, 3, 4, 5]);
    assert.deepEqual((_ref197 = (_$range13 = ___namespace.range(10), (_ref198 = ___namespace, _$takeWhile = _ref198.takeWhile, _param31 = function _param31(x) {
      return x < 5;
    }, function takeWhile(_argPlaceholder117) {
      return _$takeWhile.call(_ref198, _param31, _argPlaceholder117);
    })(_$range13)), ___namespace.toArray(_ref197)), [0, 1, 2, 3, 4]);
    assert.deepEqual((_ref199 = (_$range14 = ___namespace.range(10), (_ref200 = ___namespace, _$dropWhile = _ref200.dropWhile, _param32 = function _param32(x) {
      return x > 5;
    }, function dropWhile(_argPlaceholder118) {
      return _$dropWhile.call(_ref200, _param32, _argPlaceholder118);
    })(_$range14)), ___namespace.toArray(_ref199)), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.deepEqual((_ref201 = (_$range15 = ___namespace.range(1, 5), (_ref202 = ___namespace, _$map5 = _ref202.map, _$inc2 = ___namespace.inc, function map(_argPlaceholder119) {
      return _$map5.call(_ref202, _$inc2, _argPlaceholder119);
    })(_$range15)), ___namespace.toArray(_ref201)), [2, 3, 4, 5]);
    assert.deepEqual((_ref203 = (_ref204 = [10, 11, 12], (_ref205 = ___namespace, _$map6 = _ref205.map, _$inc3 = ___namespace.inc, function map(_argPlaceholder120) {
      return _$map6.call(_ref205, _$inc3, _argPlaceholder120);
    })(_ref204)), ___namespace.toArray(_ref203)), [11, 12, 13]);
    assert.deepEqual((_ref206 = (_ref207 = (_ref208 = (_ref209 = [5, 6, 7, 8, 9], (_ref210 = ___namespace, _$filter3 = _ref210.filter, _param33 = function _param33(x) {
      return x > 6;
    }, function filter(_argPlaceholder121) {
      return _$filter3.call(_ref210, _param33, _argPlaceholder121);
    })(_ref209)), (_ref211 = ___namespace, _$map7 = _ref211.map, _$inc4 = ___namespace.inc, function map(_argPlaceholder122) {
      return _$map7.call(_ref211, _$inc4, _argPlaceholder122);
    })(_ref208)), (_ref212 = ___namespace, _$take12 = _ref212.take, function take(_argPlaceholder123) {
      return _$take12.call(_ref212, 2, _argPlaceholder123);
    })(_ref207)), ___namespace.toArray(_ref206)), [8, 9]);
    assert.deepEqual((_ref213 = (_$range16 = ___namespace.range(7, 15), (_ref214 = ___namespace, _$take13 = _ref214.take, function take(_argPlaceholder124) {
      return _$take13.call(_ref214, 10, _argPlaceholder124);
    })(_$range16)), ___namespace.toArray(_ref213)), [7, 8, 9, 10, 11, 12, 13, 14]);
    assert.deepEqual((_$range17 = ___namespace.range(5), ___namespace.toArray(_$range17)), [0, 1, 2, 3, 4]);
    assert.deepEqual((_ref215 = (_$repeat5 = ___namespace.repeat("X"), (_ref216 = ___namespace, _$take14 = _ref216.take, function take(_argPlaceholder125) {
      return _$take14.call(_ref216, 5, _argPlaceholder125);
    })(_$repeat5)), ___namespace.toArray(_ref215)), ["X", "X", "X", "X", "X"]);
    assert.deepEqual((_ref217 = (_ref218 = [1, 2], (_ref219 = ___namespace, _$concat2 = _ref219.concat, _param34 = [3, 4], _param35 = [5, 6], function concat(_argPlaceholder126) {
      return _$concat2.call(_ref219, _argPlaceholder126, _param34, _param35);
    })(_ref218)), ___namespace.toArray(_ref217)), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual((_ref220 = (_ref221 = ["a", "b", "c", "d", "e"], (_ref222 = ___namespace, _$keepIndexed = _ref222.keepIndexed, _param36 = function _param36(idx, value) {
      return ___namespace.isOdd(idx) ? value : null;
    }, function keepIndexed(_argPlaceholder127) {
      return _$keepIndexed.call(_ref222, _param36, _argPlaceholder127);
    })(_ref221)), ___namespace.toArray(_ref220)), ["b", "d"]);
    assert.deepEqual((_ref223 = (_ref224 = [10, 11, 12], (_ref225 = ___namespace, _$mapIndexed = _ref225.mapIndexed, _param37 = function _param37(idx, value) {
      return [idx, ___namespace.inc(value)];
    }, function mapIndexed(_argPlaceholder128) {
      return _$mapIndexed.call(_ref225, _param37, _argPlaceholder128);
    })(_ref224)), ___namespace.toArray(_ref223)), [[0, 11], [1, 12], [2, 13]]);
    assert.deepEqual(___namespace.everyPred(___namespace.isEven, function (x) {
      return x > 10;
    })(12, 14, 16), true);
    assert.equal(___namespace.maxKey(function (obj) {
      return obj["king"];
    }, pieces, court), pieces);
  });
  QUnit__default['default'].test("add/subtract", function (assert) {
    var _$zeros, _ref226, _$zeros2, _ref227, _$zeros3, _ref228, _christmas, _newYears, _ref229, _christmas2, _$days, _$add5, _ref230, _ref231, _christmas3, _$weeks, _$add6, _ref232, _ref233, _christmas4, _$months, _$add7, _ref234, _ref235, _christmas5, _$years, _$add8, _ref236, _ref237, _christmas6, _$years2, _$subtract, _ref238;

    var christmas = ___namespace.date(2017, 11, 25);

    var newYears = ___namespace.date(2018, 0, 1);

    var mmddyyyy = ___namespace.fmt(___namespace.comp((_ref226 = ___namespace, _$zeros = _ref226.zeros, function zeros(_argPlaceholder129) {
      return _$zeros.call(_ref226, _argPlaceholder129, 2);
    }), ___namespace.inc, ___namespace.month), "/", ___namespace.comp((_ref227 = ___namespace, _$zeros2 = _ref227.zeros, function zeros(_argPlaceholder130) {
      return _$zeros2.call(_ref227, _argPlaceholder130, 2);
    }), ___namespace.day), "/", ___namespace.comp((_ref228 = ___namespace, _$zeros3 = _ref228.zeros, function zeros(_argPlaceholder131) {
      return _$zeros3.call(_ref228, _argPlaceholder131, 4);
    }), ___namespace.year));

    assert.equal((_christmas = christmas, mmddyyyy(_christmas)), "12/25/2017");
    assert.equal((_newYears = newYears, mmddyyyy(_newYears)), "01/01/2018");
    assert.equal((_ref229 = (_christmas2 = christmas, (_ref230 = ___namespace, _$add5 = _ref230.add, _$days = ___namespace.days(1), function add(_argPlaceholder132) {
      return _$add5.call(_ref230, _argPlaceholder132, _$days);
    })(_christmas2)), ___namespace.deref(_ref229)), 1514264400000);
    assert.equal((_ref231 = (_christmas3 = christmas, (_ref232 = ___namespace, _$add6 = _ref232.add, _$weeks = ___namespace.weeks(1), function add(_argPlaceholder133) {
      return _$add6.call(_ref232, _argPlaceholder133, _$weeks);
    })(_christmas3)), ___namespace.deref(_ref231)), 1514782800000);
    assert.equal((_ref233 = (_christmas4 = christmas, (_ref234 = ___namespace, _$add7 = _ref234.add, _$months = ___namespace.months(1), function add(_argPlaceholder134) {
      return _$add7.call(_ref234, _argPlaceholder134, _$months);
    })(_christmas4)), ___namespace.deref(_ref233)), 1516856400000);
    assert.equal((_ref235 = (_christmas5 = christmas, (_ref236 = ___namespace, _$add8 = _ref236.add, _$years = ___namespace.years(1), function add(_argPlaceholder135) {
      return _$add8.call(_ref236, _argPlaceholder135, _$years);
    })(_christmas5)), ___namespace.deref(_ref235)), 1545714000000);
    assert.equal((_ref237 = (_christmas6 = christmas, (_ref238 = ___namespace, _$subtract = _ref238.subtract, _$years2 = ___namespace.years(1), function subtract(_argPlaceholder136) {
      return _$subtract.call(_ref238, _argPlaceholder136, _$years2);
    })(_christmas6)), ___namespace.deref(_ref237)), 1482642000000);
  });
  QUnit__default['default'].test("duration", function (assert) {
    var _ref239, _newYearsDay, _$hours, _$divide, _ref240, _$add9, _$add10, _$add11, _$add12;

    var newYearsEve = ___namespace.date(2019, 11, 31);

    var newYearsDay = ___namespace.period(___namespace.date(2020, 0, 1));

    assert.equal(___namespace.divide(___namespace.years(1), ___namespace.days(1)), 365.25);
    assert.equal(___namespace.divide(___namespace.days(1), ___namespace.hours(1)), 24);
    assert.equal((_ref239 = (_newYearsDay = newYearsDay, ___namespace.toDuration(_newYearsDay)), (_ref240 = ___namespace, _$divide = _ref240.divide, _$hours = ___namespace.hours(1), function divide(_argPlaceholder137) {
      return _$divide.call(_ref240, _argPlaceholder137, _$hours);
    })(_ref239)), 24);
    assert.equal((_$add9 = ___namespace.add(newYearsEve, 1), ___namespace.deref(_$add9)), 1577854800000);
    assert.equal((_$add10 = ___namespace.add(newYearsEve, ___namespace.days(1)), ___namespace.deref(_$add10)), 1577854800000);
    assert.equal((_$add11 = ___namespace.add(newYearsEve, ___namespace.years(-1)), ___namespace.deref(_$add11)), 1546232400000); //prior New Year's Eve

    assert.equal((_$add12 = ___namespace.add(newYearsEve, ___namespace.days(1), ___namespace.hours(7)), ___namespace.deref(_$add12)), 1577880000000); //7am New Year's Day
  });
  QUnit__default['default'].test("record", function (assert) {
    var _robin, _$get23, _ref241, _ref242, _robin2, _$assoc7, _ref243, _$get24, _ref244, _sean, _$get25, _ref245;

    function Person(name, surname, dob) {
      this.attrs = {
        name: name,
        surname: surname,
        dob: dob
      };
    }

    ___namespace.record(Person);

    var sean = new Person("Sean", "Penn", ___namespace.date(1960, 8, 17));
    var robin = Person.create("Robin", "Wright", new Date(1966, 3, 8));
    Person.from({
      name: "Dylan",
      surname: "Penn",
      dob: ___namespace.date(1991, 4, 13)
    });
    assert.equal((_robin = robin, (_ref241 = ___namespace, _$get23 = _ref241.get, function get(_argPlaceholder138) {
      return _$get23.call(_ref241, _argPlaceholder138, "surname");
    })(_robin)), "Wright");
    assert.equal((_ref242 = (_robin2 = robin, (_ref243 = ___namespace, _$assoc7 = _ref243.assoc, function assoc(_argPlaceholder139) {
      return _$assoc7.call(_ref243, _argPlaceholder139, "surname", "Penn");
    })(_robin2)), (_ref244 = ___namespace, _$get24 = _ref244.get, function get(_argPlaceholder140) {
      return _$get24.call(_ref244, _argPlaceholder140, "surname");
    })(_ref242)), "Penn");
    assert.equal((_sean = sean, (_ref245 = ___namespace, _$get25 = _ref245.get, function get(_argPlaceholder141) {
      return _$get25.call(_ref245, _argPlaceholder141, "surname");
    })(_sean)), "Penn");
    assert.equal(___namespace.count(robin), 3);
  });
  QUnit__default['default'].test("cell", function (assert) {
    var _clicks, _source, _$inc5, _$swap, _ref246, _clicks2, _source2, _sink, _msink, _$get26, _ref247, _$lt2, _ref248, _bucket, _param38, _$$sub, _$4, _bucket2, _$conj6, _$swap3, _ref251, _$conj7, _ref252, _bucket3, _$conj8, _$swap4, _ref253, _$conj9, _ref254, _bucket5, _$assoc8, _$swap6, _ref257, _$assoc9, _ref258, _bucket6, _states2;

    var button = dom__namespace.tag('button');
    var tally = button("Tally");
    var clicks = $__namespace.cell(0);
    tally.click();
    assert.equal((_clicks = clicks, ___namespace.deref(_clicks)), 0);
    var tallied = $__namespace.click(tally);
    $__namespace.sub(tallied, function () {
      ___namespace.swap(clicks, ___namespace.inc);
    });
    $__namespace.sub(tallied, ___namespace.noop);
    tally.click();

    ___namespace.dispose(tallied);

    tally.click();
    var source = $__namespace.cell(0);
    var sink = $__namespace.signal(t__namespace.map(___namespace.inc), source);

    var msink = ___namespace.fmap(source, ___namespace.inc);

    _source = source, (_ref246 = ___namespace, _$swap = _ref246.swap, _$inc5 = ___namespace.inc, function swap(_argPlaceholder142) {
      return _$swap.call(_ref246, _argPlaceholder142, _$inc5);
    })(_source);
    assert.equal((_clicks2 = clicks, ___namespace.deref(_clicks2)), 1);
    assert.equal((_source2 = source, ___namespace.deref(_source2)), 1);
    assert.equal((_sink = sink, ___namespace.deref(_sink)), 2);
    assert.equal((_msink = msink, ___namespace.deref(_msink)), 2);
    var bucket = $__namespace.cell([], $__namespace.broadcast(), ___namespace.pipe((_ref247 = ___namespace, _$get26 = _ref247.get, function get(_argPlaceholder143) {
      return _$get26.call(_ref247, _argPlaceholder143, 'length');
    }), (_ref248 = ___namespace, _$lt2 = _ref248.lt, function lt(_argPlaceholder144) {
      return _$lt2.call(_ref248, _argPlaceholder144, 3);
    }))),
        states = $__namespace.cell([]);
    _bucket = bucket, (_$4 = $__namespace, _$$sub = _$4.sub, _param38 = function _param38(state) {
      var _states, _$conj4, _$swap2, _ref249, _state, _$conj5, _ref250;

      return _states = states, (_ref249 = ___namespace, _$swap2 = _ref249.swap, _$conj4 = (_ref250 = ___namespace, _$conj5 = _ref250.conj, _state = state, function conj(_argPlaceholder147) {
        return _$conj5.call(_ref250, _argPlaceholder147, _state);
      }), function swap(_argPlaceholder146) {
        return _$swap2.call(_ref249, _argPlaceholder146, _$conj4);
      })(_states);
    }, function sub(_argPlaceholder145) {
      return _$$sub.call(_$4, _argPlaceholder145, _param38);
    })(_bucket);
    _bucket2 = bucket, (_ref251 = ___namespace, _$swap3 = _ref251.swap, _$conj6 = (_ref252 = ___namespace, _$conj7 = _ref252.conj, function conj(_argPlaceholder149) {
      return _$conj7.call(_ref252, _argPlaceholder149, "ice");
    }), function swap(_argPlaceholder148) {
      return _$swap3.call(_ref251, _argPlaceholder148, _$conj6);
    })(_bucket2);
    _bucket3 = bucket, (_ref253 = ___namespace, _$swap4 = _ref253.swap, _$conj8 = (_ref254 = ___namespace, _$conj9 = _ref254.conj, function conj(_argPlaceholder151) {
      return _$conj9.call(_ref254, _argPlaceholder151, "champagne");
    }), function swap(_argPlaceholder150) {
      return _$swap4.call(_ref253, _argPlaceholder150, _$conj8);
    })(_bucket3);
    assert["throws"](function () {
      var _bucket4, _$conj10, _$swap5, _ref255, _$conj11, _ref256;

      _bucket4 = bucket, (_ref255 = ___namespace, _$swap5 = _ref255.swap, _$conj10 = (_ref256 = ___namespace, _$conj11 = _ref256.conj, function conj(_argPlaceholder153) {
        return _$conj11.call(_ref256, _argPlaceholder153, "soda");
      }), function swap(_argPlaceholder152) {
        return _$swap5.call(_ref255, _argPlaceholder152, _$conj10);
      })(_bucket4);
    });
    _bucket5 = bucket, (_ref257 = ___namespace, _$swap6 = _ref257.swap, _$assoc8 = (_ref258 = ___namespace, _$assoc9 = _ref258.assoc, function assoc(_argPlaceholder155) {
      return _$assoc9.call(_ref258, _argPlaceholder155, 1, "wine");
    }), function swap(_argPlaceholder154) {
      return _$swap6.call(_ref257, _argPlaceholder154, _$assoc8);
    })(_bucket5);
    assert.deepEqual((_bucket6 = bucket, ___namespace.deref(_bucket6)), ["ice", "wine"]);
    assert.deepEqual((_states2 = states, ___namespace.deref(_states2)), [[], ["ice"], ["ice", "champagne"], ["ice", "wine"]]);
  });
  QUnit__default['default'].test("immutable updates", function (assert) {
    var _$nth, _ref259, _$nth2, _ref260, _$nth3, _ref261, _param39, _$conj12, _ref262, _param40, _$assocIn4, _ref263, _param41, _$assocIn5, _ref264, _duos, _param42, _$$sub2, _$5, _duos2, _txn, _$swap8, _ref267, _ref268, _states4, _duos3, _d, _get, _$isIdentical, _ref269, _d2, _get2, _$isIdentical2, _ref270, _d3, _get3, _$isIdentical3, _ref271;

    var duos = $__namespace.cell([["Hall", "Oates"], ["Laurel", "Hardy"]]),
        get0 = ___namespace.pipe(___namespace.deref, (_ref259 = ___namespace, _$nth = _ref259.nth, function nth(_argPlaceholder156) {
      return _$nth.call(_ref259, _argPlaceholder156, 0);
    })),
        get1 = ___namespace.pipe(___namespace.deref, (_ref260 = ___namespace, _$nth2 = _ref260.nth, function nth(_argPlaceholder157) {
      return _$nth2.call(_ref260, _argPlaceholder157, 1);
    })),
        get2 = ___namespace.pipe(___namespace.deref, (_ref261 = ___namespace, _$nth3 = _ref261.nth, function nth(_argPlaceholder158) {
      return _$nth3.call(_ref261, _argPlaceholder158, 2);
    })),
        d0 = get0(duos),
        d1 = get1(duos),
        d2 = get2(duos),
        states = $__namespace.cell([]),
        txn = ___namespace.pipe((_ref262 = ___namespace, _$conj12 = _ref262.conj, _param39 = ["Andrew Ridgeley", "George Michaels"], function conj(_argPlaceholder159) {
      return _$conj12.call(_ref262, _argPlaceholder159, _param39);
    }), (_ref263 = ___namespace, _$assocIn4 = _ref263.assocIn, _param40 = [0, 0], function assocIn(_argPlaceholder160) {
      return _$assocIn4.call(_ref263, _argPlaceholder160, _param40, "Daryl");
    }), (_ref264 = ___namespace, _$assocIn5 = _ref264.assocIn, _param41 = [0, 1], function assocIn(_argPlaceholder161) {
      return _$assocIn5.call(_ref264, _argPlaceholder161, _param41, "John");
    }));

    _duos = duos, (_$5 = $__namespace, _$$sub2 = _$5.sub, _param42 = function _param42(state) {
      var _states3, _$conj13, _$swap7, _ref265, _state2, _$conj14, _ref266;

      return _states3 = states, (_ref265 = ___namespace, _$swap7 = _ref265.swap, _$conj13 = (_ref266 = ___namespace, _$conj14 = _ref266.conj, _state2 = state, function conj(_argPlaceholder164) {
        return _$conj14.call(_ref266, _argPlaceholder164, _state2);
      }), function swap(_argPlaceholder163) {
        return _$swap7.call(_ref265, _argPlaceholder163, _$conj13);
      })(_states3);
    }, function sub(_argPlaceholder162) {
      return _$$sub2.call(_$5, _argPlaceholder162, _param42);
    })(_duos);
    _duos2 = duos, (_ref267 = ___namespace, _$swap8 = _ref267.swap, _txn = txn, function swap(_argPlaceholder165) {
      return _$swap8.call(_ref267, _argPlaceholder165, _txn);
    })(_duos2);
    assert.equal((_ref268 = (_states4 = states, ___namespace.deref(_states4)), ___namespace.count(_ref268)), 2, "original + transaction");
    assert.deepEqual((_duos3 = duos, ___namespace.deref(_duos3)), [["Daryl", "John"], ["Laurel", "Hardy"], ["Andrew Ridgeley", "George Michaels"]]);
    assert.notOk((_d = d0, (_ref269 = ___namespace, _$isIdentical = _ref269.isIdentical, _get = get0(duos), function isIdentical(_argPlaceholder166) {
      return _$isIdentical.call(_ref269, _argPlaceholder166, _get);
    })(_d)), "new container for");
    assert.ok((_d2 = d1, (_ref270 = ___namespace, _$isIdentical2 = _ref270.isIdentical, _get2 = get1(duos), function isIdentical(_argPlaceholder167) {
      return _$isIdentical2.call(_ref270, _argPlaceholder167, _get2);
    })(_d2)), "original container untouched");
    assert.notOk((_d3 = d2, (_ref271 = ___namespace, _$isIdentical3 = _ref271.isIdentical, _get3 = get2(duos), function isIdentical(_argPlaceholder168) {
      return _$isIdentical3.call(_ref271, _argPlaceholder168, _get3);
    })(_d3)), "created from nothing");
    assert.notOk(d2, "non-existent");
  });
  QUnit__default['default'].test("list", function (assert) {
    var _$list, _$list2, _$list3;

    assert.deepEqual((_$list = ___namespace.list(), ___namespace.toArray(_$list)), []);
    assert.deepEqual((_$list2 = ___namespace.list(0), ___namespace.toArray(_$list2)), [0]);
    assert.deepEqual((_$list3 = ___namespace.list(0, 1, 2), ___namespace.toArray(_$list3)), [0, 1, 2]);
  });
  QUnit__default['default'].test("strings", function (assert) {
    var _ILikePeanutbutter, _$split, _ref272, _q1w2e3r4t5y6u7i8o9p, _param43, _$split2, _ref273, _q1w2e3r4t5y6u7i8o9p2, _param44, _$split3, _ref274, _reading, _$subs, _ref275, _reading2, _$subs2, _ref276, _ref277, _$join, _ref278, _ref279, _$join2, _ref280, _ref281, _$join3, _ref282, _ref283, _$join4, _ref284;

    assert.deepEqual((_ILikePeanutbutter = "I like peanutbutter", (_ref272 = ___namespace, _$split = _ref272.split, function split(_argPlaceholder169) {
      return _$split.call(_ref272, _argPlaceholder169, " ");
    })(_ILikePeanutbutter)), ["I", "like", "peanutbutter"]);
    assert.deepEqual((_q1w2e3r4t5y6u7i8o9p = "q1w2e3r4t5y6u7i8o9p", (_ref273 = ___namespace, _$split2 = _ref273.split, _param43 = /\d/, function split(_argPlaceholder170) {
      return _$split2.call(_ref273, _argPlaceholder170, _param43);
    })(_q1w2e3r4t5y6u7i8o9p)), ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
    assert.deepEqual((_q1w2e3r4t5y6u7i8o9p2 = "q1w2e3r4t5y6u7i8o9p", (_ref274 = ___namespace, _$split3 = _ref274.split, _param44 = /\d/, function split(_argPlaceholder171) {
      return _$split3.call(_ref274, _argPlaceholder171, _param44, 4);
    })(_q1w2e3r4t5y6u7i8o9p2)), ["q", "w", "e", "r4t5y6u7i8o9p"]);
    assert.equal((_reading = "reading", (_ref275 = ___namespace, _$subs = _ref275.subs, function subs(_argPlaceholder172) {
      return _$subs.call(_ref275, _argPlaceholder172, 3);
    })(_reading)), "ding");
    assert.equal((_reading2 = "reading", (_ref276 = ___namespace, _$subs2 = _ref276.subs, function subs(_argPlaceholder173) {
      return _$subs2.call(_ref276, _argPlaceholder173, 0, 4);
    })(_reading2)), "read");
    assert.equal((_ref277 = ["spam", null, "eggs", "", "spam"], (_ref278 = ___namespace, _$join = _ref278.join, function join(_argPlaceholder174) {
      return _$join.call(_ref278, ", ", _argPlaceholder174);
    })(_ref277)), "spam, , eggs, , spam");
    assert.equal((_ref279 = [1, 2, 3], (_ref280 = ___namespace, _$join2 = _ref280.join, function join(_argPlaceholder175) {
      return _$join2.call(_ref280, ", ", _argPlaceholder175);
    })(_ref279)), "1, 2, 3");
    assert.equal((_ref281 = ["ace", "king", "queen"], (_ref282 = ___namespace, _$join3 = _ref282.join, function join(_argPlaceholder176) {
      return _$join3.call(_ref282, "-", _argPlaceholder176);
    })(_ref281)), "ace-king-queen");
    assert.equal((_ref283 = ["hello", " ", "world"], (_ref284 = ___namespace, _$join4 = _ref284.join, function join(_argPlaceholder177) {
      return _$join4.call(_ref284, "", _argPlaceholder177);
    })(_ref283)), "hello world");
  });
  QUnit__default['default'].test("min/max", function (assert) {
    assert.equal(___namespace.min(-9, 9, 0), -9);
    assert.equal(___namespace.max(-9, 9, 0), 9);
  });
  QUnit__default['default'].test("indexed-seq", function (assert) {
    var _letters, _letters2, _$nth4, _ref285, _nums, _nums2, _$nth5, _ref286, _nums3, _nums4, _$IReduce, _$satisfies, _ref287, _nums5, _$add13, _$reduce, _ref288;

    var nums = ___namespace.indexedSeq([11, 12, 13, 14], 1);

    var letters = ___namespace.indexedSeq(___namespace.split("grace", ""));

    assert.equal((_letters = letters, ___namespace.first(_letters)), "g");
    assert.equal((_letters2 = letters, (_ref285 = ___namespace, _$nth4 = _ref285.nth, function nth(_argPlaceholder178) {
      return _$nth4.call(_ref285, _argPlaceholder178, 2);
    })(_letters2)), "a");
    assert.equal((_nums = nums, ___namespace.first(_nums)), 12);
    assert.equal((_nums2 = nums, (_ref286 = ___namespace, _$nth5 = _ref286.nth, function nth(_argPlaceholder179) {
      return _$nth5.call(_ref286, _argPlaceholder179, 1);
    })(_nums2)), 13);
    assert.equal((_nums3 = nums, ___namespace.count(_nums3)), 3);
    assert.ok((_nums4 = nums, (_ref287 = ___namespace, _$satisfies = _ref287.satisfies, _$IReduce = ___namespace.IReduce, function satisfies(_argPlaceholder180) {
      return _$satisfies.call(_ref287, _$IReduce, _argPlaceholder180);
    })(_nums4)));
    assert.equal((_nums5 = nums, (_ref288 = ___namespace, _$reduce = _ref288.reduce, _$add13 = ___namespace.add, function reduce(_argPlaceholder181) {
      return _$reduce.call(_ref288, _$add13, 0, _argPlaceholder181);
    })(_nums5)), 39);
  });
  QUnit__default['default'].test("equality", function (assert) {
    var _Curly, _$eq, _ref289, _Curlers, _$eq2, _ref290, _Curlers2, _$notEq, _ref291, _5, _$eq3, _ref292, _ref293, _param45, _$eq4, _ref294, _ref295, _param46, _$eq5, _ref296, _ref297, _param47, _$eq6, _ref298, _fname$lname, _fname$lname2, _$eq7, _ref299, _fname$middle$lname, _fname$lname3, _$eq8, _ref300;

    assert.ok((_Curly = "Curly", (_ref289 = ___namespace, _$eq = _ref289.eq, function eq(_argPlaceholder182) {
      return _$eq.call(_ref289, _argPlaceholder182, "Curly");
    })(_Curly)), "Equal strings");
    assert.notOk((_Curlers = "Curlers", (_ref290 = ___namespace, _$eq2 = _ref290.eq, function eq(_argPlaceholder183) {
      return _$eq2.call(_ref290, _argPlaceholder183, "Curly");
    })(_Curlers)), "Unequal strings");
    assert.ok((_Curlers2 = "Curlers", (_ref291 = ___namespace, _$notEq = _ref291.notEq, function notEq(_argPlaceholder184) {
      return _$notEq.call(_ref291, _argPlaceholder184, "Curly");
    })(_Curlers2)), "Unequal strings");

    var rng = ___namespace.range(3);

    assert.ok(___namespace.eq(rng, rng, ___namespace.range(3), rng, [0, 1, 2], rng, ___namespace.cons(0, ___namespace.range(1, 3)), ___namespace.initial(___namespace.range(4))), "Communicative sequences");
    assert.ok((_5 = 45, (_ref292 = ___namespace, _$eq3 = _ref292.eq, function eq(_argPlaceholder185) {
      return _$eq3.call(_ref292, _argPlaceholder185, 45);
    })(_5)), "Equal numbers");
    assert.ok((_ref293 = [1, 2, 3], (_ref294 = ___namespace, _$eq4 = _ref294.eq, _param45 = [1, 2, 3], function eq(_argPlaceholder186) {
      return _$eq4.call(_ref294, _argPlaceholder186, _param45);
    })(_ref293)), "Equal arrays");
    assert.notOk((_ref295 = [1, 2, 3], (_ref296 = ___namespace, _$eq5 = _ref296.eq, _param46 = [2, 3], function eq(_argPlaceholder187) {
      return _$eq5.call(_ref296, _argPlaceholder187, _param46);
    })(_ref295)), "Unequal arrays");
    assert.notOk((_ref297 = [1, 2, 3], (_ref298 = ___namespace, _$eq6 = _ref298.eq, _param47 = [3, 2, 1], function eq(_argPlaceholder188) {
      return _$eq6.call(_ref298, _argPlaceholder188, _param47);
    })(_ref297)), "Unequal arrays");
    assert.ok((_fname$lname = {
      fname: "Moe",
      lname: "Howard"
    }, (_ref299 = ___namespace, _$eq7 = _ref299.eq, _fname$lname2 = {
      fname: "Moe",
      lname: "Howard"
    }, function eq(_argPlaceholder189) {
      return _$eq7.call(_ref299, _argPlaceholder189, _fname$lname2);
    })(_fname$lname)), "Equal objects");
    assert.notOk((_fname$middle$lname = {
      fname: "Moe",
      middle: "Harry",
      lname: "Howard"
    }, (_ref300 = ___namespace, _$eq8 = _ref300.eq, _fname$lname3 = {
      fname: "Moe",
      lname: "Howard"
    }, function eq(_argPlaceholder190) {
      return _$eq8.call(_ref300, _argPlaceholder190, _fname$lname3);
    })(_fname$middle$lname)), "Unequal objects");
  });
  QUnit__default['default'].test("coersion", function (assert) {
    var _ref301, _Moe$Curly;

    assert.deepEqual((_ref301 = [["Moe", "Howard"], ["Curly", "Howard"]], ___namespace.toObject(_ref301)), {
      Moe: "Howard",
      Curly: "Howard"
    });
    assert.deepEqual((_Moe$Curly = {
      Moe: "Howard",
      Curly: "Howard"
    }, ___namespace.toArray(_Moe$Curly)), [["Moe", "Howard"], ["Curly", "Howard"]]);
  });
  QUnit__default['default'].test("predicates", function (assert) {
    var _ace$king$queen2, _ace$king, _$matches, _ref302;

    assert.ok((_ace$king$queen2 = {
      ace: 1,
      king: 2,
      queen: 3
    }, (_ref302 = ___namespace, _$matches = _ref302.matches, _ace$king = {
      ace: 1,
      king: 2
    }, function matches(_argPlaceholder191) {
      return _$matches.call(_ref302, _argPlaceholder191, _ace$king);
    })(_ace$king$queen2)));
    assert.equal(___namespace.any(3, 1), 3);
    assert.equal(___namespace.any(null, 1), 1);
    assert.equal(___namespace.all(3, 1), 1);
    assert.equal(___namespace.all(null, 1), null);
  });

});
