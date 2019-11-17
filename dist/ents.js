define(['atomic/core', 'atomic/dom', 'atomic/transients', 'atomic/reactives', 'atomic/validates', 'atomic/immutables', 'context'], function(_, dom, mut, $, vd, imm, context){

  //TODO Apply effects (destruction, modification, addition) to datastore.
  //TODO Improve efficiency (with an index decorator?) of looking up an entity in a buffer by pk rather than guid.
  //TODO Consider use cases for `init` (e.g. creating new entities or resetting an existing field to factory defaults).
  //TODO Render a form that can be persisted thereby replacing `dynaform`.
  //TODO #FUTURE Optimize like effects (destruction, modification, addition) into aggregate effects before applying them.

  var IAssociative = _.IAssociative,
      ISwap = _.ISwap,
      ITransientAssociative = mut.ITransientAssociative,
      IMiddleware = $.IMiddleware,
      IDispatch = $.IDispatch,
      ISubscribe = $.ISubscribe,
      IEmptyableCollection = _.IEmptyableCollection,
      ICheckable = vd.ICheckable,
      ICollection = _.ICollection,
      ITransientCollection = mut.ITransientCollection,
      IReduce = _.IReduce,
      IKVReduce = _.IKVReduce,
      IAppendable = _.IAppendable,
      IPrependable = _.IPrependable,
      IQueryable = _.IQueryable,
      INext = _.INext,
      ISeq = _.ISeq,
      IDeref = _.IDeref,
      IEquiv = _.IEquiv,
      IIndexed = _.IIndexed,
      ICounted = _.ICounted,
      ISeqable = _.ISeqable,
      ISequential = _.ISequential,
      IMap = _.IMap,
      ILookup = _.ILookup,
      IBounds = _.IBounds,
      IFunctor = _.IFunctor,
      IInclusive = _.IInclusive;

  var seed = _.generate(_.negatives);

  function create(){ //USE What.create = create; What.create(1);
    return _.apply(_.constructs(this), _.slice(arguments));  //universal `new-less` create function
  }

  function createable(Type){ //TODO consider
    Type.create = create;
  }

  function path(){
    return _.replace(_.join("", _.indexed(arguments)), /\/\//g, '/');
  }

  function isSequential(values){
    return _.satisfies(ISequential, values);
  }

  function Cardinality(least, most){ //TODO add to (or replace in) atomic/validates?
    this.least = least;
    this.most = most;
  }

  (function(){

    function start(self){
      return self.least;
    }

    function end(self){
      return self.most;
    }

    function includes(self, value){
      return _.isInteger(value) && _.between(self, value);
    }

    function check(self, coll){
      var n = _.count(coll);
      return n < self.least || n > self.most ? [vd.issue(self)] : null;
    }

    _.doto(Cardinality,
      _.implement(ICheckable, {check: check}),
      _.implement(IInclusive, {includes: includes}),
      _.implement(IBounds, {start: start, end: end}));

  })();

  function validCardinality(least, most){
    return _.isInteger(least) && least >= 0 &&  most >= 0 && least <= most && (_.isInteger(most) || most === Infinity);
  }

  var card = _.fnil(_.pre(_.constructs(Cardinality), validCardinality), 0, Infinity);

  var IPossession = _.protocol({
    owner: null
  });

  var IMergeable = _.protocol({
    merge: null
  });

  var IEntitySelector = _.protocol({
    select: null,
    deselect: null
  });

  var ITimeTravel = _.protocol({
    undo: null,
    redo: null,
    flush: null,
    undoable: null,
    redoable: null
  });

  var IIntention = _.protocol({
    command: null //returns the serialization-friendly command object which upon execution is capable of realizing the intention
  });

  var IStore = _.protocol({
    commit: null
  });

  var IIdentifiable = _.protocol({
    identifier: null //machine-friendly identifier (lowercase, no embedded spaces) offering reasonable uniqueness within a context
  });

  var ISubject = _.protocol({
    title: null //human-friendly description offering reasonable uniqueness within a context
  });

  var IResolver = _.protocol({
    resolve: null //TODO returns both resolved and unresolved values
  });

  var IFactory = _.protocol({
    make: null
  });

  var ITransaction = _.protocol({
    commands: null //returns one or more commands that when executed effect the transaction in its entirety
  });

  var IView = _.protocol({ //TODO rename to mount
    render: null
  });

  var ICatalog = _.protocol({
    touched: null, //entities touched during the last operation - useful when diffing before/after model snapshots
    dirty: null,
    load: null, //add existing entity from domain to workspace
    add: null, //add new entity to workspace
    edit: null, //update entity present in workspace
    destroy: null, //delete entity present in workspace
    changes: null //changed entities
  });

  var IField = _.protocol({
    aget: null,
    aset: null,
    init: null
  });

  var IDefaultField = _.protocol({
    defaultField: null
  });

  var IConstrained = _.protocol({ //constraints are validation which expose their data for use iby the UI
    constraints: null
  });

  var ICardinality = _.protocol({
    cardinality: null
  });

  var IMultiDictionary = _.protocol({
  });

  var IEntity = _.protocol({
    eid: null
  });

  var IKind = _.protocol({
    kind: null,
    field: null
  });

  function _constraints2(self, f){
    return IConstrained.constraints(self, _.isFunction(f) ? f(IConstrained.constraints(self)) : f);
  }

  var _constraints = _.overload(null, IConstrained.constraints, _constraints2);

  function constrain(self, constraint){
    return _constraints(self, _.append(_, constraint));
  }

  function validate(obj){
    return _.seq(vd.check(IConstrained.constraints(obj), obj));
  }

  var protocols = {
    IMultiDictionary: IMultiDictionary,
    IIdentifiable: IIdentifiable,
    IKind: IKind,
    IField: IField,
    IEntity: IEntity,
    IResolver: IResolver,
    ISubject: ISubject,
    ICardinality: ICardinality,
    IQueryable: IQueryable,
    IFactory: IFactory,
    IConstrained: IConstrained,
    IStore: IStore,
    IPossession: IPossession,
    ITransaction: ITransaction,
    IEntitySelector: IEntitySelector,
    ITimeTravel: ITimeTravel,
    IView: IView,
    IMiddleware: IMiddleware,
    ICatalog: ICatalog
  }

  function TimeTravelCell(pos, max, history, cell){
    this.pos = pos;
    this.max = max;
    this.history = history;
    this.cell = cell;
  }

  function timeTravelCell2(max, cell){
    return new TimeTravelCell(0, max, [_.deref(cell)], cell);
  }

  function timeTravelCell1(cell){
    return timeTravelCell2(Infinity, cell);
  }

  var timeTravelCell = _.overload(null, timeTravelCell1, timeTravelCell2);

  (function(){

    function undo(self){
      if (undoable(self)) {
        self.pos += 1;
        _.reset(self.cell, self.history[self.pos]);
      }
    }

    function redo(self){
      if (redoable(self)) {
        self.pos -= 1;
        _.reset(self.cell, self.history[self.pos]);
      }
    }

    function flush(self){
      self.history = [self.history[self.pos]];
      self.pos = 0;
    }

    function undoable(self){
      return self.pos < ICounted.count(self.history);
    }

    function redoable(self){
      return self.pos > 0;
    }

    function deref(self){
      return IDeref.deref(self.cell);
    }

    function reset(self, state){
      var history = self.pos ? self.history.slice(self.pos) : self.history;
      history.unshift(state);
      while(_.count(history) > self.max) {
        history.pop();
      }
      self.history = history;
      self.pos = 0;
      _.reset(self.cell, state);
    }

    function swap(self, f){
      reset(self, f(IDeref.deref(self.cell)));
    }

    function sub(self, observer){
      $.sub(self.cell, observer);
    }

    function unsub(self, observer){
      $.unsub(self.cell, observer);
    }

    function subscribed(self){
      return $.subscribed(self.cell);
    }

    _.doto(TimeTravelCell,
      _.implement(ITimeTravel, {undo: undo, redo: redo, flush: flush, undoable: undoable, redoable: redoable}),
      _.implement(_.IDeref, {deref: deref}),
      _.implement(_.IReset, {reset: reset}),
      _.implement(_.ISwap, {swap: swap}),
      _.implement($.ISubscribe, {sub: sub, unsub: unsub, subscribed: subscribed}))

  })();

  function DerefCheck(check){
    this.check = check;
  }

  (function(){

    function check(self, value){
      return ICheckable.check(self.check, _.deref(value));
    }

    _.doto(DerefCheck,
      _.implement(ICheckable, {check: check}));

  })()

  function ConstrainedCollection(constraints, values){
    this.constraints = constraints;
    this.values = values;
  }

  (function(){

    //TODO eliminate field for type

    var forward = _.forwardTo("values");
    var first = forward(ISeq.first);
    var rest = forward(ISeq.rest);
    var next = forward(INext.next);
    var includes = forward(IInclusive.includes);
    var count = forward(ICounted.count);
    var nth = forward(IIndexed.nth);
    var contains = forward(IAssociative.contains);

    function reduce(self, xf, init){
      var memo = init,
          ys = self;
      while(ISeqable.seq(ys)){
        var y = _.first(ys);
        memo = xf(memo, y);
        ys = _.rest(ys);
      }
      return memo;
    }

    function reducekv(self, xf, init){
      return _.reduce(function(memo, idx){
        return xf(memo, idx, _.nth(self, idx));
      }, init, _.range(0, count(self)));
    }

    function conj(self, value){
      return new self.constructor(self.constraints, _.conj(self.values, value));
    }

    function equiv(self, other){
      return self === other; //TODO self.constructor === other.constructor && _.every()
    }

    function assoc(self, idx, value){
      return new self.constructor(self.constraints, IAssociative.assoc(self.values, idx, value));
    }

    function seq(self){
      return ISeqable.seq(self.values) ? self : null;
    }

    function empty(self){
      return new self.constructor(self.constraints, IEmptyableCollection.empty(self.values));
    }

    function deref(self){
      return self.values;
    }

    function fmap(self, f){
      return new self.constructor(self.constraints, _.fmap(self.values, f));
    }

    function constraints1(self){
      return self.constraints;
    }

    function constraints2(self, constraints){
      return new self.constructor(constraints, self.values);
    }

    var constraints = _.overload(null, constraints1, constraints2);

    _.doto(ConstrainedCollection,
      _.implement(IEmptyableCollection, {empty: empty}),
      _.implement(IFunctor, {fmap: fmap}),
      _.implement(IConstrained, {constraints: constraints}),
      _.implement(ILookup, {lookup: nth}),
      _.implement(IAssociative, {assoc: assoc, contains: contains}),
      _.implement(IDeref, {deref: deref}),
      _.implement(ICounted, {count: count}),
      _.implement(IReduce, {reduce: reduce}),
      _.implement(IKVReduce, {reducekv: reducekv}),
      _.implement(ISeq, {first: first, rest: rest}),
      _.implement(INext, {next: next}),
      _.implement(IEquiv, {equiv: equiv}),
      _.implement(IInclusive, {includes: includes}),
      _.implement(ICollection, {conj: conj}),
      _.implement(IIndexed, {nth: nth}),
      _.implement(ISeqable, {seq: seq}));

  })();

  function ClampedCollection(cardinality, coll){
    this.cardinality = cardinality;
    this.coll = coll;
  }

  var clampedCollection = _.constructs(ClampedCollection);

  (function(){

    var forward = _.forwardTo("coll");
    var reduce = forward(IReduce.reduce);
    var reducekv = forward(IKVReduce.reducekv);
    var first = forward(ISeq.first);
    var rest = forward(ISeq.rest);
    var next = forward(INext.next);
    var count = forward(ICounted.count);
    var includes = forward(IInclusive.includes);
    var equiv = forward(IEquiv.equiv);
    var nth = forward(IIndexed.nth);
    var contains = forward(IAssociative.contains);
    var seq = forward(ISeqable.seq);
    var cardinality = forward(ICardinality.cardinality);
    var deref = forward(IDeref.deref);

    function fmap(self, f){
      return new self.constructor(self.cardinality, _.fmap(self.coll, f));
    }

    function conj(self, value){
      var coll = ICollection.conj(self.coll, value);
      return new self.constructor(self.cardinality, _.into(IEmptyableCollection.empty(coll), _.drop(_.max(ICounted.count(coll) - IBounds.end(self.cardinality), 0), coll)));
    }

    function assoc(self, idx, value){
      return new self.constructor(self.cardinality, IAssociative.assoc(self.coll, idx, value));
    }

    function empty(self){
      return new self.constructor(self.cardinality, _.into(IEmptyableCollection.empty(self.coll), _.take(IBounds.start(self.cardinality), self.coll)));
    }

    function constraints1(self){
      return IConstrained.constraints(self.coll);
    }

    function constraints2(self, constraints){
      return new self.constructor(self.cardinality, IConstrained.constraints(self.coll, constraints));
    }

    var constraints = _.overload(null, constraints1, constraints2);

    _.doto(ClampedCollection,
      _.implement(IEmptyableCollection, {empty: empty}),
      _.implement(IFunctor, {fmap: fmap}),
      _.implement(IConstrained, {constraints: constraints}),
      _.implement(ILookup, {lookup: nth}),
      _.implement(IAssociative, {assoc: assoc, contains: contains}),
      _.implement(IDeref, {deref: deref}),
      _.implement(ICounted, {count: count}),
      _.implement(IReduce, {reduce: reduce}),
      _.implement(IKVReduce, {reducekv: reducekv}),
      _.implement(ICardinality, {cardinality: cardinality}),
      _.implement(ISeq, {first: first, rest: rest}),
      _.implement(INext, {next: next}),
      _.implement(IEquiv, {equiv: equiv}),
      _.implement(IInclusive, {includes: includes}),
      _.implement(ICollection, {conj: conj}),
      _.implement(IIndexed, {nth: nth}),
      _.implement(ISeqable, {seq: seq}));

  })();

  var constrainedCollection = _.fnil(_.constructs(ConstrainedCollection), vd.and(card(0, 1)), [], []),
      optional = clampedCollection(card(0, 1), constrainedCollection(vd.and(card(0, 1)))),
      required = clampedCollection(card(1, 1), constrainedCollection(vd.and(card(1, 1)))),
      unlimited = constrainedCollection(vd.and(card(0, Infinity)));

  function reassign(self, key, f){
    var field = IKind.field(self, key),
        values = IField.aget(field, self),
        revised = f(values);
    return revised === values ? self : IField.aset(field, self, _.into(_.empty(values), revised));
  }

  function assert3(self, key, value){
    return reassign(self, key, _.conj(_, value));
  }

  var assert = _.overload(null, null, null, assert3, _.reducing(assert3));

  function retract3(self, key, value){
    return reassign(self, key, _.branch(_.includes(_, value), _.remove(_.eq(_, value), _), _.identity));
  }

  function retract2(self, key){
    return reassign(self, key, _.branch(_.seq, _.empty, _.identity));
  }

  var retract = _.overload(null, null, retract2, retract3, _.reducing(retract3));

  function asserts3(self, key, value){
    return _.seq(_.filter(function(assertion){
      return _.equiv(value, _.nth(assertion, 1));
    }, asserts2(self, key)));
  }

  function asserts2(self, key){
    return IField.aget(IKind.field(self, key), self);
  }

  function asserts1(self){
    return _.seq(_.mapcat(function(key){
      return asserts2(self, key);
    }, _.keys(self)));
  }

  var asserts = _.overload(null, asserts1, asserts2, asserts3);

  var behaveAsEntity = (function(){

    function identifier(self){ //TODO use?
      return IIdentifiable.identifier(self.repo);
    }

    function eid(self){
      return self.attrs.id;
    }

    function title(self){
      return _.get(self, self.repo.title, null);
    }

    function field(self, key){
      return IKind.field(self.repo, key);
    }

    function kind(self){ //TODO use?
      return self.repo.identifier;
    }

    function lookup(self, key){
      return IField.aget(field(self, key) || IDefaultField.defaultField(self, key), self);
    }

    function assoc(self, key, values){
      return IField.aset(field(self, key) || IDefaultField.defaultField(self, key), self, values);
    }

    function contains(self, key){
      return IAssociative.contains(self.attrs, key);
    }

    function dissoc(self, key){
      return assoc(self, key, null); //TODO test
    }

    function keys(self){
      return _.keys(self.repo);
    }

    return _.does(
      _.implement(IMultiDictionary, {}),
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IEntity, {eid: eid}),
      _.implement(ISubject, {title: title}),
      _.implement(IMap, {keys: keys, dissoc: dissoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IAssociative, {assoc: assoc, contains: contains}),
      _.implement(IKind, {field: field, kind: kind}));

  })();

  var ReadOnlyField = (function(){

    function ReadOnlyField(field){
      this.field = field;
    }

    function aget(self, entity){
      return IField.aget(self.field, entity);
    }

    function aset(self, entity, values){
      throw new Error("Cannot set readonly field '" + identifier(self) + "'.");
    }

    function init(self){
      return IField.init(self.field);
    }

    function identifier(self){
      return IIdentifiable.identifier(self.field);
    }

    return _.doto(ReadOnlyField,
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IField, {aget: aget, aset: aset, init: init}));

  })();

  var readOnlyField = _.constructs(ReadOnlyField);

  var DefaultedField = (function(){

    function DefaultedField(init, field){
      this.init = init;
      this.field = field;
    }

    function aget(self, entity){
      return IField.aget(self.field, entity);
    }

    function aset(self, entity, values){
      return IField.aset(self.field, entity, values);
    }

    function init(self){
      return _.into(IField.init(self.field), self.init());
    }

    function identifier(self){
      return IIdentifiable.identifier(self.field);
    }

    return _.doto(DefaultedField,
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IField, {aget: aget, aset: aset, init: init}));

  })();

  var defaultedField = _.fnil(_.constructs(DefaultedField), _.array, null);

  var BinComputedField = (function(){

    function BinComputedField(key, computations, emptyColl){
      this.key = key;
      this.computations = computations;
      this.emptyColl = emptyColl;
    }

    function aget(self, entity){
      return _.into(self.emptyColl, _.filter(_.isSome, _.map(_.applying(entity), self.computations)));
    }

    function identifier(self){
      return self.key;
    }

    return _.doto(BinComputedField,
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IField, {aget: aget}));

  })();

  var binComputedField = _.fnil(_.constructs(BinComputedField), null, [], optional);

  var BinField = (function(){

    function BinField(key, emptyColl){
      this.key = key;
      this.emptyColl = emptyColl;
    }

    function aget(self, entity){
      return _.into(self.emptyColl, _.maybe(entity.attrs, _.get(_, self.key), _.array));
    }

    function aset(self, entity, values){
      var value = _.last(_.into(self.emptyColl, values));
      return new entity.constructor(entity.repo, _.isSome(value) ? _.assoc(entity.attrs, self.key, value) : _.dissoc(entity.attrs, self.key));
    }

    function init(self){
      return self.emptyColl;
    }

    function identifier(self){
      return self.key;
    }

    return _.doto(BinField,
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IField, {aget: aget, aset: aset, init: init}));

  })();

  var binField = _.fnil(_.constructs(BinField), null, optional);

  var MultiBinField = (function(){

    function MultiBinField(key, emptyColl){
      this.key = key;
      this.emptyColl = emptyColl;
    }

    function aget(self, entity){
      return _.into(self.emptyColl, _.get(entity.attrs, self.key));
    }

    function aset(self, entity, values){
      var values = _.deref(_.into(self.emptyColl, values));
      return new entity.constructor(entity.repo, _.seq(values) ? _.assoc(entity.attrs, self.key, values) : _.dissoc(entity.attrs, self.key));
    }

    function init(self){
      return self.emptyColl;
    }

    function identifier(self){
      return self.key;
    }

    return _.doto(MultiBinField,
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IField, {aget: aget, aset: aset, init: init}));

  })();

  var multiBinField = _.fnil(_.constructs(MultiBinField), null, unlimited);

  var LabeledField = (function(){

    function LabeledField(label, field){
      this.label = label;
      this.field = field;
    }

    function aget(self, entity){
      return IField.aget(self.field, entity);
    }

    function aset(self, entity, values){
      return IField.aset(self.field, entity, values);
    }

    function init(self){
      return IField.init(self.field);
    }

    function title(self){
      return self.label;
    }

    function identifier(self){
      return IIdentifiable.identifier(self.field);
    }

    return _.doto(LabeledField,
      _.implement(ISubject, {title: title}),
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IField, {aget: aget, aset: aset, init: init}));

  })();

  var labeledField = _.constructs(LabeledField);

  var Bin = (function(){

    function Bin(type, title, identifier, schema, items){
      this.type = type;
      this.title = title;
      this.identifier = identifier;
      this.schema = schema;
      this.items = items;
    }

    function make(self, attrs){
      return attrs ? new self.type(self, attrs) : _.reduce(function(memo, key){
        var fld = field(self, key);
        return IField.aset(fld, memo, IField.init(fld));
      }, new self.type(self, {}), _.keys(self.schema));
    }

    function title(self){
      return self.title;
    }

    function identifier(self){
      return self.identifier;
    }

    function field(self, key){
      return _.get(self.schema, key);
    }

    function query(self, plan){
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve(self.items);
        }, 500);
      })
      //return Promise.resolve(self.items); //TODO use plan
    }

    function keys(self){
      return _.keys(self.schema);
    }
    return _.doto(Bin,
      _.implement(IKind, {field: field}),
      _.implement(ISubject, {title: title}),
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IMap, {keys: keys}),
      _.implement(IQueryable, {query: query}),
      _.implement(IFactory, {make: make}),
      _.implement(IStore, {commit: _.see("commit")}));

  })();

  function Schema(fields){
    this.fields = fields;
  }

  (function(){

    function conj(self, field){
      return new self.constructor(_.assoc(self.fields, IIdentifiable.identifier(field), field));
    }

    function lookup(self, key){
      return _.get(self.fields, key);
    }

    function keys(self){
      return _.keys(self.fields);
    }

    function vals(self){
      return _.vals(self.fields);
    }

    function dissoc(self, key){
      return new self.constructor(_.dissoc(self.fields, key));
    }

    function merge(self, other){
      return _.reduce(_.conj, self, _.vals(other));
    }

    _.doto(Schema,
      _.implement(IMergeable, {merge: merge}),
      _.implement(IMap, {keys: keys, vals: vals, dissoc: dissoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(ICollection, {conj: conj}));

  })();

  function schema(singular, plural){
    return new Schema({}, singular, plural);
  }

  var bin = _.constructs(Bin);

  function titleBehavior(key){

    function title1(self){
      return _.just(self, _.get(_, key), _.first);
    }

    function title2(self, text){
      return assert(self, key, text);
    }

    var title = _.overload(null, title1, title2);

    return _.does(
      _.implement(ISubject, {title: title}));

  }

  function defaultFieldBehavior(singular, plural){

    function defaultField(self, key){
      return _.isArray(_.get(self.attrs, key)) ? plural(key) : singular(key);
    }

    return _.does(
      _.implement(IDefaultField, {defaultField: defaultField}));

  }

  function Task(repo, attrs){
    this.repo = repo;
    this.attrs = attrs;
  }

  _.doto(Task,
    behaveAsEntity,
    defaultFieldBehavior(binField, multiBinField),
    titleBehavior("summary"));

  function Note(repo, attrs){
    this.repo = repo;
    this.attrs = attrs;
  }

  _.doto(Note,
    behaveAsEntity,
    defaultFieldBehavior(binField, multiBinField),
    titleBehavior("body"));

  var taggable = _.conj(schema(),
    labeledField("Tag", multiBinField("tag")));

  var tasks = (function(){

    function flag(name, pred){
      return function(entity){
        return pred(entity) ? name : null;
      }
    }

    function isOverdue(entity){
      return _.maybe(entity, _.get(_, "due"), _.first, _.gt(new Date(), _)); //impure
    }

    function isImportant(entity){
      return _.maybe(entity, _.get(_, "priority"), _.detect(_.eq(_, "A"), _));
    }

    return _.doto(new Bin(Task, "Task", "task",
      _.just(schema(),
        _.conj(_,
          labeledField("ID", defaultedField(_.comp(_.array, _.guid), binField("id", required))),
          labeledField("Summary", binField("summary", required)),
          labeledField("Priority", defaultedField(_.constantly(["C"]), binField("priority", optional))),
          labeledField("Detail", binField("detail", optional)),
          labeledField("Due Date", binField("due", optional)),
          labeledField("Overdue", binComputedField("overdue", [isOverdue], optional)),
          labeledField("Flags", binComputedField("flags", [flag("overdue", isOverdue), flag("important", isImportant)], unlimited)),
          labeledField("Assignee", binField("assignee", optional)),
          labeledField("Subtask", multiBinField("subtask")),
          labeledField("Note", multiBinField("note")),
          labeledField("Expanded", binField("expanded", required))),
        _.partial(IMergeable.merge, taggable)),
      []), function(bin){

      _.each(function(item){
        bin.items.push(item);
      }, _.map(function(attrs){
        return IFactory.make(bin, attrs);
      }, [{
        id: _.guid("a"),
        summary: "Build backyard patio",
        priority: "A",
        due: _.add(new Date(), _.days(-2)),
        expanded: true,
        subtask: [_.guid("b"), _.guid("c")],
        note: [_.guid("d")],
        tag: ["backlog"]
      },{
        id: _.guid("b"),
        summary: "Choose 3 potential materials and price them",
        expanded: false
      },{
        id: _.guid("c"),
        summary: "Get contractor quote",
        expanded: false
      }]));

    });

  })();

  var notes = (function(){

    return _.doto(new Bin(Note, "Note", "note",
      _.just(schema(),
        _.conj(_,
          labeledField("ID", defaultedField(_.comp(_.array, _.guid), binField("id", required))),
          labeledField("Body", binField("body", required))),
        _.partial(IMergeable.merge, taggable)),
      []), function(bin){

      _.each(function(item){
        bin.items.push(item);
      }, _.map(function(attrs){
        return IFactory.make(bin, attrs);
      }, [{
        id: _.guid("d"),
        body: "My first note",
        tag: ["cheese"]
      }]));

    });

  })();

  function Domain(repos){
    this.repos = repos;
  }

  function domain(repos){
    return _.reduce(_.conj, new Domain({}), repos || []);
  }

  (function(){

    function owner(self, txn){
      var entity = _.deref(txn);
      return _.detect(function(repo){
        return repo.type === entity.type ? repo : null;
      }, _.vals(self.repos));
    }

    function query(self, options){
      var type = _.get(options, "$type");
      return IQueryable.query(_.get(self.repos, type), null); //TODO web.toQueryString(_.dissoc(options, "$type")));
    }

    function commit(self, txn){
      _.each(function(cmd){
        IStore.commit(owner(self, cmd), cmd);
      }, ITransaction.commands(txn));
    }

    function make(self, options){
      return IFactory.make(_.get(self.repos, _.get(options, "$type")) || _.just(self.repos, _.keys, _.first, _.get(self.repos, _)), _.dissoc(options, "$type"));
    }

    function conj(self, repo){
      return new Domain(_.assoc(self.repos, IIdentifiable.identifier(repo), repo));
    }

    function resolve(self, refs){ //TODO implement
    }

    _.doto(Domain,
      _.implement(IResolver, {resolve: resolve}),
      _.implement(ICollection, {conj: conj}),
      _.implement(IEmptyableCollection, {empty: _.constantly(domain())}),
      _.implement(IPossession, {owner: owner}),
      _.implement(IFactory, {make: make}),
      _.implement(IQueryable, {query: query}),
      _.implement(IStore, {commit: commit}));

  })();

  function EntityCatalog(id, loaded, changed, touched){
    this.id = id; //for idempotence checking
    this.loaded = loaded;
    this.changed = changed;
    this.touched = touched;
  }

  function Transaction(buffer, user){
    this.buffer = buffer;
    this.user = user;
  }

  var transaction = _.constructs(Transaction);

  (function(){

    function eid(self){
      return IEntity.eid(self.buffer);
    }

    function commands(self){ //TODO serializable commands with sufficient data for later application
      return ITransaction.commands(self.buffer); //TODO wrap each command with additional information (e.g. user, owning txn id)
    }

    _.doto(Transaction, //TODO some way of validating both the changed entities and the overall transaction
      _.implement(IEntity, {eid: eid}),
      _.implement(ITransaction, {commands: commands}));

  })();

  function Addition(entity){
    this.entity = entity;
  }

  var addition = _.constructs(Addition);

  (function(){

    function deref(self){
      return self.entity;
    }

    _.doto(Addition,
      _.implement(IDeref, {deref: deref}));

  })();

  function Destruction(entity){
    this.entity = entity;
  }

  var destruction = _.constructs(Destruction);

  (function(){

    function deref(self){
      return self.entity;
    }

    _.doto(Destruction,
      _.implement(IDeref, {deref: deref}));

  })();

  function Modification(before, after){
    this.before = before;
    this.after = after;
  }

  var modification = _.constructs(Modification);

  (function(){

    function deref(self){
      return self.after;
    }

    _.doto(Modification,
      _.implement(IDeref, {deref: deref}));

  })();

  (function(){

    //TODO should `clone` return identity or a copy? i returned identity because I assumed no mutation.

    function query(self, qs){
      return ISeqable.seq(self);
    }

    function load(self, entities){
      return entityCatalog(mut.withMutations(self.loaded, function(loaded){
        return _.reduce(function(memo, entity){
          var id = _.str(IEntity.eid(entity));
          if (!_.contains(memo, id)) {
            mut.assoc(memo, id, entity);
          }
          return memo;
        }, loaded, entities);
      }), self.changed, _.mapa(IEntity.eid, entities));
    }

    function add(self, entities){
      return entityCatalog(self.loaded, mut.withMutations(self.changed, function(changed){
        return _.reduce(function(memo, entity){
          var id = _.str(IEntity.eid(entity));
          if (!_.contains(memo, id)){
            mut.assoc(memo, id, entity);
          }
          return memo;
        }, changed, entities);
      }), _.mapa(IEntity.eid, entities));
    }

    function edit(self, entities){
      return entityCatalog(self.loaded, mut.withMutations(self.changed, function(changed){
        return _.reduce(function(memo, entity){
          var id = _.str(IEntity.eid(entity));
          if (_.contains(self.loaded, id) || _.contains(memo, id)) {
            mut.assoc(memo, id, entity);
          }
          return memo;
        }, changed, entities);
      }), _.mapa(IEntity.eid, entities));
    }

    function destroy(self, entities){
      return entityCatalog(self.loaded, mut.withMutations(self.changed, function(changed){
        return _.reduce(function(memo, entity){
          var id = _.str(IEntity.eid(entity));
          if (_.contains(self.loaded, id)) {
            mut.assoc(memo, id, null);
          } else if (_.contains(memo, id)) {
            mut.dissoc(memo, id);
          }
          return  memo;
        }, changed, entities);
      }), _.mapa(IEntity.eid, entities));
    }

    function dirty(self, entity){
      var id = _.str(IEntity.eid(entity));
      return _.notEq(entity, _.get(self.loaded, id));
    }

    function changes(self){
      return _.count(_.keys(self.changed)) ? transaction(self, context.userId) : null;
    }

    function includes(self, entity){
      return IAssociative.contains(self, IEntity.eid(entity));
    }

    function first(self){
      return ISeq.first(vals(self));
    }

    function rest(self){
      return ISeq.rest(vals(self));
    }

    function next(self){
      return ISeqable.seq(rest(self));
    }

    function seq(self){
      return ISeqable.seq(IMap.keys(self)) ? self : null;
    }

    function lookup(self, guid){
      return IAssociative.contains(self.changed, guid) ? _.get(self.changed, _.str(guid)) : _.get(self.loaded, _.str(guid));
    }

    function reduce(self, xf, init){
      return IReduce.reduce(_.map(_.get(self, _), _.keys(self)), xf, init);
    }

    function dissoc(self, guid){
      var id = _.str(guid);
      return IAssociative.contains(self, id) ?
        entityCatalog(
          IAssociative.contains(self.loaded, id) ? IMap.dissoc(self.loaded, id) : self.loaded,
          IAssociative.contains(self.changed, id) ? IMap.dissoc(self.changed, id) : self.changed, _.cons(guid)) : self;
    }

    function keys(self){
      return _.filter(_.get(self, _),
        imm.distinct(_.concat(_.keys(self.loaded), _.keys(self.changed))));
    }

    function vals(self){
      return _.map(_.get(self, _), _.keys(self));
    }

    function count(self){
      return _.count(keys(self));
    }

    function contains(self, guid){
      return !!ILookup.lookup(self, guid);
    }

    function eid(self){
      return self.id;
    }

    function changed(before, after){
      if (before && after) {
        if (_.eq(before, after)) {
          return [];
        } else if (before.constructor !== after.constructor) { //type changed
          return [destruction(before), addition(after)];
        } else {
          return [modification(before, after)];
        }
      } else if (before) {
        return [destruction(before)];
      } else if (after) {
        return [addition(after)];
      } else {
        return [];
      }
    }

    function commands(self){
      return _.just(self.changed,
        _.keys,
        _.mapcat(function(id){
          return changed(_.get(self.loaded, id), _.get(self.changed, id));
        }, _));
    }

    function resolve(self, refs){
      return _.mapa(function(ref){
        return _.detect(function(entity){
          return entity.attrs.Id === ref.value; //TODO inefficient non-indexed access
        }, self);
      }, refs);
    }

    function touched(self){
      return self.touched;
    }

    function nth(self, idx){
      return _.first(_.drop(idx, self));
    }

    _.doto(EntityCatalog,
      _.implement(IResolver, {resolve: resolve}),
      _.implement(IIndexed, {nth: nth}),
      _.implement(IEntity, {eid: eid}),
      _.implement(IQueryable, {query: query}),
      _.implement(ITransaction, {commands: commands}),
      _.implement(ICatalog, {dirty: dirty, load: load, add: add, edit: edit, destroy: destroy, changes: changes, touched: touched}),
      _.implement(ICounted, {count: count}),
      _.implement(IAssociative, {contains: contains}),
      _.implement(IMap, {keys: keys, vals: vals, dissoc: dissoc}),
      _.implement(IReduce, {reduce: reduce}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(ISeq, {first: first, rest: rest}),
      _.implement(INext, {next: next}),
      _.implement(ISeqable, {seq: seq}),
      _.implement(IInclusive, {includes: includes}),
      _.implement(IEmptyableCollection, {empty: buffer}));

  })();

  function entityCatalog(loaded, changed, touched){
    return new EntityCatalog(_.guid(), loaded, changed, touched);
  }

  var _catalog = entityCatalog({}, {});

  function catalog(){
    return _catalog;
  }

  function TypedEntityCatalog(catalog, types){
    this.catalog = catalog;
    this.types = types;
  }

  function typedCatalog2(catalog, types){
    return new TypedEntityCatalog(catalog, types);
  }

  function typedCatalog1(catalog){
    return typedCatalog2(catalog, {});
  }

  function typedCatalog0(){
    return typedCatalog1(catalog());
  }

  var typedCatalog = _.overload(typedCatalog0, typedCatalog1, typedCatalog2);

  (function(){

    function query(self, options){
      return _.maybe(_.get(self.types, _.get(options, "$type")), IQueryable.query);
    }

    function load(self, entities){
      return typedCatalog(ICatalog.load(self.catalog, entities), _.reducekv(function(memo, key, value){
        return _.update(memo, key, function(b){
          return ICatalog.load(b || catalog(), value);
        });
      }, self.types, _.groupBy(function(entity){
        return IKind.kind(entity);
      }, entities)));
    }

    function add(self, entities){
      return typedCatalog(ICatalog.add(self.catalog, entities), _.reducekv(function(memo, key, value){
        return _.update(memo, key, function(b){
          return ICatalog.add(b || catalog(), value);
        });
      }, self.types,  _.groupBy(function(entity){
        return IKind.kind(entity);
      }, entities)));
    }

    function edit(self, entities){
      return typedCatalog(ICatalog.edit(self.catalog, entities), _.reducekv(function(memo, key, value){
        return _.update(memo, key, function(b){
          return ICatalog.edit(b || catalog(), value);
        });
      }, self.types, _.groupBy(function(entity){
        return IKind.kind(entity);
      }, entities)));
    }

    function destroy(self, entities){
      return typedCatalog(ICatalog.destroy(self.catalog, entities), _.reducekv(function(memo, key, value){
        return _.update(memo, key, function(b){
          return ICatalog.destroy(b || catalog(), value);
        });
      }, self.types, _.groupBy(function(entity){
        return IKind.kind(entity);
      }, entities)));
    }

    var forward = _.forwardTo("catalog");
    var dirty = forward(ICatalog.dirty);
    var changes = forward(ICatalog.changes);
    var includes = forward(IInclusive.includes);
    var first = forward(ISeq.first);
    var rest = forward(ISeq.rest);
    var next = forward(INext.next);
    var seq = forward(ISeqable.seq);
    var lookup = forward(ILookup.lookup);
    var reduce = forward(IReduce.reduce);
    var keys = forward(IMap.keys);
    var vals = forward(IMap.vals);
    var count = forward(ICounted.count);
    var contains = forward(IAssociative.contains);
    var eid = forward(IEntity.eid);
    var commands = forward(ITransaction.commands);

    function dissoc(self, guid){
    }

    function resolve(self, refs){
      return _.reducekv(function(memo, idx, ref){
        return _.assoc(memo, idx, _.get(self, ref));
      }, refs, refs);
    }

    _.doto(TypedEntityCatalog,
      _.implement(IEntity, {eid: eid}),
      _.implement(IResolver, {resolve: resolve}),
      _.implement(IQueryable, {query: query}),
      _.implement(ITransaction, {commands: commands}),
      _.implement(ICatalog, {dirty: dirty, load: load, add: add, edit: edit, destroy: destroy, changes: changes}),
      _.implement(ICounted, {count: count}),
      _.implement(IAssociative, {contains: contains}),
      _.implement(IMap, {keys: keys, vals: vals, dissoc: dissoc}),
      _.implement(IReduce, {reduce: reduce}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(ISeq, {first: first, rest: rest}),
      _.implement(INext, {next: next}),
      _.implement(ISeqable, {seq: seq}),
      _.implement(IInclusive, {includes: includes}),
      _.implement(IEmptyableCollection, {empty: typedCatalog}));

  })();

  _.doto(_.Nil,
    _.implement(ITransaction, {commands: _.constantly(null)}));

  function Bus(middlewares){
    this.middlewares = middlewares;
  }

  function bus(middlewares){
    return new Bus(middlewares || []);
  }

  (function(){

    function conj(self, middleware){
      self.middlewares = _.conj(self.middlewares, middleware);
    }

    function handle(self, message, next){
      var f = _.reduce(function(memo, middleware){
        return $.handle(middleware, _, memo);
      }, next || _.noop, _.reverse(self.middlewares));
      f(message);
    }

    function dispatch(self, message){
      handle(self, message);
    }

    return _.doto(Bus,
      _.implement(ITransientCollection, {conj: conj}),
      _.implement(IDispatch, {dispatch: dispatch}),
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LoadCommand(entities){
    this.entities = entities;
  }

  var loadCommand = _.constructs(LoadCommand);

  (function(){

    return _.doto(LoadCommand,
      _.implement(IIdentifiable, {identifier: _.constantly("load")}))

  })();

  function LoadedEvent(entities){
    this.entities = entities;
  }

  var loadedEvent = _.constructs(LoadedEvent);

  (function(){

    return _.doto(LoadedEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("loaded")}))

  })();

  function LoadHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var loadHandler = _.constructs(LoadHandler);

  (function(){

    function handle(self, command, next){
      ICatalog.load(self.buffer, command.entities); //TODO ITransientBuffer.load
      $.raise(self.provider, loadedEvent(command.entities));
      next(command);
    }

    return _.doto(LoadHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function NullHandler(){
  }

  var nullHandler = new NullHandler();

  (function(){

    function handle(self, message, next){
      next(message);
    }

    return _.doto(NullHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function AddCommand(text, options){
    this.text = text;
    this.options = options;
  }

  function addCommand(text, options){
    return new AddCommand(text, options || {});
  }

  (function(){

    function lookup(self, key){
      switch(key){
        case "id":
        case "type":
          return self.options[key];
        case "text":
          return self.text;
        default:
          return null;
      }
    }

    function assoc(self, key, value){
      switch(key){
        case "id":
        case "type":
          return new self.constructor(self.text, _.assoc(self.options, key, value));
        case "text":
          return new self.constructor(value, self.options);
        default:
          return self;
      }
    }

    return _.doto(AddCommand,
      _.implement(IAssociative, {assoc: assoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IIdentifiable, {identifier: _.constantly("add")}));

  })();

  function AddHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var addHandler = _.constructs(AddHandler);

  (function(){

    function handle(self, command, next){
      var entity = IFactory.make(self.buffer, {id: _.get(command, "id") || _.guid(), $type: _.get(command, "type")});
      _.swap(self.buffer, function(buffer){
        return ICatalog.add(buffer, [ISubject.title(entity, _.get(command, "text"))]);
      });
      $.raise(self.provider, addedEvent(IEntity.eid(entity), _.get(command, "text")));
      next(command);
    }

    _.doto(AddHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function AddedEvent(id, text){
    this.id = id;
    this.text = text;
  }

  var addedEvent = _.constructs(AddedEvent);

  function AddedHandler(model, commandBus){
    this.model = model;
    this.commandBus = commandBus;
  }

  var addedHandler = _.constructs(AddedHandler);

  (function(){

    function handle(self, event, next){
      _.each(function(id){
        $.dispatch(self.commandBus, deselectCommand(id));
      }, _.get(_.deref(self.model), "selected"));
      $.dispatch(self.commandBus, selectCommand(_.get(event, "id")));
      next(event);
    }

    _.doto(AddedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();






  (function(){

    return _.doto(AddedEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("added")}));

  })();

  function ToggleCommand(key, options){
    this.key = key;
    this.options = options;
  }

  function toggleCommand(key, options){
    return new ToggleCommand(key, options || {});
  }

  (function(){

    function lookup(self, key){
      switch(key){
        case "id":
          return self.options[key];
        case "key":
          return self.key;
        default:
          return null;
      }
    }

    function assoc(self, key, value){
      switch(key){
        case "id":
          return new self.constructor(self.key, _.assoc(self.options, key, value));
        case "key":
          return new self.constructor(value, self.options);
        default:
          return self;
      }
    }

    return _.doto(ToggleCommand,
      _.implement(IAssociative, {assoc: assoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IIdentifiable, {identifier: _.constantly("toggle")}));

  })();

  function ToggleHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var toggleHandler = _.constructs(ToggleHandler);

  (function(){

    function handle(self, command, next){
      var entity = _.get(self.buffer, _.get(command, "id"));
      if (entity) {
        _.swap(self.buffer, function(buffer){
          var values = _.just(entity, _.get(_, _.get(command, "key")), _.fmap(_, _.not));
          return ICatalog.edit(buffer, [_.assoc(entity, _.get(command, "key"), values)]);
        });
        $.raise(self.provider, toggledEvent(_.get(command, "id"), _.get(command, "key")));
      }
      next(command);
    }

    _.doto(ToggleHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function ToggledEvent(id, key){
    this.id = id;
    this.key = key;
  }

  var toggledEvent = _.constructs(ToggledEvent);

  (function(){

    return _.doto(ToggledEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("toggled")}));

  })();

  function TagCommand(value, options){
    this.value = value;
    this.options = options;
  }

  function tagCommand(value, options){
    return new TagCommand(value, options || {});
  }

  (function(){

    function lookup(self, key){
      switch(key){
        case "id":
          return self.options[key];
        case "value":
          return self.value;
        default:
          return null;
      }
    }

    function assoc(self, key, value){
      switch(key){
        case "id":
          return new self.constructor(self.value, _.assoc(self.options, key, value));
        case "value":
          return new self.constructor(value, self.options);
        default:
          return self;
      }
    }

    return _.doto(TagCommand,
      _.implement(IAssociative, {assoc: assoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IIdentifiable, {identifier: _.constantly("tag")}));

  })();

  function TagHandler(handler){
    this.handler = handler;
  }

  var tagHandler = _.constructs(TagHandler);

  (function(){

    function handle(self, command, next){
      $.handle(self.handler, assertCommand("tag", _.get(command, "value"), command.options), next);
      //next(command);
    }

    _.doto(TagHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function UntagCommand(value, options){
    this.value = value;
    this.options = options;
  }

  function untagCommand(value, options){
    return new UntagCommand(value, options || {});
  }

  (function(){

    function lookup(self, key){
      switch(key){
        case "id":
          return self.options[key];
        case "value":
          return self.value;
        default:
          return null;
      }
    }

    function assoc(self, key, value){
      switch(key){
        case "id":
          return new self.constructor(self.value, _.assoc(self.options, key, value));
        case "value":
          return new self.constructor(value, self.options);
        default:
          return self;
      }
    }

    return _.doto(UntagCommand,
      _.implement(IAssociative, {assoc: assoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IIdentifiable, {identifier: _.constantly("untag")}));

  })();

  function UntagHandler(handler){
    this.handler = handler;
  }

  var untagHandler = _.constructs(UntagHandler);

  (function(){

    function handle(self, command, next){
      $.handle(self.handler, retractCommand("tag", _.assoc(command.options, "value", command.value)), next);
    }

    _.doto(UntagHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function CastCommand(type, options){
    this.type = type;
    this.options = options;
  }

  function castCommand(type, options){
    return new CastCommand(type, options || {});
  }

  (function(){

    function lookup(self, key){
      switch(key){
        case "id":
          return self.options[key];
        case "type":
          return self.type;
        default:
          return null;
      }
    }

    function assoc(self, key, value){
      switch(key){
        case "id":
          return new self.constructor(self.type, _.assoc(self.options, key, value));
        case "type":
          return new self.constructor(value, self.options);
        default:
          return self;
      }
    }

    return _.doto(CastCommand,
      _.implement(IAssociative, {assoc: assoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IIdentifiable, {identifier: _.constantly("cast")}));

  })();

  function CastHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var castHandler = _.constructs(CastHandler);

  (function(){

    //it's unavoidable that attributes may not line up on a cast, so cast wisely.
    function handle(self, command, next){
      var existing = _.get(self.buffer, _.get(command, "id"));
      if (existing) {
        var entity = IFactory.make(self.buffer, Object.assign({}, existing.attrs, {$type: _.get(command, "type")}));
        _.swap(self.buffer, function(buffer){
          return ICatalog.edit(buffer, [entity]);
        });
        $.raise(self.provider, castedEvent(_.get(command, "id"), _.get(command, "type")));
      }
      next(command);
    }

    _.doto(CastHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function CastedEvent(id, type){
    this.id = id;
    this.type = type;
  }

  var castedEvent = _.constructs(CastedEvent);

  (function(){

    return _.doto(CastedEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("casted")}));

  })();

  function UndoCommand(){
  }

  function undoCommand(){
    return new UndoCommand();
  }

  (function(){

    return _.doto(UndoCommand,
      _.implement(IIdentifiable, {identifier: _.constantly("undo")}));

  })();

  function timeTravels(able, effect, event){

    function handle(self, command, next){
      if (able(self.buffer)){
        effect(self.buffer);
        $.raise(self.provider, event);
      }
      next(command);
    }

    return _.does(
      _.implement(IMiddleware, {handle: handle}));

  }

  function UndoHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var undoHandler = _.constructs(UndoHandler);

  function UndoneEvent(){
  }

  var undoneEvent = _.constructs(UndoneEvent);

  (function(){

    return _.doto(UndoneEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("undone")}));

  })();

  _.doto(UndoHandler,
    timeTravels(ITimeTravel.undoable, ITimeTravel.undo, undoneEvent()));

  function RedoCommand(){
  }

  function redoCommand(){
    return new RedoCommand();
  }

  (function(){

    return _.doto(RedoCommand,
      _.implement(IIdentifiable, {identifier: _.constantly("redo")}));

  })();

  function RedoHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var redoHandler = _.constructs(RedoHandler);

  function RedoneEvent(){
  }

  var redoneEvent = _.constructs(RedoneEvent);

  (function(){

    return _.doto(RedoneEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("redone")}));

  })();

  _.doto(RedoHandler,
    timeTravels(ITimeTravel.redoable, ITimeTravel.redo, redoneEvent()));

  function FlushCommand(){
  }

  function flushCommand(){
    return new FlushCommand();
  }

  (function(){

    return _.doto(FlushCommand,
      _.implement(IIdentifiable, {identifier: _.constantly("flush")}));

  })();

  function FlushHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var flushHandler = _.constructs(FlushHandler);

  function FlushedEvent(){
  }

  var flushedEvent = _.constructs(FlushedEvent);

  (function(){

    return _.doto(FlushedEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("flushed")}));

  })();

  _.doto(FlushHandler,
    timeTravels(_.constantly(true), ITimeTravel.flush, flushedEvent()));

  function AssertCommand(key, value, options){
    this.key = key;
    this.value = value;
    this.options = options;
  }

  function assertCommand(key, value, options){
    return new AssertCommand(key, value, options || {});
  }

  (function(){

    function lookup(self, key){
      switch(key){
        case "id":
          return self.options.id;
        case "key":
          return self.key;
        case "value":
          return self.value;
        default:
          return null;
      }
    }

    function assoc(self, key, value){
      switch(key){
        case "id":
          return new self.constructor(self.key, self.value, _.assoc(self.options, key, value));
        case "key":
          return new self.constructor(value, self.value, self.options);
        case "value":
          return new self.constructor(self.key, value, self.options);
        default:
          return self;
      }
    }

    return _.doto(AssertCommand,
      _.implement(IAssociative, {assoc: assoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IIdentifiable, {identifier: _.constantly("assert")}));

  })();

  function AssertHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var assertHandler = _.constructs(AssertHandler);

  (function(){

    function handle(self, command, next){
      var entity = _.get(self.buffer, _.get(command, "id"));
      if (entity) {
        _.swap(self.buffer, function(buffer){
          return ICatalog.edit(buffer, [assert(entity, _.get(command, "key"), _.get(command, "value"))]);
        });
        $.raise(self.provider, assertedEvent(_.get(command, "id"), _.get(command, "key"), _.get(command, "value")));
      }
      next(command);
    }

    _.doto(AssertHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function AssertedEvent(id, key, value){
    this.id = id;
    this.key = key;
    this.value = value;
  }

  var assertedEvent = _.constructs(AssertedEvent);

  (function(){

    return _.doto(AssertedEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("asserted")}));

  })();

  function DestroyCommand(id){
    this.id = id;
  }

  var destroyCommand = _.constructs(DestroyCommand);

  (function(){

    function assoc(self, key, value){
      switch(key){
        case "id":
          return destroyCommand(value, self.key, self.value);
        default:
          return self;
      }
    }

    return _.doto(DestroyCommand,
      _.implement(IAssociative, {assoc: assoc}),
      _.implement(IIdentifiable, {identifier: _.constantly("destroy")}));

  })();

  function DestroyHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var destroyHandler = _.constructs(DestroyHandler);

  (function(){

    function handle(self, command, next){
      var entity = _.get(self.buffer, command.id);
      if (entity) {
        _.swap(self.buffer, function(buffer){
          return ICatalog.destroy(buffer, [entity]);
        });
        $.raise(self.provider, destroyedEvent(command.id));
      }
      next(command);
    }

    _.doto(DestroyHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DestroyedEvent(id){
    this.id = id;
  }

  var destroyedEvent = _.constructs(DestroyedEvent);

  (function(){

    return _.doto(DestroyedEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("destroyed")}));

  })();

  function SelectionHandler(model, handler){
    this.model = model;
    this.handler = handler;
  }

  var selectionHandler = _.constructs(SelectionHandler);

  (function(){

    function handle(self, command, next){
      if (_.get(command, "id")) {
        $.handle(self.handler, command, next);
      } else {
        _.each(function(id){
          $.handle(self.handler, _.assoc(command, "id", id));
        }, _.just(self.model, _.deref, _.get(_, "selected")));
      }
      next(command);
    }

    _.doto(SelectionHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function RetractCommand(key, options){
    this.key = key;
    this.options = options;
  }

  function retractCommand(key, options){
    return new RetractCommand(key, options || {});
  }

  (function(){

    function lookup(self, key){
      switch(key){
        case "id":
          return self.options.id;
        case "key":
          return self.key;
        case "value":
          return self.options.value;
        default:
          return null;
      }
    }

    function assoc(self, key, value){
      switch(key){
        case "id":
        case "value":
          return new self.constructor(self.key, _.assoc(self.options, key, value));
        case "key":
          return new self.constructor(value, self.options);
        default:
          return self;
      }
    }

    return _.doto(RetractCommand,
      _.implement(IAssociative, {assoc: assoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IIdentifiable, {identifier: _.constantly("retract")}));

  })();

  function RetractHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var retractHandler = _.constructs(RetractHandler);

  (function(){

    function handle(self, command, next){
      var entity = _.get(self.buffer, _.get(command, "id"));
      _.swap(self.buffer, function(buffer){
        return ICatalog.edit(buffer, [_.isSome(_.get(command, "value")) ? retract(entity, _.get(command, "key"), _.get(command, "value")) : retract(entity, _.get(command, "key"))]);
      });
      $.raise(self.provider, retractedEvent(_.get(command, "id"), _.get(command, "key"), _.get(command, "value")));
      next(command);
    }

    _.doto(RetractHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function RetractedEvent(id, key, value){
    this.id = id;
    this.key = key;
    this.value = value;
  }

  var retractedEvent = _.constructs(RetractedEvent);

  (function(){

    return _.doto(RetractedEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("retracted")}));

  })();

  function QueryCommand(plan){
    this.plan = plan;
  }

  var queryCommand = _.constructs(QueryCommand);

  (function(){

    return _.doto(QueryCommand,
      _.implement(IIdentifiable, {identifier: _.constantly("query")}));

  })();

  function QueriedEvent(entities){
    this.entities = entities;
  }

  var queriedEvent = _.constructs(QueriedEvent);

  (function(){

    return _.doto(QueriedEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("queried")}));

  })();

  function QueryHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var queryHandler = _.constructs(QueryHandler);

  (function(){

    function handle(self, command, next){
      return _.fmap(IQueryable.query(self.buffer, command.plan), function(entities){
        $.raise(self.provider, queriedEvent(entities));
        next(command);
      });
    }

    return _.doto(QueryHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function QueriedHandler(commandBus){
    this.commandBus = commandBus;
  }

  var queriedHandler = _.constructs(QueriedHandler);

  (function(){

    function handle(self, event, next){
      $.dispatch(self.commandBus, loadCommand(event.entities));
      next(event);
    }

    return _.doto(QueriedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SelectCommand(id){
    this.id = id;
  }

  var selectCommand = _.constructs(SelectCommand);

  (function(){

    return _.doto(SelectCommand,
      _.implement(IIdentifiable, {identifier: _.constantly("select")}))

  })();

  function SelectedEvent(id){
    this.id = id;
  }

  var selectedEvent = _.constructs(SelectedEvent);

  (function(){

    return _.doto(SelectedEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("selected")}))

  })();

  function SelectHandler(model, provider){
    this.model = model;
    this.provider = provider;
  }

  var selectHandler = _.constructs(SelectHandler);

  (function(){

    function handle(self, command, next){
      _.swap(self.model,
        _.update(_, "selected",
          _.conj(_, command.id)));
      $.raise(self.provider, selectedEvent(command.id));
      next(command);
    }

    return _.doto(SelectHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DeselectCommand(id){
    this.id = id;
  }

  var deselectCommand = _.constructs(DeselectCommand);

  (function(){

    return _.doto(DeselectCommand,
      _.implement(IIdentifiable, {identifier: _.constantly("deselect")}))

  })();

  function DeselectedEvent(id){
    this.id = id;
  }

  var deselectedEvent = _.constructs(DeselectedEvent);

  (function(){

    return _.doto(DeselectedEvent,
      _.implement(IIdentifiable, {identifier: _.constantly("deselected")}))

  })();

  function DeselectHandler(model, provider){
    this.model = model;
    this.provider = provider;
  }

  var deselectHandler = _.constructs(DeselectHandler);

  (function(){

    function handle(self, command, next){
      _.swap(self.model,
        _.update(_, "selected",
          _.disj(_, command.id)));
      $.raise(self.provider, deselectedEvent(command.id));
      next(command);
    }

    return _.doto(DeselectHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LockingMiddleware(middleware, queued, handling){
    this.middleware = middleware;
    this.queued = queued;
    this.handling = handling;
  }

  function lockingMiddleware(middleware){
    return new LockingMiddleware(middleware, [], false);
  }

  (function(){

    function handle(self, message, next){
      if (self.handling) {
        self.queued.push(message);
      } else {
        self.handling = true;
        IMiddleware.handle(self.middleware, message, function(message){
          self.handling = false;
          next(message);
          if (self.queued.length) {
            handle(self, self.queued.unshift(), next);
          }
        });
      }
    }

    return _.doto(LockingMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LoggerMiddleware(label){
    this.label = label; //TODO use logger role/protocol here
  }

  var loggerMiddleware = _.constructs(LoggerMiddleware);

  (function(){

    function handle(self, message, next){
      _.log(self.label, message);
      next(message);
    }

    return _.doto(LoggerMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DrainEventsMiddleware(provider, eventBus){
    this.provider = provider;
    this.eventBus = eventBus;
  }

  var drainEventsMiddleware = _.constructs(DrainEventsMiddleware);

  (function(){

    function handle(self, command, next){
      next(command);
      _.each(function(message){
        IMiddleware.handle(self.eventBus, message, next);
      }, $.release(self.provider));
    }

    return _.doto(DrainEventsMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function EventMiddleware(emitter){
    this.emitter = emitter;
  }

  var eventMiddleware = _.constructs(EventMiddleware);

  (function(){

    function handle(self, event, next){
      $.pub(self.emitter, event);
      next(event);
    }

    return _.doto(EventMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })()

  function HandlerMiddleware(handlers, identify, fallback){
    this.handlers = handlers;
    this.identify = identify;
    this.fallback = fallback;
  }

  var handlerMiddleware3 = _.constructs(HandlerMiddleware);

  function handlerMiddleware2(identify, fallback){
    return handlerMiddleware3({}, identify, fallback);
  }

  function handlerMiddleware1(identify){
    return handlerMiddleware2(identify, null);
  }

  function handlerMiddleware0(){
    return handlerMiddleware1(IIdentifiable.identifier);
  }

  var handlerMiddleware = _.overload(handlerMiddleware0, handlerMiddleware1, handlerMiddleware2, handlerMiddleware3);

  (function(){

    function assoc(self, key, handler){
      self.handlers = _.assoc(self.handlers, key, handler);
    }

    function handle(self, message, next){
      var handler = _.get(self.handlers, self.identify(message), self.fallback);
      if (handler){
        $.handle(handler, message, next);
      }
      next(message);
    }

    return _.doto(HandlerMiddleware,
      _.implement(ITransientAssociative, {assoc: assoc}),
      _.implement(IMiddleware, {handle: handle}));

  })();

  function Buffer(repo, catalog){
    this.repo = repo;
    this.catalog = catalog;
  }

  var buffer = _.constructs(Buffer);

  (function(){

    var forward = _.forwardTo("catalog");

    function make(self, attrs){
      return IFactory.make(self.repo, attrs);
    }

    function edit(self, entities){
      _.swap(self.catalog, function(catalog){
        return ICatalog.edit(catalog, entities);
      });
    }

    function lookup(self, id){
      return _.just(self.catalog, _.deref, _.get(_, id));
    }

    function load(self, entities){
      _.swap(self.catalog, function(catalog){
        return ICatalog.load(catalog, entities);
      });
    }

    function query(self, plan){
      return IQueryable.query(self.repo, plan);
    }

    var swap = forward(ISwap.swap);
    var undo = forward(ITimeTravel.undo);
    var redo = forward(ITimeTravel.redo);
    var flush = forward(ITimeTravel.flush);
    var undoable = forward(ITimeTravel.undoable);
    var redoable = forward(ITimeTravel.redoable);

    _.doto(Buffer,
      _.implement(ITimeTravel, {undo: undo, redo: redo, flush: flush, undoable: undoable, redoable: redoable}),
      _.implement(IFactory, {make: make}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(ISwap, {swap: swap}),
      _.implement(ICatalog, {load: load, edit: edit}), //TODO ITransientBuffer.load
      _.implement(IQueryable, {query: query}));

  })();

  //NOTE a view is capable of returning a seq of all possible `IView.interactions` each implementing `IIdentifiable` and `ISubject`.
  //NOTE an interaction is a persistent, validatable object with field schema.  It will be flagged as command or query which will help with processing esp. pipelining.  When successfully validated it has all that it needs to be handled by the handler.  That it can be introspected allows for the UI to help will completing them.
  function Outline(buffer, model, commandBus, eventBus, emitter, options){
    this.buffer = buffer;
    this.model = model;
    this.commandBus = commandBus;
    this.eventBus = eventBus;
    this.emitter = emitter;
    this.options = options;
  }

  function outline(buffer, options){
    var model = $.cell({
          root: options.root, //identify the root entities from where rendering begins
          selected: _.into(imm.set(), options.selected || []), //track which entities are selected
          expanded: _.into(imm.set(), options.expanded || []) //track which entities are expanded vs collapsed
        }),
        events = $.events(),
        eventBus = bus(),
        commandBus = bus(),
        emitter = $.broadcast();

    _.doto(eventBus,
      mut.conj(_,
        eventMiddleware(emitter),
        _.doto(handlerMiddleware(),
          mut.assoc(_, "added", addedHandler(model, commandBus)),
          mut.assoc(_, "queried", queriedHandler(commandBus)))));

    _.doto(commandBus,
      mut.conj(_,
        loggerMiddleware("command"),
        lockingMiddleware(
          _.doto(handlerMiddleware(),
            mut.assoc(_, "load", loadHandler(buffer, events)),
            mut.assoc(_, "add", addHandler(buffer, events)),
            mut.assoc(_, "undo", undoHandler(buffer, events)),
            mut.assoc(_, "redo", redoHandler(buffer, events)),
            mut.assoc(_, "flush", flushHandler(buffer, events)),
            mut.assoc(_, "cast", selectionHandler(model, castHandler(buffer, events))),
            mut.assoc(_, "tag", tagHandler(selectionHandler(model, assertHandler(buffer, events)))),
            mut.assoc(_, "untag", untagHandler(selectionHandler(model, retractHandler(buffer, events)))),
            mut.assoc(_, "toggle", selectionHandler(model, toggleHandler(buffer, events))),
            mut.assoc(_, "assert", selectionHandler(model, assertHandler(buffer, events))),
            mut.assoc(_, "retract", selectionHandler(model, retractHandler(buffer, events))),
            mut.assoc(_, "destroy", selectionHandler(model, destroyHandler(buffer, events))),
            mut.assoc(_, "query", queryHandler(buffer, events)),
            mut.assoc(_, "select", selectHandler(model, events)),
            mut.assoc(_, "deselect", deselectHandler(model, events)))),
        drainEventsMiddleware(events, eventBus)));

    return new Outline(buffer, model, commandBus, eventBus, emitter, options);
  }

  (function(){
    function render(self, el){
      _.log("render", self, el);
      //TODO implement
    }

    function dispatch(self, command){
      $.dispatch(self.commandBus, command);
    }

    function lookup(self, guid){ //for development purposes, not meant for permanent use
      return _.get(self.buffer, guid);
    }

    function sub(self, observer){ //TODO consider keeping these events private
      return ISubscribe.sub(self.emitter, observer);
    }

    return _.doto(Outline,
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IDispatch, {dispatch: dispatch}),
      _.implement(ISubscribe, {sub: sub}),
      _.implement(IView, {render: render}));

  })();

  var buf = buffer(domain([tasks, notes]), timeTravelCell($.cell(typedCatalog())));

  _.each(function(el){
    var a = _.guid("a"), //TODO use memoize on fn with weakMap?
        b = _.guid("b"),
        c = _.guid("c");
    var ol = outline(buf, {root: a});
    IView.render(ol, el);
    $.sub(ol, _.see("event"));
    _.each($.dispatch(ol, _), [
      queryCommand({$type: "task"}),
      queryCommand({$type: "note"}),
      selectCommand(a),
      selectCommand(b),
      selectCommand(c),
      deselectCommand(c)
      //assertCommand(null, "priority", "C")
    ]);
    Object.assign(window, {ol: ol});
  }, dom.sel("#outline"));

  return _.just(protocols, _.reduce(_.merge, _, _.map(function(protocol){
    return _.reduce(function(memo, key){
      return _.assoc(memo, key, protocol[key]);
    }, {}, Object.keys(protocol));
  }, _.vals(protocols))), _.merge(_, {
    optional: optional,
    required: required,
    unlimited: unlimited,
    loadCommand: loadCommand,
    addCommand: addCommand,
    castCommand: castCommand,
    tagCommand: tagCommand,
    untagCommand: untagCommand,
    toggleCommand: toggleCommand,
    assertCommand: assertCommand,
    retractCommand: retractCommand,
    destroyCommand: destroyCommand,
    queryCommand: queryCommand,
    selectCommand: selectCommand,
    deselectCommand: deselectCommand,
    undoCommand: undoCommand,
    redoCommand: redoCommand,
    flushCommand: flushCommand,
    entityCatalog: entityCatalog,
    typedCatalog: typedCatalog,
    validate: validate,
    constrain: constrain,
    constraints: _constraints,
    domain: domain,
    assert: assert,
    retract: retract,
    asserts: asserts
  }), _.impart(_, _.partly));

});

//# sourceURL=ents.js