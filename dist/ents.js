define(['fetch', 'atomic/core', 'atomic/dom', 'atomic/transients', 'atomic/reactives', 'atomic/validates', 'atomic/immutables', 'context'], function(fetch, _, dom, mut, $, vd, imm, context){

  //TODO Apply effects (destruction, modification, addition) to datastore.
  //TODO Improve efficiency (with an index decorator?) of looking up an entity in a buffer by pk rather than guid.
  //TODO Consider use cases for `init` (e.g. creating new entities or resetting an existing field to factory defaults).
  //TODO Render a form that can be persisted thereby replacing `dynaform`.
  //TODO #FUTURE Optimize like effects (destruction, modification, addition) into aggregate effects before applying them.

  var IAssociative = _.IAssociative,
      ISwap = _.ISwap,
      IMergeable = _.IMergeable,
      IHash = imm.IHash,
      ISet = _.ISet,
      ITransientAssociative = mut.ITransientAssociative,
      IDispatch = $.IDispatch,
      ISubscribe = $.ISubscribe,
      ITimeTraveler = $.ITimeTraveler,
      IEmptyableCollection = _.IEmptyableCollection,
      ICheckable = vd.ICheckable,
      IConstrained = vd.IConstrained,
      ICollection = _.ICollection,
      ITransientCollection = mut.ITransientCollection,
      IMiddleware = $.IMiddleware,
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

  var IOriginated = _.protocol({
    origin: null
  });

  var ICaster = _.protocol({
    cast: null,
    uncast: null
  });

  var IPersistable = _.protocol({
    save: null
  });

  var IStore = _.protocol({
    commit: null
  });

  var IIdentifiable = _.protocol({
    identifier: null //machine-friendly identifier (lowercase, no embedded spaces) offering reasonable uniqueness within a context
  });

  var INamed = _.protocol({
    name: null //human-friendly name offering reasonable uniqueness within a context
  });

  var ITiddler = _.protocol({
    title: null,
    text: null
  });

  var IResolver = _.protocol({
    resolve: null //TODO returns both resolved and unresolved values
  });

  var IResolveable = _.protocol({
    resolved: null
  });

  var ISerializable = _.protocol({
    serialize: null
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

  var IVertex = _.protocol({
    outs: null,
    ins: null
  });

  var IWorkspace = _.protocol({
    touched: null, //entities touched during the last operation - useful when diffing before/after model snapshots
    dirty: null, //was a given entity ever modified?
    load: null, //add existing entity from domain to workspace
    add: null, //add new entity to workspace
    edit: null, //update entity present in workspace
    destroy: null, //delete entity present in workspace
    changes: null //changed entities
  });

  var IKind = _.protocol({
    kind: null,
    field: null
  });

  var IEntity = _.protocol({
    id: null,
    assertions: null
  });

  var IField = _.protocol({
    aget: null,
    aset: null
  });

  var protocols = {
    ICaster: ICaster,
    IIdentifiable: IIdentifiable,
    ISerializable: ISerializable,
    IKind: IKind,
    IField: IField,
    IEntity: IEntity,
    IResolver: IResolver,
    INamed: INamed,
    ITiddler: ITiddler,
    IQueryable: IQueryable,
    IFactory: IFactory,
    IConstrained: IConstrained,
    IPersistable: IPersistable,
    IOriginated: IOriginated,
    ITransaction: ITransaction,
    IView: IView,
    IVertex: IVertex,
    IWorkspace: IWorkspace
  }

  function _constraints2(self, f){
    return IConstrained.constraints(self, _.isFunction(f) ? f(IConstrained.constraints(self)) : f);
  }

  var _constraints = _.overload(null, IConstrained.constraints, _constraints2);

  function constrain(self, constraint){
    return _constraints(self, _.append(_, constraint));
  }

  function identifiableRecord(Type, identifier){

    function hash(self){
      return IHash.hash(self.attrs);
    }

    _.doto(Type,
      _.record,
      _.implement(IHash, {hash: hash}),
      _.implement(IIdentifiable, {identifier: _.constantly(identifier)}));
  }

  function ConstrainedCollection(constraints, coll){
    this.constraints = constraints;
    this.coll = coll;
  }

  (function(){

    var forward = _.forwardTo("coll");
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
      return new self.constructor(self.constraints, _.conj(self.coll, value));
    }

    function equiv(self, other){
      return self === other; //TODO self.constructor === other.constructor && _.every()
    }

    function assoc(self, idx, value){
      return new self.constructor(self.constraints, IAssociative.assoc(self.coll, idx, value));
    }

    function seq(self){
      return ISeqable.seq(self.coll) ? self : null;
    }

    function empty(self){
      return new self.constructor(self.constraints, IEmptyableCollection.empty(self.coll));
    }

    function deref(self){
      return self.coll;
    }

    function fmap(self, f){
      return new self.constructor(self.constraints, _.fmap(self.coll, f));
    }

    function constraints1(self){
      return self.constraints;
    }

    function constraints2(self, constraints){
      return new self.constructor(constraints, self.coll);
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

  function ResolvingCollection(constraints, coll){
    this.constraints = constraints;
    this.coll = coll;
  }

  (function(){

    var forward = _.forwardTo("coll");
    var first = forward(ISeq.first);
    var rest = forward(ISeq.rest);
    var next = forward(INext.next);
    var includes = forward(IInclusive.includes);
    var count = forward(ICounted.count);
    var nth = forward(IIndexed.nth);
    var contains = forward(IAssociative.contains);
    var seq = forward(ISeqable.seq);
    var deref = forward(IDeref.deref);
    var fmap = forward(IFunctor.fmap);
    var reduce = forward(IReduce.reduce);
    var reducekv = forward(IKVReduce.reducekv);

    function conj(self, value){
      return new self.constructor(self.constraints, _.conj(self.coll, value));
    }

    function assoc(self, idx, value){
      return new self.constructor(self.constraints, IAssociative.assoc(self.coll, idx, value));
    }

    function empty(self){
      return new self.constructor(self.constraints, IEmptyableCollection.empty(self.coll));
    }

    function constraints1(self){
      return IConstrained.constraints(self.coll);
    }

    function constraints2(self, constraints){
      return new self.constructor(self.constraints, IConstrained.constraints(self.coll, constraints));
    }

    var constraints = _.overload(null, constraints1, constraints2);

    function resolved(self){
      return IConstrained.constraints(self.coll, self.constraints);
    }

    _.doto(ResolvingCollection,
      _.implement(IResolveable, {resolved: resolved}),
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
      _.implement(IInclusive, {includes: includes}),
      _.implement(ICollection, {conj: conj}),
      _.implement(IIndexed, {nth: nth}),
      _.implement(ISeqable, {seq: seq}));

  })();

  var resolvingCollection = _.constructs(ResolvingCollection);

  function ClampedCollection(cardinality, coll){
    this.cardinality = cardinality;
    this.coll = coll;
  }

  function clampedCollection2(cardinality, coll){
    return new ClampedCollection(cardinality, coll);
  }

  function clampedCollection1(cardinality){
    return clampedCollection2(cardinality, constrainedCollection(vd.and(cardinality)));
  }

  var clampedCollection = _.overload(null, clampedCollection1, clampedCollection2);

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
      _.implement(ISeq, {first: first, rest: rest}),
      _.implement(INext, {next: next}),
      _.implement(IEquiv, {equiv: equiv}),
      _.implement(IInclusive, {includes: includes}),
      _.implement(ICollection, {conj: conj}),
      _.implement(IIndexed, {nth: nth}),
      _.implement(ISeqable, {seq: seq}));

  })();

  var constrainedCollection = _.fnil(_.constructs(ConstrainedCollection), vd.and(vd.opt), [], []),
      optional  = clampedCollection(vd.opt),
      required  = clampedCollection(vd.req),
      unlimited = constrainedCollection(vd.and(vd.unlimited)),
      entities  = constrain(unlimited, vd.collOf(vd.isa(_.GUID))),
      entity    = constrain(required, vd.collOf(vd.isa(_.GUID)));

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

  function Assertion(attrs){
    this.attrs = attrs;
  }

  function assertion(subject, predicate, object){
    return new Assertion({subject: subject, predicate: predicate, object: object});
  }

  (function(){

    var forward = _.forwardTo("attrs");
    var hash = forward(IHash.hash);

    _.doto(Assertion,
      _.implement(IHash, {hash: hash}),
      _.record);

  })();

  function AssertionStore(questions, assertions){
    this.questions = questions;
    this.assertions = assertions;
  }

  var assertionStore = _.fnil(_.constructs(AssertionStore), _.array, imm.dict());

  function questions(assertion){
    return [
      assertion,
      _.assoc(assertion, "predicate", null, "object", null),
      _.assoc(assertion, "predicate", null),
      _.assoc(assertion, "subject", null),
      _.assoc(assertion, "object", null)
    ];
  }

  (function(){

    function reviseStore(manner){
      return function(self, assertion){
        return assertionStore(self.questions, _.reduce(function(memo, question){
          return _.update(memo, question, function(answers){
            return manner(answers || imm.set(), assertion);
          });
        }, self.assertions, self.questions(assertion)));
      }
    }

    function lookup(self, assertion){
      return ISeqable.seq(ILookup.lookup(self.assertions, assertion));
    }

    _.doto(AssertionStore,
      _.implement(ICollection, {conj: reviseStore(ICollection.conj)}),
      _.implement(ISet, {disj: reviseStore(ISet.disj)}),
      _.implement(ILookup, {lookup: lookup}));

  })();

  var behaveAsEntity = (function(){

    function assertions(self){
      var id = IEntity.id(self);
      return _.mapcat(function(key){
        var fld = IKind.field(self, key);
        return _.get(fld, "computed") ? [] : _.map(function(value){
          return assertion(id, key, value);
        }, _.get(self, key));
      }, _.filter(_.notEq(_, "id"), _.keys(self))); //TODO identify pk with metadata
    }

    function outs(self){ //TODO improve efficiency by using only relational keys
      return _.filter(function(assertion){
        return _.is(assertion.object, _.GUID);
      }, assertions(self));
    }

    function identifier(self){ //TODO use?
      return IIdentifiable.identifier(self.topic);
    }

    function id(self){
      return _.guid(self.attrs.id);
    }

    function field(self, key){
      return IKind.field(self.topic, key) || _.assoc(_.isArray(_.get(self.attrs, key)) ? _field(key, unlimited, valuesCaster) : _field(key, optional, valueCaster), "missing", true);
    }

    function kind(self){ //TODO use?
      return self.topic.attrs.key; //TODO demeter
    }

    function lookup(self, key){
      return IField.aget(field(self, key), self);
    }

    function assoc(self, key, values){
      return IField.aset(field(self, key), self, values);
    }

    function contains(self, key){
      return IAssociative.contains(self.attrs, key);
    }

    function dissoc(self, key){
      return assoc(self, key, null); //TODO test
    }

    function keys(self){
      return _.keys(self.topic);
    }

    function constraints(self){
      return _.reduce(function(memo, key){
        return _.append(memo, vd.optional(key, IConstrained.constraints(field(self, key))));
      }, vd.and(), keys(self));
    }

    function serialize(self){
      return self.attrs;
    }

    return _.does(
      _.implement(ISerializable, {serialize: serialize}),
      _.implement(IConstrained, {constraints: constraints}),
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IEntity, {id: id, assertions: assertions}),
      _.implement(IMap, {keys: keys, dissoc: dissoc}),
      _.implement(IVertex, {outs: outs}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IAssociative, {assoc: assoc, contains: contains}),
      _.implement(IKind, {field: field, kind: kind}));

  })();

  function dirtyKeys(self, other){
    return self.attrs === other.attrs ? null : _.remove(function(key){
      return self.attrs[key] === other.attrs[key];
    }, imm.distinct(_.concat(_.keys(self.attrs), _.keys(other.attrs))));
  }

  function ValueCaster(emptyColl){
    this.emptyColl = emptyColl;
  }

  var valueCaster = _.constructs(ValueCaster);

  (function(){

    function cast(self, value){
      return _.into(self.emptyColl, _.maybe(value, _.array));
    }

    function uncast(self, coll){
      return _.last(coll);
    }

    _.doto(ValueCaster,
      _.implement(ICaster, {cast: cast, uncast: uncast}));

  })();

  function ValuesCaster(emptyColl){
    this.emptyColl = emptyColl;
  }

  var valuesCaster = _.constructs(ValuesCaster);

  (function(){

    function cast(self, values){
      return _.into(self.emptyColl, values);
    }

    function uncast(self, coll){
      return _.deref(coll);
    }

    _.doto(ValuesCaster,
      _.implement(ICaster, {cast: cast, uncast: uncast}));

  })();

  function Recaster(cast, uncast, caster){
    this.cast = cast;
    this.uncast = uncast;
    this.caster = caster;
  }

  var recaster = _.constructs(Recaster);

  (function(){

    function cast(self, values){
      return _.fmap(ICaster.cast(self.caster, values), self.cast);
    }

    function uncast(self, coll){
      return ICaster.uncast(self.caster, _.fmap(coll, self.uncast));
    }

    _.doto(Recaster,
      _.implement(ICaster, {cast: cast, uncast: uncast}));

  })();

  var Field = (function(){

    function Field(attrs, caster){
      this.attrs = attrs;
      this.caster = caster;
    }

    function lookup(self, key){
      return self.attrs[key];
    }

    function assoc(self, key, value){
      return new self.constructor(IAssociative.assoc(self.attrs, key, value), self.caster);
    }

    function contains(self, key){
      return IAssociative.contains(self.attrs, key);
    }

    function aget(self, entity){
      var key = _.get(self, "key");
      return _.just(entity.attrs, _.get(_, key), function(value){
        return ICaster.cast(self.caster, value);
      });
    }

    function aset(self, entity, values){
      var key =  _.get(self, "key"),
          value = ICaster.uncast(self.caster, values);
      return new entity.constructor(entity.topic, _.isSome(value) ? _.assoc(entity.attrs, key, value) : _.dissoc(entity.attrs, self.key));
    }

    function identifier(self){
      return _.get(self, "key");
    }

    function constraints(self){
      return IConstrained.constraints(ICaster.cast(self.caster, null));
    }

    return _.doto(Field,
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IAssociative, {contains: contains, assoc: assoc}),
      _.implement(IConstrained, {constraints: constraints}),
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IField, {aget: aget, aset: aset}));

  })();

  function field3(key, emptyColl, casts){
    return new Field({key: key, readonly: false, missing: false, computed: false}, casts(emptyColl)); //include defaults here
  }

  function field2(key, emptyColl){
    return field3(key, emptyColl, valueCaster);
  }

  function field1(key){
    return field2(key, optional);
  }

  var field = _.overload(null, field1, field2, field3);
  var _field = field;

  var ComputedField = (function(){

    function ComputedField(attrs, computations, emptyColl){
      this.attrs = attrs;
      this.computations = computations;
      this.emptyColl = emptyColl;
    }

    function lookup(self, key){
      return self.attrs[key];
    }

    function assoc(self, key, value){
      return new self.constructor(IAssociative.assoc(self.attrs, key, value), self.computations, self.emptyColl);
    }

    function contains(self, key){
      return IAssociative.contains(self.attrs, key);
    }

    function aget(self, entity){
      return _.into(self.emptyColl, _.filter(_.isSome, _.map(_.applying(entity), self.computations)));
    }

    function identifier(self){
      return _.get(self, "key");
    }

    function constraints(self){
      return IConstrained.constraints(self.emptyColl);
    }

    return _.doto(ComputedField,
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IAssociative, {contains: contains, assoc: assoc}),
      _.implement(IConstrained, {constraints: constraints}),
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IField, {aget: aget}));

  })();

  function computedField(key, computations, emptyColl){
    return new ComputedField({key: key, readonly: true, missing: false, computed: true}, computations, emptyColl || []);
  }

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

  var schema = _.constructs(Schema);

  function Ontology(topics){
    this.topics = topics;
  }

  (function(){

    function conj(self, topic){
      return new self.constructor(_.assoc(self.topics, IIdentifiable.identifier(topic), topic));
    }

    function lookup(self, key){
      return _.get(self.topics, key);
    }

    function keys(self){
      return _.keys(self.topics);
    }

    function vals(self){
      return _.vals(self.topics);
    }

    function dissoc(self, key){
      return new self.constructor(_.dissoc(self.topics, key));
    }

    function merge(self, other){
      return _.reduce(_.conj, self, _.vals(other));
    }

    _.doto(Ontology,
      _.implement(IMergeable, {merge: merge}),
      _.implement(IMap, {keys: keys, vals: vals, dissoc: dissoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(ICollection, {conj: conj}));

  })();

  var ontology = _.fnil(_.constructs(Ontology), {});

  function JsonResource(url, ontology) {
    this.url = url;
    this.ontology = ontology;
  }

  var jsonResource = _.constructs(JsonResource);

  (function(){

    function query(self, plan){ //plan is disregarded, must fully load outline.
      return _.fmap(fetch(self.url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
       }),
        function(resp){
          return resp.text();
        },
        JSON.parse,
        _.mapa(function(attrs){
          return make(self, attrs);
        }, _));
    }

    function make(self, attrs){
      return IFactory.make(_.get(self.ontology, attrs.$type), attrs);
    }

    function commit(self, workspace){
      var body = _.just(workspace, _.deref, _.mapa(ISerializable.serialize, _), function(items){
        return JSON.stringify(items, null, "\t");
      });
      fetch(self.url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: body
      });
    }
    _.doto(JsonResource,
      _.implement(IFactory, {make: make}),
      _.implement(IStore, {commit: commit}),
      _.implement(IQueryable, {query: query}));

  })();

  var Topic = (function(){

    function Topic(type, attrs, schema){
      this.type = type;
      this.attrs = attrs;
      this.schema = schema;
    }

    function lookup(self, key){
      return ILookup.lookup(self.attrs, key);
    }

    function assoc(self, key, value){
      return new Topic(self.type, IAssociative.assoc(self.attrs, key, value), self.schema, self.resource);
    }

    function contains(self, key){
      return IAssociative.contains(self.attrs, key);
    }

    function make(self, attrs){
      return new self.type(self, attrs);
    }

    function name(self){
      return _.get(self, "label");
    }

    function identifier(self){
      return _.get(self, "key");
    }

    function field(self, key){
      return _.get(self.schema, key);
    }

    function keys(self){
      return _.keys(self.schema);
    }

    return _.doto(Topic,
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IAssociative, {assoc: assoc, contains: contains}),
      _.implement(IKind, {field: field}),
      _.implement(INamed, {name: name}),
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IMap, {keys: keys}),
      _.implement(IFactory, {make: make}));

  })();

  function topic3(type, key, schema){
    return topic4(type, type.name, key, schema);
  }

  function topic4(type, label, key, schema){
    return new Topic(type, {label: label, key: key}, schema);
  }

  var topic = _.overload(null, null, null, topic3, topic4);

  function tiddlerBehavior(title, text){

    function accessor(key){

      function read(self){
        return _.just(self, _.get(_, key), _.first);
      }

      function write(self, text){
        return assert(self, key, text);
      }

      return _.overload(null, read, write);
    }

    return _.does(
      _.implement(ITiddler, {title: accessor(title), text: accessor(text)}));

  }

  function Tiddler(topic, attrs){
    this.topic = topic;
    this.attrs = attrs;
  }

  _.doto(Tiddler,
    behaveAsEntity,
    tiddlerBehavior("title", "text"));

  function Task(topic, attrs){
    this.topic = topic;
    this.attrs = attrs;
  }

  _.doto(Task,
    behaveAsEntity,
    tiddlerBehavior("title", "text"));

  var defaults = _.conj(schema(),
    _.assoc(field("id", entity, function(coll){
      return recaster(_.guid, _.str, valueCaster(coll));
    }), "label", "ID"),
    _.assoc(field("title", required), "label", "Title"),
    _.assoc(field("text", optional), "label", "Text"),
    _.assoc(field("child", resolvingCollection(vd.and(vd.unlimited, vd.collOf(vd.isa(Task, Tiddler))), entities), function(coll){
      return recaster(_.guid, _.identity, valuesCaster(coll));
    }), "label", "Child"),
    _.assoc(field("tag", unlimited, valuesCaster), "label", "Tag", "appendonly", true),
    _.assoc(field("modified", constrain(optional, vd.collOf(_.isDate)), function(coll){
      return recaster(_.date, toLocaleString, valueCaster(coll));
    }), "label", "Modified Date"));

  function typed(entity){
    return IIdentifiable.identifier(entity.topic);
  }

  function flag(name, pred){
    return function(entity){
      return pred(entity) ? name : null;
    }
  }

  function isOverdue(entity){
    return _.maybe(entity, _.get(_, "due"), _.first, _.gt(new Date(), _)); //impure
  }

  function isImportant(entity){
    return _.maybe(entity, _.get(_, "priority"), _.detect(_.eq(_, 1), _));
  }

  var toLocaleString = _.invokes(_, "toLocaleString");

  var tiddler =
    topic(Tiddler,
      "tiddler",
      _.conj(defaults,
        _.assoc(computedField("flags", [typed]), "label", "Flags")));

  var task =
    topic(Task,
      "task",
      _.conj(defaults,
        _.assoc(field("priority", constrain(optional, vd.collOf(vd.choice([1, 2, 3])))), "label", "Priority"),
        _.assoc(field("due", constrain(optional, vd.collOf(_.isDate)), function(coll){
          return recaster(_.date, toLocaleString, valueCaster(coll));
        }), "label", "Due Date"),
        _.assoc(computedField("overdue", [isOverdue]), "label", "Overdue"),
        _.assoc(computedField("flags", [typed, flag("overdue", isOverdue), flag("important", isImportant)]), "label", "Flags"),
        _.assoc(field("assignee", entities), "label", "Assignee"),
        _.assoc(field("expanded", constrain(required, vd.collOf(_.isBoolean))), "label", "Expanded")));

  var work = _.conj(ontology(), tiddler, task);

  function Domain(repos){
    this.repos = repos;
  }

  function domain(repos){
    return _.reduce(_.conj, new Domain({}), repos || []);
  }

  (function(){

    function origin(self, txn){
      var entity = _.deref(txn);
      return _.detect(function(repo){
        return repo.type === entity.type ? repo : null;
      }, _.vals(self.repos));
    }

    function query(self, options){
      var type = _.get(options, "$type"),
          plan = _.dissoc(options, "$type");
      return IQueryable.query(_.get(self.repos, type), plan);
    }

    function make(self, attrs){
      return IFactory.make(_.get(self.repos, _.get(attrs, "$type")) || _.just(self.repos, _.keys, _.first, _.get(self.repos, _)), _.dissoc(attrs, "$type"));
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
      _.implement(IOriginated, {origin: origin}),
      _.implement(IFactory, {make: make}),
      _.implement(IQueryable, {query: query}));

  })();

  function Transaction(buffer, user){
    this.buffer = buffer;
    this.user = user;
  }

  var transaction = _.constructs(Transaction);

  (function(){

    function id(self){
      return IEntity.id(self.buffer);
    }

    function commands(self){ //TODO serializable commands with sufficient data for later application
      return ITransaction.commands(self.buffer); //TODO wrap each command with additional information (e.g. user, owning txn id)
    }

    _.doto(Transaction, //TODO some way of validating both the changed entities and the overall transaction
      _.implement(IEntity, {id: id}),
      _.implement(ITransaction, {commands: commands}));

  })();

  function Change(id, prior, current, op){
    this.id = id;
    this.prior = prior;
    this.current = current;
    this.op = op;
  }

  var change = _.constructs(Change);

  function EntityWorkspace(loaded, changed, touched){
    this.loaded = loaded;
    this.changed = changed;
    this.touched = touched;
  }

  (function(){

    //TODO should `clone` return identity or a copy? i returned identity because I assumed no mutation.

    function query(self, plan){
      return _.filter(function(entity){
        return _.matches(entity.attrs, plan); //TODO temporary
      }, ISeqable.seq(self));
    }

    function load(self, entities){
      return entityWorkspace(_.reduce(function(memo, entity){
        var id = IEntity.id(entity);
        return _.contains(memo, id) ? memo : _.assoc(memo, id, entity);
      }, self.loaded, entities), self.changed, _.into(imm.set(), _.map(IEntity.id, entities)));
    }

    function add(self, entities){
      return entityWorkspace(self.loaded, _.reduce(function(memo, entity){
        var id = IEntity.id(entity);
        return _.contains(memo, id) ? memo : _.assoc(memo, id, entity);
      }, self.changed, entities), _.into(imm.set(), _.map(IEntity.id, entities)));
    }

    function edit(self, entities){
      return entityWorkspace(self.loaded, _.reduce(function(memo, entity){
        var id = IEntity.id(entity);
        return _.contains(self.loaded, id) || _.contains(memo, id) ? _.assoc(memo, id, entity) : memo;
      }, self.changed, entities), _.into(imm.set(), _.map(IEntity.id, entities)));
    }

    function destroy(self, entities){
      return entityWorkspace(self.loaded, _.reduce(function(memo, entity){
        var id = IEntity.id(entity);
        return _.contains(self.loaded, id) ? _.assoc(memo, id, null) : _.contains(memo, id) ? _.dissoc(memo, id) : memo;
      }, self.changed, entities), _.into(imm.set(), _.map(IEntity.id, entities)));
    }

    function dirty(self, entity){
      return _.notEq(entity, _.get(self.loaded, IEntity.id(entity)));
    }

    function changes(self){
      return _.count(_.keys(self.changed)) ? transaction(self, context.userId) : null;
    }

    function includes(self, entity){
      return IAssociative.contains(self, IEntity.id(entity));
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

    function lookup(self, id){
      return IAssociative.contains(self.changed, id) ? _.get(self.changed, id) : _.get(self.loaded, id);
    }

    function reduce(self, xf, init){
      return IReduce.reduce(_.map(_.get(self, _), _.keys(self)), xf, init);
    }

    function dissoc(self, id){
      return IAssociative.contains(self, id) ?
        entityWorkspace(
          IAssociative.contains(self.loaded, id) ? IMap.dissoc(self.loaded, id) : self.loaded,
          IAssociative.contains(self.changed, id) ? IMap.dissoc(self.changed, id) : self.changed, _.cons(id)) : self;
    }

    function keys(self){
      return _.filter(_.get(self, _),
        imm.distinct(_.concat(Array.from(_.keys(self.loaded)), Array.from(_.keys(self.changed)))));
    }

    function vals(self){
      return _.map(_.get(self, _), _.keys(self));
    }

    function count(self){
      return _.count(keys(self));
    }

    function contains(self, id){
      return !!ILookup.lookup(self, id);
    }

    function id(self){
      return self.id;
    }

    function commands(self){
      return _.just(self.changed,
        Array.from, //TODO prefer lazy so implement lazy iteration
        _.see('items'),
        _.map(_.first, _),
        _.mapcat(function(id){
          var prior   = _.get(self.loaded , id),
              current = _.get(self.changed, id);
          if (prior && current) {
            if (_.eq(prior, current)) {
              return [];
            } else if (prior.constructor !== current.constructor) { //type changed
              return [change(id, prior, null, 'destroy'), change(id, null, current, 'add')];
            } else {
              return [change(id, prior, current, 'modify')];
            }
          } else if (prior) {
            return [change(id, prior, null, 'destroy')];
          } else if (current) {
            return [change(id, null, current, 'add')];
          } else {
            return [];
          }
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

    _.doto(EntityWorkspace,
      _.implement(IResolver, {resolve: resolve}),
      _.implement(IIndexed, {nth: nth}),
      _.implement(IEntity, {id: id}),
      _.implement(IQueryable, {query: query}),
      _.implement(ITransaction, {commands: commands}),
      _.implement(IWorkspace, {dirty: dirty, load: load, add: add, edit: edit, destroy: destroy, changes: changes, touched: touched}),
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

  var entityWorkspace = _.fnil(_.constructs(EntityWorkspace), imm.dict(), imm.dict(), imm.set());

  function IndexedEntityWorkspace(indexes, workspace){
    this.indexes = indexes;
    this.workspace = workspace;
  }

  (function(){ // TODO implement indexing

    var forward = _.forwardTo("workspace");

    function query(self, plan){
      return IQueryable.query(self.workspace, plan);
    }

    function load(self, entities){
      return new self.constructor(self.indexes, IWorkspace.load(self.workspace, entities));
    }

    function add(self, entities){
      var xs = _.mapcat(IEntity.assertions, entities);
      _.log("added", _.toArray(xs));
      return new self.constructor(self.indexes, IWorkspace.add(self.workspace, entities));
    }

    function edit(self, entities){
      return new self.constructor(self.indexes, IWorkspace.edit(self.workspace, entities));
    }

    function destroy(self, entities){
      return new self.constructor(self.indexes, IWorkspace.destroy(self.workspace, entities));
    }

    var dirty = forward(IWorkspace.dirty);
    var changes = forward(IWorkspace.changes);
    var includes = forward(IInclusive.includes);
    var first = forward(ISeq.first);
    var rest = forward(ISeq.rest);
    var next = forward(INext.next);
    var seq = forward(ISeqable.seq);
    var lookup = forward(ILookup.lookup);
    var reduce = forward(IReduce.reduce);

    function dissoc(self, id){
      return new self.constructor(self.indexes, IMap.dissoc(self.workspace, id));
    }

    var keys = forward(IMap.keys);
    var vals = forward(IMap.vals);
    var count = forward(ICounted.count);
    var contains = forward(IAssociative.contains);
    var id = forward(IEntity.id);
    var commands = forward(ITransaction.commands);
    var resolve = forward(IResolver.resolve);
    var touched = forward(IWorkspace.touched);
    var nth = forward(IIndexed.nth);

    _.doto(IndexedEntityWorkspace,
      _.implement(IResolver, {resolve: resolve}),
      _.implement(IIndexed, {nth: nth}),
      _.implement(IEntity, {id: id}),
      _.implement(IQueryable, {query: query}),
      _.implement(ITransaction, {commands: commands}),
      _.implement(IWorkspace, {dirty: dirty, load: load, add: add, edit: edit, destroy: destroy, changes: changes, touched: touched}),
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

  var indexedEntityWorkspace = _.fnil(_.constructs(IndexedEntityWorkspace), assertionStore(), entityWorkspace());

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

  function LoadedEvent(attrs){
    this.attrs = attrs;
  }

  function loadedEvent(entities){
    return new LoadedEvent({entities: entities});
  }

  identifiableRecord(LoadedEvent, "loaded");

  function LoadHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var loadHandler = _.constructs(LoadHandler);

  (function(){

    function handle(self, command, next){
      IWorkspace.load(self.buffer, command.entities); //TODO ITransientBuffer.load
      $.raise(self.provider, loadedEvent(command.entities));
      next(command);
    }

    return _.doto(LoadHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function AddCommand(attrs){
    this.attrs = attrs;
  }

  function addCommand(text, options){
    return new AddCommand(_.merge({text: text}, options));
  }

  identifiableRecord(AddCommand, "add");

  function AddHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var addHandler = _.constructs(AddHandler);

  (function(){

    function handle(self, command, next){
      var added = IFactory.make(self.buffer, {id: _.get(command, "id") || _.guid(), $type: _.get(command, "type")});
      var entity = _.reduce(function(memo, key){
          var fld = IKind.field(memo, key);
          return _.maybe(_.get(fld, "defaults"), function(defaults){
            return IField.aset(fld, memo, defaults);
          }) || memo;
        }, added, _.keys(added));
      _.swap(self.buffer, function(buffer){
        return IWorkspace.add(buffer, [ITiddler.title(entity, _.get(command, "text"))]);
      });
      $.raise(self.provider, addedEvent(IEntity.id(entity), _.get(command, "text")));
      next(command);
    }

    _.doto(AddHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function AddedEvent(attrs){
    this.attrs = attrs;
  }

  function addedEvent(id, text){
    return new AddedEvent({id: id, text: text});
  }

  identifiableRecord(AddedEvent, "added");

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

  function ToggleCommand(attrs){
    this.attrs = attrs;
  }

  function toggleCommand(key, options){
    return new ToggleCommand(_.merge({key: key}, options));
  }

  identifiableRecord(ToggleCommand, "toggle");

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
          return IWorkspace.edit(buffer, [_.assoc(entity, _.get(command, "key"), values)]);
        });
        $.raise(self.provider, toggledEvent(_.get(command, "id"), _.get(command, "key")));
      }
      next(command);
    }

    _.doto(ToggleHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function ToggledEvent(attrs){
    this.attrs = attrs;
  }

  function toggledEvent(id, key){
    return new ToggledEvent({id: id, key: key});
  }

  identifiableRecord(ToggledEvent, "toggled");

  function TagCommand(attrs){
    this.attrs = attrs;
  }

  function tagCommand(value, options){
    return new TagCommand(_.merge({value: value}, options));
  }

  identifiableRecord(tagCommand, "tag");

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

  function UntagCommand(attrs){
    this.attrs = attrs;
  }

  function untagCommand(value, options){
    return new UntagCommand(_.merge({value: value}, options));
  }

  identifiableRecord(UntagCommand, "untag");

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

  function CastCommand(attrs){
    this.attrs = attrs;
  }

  function castCommand(type, options){
    return new CastCommand(_.merge({type: type}, options));
  }

  identifiableRecord(castCommand, "cast");

  function CastHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var castHandler = _.constructs(CastHandler);

  (function(){

    //it's unavoidable that attributes may not line up on a cast, so cast wisely.
    function handle(self, command, next){
      var prior = _.get(self.buffer, _.get(command, "id"));
      if (prior) {
        var entity = IFactory.make(self.buffer, Object.assign({}, prior.attrs, {$type: _.get(command, "type")})),
            title  = ITiddler.title(prior),
            text   = ITiddler.text(prior);
        if (title){
          entity = ITiddler.title(entity, title);
        }
        if (text){
          entity = ITiddler.text(entity, text);
        }
        _.swap(self.buffer, function(buffer){
          return IWorkspace.edit(buffer, [entity]);
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

  function SaveCommand(attrs){
    this.attrs = attrs;
  }

  function saveCommand(){
    return SaveCommand({});
  }

  identifiableRecord(SaveCommand, "save");

  function SaveHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var saveHandler = _.constructs(SaveHandler);

  function SavedEvent(attrs){
    this.attrs = attrs;
  }

  function savedEvent(){
    return new SavedEvent({});
  }

  identifiableRecord(SavedEvent, "saved");

  (function (){

    function handle(self, command){
      IPersistable.save(self.buffer)
      $.raise(self.provider, savedEvent());
    }

    _.doto(SaveHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SavedHandler(commandBus){
    this.commandBus = commandBus;
  }

  var savedHandler = _.constructs(SavedHandler);

  (function(){

    function handle(self, event, next){
      $.dispatch(self.commandBus, flushCommand());
      next(event);
    }

    return _.doto(SavedHandler,
      _.implement(IMiddleware, {handle: handle}));

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

  function UndoCommand(attrs){
    this.attrs = attrs;
  }

  function undoCommand(){
    return new UndoCommand({});
  }

  identifiableRecord(UndoCommand, "undo");

  function UndoHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var undoHandler = _.constructs(UndoHandler);

  function UndoneEvent(attrs){
    this.attrs = attrs;
  }

  function undoneEvent(){
    return UndoneEvent({});
  }

  identifiableRecord(UndoneEvent, "undone");

  _.doto(UndoHandler,
    timeTravels(ITimeTraveler.undoable, ITimeTraveler.undo, undoneEvent()));

  function RedoCommand(attrs){
    this.attrs = attrs;
  }

  function redoCommand(){
    return new RedoCommand({});
  }

  identifiableRecord(RedoCommand, "redo");

  function RedoHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var redoHandler = _.constructs(RedoHandler);

  function RedoneEvent(attrs){
    this.attrs = attrs;
  }

  function redoneEvent(){
    return new RedoneEvent({});
  }

  identifiableRecord(RedoneEvent, "redone");

  _.doto(RedoHandler,
    timeTravels(ITimeTraveler.redoable, ITimeTraveler.redo, redoneEvent()));

  function FlushCommand(attrs){
    this.attrs = attrs;
  }

  function flushCommand(){
    return new FlushCommand({});
  }

  identifiableRecord(FlushCommand, "flush");

  function FlushHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var flushHandler = _.constructs(FlushHandler);

  function FlushedEvent(attrs){
    this.attrs = attrs;
  }

  function flushedEvent(){
    return new FlushedEvent({});
  }

  identifiableRecord(FlushedEvent, "flushed");

  _.doto(FlushHandler,
    timeTravels(_.constantly(true), ITimeTraveler.flush, flushedEvent()));

  function AssertCommand(attrs){
    this.attrs = attrs;
  }

  function assertCommand(key, value, options){
    return new AssertCommand(_.merge({key: key, value: value}, options));
  }

  identifiableRecord(AssertCommand, "assert");

  function AssertHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var assertHandler = _.constructs(AssertHandler);

  (function(){

    function handle(self, command, next){
      var id = _.get(command, "id"),
          entity = _.get(self.buffer, id);
      if (entity) {
        var key = _.get(command, "key"),
            value = _.get(command, "value");
        _.swap(self.buffer, function(buffer){
          return IWorkspace.edit(buffer, [assert(entity, key, value)]);
        });
        $.raise(self.provider, assertedEvent(id, key, value));
      }
      next(command);
    }

    _.doto(AssertHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function AssertedEvent(attrs){
    this.attrs = attrs;
  }

  function assertedEvent(id, key, value){
    return new AssertedEvent({id: id, key: key, value: value});
  }

  identifiableRecord(AssertedEvent, "asserted");

  function BlockingHandler(key, buffer, handler){
    this.key = key;
    this.buffer = buffer;
    this.handler = handler;
  }

  var blockingHandler = _.constructs(BlockingHandler);

  (function(){

    function handle(self, command, next){
      var id = _.get(command, "id"),
          entity = _.get(self.buffer, id);
      if (entity) {
        var key = _.get(command, "key");
        if (_.get(IKind.field(entity, key), self.key)) {
          throw new Error("Field `" + key + "` is " + self.key + " and thus cannot " + IIdentifiable.identifier(command) + ".");
        }
        IMiddleware.handle(self.handler, command, next);
      }
      next(command);
    }

    _.doto(BlockingHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DestroyCommand(attrs){
    this.attrs = attrs;
  }

  function destroyCommand(id){
    return new DestroyCommand({id: id});
  }

  identifiableRecord(DestroyCommand, "destroy");

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
          return IWorkspace.destroy(buffer, [entity]);
        });
        $.raise(self.provider, destroyedEvent(command.id));
      }
      next(command);
    }

    _.doto(DestroyHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DestroyedEvent(attrs){
    this.attrs = attrs;
  }

  function destroyedEvent(id){
    return new DestroyedEvent({id: id});
  }

  identifiableRecord(DestroyedEvent, "destroyed");

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

  function RetractCommand(attrs){
    this.attrs = attrs;
  }

  function retractCommand(key, options){
    return new RetractCommand(_.merge({key: key}, options));
  }

  identifiableRecord(RetractCommand, "retract");

  function RetractHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var retractHandler = _.constructs(RetractHandler);

  (function(){

    function handle(self, command, next){
      var id = _.get(command, "id"),
          key = _.get(command, "key"),
          value = _.get(command, "value"),
          entity = _.get(self.buffer, id);
      _.swap(self.buffer, function(buffer){
        return IWorkspace.edit(buffer, [_.isSome(value) ? retract(entity, key, value) : retract(entity, key)]);
      });
      $.raise(self.provider, retractedEvent(id, key, value));
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

  function retractedEvent(id, key, value){
    return new RetractedEvent({id: id, key: key, value: value});
  }

  identifiableRecord(RetractedEvent, "retracted");

  function QueryCommand(attrs){
    this.attrs = attrs;
  }

  function queryCommand(plan){
    return new QueryCommand({plan: plan});
  }

  identifiableRecord(QueryCommand, "query");

  function QueriedEvent(attrs){
    this.attrs = attrs;
  }

  function queriedEvent(entities){
    return new QueriedEvent({entities: entities});
  }

  identifiableRecord(QueriedEvent, "queried");

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
      $.dispatch(self.commandBus, loadCommand(_.get(event, "entities")));
      next(event);
    }

    return _.doto(QueriedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SelectCommand(attrs){
    this.attrs = attrs;
  }

  function selectCommand(id){
    return new SelectCommand({id: id});
  }

  identifiableRecord(SelectCommand, "select");

  function SelectedEvent(attrs){
    this.attrs = attrs;
  }

  function selectedEvent(id){
    return new SelectedEvent({id: id});
  }

  identifiableRecord(SelectedEvent, "selected");

  function SelectHandler(model, provider){
    this.model = model;
    this.provider = provider;
  }

  var selectHandler = _.constructs(SelectHandler);

  (function(){

    function handle(self, command, next){
      _.swap(self.model,
        _.update(_, "selected",
          _.conj(_, _.get(command, "id"))));
      $.raise(self.provider, selectedEvent(_.get(command, "id")));
      next(command);
    }

    return _.doto(SelectHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DeselectCommand(attrs){
    this.attrs = attrs;
  }

  function deselectCommand(id){
    return new DeselectCommand({id: id});
  }

  identifiableRecord(DeselectCommand, "deselect");

  function DeselectedEvent(attrs){
    this.attrs = attrs;
  }

  function deselectedEvent(id){
    return new DeselectedEvent({id: id});
  }

  identifiableRecord(identifiableRecord, "deselected");

  function DeselectHandler(model, provider){
    this.model = model;
    this.provider = provider;
  }

  var deselectHandler = _.constructs(DeselectHandler);

  (function(){

    function handle(self, command, next){
      _.swap(self.model,
        _.update(_, "selected",
          _.disj(_, _.get(command, "id"))));
      $.raise(self.provider, deselectedEvent(_.get(command, "id")));
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

  function Buffer(repo, workspace){
    this.repo = repo;
    this.workspace = workspace;
  }

  var buffer = _.constructs(Buffer);

  (function(){

    var forward = _.forwardTo("workspace");

    function make(self, attrs){
      return IFactory.make(self.repo, attrs);
    }

    function edit(self, entities){
      _.swap(self.workspace, function(workspace){
        return IWorkspace.edit(workspace, entities);
      });
    }

    function lookup(self, id){
      return _.just(self.workspace, _.deref, _.get(_, id));
    }

    function load(self, entities){
      _.swap(self.workspace, function(workspace){
        return IWorkspace.load(workspace, entities);
      });
    }

    function query(self, plan){
      return IQueryable.query(self.repo, plan);
    }

    function save(self){
      return IStore.commit(self.repo, self.workspace); //TODO return outcome status?
    }

    var swap = forward(ISwap.swap);
    var undo = forward(ITimeTraveler.undo);
    var redo = forward(ITimeTraveler.redo);
    var flush = forward(ITimeTraveler.flush);
    var undoable = forward(ITimeTraveler.undoable);
    var redoable = forward(ITimeTraveler.redoable);

    _.doto(Buffer,
      _.implement(ITimeTraveler, {undo: undo, redo: redo, flush: flush, undoable: undoable, redoable: redoable}),
      _.implement(IPersistable, {save: save}),
      _.implement(IFactory, {make: make}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(ISwap, {swap: swap}),
      _.implement(IWorkspace, {load: load, edit: edit}), //TODO ITransientBuffer.load
      _.implement(IQueryable, {query: query}));

  })();

  //NOTE a view is capable of returning a seq of all possible `IView.interactions` each implementing `IIdentifiable` and `INamed`.
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
          mut.assoc(_, "saved", savedHandler(commandBus)),
          mut.assoc(_, "queried", queriedHandler(commandBus)))));

    _.doto(commandBus,
      mut.conj(_,
        loggerMiddleware("command"),
        lockingMiddleware(
          _.doto(handlerMiddleware(),
            mut.assoc(_, "load", loadHandler(buffer, events)),
            mut.assoc(_, "add", addHandler(buffer, events)),
            mut.assoc(_, "save", saveHandler(buffer, events)),
            mut.assoc(_, "undo", undoHandler(buffer, events)),
            mut.assoc(_, "redo", redoHandler(buffer, events)),
            mut.assoc(_, "flush", flushHandler(buffer, events)),
            mut.assoc(_, "cast", selectionHandler(model, castHandler(buffer, events))),
            mut.assoc(_, "tag", tagHandler(selectionHandler(model, assertHandler(buffer, events)))),
            mut.assoc(_, "untag", untagHandler(selectionHandler(model, retractHandler(buffer, events)))),
            mut.assoc(_, "toggle", selectionHandler(model, blockingHandler("readonly", buffer, toggleHandler(buffer, events)))),
            mut.assoc(_, "assert", selectionHandler(model, blockingHandler("readonly", buffer, assertHandler(buffer, events)))),
            mut.assoc(_, "retract", selectionHandler(model, blockingHandler("appendonly", buffer, blockingHandler("readonly", buffer, retractHandler(buffer, events))))),
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

  var buf = buffer(jsonResource("./dist/outline.json", work), $.timeTraveler($.cell(indexedEntityWorkspace(assertionStore(), entityWorkspace()))));

  _.maybe(dom.sel1("#outline"), function(el){
    var ol = outline(buf, {root: null});
    IView.render(ol, el);
    $.sub(ol, _.see("event"));
    _.each($.dispatch(ol, _), [
      queryCommand()
      //assertCommand(null, "priority", "C")
    ]);
    Object.assign(window, {ol: ol});
  });

  return _.just(protocols, _.reduce(_.merge, _, _.map(function(protocol){
    return _.reduce(function(memo, key){
      return _.assoc(memo, key, protocol[key]);
    }, {}, Object.keys(protocol));
  }, _.vals(protocols))), _.merge(_, {
    optional: optional,
    required: required,
    unlimited: unlimited,
    assertionStore: assertionStore,
    dirtyKeys: dirtyKeys,
    questions: questions,
    assertion: assertion,
    loadCommand: loadCommand,
    addCommand: addCommand,
    saveCommand: saveCommand,
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
    entityWorkspace: entityWorkspace,
    constrain: constrain,
    constraints: _constraints,
    domain: domain,
    assert: assert,
    retract: retract,
    asserts: asserts
  }), _.impart(_, _.partly));

});

//# sourceURL=ents.js