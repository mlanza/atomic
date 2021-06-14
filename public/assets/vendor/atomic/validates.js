define(['exports', 'atomic/core', 'promise'], function (exports, _, Promise$1) { 'use strict';

  var ICheckable = _.protocol({
    check: null
  });

  var IConstrainable = _.protocol({
    //constraints are validation which expose their data for use iby the UI
    constraints: null
  });

  var IExplains = _.protocol({
    explain: null
  });

  var IScope = _.protocol({
    scope: null,
    at: null
  });

  var ISelection = _.protocol({
    options: null
  });

  function And(constraints) {
    this.constraints = constraints;
  }
  function and() {
    for (var _len = arguments.length, constraints = new Array(_len), _key = 0; _key < _len; _key++) {
      constraints[_key] = arguments[_key];
    }

    return new And(constraints);
  }

  function Issue(constraint, path) {
    this.constraint = constraint;
    this.path = path;
  }
  function issue(constraint, path) {
    return new Issue(constraint, path || null);
  }

  function issues1(obj) {
    return _.seq(ICheckable.check(IConstrainable.constraints(obj), obj));
  }

  function issues2(xs, f) {
    if (xs == null) {
      return null;
    } else if (_.isPromise(xs)) {
      return _.fmap(xs, function (x) {
        return issues2(x, f);
      });
    } else if (_.satisfies(_.ISeq, xs)) {
      var _ref, _ref2, _map;

      return _ref = (_ref2 = (_map = _.map(f, xs), _.flatten(_map)), _.compact(_ref2)), _.blot(_ref);
    }
  }

  var issues = _.overload(null, issues1, issues2);

  function issuing2(x, issue) {
    return issuing3(x, _.identity, issue);
  }

  function issuing3(x, valid, issue) {
    if (_.isPromise(x)) {
      var _valid, _issue, _issuing;

      return _.fmap(x, valid, (_issuing = issuing, _valid = valid, _issue = issue, function issuing(_argPlaceholder) {
        return _issuing(_argPlaceholder, _valid, _issue);
      }));
    } else if (valid(x)) {
      return null;
    } else {
      return [issue];
    }
  }

  var issuing = _.overload(null, null, issuing2, issuing3);

  function deref$1(self) {
    return self.constraint;
  }

  function scope$1(self, key) {
    return issue(self.constraint, _.toArray(_.cons(key, self.path)));
  }

  function at$1(self, path) {
    return issue(self.constraint, path);
  }

  var behaveAsIssue = _.does(_.implement(_.IDeref, {
    deref: deref$1
  }), _.implement(IScope, {
    scope: scope$1,
    at: at$1
  }));

  behaveAsIssue(Issue);

  function check$f(self, value) {
    var _value, _ICheckable$check, _ICheckable;

    return issues(self.constraints, (_ICheckable = ICheckable, _ICheckable$check = _ICheckable.check, _value = value, function check(_argPlaceholder) {
      return _ICheckable$check.call(_ICheckable, _argPlaceholder, _value);
    }));
  }

  function conj$1(self, constraint) {
    return _.apply(and, _.ICollection.conj(self.constraints, constraint));
  }

  function first$1(self) {
    return _.ISeq.first(self.constraints);
  }

  function rest$1(self) {
    return _.ISeq.rest(self.constraints);
  }

  function empty$1(self) {
    return and();
  }

  function seq$1(self) {
    return _.ISeqable.seq(self.constraints) ? self : null;
  }

  function next$1(self) {
    return seq$1(rest$1(self));
  }

  var behaveAsAnd = _.does(_.implement(_.ISeqable, {
    seq: seq$1
  }), _.implement(_.INext, {
    next: next$1
  }), _.implement(_.IEmptyableCollection, {
    empty: empty$1
  }), _.implement(_.ICollection, {
    conj: conj$1
  }), _.implement(_.ISeq, {
    first: first$1,
    rest: rest$1
  }), _.implement(_.IAppendable, {
    append: conj$1
  }), _.implement(ICheckable, {
    check: check$f
  }));

  behaveAsAnd(And);

  function Annotation(note, constraint) {
    this.note = note;
    this.constraint = constraint;
  }
  function anno(note, constraint) {
    return new Annotation(note, constraint);
  }

  function deref(self) {
    return self.constraint;
  }

  function explain$1(self) {
    return self.note;
  }

  function check$e(self, value) {
    return issues(ICheckable.check(self.constraint, value), function (iss) {
      return issue(anno(self.note, iss.constraint), iss.path);
    });
  }

  function append$2(self, constraint) {
    return anno(self.note, _.IAppendable.append(self.constraint, constraint));
  }

  var behaveAsAnnotation = _.does(_.implement(_.IDeref, {
    deref: deref
  }), _.implement(IExplains, {
    explain: explain$1
  }), _.implement(_.IAppendable, {
    append: append$2
  }), _.implement(ICheckable, {
    check: check$e
  }));

  behaveAsAnnotation(Annotation);

  function Bounds(start, end, f) {
    this.start = start;
    this.end = end;
    this.f = f;
  }

  function bounds3(start, end, f) {
    return new Bounds(start, end, f);
  }

  function bounds2(start, end) {
    return bounds3(start, end, _.identity);
  }

  function bounds1(end) {
    return bounds2(null, end);
  }

  var bounds = _.overload(null, bounds1, bounds2, bounds3);

  function start$1(self) {
    return self.start;
  }

  function end$1(self) {
    return self.end;
  }

  function includes$1(self, value) {
    return _.between(self, value);
  }

  function check$d(self, obj) {
    var value = self.f(obj);
    return self.start != null && value <= self.start || self.end != null && value >= self.end ? [issue(self)] : null;
  }

  var behaveAsBounds = _.does(_.implement(ICheckable, {
    check: check$d
  }), _.implement(_.IInclusive, {
    includes: includes$1
  }), _.implement(_.IBounds, {
    start: start$1,
    end: end$1
  }));

  behaveAsBounds(Bounds);

  function Cardinality(least, most) {
    this.least = least;
    this.most = most;
  }

  function validCardinality(least, most) {
    return _.isInteger(least) && least >= 0 && most >= 0 && least <= most && (_.isInteger(most) || most === Infinity);
  }

  var card = _.fnil(_.pre(_.constructs(Cardinality), validCardinality), 0, Infinity);
  var opt = card(0, 1);
  var req = card(1, 1);
  var unlimited = card(0, Infinity);

  function start(self) {
    return self.least;
  }

  function end(self) {
    return self.most;
  }

  function includes(self, value) {
    return _.isInteger(value) && _.between(self, value);
  }

  function check$c(self, coll) {
    var n = _.count(coll);
    return n < self.least || n > self.most ? [issue(self)] : null;
  }

  var behaveAsCardinality = _.does(_.implement(ICheckable, {
    check: check$c
  }), _.implement(_.IInclusive, {
    includes: includes
  }), _.implement(_.IBounds, {
    start: start,
    end: end
  }));

  behaveAsCardinality(Cardinality);

  function Catches(constraint) {
    this.constraint = constraint;
  }
  function catches(constraint) {
    return new Catches(constraint);
  }

  function check$b(self, obj) {
    try {
      return ICheckable.check(self.constraint, obj);
    } catch (ex) {
      return [issue(self)];
    }
  }

  var behaveAsCatches = _.does(_.implement(ICheckable, {
    check: check$b
  }));

  behaveAsCatches(Catches);

  function Characters(start, end, f) {
    this.start = start;
    this.end = end;
    this.f = f;
  }

  function chars2(start, end) {
    return new Characters(start, end, _.count);
  }

  function chars1(end) {
    return chars2(null, end);
  }

  var chars = _.overload(null, chars1, chars2);

  behaveAsBounds(Characters);

  function Choice(options) {
    this.options = options;
  }
  function choice(options) {
    return new Choice(options);
  }

  function options$2(self) {
    return self.options;
  }

  function check$a(self, value) {
    return _.includes(self.options, value) ? null : [issue(self)];
  }

  var behaveAsChoice = _.does(_.implement(ISelection, {
    options: options$2
  }), _.implement(ICheckable, {
    check: check$a
  }));

  behaveAsChoice(Choice);

  function CollOf(constraint) {
    this.constraint = constraint;
  }
  function collOf(constraint) {
    return new CollOf(constraint);
  }

  function check$9(self, coll) {
    var _param, _mapIndexed;

    return _.maybe(coll, (_mapIndexed = _.mapIndexed, _param = function _param(idx, item) {
      var _idx, _IScope$scope, _IScope;

      return _.map((_IScope = IScope, _IScope$scope = _IScope.scope, _idx = idx, function scope(_argPlaceholder2) {
        return _IScope$scope.call(_IScope, _argPlaceholder2, _idx);
      }), ICheckable.check(self.constraint, item));
    }, function mapIndexed(_argPlaceholder) {
      return _mapIndexed(_param, _argPlaceholder);
    }), _.concatenated, _.compact, _.toArray, _.blot);
  }

  var behaveAsCollOf = _.does(_.implement(ICheckable, {
    check: check$9
  }));

  behaveAsCollOf(CollOf);

  function Isa(types) {
    this.types = types;
  }
  function isa() {
    for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
      types[_key] = arguments[_key];
    }

    return new Isa(types);
  }

  function check$8(self, obj) {
    var _obj, _is;

    return _.some((_is = _.is, _obj = obj, function is(_argPlaceholder) {
      return _is(_obj, _argPlaceholder);
    }), self.types) ? null : [issue(self)];
  }

  function options$1(self) {
    return self.types;
  }

  var behaveAsIsa = _.does(_.implement(ISelection, {
    options: options$1
  }), _.implement(ICheckable, {
    check: check$8
  }));

  behaveAsIsa(Isa);

  function Map(f, constraint) {
    this.f = f;
    this.constraint = constraint;
  }
  function map(f, constraint) {
    return new Map(f, constraint);
  }

  function check$7(self, obj) {
    try {
      var value = _.invoke(self.f, obj);
      return ICheckable.check(self.constraint, value);
    } catch (ex) {
      return [issue(self.constraint)];
    }
  }

  var behaveAsMap = _.does(_.implement(ICheckable, {
    check: check$7
  }));

  behaveAsMap(Map);

  function Optional(key, constraint) {
    this.key = key;
    this.constraint = constraint;
  }
  function optional(key, constraint) {
    return new Optional(key, constraint || null);
  }

  function check$6(self, obj) {
    var found = _.get(obj, self.key);

    if (_.blank(found)) {
      return null;
    } else {
      var _self$key, _IScope$scope, _IScope;

      return issues(ICheckable.check(self.constraint, found), (_IScope = IScope, _IScope$scope = _IScope.scope, _self$key = self.key, function scope(_argPlaceholder) {
        return _IScope$scope.call(_IScope, _argPlaceholder, _self$key);
      }));
    }
  }

  function append$1(self, constraint) {
    return optional(self.key, and(self.constraint, constraint));
  }

  var behaveAsOptional = _.does(_.implement(_.IAppendable, {
    append: append$1
  }), _.implement(ICheckable, {
    check: check$6
  }));

  behaveAsOptional(Optional);

  function Or(constraints) {
    this.constraints = constraints;
  }
  function or() {
    for (var _len = arguments.length, constraints = new Array(_len), _key = 0; _key < _len; _key++) {
      constraints[_key] = arguments[_key];
    }

    return new Or(constraints);
  }

  function check$5(self, value) {
    var _value, _ICheckable$check, _ICheckable;

    return _.detect(_.isSome, _.map((_ICheckable = ICheckable, _ICheckable$check = _ICheckable.check, _value = value, function check(_argPlaceholder) {
      return _ICheckable$check.call(_ICheckable, _argPlaceholder, _value);
    }), self.constraints));
  }

  function conj(self, constraint) {
    return apply(or, _.ICollection.conj(self.constraints, constraint));
  }

  function first(self) {
    return _.ISeq.first(self.constraints);
  }

  function rest(self) {
    return _.ISeq.rest(self.constraints);
  }

  function empty(self) {
    return or();
  }

  function seq(self) {
    return _.ISeqable.seq(self.constraints) ? self : null;
  }

  function next(self) {
    return seq(rest(self));
  }

  var behaveAsOr = _.does(_.implement(_.ISeqable, {
    seq: seq
  }), _.implement(_.INext, {
    next: next
  }), _.implement(_.IEmptyableCollection, {
    empty: empty
  }), _.implement(_.ICollection, {
    conj: conj
  }), _.implement(_.ISeq, {
    first: first,
    rest: rest
  }), _.implement(_.IAppendable, {
    append: conj
  }), _.implement(ICheckable, {
    check: check$5
  }));

  behaveAsOr(Or);

  function Predicate(f, args) {
    this.f = f;
    this.args = args;
  }
  function pred(f) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return new Predicate(f, args);
  }

  function check$4(self, obj) {
    var pos = _.indexOf(self.args, null),
        args = _.assoc(self.args, pos, obj);
    return _.apply(self.f, args) ? null : [issue(self)];
  }

  var behaveAsPredicate = _.does(_.implement(ICheckable, {
    check: check$4
  }));

  behaveAsPredicate(Predicate);

  function Required(key, constraint) {
    this.key = key;
    this.constraint = constraint;
  }
  function required(key, constraint) {
    return new Required(key, constraint || null);
  }

  function check$3(self, obj) {
    var found = _.get(obj, self.key);

    if (_.blank(found)) {
      return [issue(self, [self.key])];
    } else {
      var _self$key, _IScope$scope, _IScope;

      return issues(ICheckable.check(self.constraint, found), (_IScope = IScope, _IScope$scope = _IScope.scope, _self$key = self.key, function scope(_argPlaceholder) {
        return _IScope$scope.call(_IScope, _argPlaceholder, _self$key);
      }));
    }
  }

  function append(self, constraint) {
    return required(self.key, and(self.constraint, constraint));
  }

  var behaveAsRequired = _.does(_.implement(_.IAppendable, {
    append: append
  }), _.implement(ICheckable, {
    check: check$3
  }));

  behaveAsRequired(Required);

  function Scoped(key, constraint) {
    this.key = key;
    this.constraint = constraint;
  }
  function scoped(key, constraint) {
    return new Scoped(key, constraint);
  }

  function check$2(self, value) {
    return issues(ICheckable.check(self.constraint, value), function (iss) {
      return issue(self.constraint, _.toArray(_.cons(self.key, iss.path)));
    });
  }

  var behaveAsScoped = _.does(_.implement(ICheckable, {
    check: check$2
  }));

  behaveAsScoped(Scoped);

  function When(pred, constraint) {
    this.pred = pred;
    this.constraint = constraint;
  }
  function when(pred, constraint) {
    return new When(pred, constraint);
  }

  function check$1(self, obj) {
    return self.pred(obj) ? ICheckable.check(self.constraint, obj) : null;
  }

  var behaveAsWhen = _.does(_.implement(ICheckable, {
    check: check$1
  }));

  behaveAsWhen(When);

  function parses(parse, constraint) {
    return anno({
      type: 'parse',
      parse: parse
    }, catches(map(_.branch(_.isString, parse, _.identity), constraint)));
  }

  function check3(self, parse, value) {
    return ICheckable.check(parses(parse, self), value);
  }

  var check = _.awaits(_.overload(null, null, ICheckable.check, check3));

  function constraints2(self, f) {
    return IConstrainable.constraints(self, _.isFunction(f) ? f(IConstrainable.constraints(self)) : f);
  }

  var constraints = _.overload(null, IConstrainable.constraints, constraints2);
  function constrain(self, constraint) {
    var _constraint, _append;

    return constraints(self, (_append = _.append, _constraint = constraint, function append(_argPlaceholder) {
      return _append(_argPlaceholder, _constraint);
    }));
  }

  var explain = IExplains.explain;

  var scope = IScope.scope;
  var at = IScope.at;

  var options = ISelection.options;

  function toPred(constraint) {
    return function (obj) {
      var issues = ICheckable.check(constraint, obj);
      return !issues;
    };
  }
  function present(constraint) {
    return or(_.isNil, constraint);
  }
  function atLeast(n) {
    return anno({
      type: 'at-least',
      n: n
    }, map(_.count, pred(_.gte, null, n)));
  }
  function atMost(n) {
    return anno({
      type: 'at-most',
      n: n
    }, map(_.count, pred(_.lte, null, n)));
  }
  function exactly(n) {
    return anno({
      type: 'exactly',
      n: n
    }, map(_.count, pred(_.eq, null, n)));
  }
  function between(min, max) {
    return min == max ? anno({
      type: 'equal',
      value: min
    }, pred(_.eq, null, min)) : anno({
      type: 'between',
      min: min,
      max: max
    }, or(anno({
      type: 'min',
      min: min
    }, pred(_.gte, null, min)), anno({
      type: 'max',
      max: max
    }, pred(_.lte, null, max))));
  }
  function keyed(keys) {
    return _.apply(_.juxt, _.mapa(function (key) {
      var _key, _get;

      return _get = _.get, _key = key, function get(_argPlaceholder) {
        return _get(_argPlaceholder, _key);
      };
    }, keys));
  }
  function supplied(cond, keys) {
    return scoped(_.first(keys), map(keyed(keys), _.spread(_.filled(cond, _.constantly(true)))));
  }
  function range(start, end) {
    return anno({
      type: 'range',
      start: start,
      end: end
    }, supplied(_.lte, [start, end]));
  }
  var email = anno({
    type: "email"
  }, /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i);
  var phone = anno({
    type: "phone"
  }, /^(\d{3}-|\(\d{3}\) )\d{3}-\d{4}$/);
  var stateCode = anno({
    type: "state-code"
  }, choice(['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY']));
  var zipCode = anno({
    type: "zip-code"
  }, /^\d{5}(-\d{4})?$/);

  (function () {
    var check = _.constantly(null);
    _.doto(_.Nil, _.implement(ICheckable, {
      check: check
    }));
  })();

  function datatype(Type, pred, type) {
    function check(self, value) {
      return pred(value) ? null : [issue(Type)];
    }

    var explain = _.constantly({
      type: type
    });
    _.doto(Type, _.specify(IExplains, {
      explain: explain
    }), _.specify(ICheckable, {
      check: check
    }));
  }
  datatype(Function, _.isFunction, "function");
  datatype(Number, _.isNumber, "number");
  datatype(Date, _.isDate, "date");
  datatype(String, _.isString, "string");
  datatype(RegExp, _.isRegExp, "regexp");
  datatype(_.Nil, _.isNil, "nil");

  (function () {
    function check(self, value) {
      return self.test(value) ? null : [issue(self)];
    }

    _.doto(RegExp, _.implement(IExplains, {
      explain: _.constantly({
        type: "pattern"
      })
    }), _.implement(ICheckable, {
      check: check
    }));
  })();

  (function () {
    function check(self, value) {
      return issuing(self(value), issue(self));
    }

    _.doto(Function, _.implement(IExplains, {
      explain: _.constantly({
        type: "predicate"
      })
    }), _.implement(ICheckable, {
      check: check
    }));
  })();

  exports.And = And;
  exports.Annotation = Annotation;
  exports.Bounds = Bounds;
  exports.Cardinality = Cardinality;
  exports.Catches = Catches;
  exports.Characters = Characters;
  exports.Choice = Choice;
  exports.CollOf = CollOf;
  exports.ICheckable = ICheckable;
  exports.IConstrainable = IConstrainable;
  exports.IExplains = IExplains;
  exports.IScope = IScope;
  exports.ISelection = ISelection;
  exports.Isa = Isa;
  exports.Issue = Issue;
  exports.Map = Map;
  exports.Optional = Optional;
  exports.Or = Or;
  exports.Predicate = Predicate;
  exports.Required = Required;
  exports.Scoped = Scoped;
  exports.When = When;
  exports.and = and;
  exports.anno = anno;
  exports.at = at;
  exports.atLeast = atLeast;
  exports.atMost = atMost;
  exports.between = between;
  exports.bounds = bounds;
  exports.card = card;
  exports.catches = catches;
  exports.chars = chars;
  exports.check = check;
  exports.choice = choice;
  exports.collOf = collOf;
  exports.constrain = constrain;
  exports.constraints = constraints;
  exports.datatype = datatype;
  exports.email = email;
  exports.exactly = exactly;
  exports.explain = explain;
  exports.isa = isa;
  exports.issue = issue;
  exports.issues = issues;
  exports.issuing = issuing;
  exports.keyed = keyed;
  exports.map = map;
  exports.opt = opt;
  exports.optional = optional;
  exports.options = options;
  exports.or = or;
  exports.parses = parses;
  exports.phone = phone;
  exports.pred = pred;
  exports.present = present;
  exports.range = range;
  exports.req = req;
  exports.required = required;
  exports.scope = scope;
  exports.scoped = scoped;
  exports.stateCode = stateCode;
  exports.supplied = supplied;
  exports.toPred = toPred;
  exports.unlimited = unlimited;
  exports.when = when;
  exports.zipCode = zipCode;

  Object.defineProperty(exports, '__esModule', { value: true });

});
