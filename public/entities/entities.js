define(['fetch', 'atomic/core', 'atomic/dom', 'atomic/transducers', 'atomic/transients', 'atomic/reactives', 'atomic/validates', 'atomic/immutables', 'atomic/repos', 'context'], function(fetch, _, dom, t, mut, $, vd, imm, repos, context){

  //TODO Apply effects (destruction, modification, addition) to datastore.
  //TODO Improve efficiency (with an index decorator?) of looking up an entity in a buffer by pk rather than guid.
  //TODO Consider use cases for `init` (e.g. creating new entities or resetting an existing field to factory defaults).
  //TODO Render a form that can be persisted thereby replacing `dynaform`.
  //TODO #FUTURE Optimize like effects (destruction, modification, addition) into aggregate effects before applying them.

  var IAssociative = _.IAssociative,
      ISwap = _.ISwap,
      IMergable = _.IMergable,
      IHash = imm.IHash,
      ISet = _.ISet,
      INamable = _.INamable,
      ITransientAssociative = mut.ITransientAssociative,
      IDispatch = $.IDispatch,
      ISubscribe = $.ISubscribe,
      IRevertible = $.IRevertible,
      IEmptyableCollection = _.IEmptyableCollection,
      ICheckable = vd.ICheckable,
      IConstrainable = vd.IConstrainable,
      ICollection = _.ICollection,
      ITransientCollection = mut.ITransientCollection,
      IMiddleware = $.IMiddleware,
      IReduce = _.IReduce,
      IKVReduce = _.IKVReduce,
      IAppendable = _.IAppendable,
      IPrependable = _.IPrependable,
      IQueryable = repos.IQueryable,
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

  var IRepository = _.protocol({
    commit: null
  });

  var IIdentifiable = _.protocol({
    identifier: null //machine-friendly identifier (lowercase, no embedded spaces) offering reasonable uniqueness within a context
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

  var IBuffer = _.protocol({
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
    ITiddler: ITiddler,
    IQueryable: IQueryable,
    IFactory: IFactory,
    IPersistable: IPersistable,
    IOriginated: IOriginated,
    ITransaction: ITransaction,
    IView: IView,
    IVertex: IVertex,
    IBuffer: IBuffer
  }

  function ConstrainedCollection(constraints, coll){
    this.constraints = constraints;
    this.coll = coll;
  }

  (function(){

    function reduce(self, xf, init){
      var memo = init,
          ys = self;
      while(_.seq(ys)){
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
      return new self.constructor(self.constraints, _.assoc(self.coll, idx, value));
    }

    function seq(self){
      return _.seq(self.coll) ? self : null;
    }

    function empty(self){
      return new self.constructor(self.constraints, _.empty(self.coll));
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
      _.forward("coll", ISeq, INext, IInclusive, ICounted, IIndexed, IAssociative),
      _.implement(IEmptyableCollection, {empty: empty}),
      _.implement(IFunctor, {fmap: fmap}),
      _.implement(IConstrainable, {constraints: constraints}),
      _.implement(ILookup, {lookup: _.nth}),
      _.implement(IAssociative, {assoc: assoc}),
      _.implement(IDeref, {deref: deref}),
      _.implement(IReduce, {reduce: reduce}),
      _.implement(IKVReduce, {reducekv: reducekv}),
      _.implement(IEquiv, {equiv: equiv}),
      _.implement(ICollection, {conj: conj}),
      _.implement(ISeqable, {seq: seq}));

  })();

  function ResolvingCollection(constraints, coll){
    this.constraints = constraints;
    this.coll = coll;
  }

  (function(){

    function conj(self, value){
      return new self.constructor(self.constraints, _.conj(self.coll, value));
    }

    function assoc(self, idx, value){
      return new self.constructor(self.constraints, _.assoc(self.coll, idx, value));
    }

    function empty(self){
      return new self.constructor(self.constraints, _.empty(self.coll));
    }

    function constraints1(self){
      return IConstrainable.constraints(self.coll);
    }

    function constraints2(self, constraints){
      return new self.constructor(self.constraints, IConstrainable.constraints(self.coll, constraints));
    }

    var constraints = _.overload(null, constraints1, constraints2);

    function resolved(self){
      return IConstrainable.constraints(self.coll, self.constraints);
    }

    _.doto(ResolvingCollection,
      _.forward("coll", ISeq, INext, IInclusive, ICounted, IIndexed, IAssociative, ISeqable, IDeref, IFunctor, IReduce, IKVReduce),
      _.implement(IResolveable, {resolved: resolved}),
      _.implement(IEmptyableCollection, {empty: empty}),
      _.implement(IConstrainable, {constraints: constraints}),
      _.implement(ILookup, {lookup: _.nth}),
      _.implement(IAssociative, {assoc: assoc}),
      _.implement(ICollection, {conj: conj}));

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

    function fmap(self, f){
      return new self.constructor(self.cardinality, _.fmap(self.coll, f));
    }

    function conj(self, value){
      var coll = ICollection.conj(self.coll, value);
      return new self.constructor(self.cardinality, _.into(_.empty(coll), _.drop(_.max(_.count(coll) - _.end(self.cardinality), 0), coll)));
    }

    function assoc(self, idx, value){
      return new self.constructor(self.cardinality, _.assoc(self.coll, idx, value));
    }

    function empty(self){
      return new self.constructor(self.cardinality, _.into(_.empty(self.coll), _.take(_.start(self.cardinality), self.coll)));
    }

    function constraints1(self){
      return IConstrainable.constraints(self.coll);
    }

    function constraints2(self, constraints){
      return new self.constructor(self.cardinality, IConstrainable.constraints(self.coll, constraints));
    }

    var constraints = _.overload(null, constraints1, constraints2);

    _.doto(ClampedCollection,
      _.forward("coll", IReduce, IKVReduce, ISeq, INext, ICounted, IInclusive, IEquiv, IIndexed, IAssociative, ISeqable, IDeref),
      _.implement(IEmptyableCollection, {empty: empty}),
      _.implement(IFunctor, {fmap: fmap}),
      _.implement(IConstrainable, {constraints: constraints}),
      _.implement(ILookup, {lookup: _.nth}),
      _.implement(IAssociative, {assoc: assoc}),
      _.implement(ICollection, {conj: conj}));

  })();

  var constrainedCollection = _.fnil(_.constructs(ConstrainedCollection), vd.and(vd.opt), [], []),
      optional  = clampedCollection(vd.opt),
      required  = clampedCollection(vd.req),
      unlimited = constrainedCollection(vd.and(vd.unlimited)),
      entities  = vd.constrain(unlimited, vd.collOf(vd.isa(_.GUID))),
      entity    = vd.constrain(required, vd.collOf(vd.isa(_.GUID)));

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

    _.doto(Assertion,
      _.forward("attrs", IHash),
      _.record);

  })();

  function AssertionStore(questions, assertions){
    this.questions = questions;
    this.assertions = assertions;
  }

  var assertionStore = _.fnil(_.constructs(AssertionStore), _.array, imm.map());

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
      return _.seq(_.get(self.assertions, assertion));
    }

    _.doto(AssertionStore,
      _.implement(ICollection, {conj: reviseStore(_.conj)}),
      _.implement(ISet, {disj: reviseStore(_.disj)}),
      _.implement(ILookup, {lookup: lookup}));

  })();

  var ientity = (function(){

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

    function id(self){
      return _.guid(self.attrs.id);
    }

    function field(self, key){
      return IKind.field(self.topic, key) || _.assoc(_.isArray(_.get(self.attrs, key)) ? _field(key, unlimited, valuesCaster) : _field(key, optional, valueCaster), "missing", true);
    }

    function kind(self){ //TODO use?
      return IIdentifiable.identifier(self.topic);
    }

    function lookup(self, key){
      return IField.aget(field(self, key), self);
    }

    function assoc(self, key, values){
      return IField.aset(field(self, key), self, values);
    }

    function contains(self, key){
      return _.contains(self.attrs, key);
    }

    function dissoc(self, key){
      return assoc(self, key, null); //TODO test
    }

    function keys(self){
      return imm.distinct(_.concat(_.keys(self.topic), _.keys(self.attrs)));
    }

    function constraints(self){
      return _.reduce(function(memo, key){
        return _.append(memo, vd.optional(key, IConstrainable.constraints(field(self, key))));
      }, vd.and(), keys(self));
    }

    function serialize(self){
      return self.attrs;
    }

    return _.does(
      _.implement(ISerializable, {serialize: serialize}),
      _.implement(IConstrainable, {constraints: constraints}),
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
      return new self.constructor(_.assoc(self.attrs, key, value), self.caster);
    }

    function contains(self, key){
      return _.contains(self.attrs, key);
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
      return IConstrainable.constraints(ICaster.cast(self.caster, null));
    }

    return _.doto(Field,
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IAssociative, {contains: contains, assoc: assoc}),
      _.implement(IConstrainable, {constraints: constraints}),
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
      return new self.constructor(_.assoc(self.attrs, key, value), self.computations, self.emptyColl);
    }

    function contains(self, key){
      return _.contains(self.attrs, key);
    }

    function aget(self, entity){
      return _.into(self.emptyColl, _.filter(_.isSome, _.map(_.applying(entity), self.computations)));
    }

    function identifier(self){
      return _.get(self, "key");
    }

    function constraints(self){
      return IConstrainable.constraints(self.emptyColl);
    }

    return _.doto(ComputedField,
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IAssociative, {contains: contains, assoc: assoc}),
      _.implement(IConstrainable, {constraints: constraints}),
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
      _.implement(IMergable, {merge: merge}),
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
      _.implement(IMergable, {merge: merge}),
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
      _.implement(IRepository, {commit: commit}),
      _.implement(IQueryable, {query: query}));

  })();

  var Topic = (function(){

    function Topic(type, attrs, schema){
      this.type = type;
      this.attrs = attrs;
      this.schema = schema;
    }

    function lookup(self, key){
      return _.get(self.attrs, key);
    }

    function assoc(self, key, value){
      return new Topic(self.type, _.assoc(self.attrs, key, value), self.schema, self.resource);
    }

    function contains(self, key){
      return _.contains(self.attrs, key);
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
      _.implement(INamable, {name: name}),
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
    ientity,
    tiddlerBehavior("title", "text"));

  function Task(topic, attrs){
    this.topic = topic;
    this.attrs = attrs;
  }

  _.doto(Task,
    ientity,
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
    _.assoc(field("modified", vd.constrain(optional, vd.collOf(_.isDate)), function(coll){
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
        _.assoc(field("priority", vd.constrain(optional, vd.collOf(vd.choice([1, 2, 3])))), "label", "Priority"),
        _.assoc(field("due", vd.constrain(optional, vd.collOf(_.isDate)), function(coll){
          return recaster(_.date, toLocaleString, valueCaster(coll));
        }), "label", "Due Date"),
        _.assoc(computedField("overdue", [isOverdue]), "label", "Overdue"),
        _.assoc(computedField("flags", [typed, flag("overdue", isOverdue), flag("important", isImportant)]), "label", "Flags"),
        _.assoc(field("assignee", entities), "label", "Assignee"),
        _.assoc(field("expanded", vd.constrain(required, vd.collOf(_.isBoolean))), "label", "Expanded")));

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
      }, _.seq(self));
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
      return _.contains(self, IEntity.id(entity));
    }

    function first(self){
      return _.first(vals(self));
    }

    function rest(self){
      return _.rest(vals(self));
    }

    function next(self){
      return _.seq(rest(self));
    }

    function seq(self){
      return _.seq(_.keys(self)) ? self : null;
    }

    function lookup(self, id){
      return _.contains(self.changed, id) ? _.get(self.changed, id) : _.get(self.loaded, id);
    }

    function reduce(self, f, init){
      return _.reduce(f, init, _.map(_.get(self, _), _.keys(self)));
    }

    function dissoc(self, id){
      return _.contains(self, id) ?
        entityWorkspace(
          _.contains(self.loaded, id) ? _.dissoc(self.loaded, id) : self.loaded,
          _.contains(self.changed, id) ? _.dissoc(self.changed, id) : self.changed, _.cons(id)) : self;
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
      return !!_.get(self, id);
    }

    function id(self){
      return self.id;
    }

    function commands(self){
      return _.just(self.changed,
        _.keys,
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
      _.implement(IBuffer, {dirty: dirty, load: load, add: add, edit: edit, destroy: destroy, changes: changes, touched: touched}),
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

  var entityWorkspace = _.fnil(_.constructs(EntityWorkspace), imm.map(), imm.map(), imm.set());

  function IndexedEntityWorkspace(indexes, workspace){
    this.indexes = indexes;
    this.workspace = workspace;
  }

  (function(){ // TODO implement indexing

    function query(self, plan){
      return IQueryable.query(self.workspace, plan);
    }

    function load(self, entities){
      return new self.constructor(self.indexes, IBuffer.load(self.workspace, entities));
    }

    function add(self, entities){
      var xs = _.mapcat(IEntity.assertions, entities);
      return new self.constructor(self.indexes, IBuffer.add(self.workspace, entities));
    }

    function edit(self, entities){
      return new self.constructor(self.indexes, IBuffer.edit(self.workspace, entities));
    }

    function destroy(self, entities){
      return new self.constructor(self.indexes, IBuffer.destroy(self.workspace, entities));
    }

    function dissoc(self, id){
      return new self.constructor(self.indexes, _.dissoc(self.workspace, id));
    }

    _.doto(IndexedEntityWorkspace,
      _.forward("workspace", IMap, ISeq, INext, ISeqable, ILookup, IReduce, ICounted, IInclusive, IAssociative, IEntity, ITransaction, IResolver, IBuffer, IIndexed),
      _.implement(IQueryable, {query: query}),
      _.implement(IBuffer, {load: load, add: add, edit: edit, destroy: destroy}),
      _.implement(IMap, {dissoc: dissoc}),
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

  function Command(type, attrs){
    this.type = type;
    this.attrs = attrs;
  }

  function Event(type, attrs){
    this.type = type;
    this.attrs = attrs;
  }

  var alter = _.partly(function alter(message, type){
    return Object.assign(_.clone(message), {type: type});
  });

  var effect = _.partly(function effect(message, type){
    var e = new Event();
    return Object.assign(e, message, {type: type});
  });

  function messageBehavior(Type){

    function hash(self){
      return imm.hash({type: self.type, attrs: self.attrs});
    }

    function identifier(self){
      return self.type;
    }

    return _.doto(Type,
      _.record,
      _.implement(IHash, {hash: hash}),
      _.implement(IIdentifiable, {identifier: identifier}));

  }

  _.each(messageBehavior, [Command, Event]);

  function constructs(Type){
    return function message(type){
      return function(args, options){
        return new Type(type, Object.assign({args: args || []}, options));
      }
    }
  }

  var command = constructs(Command),
      event = constructs(Event);

  function defs(construct, keys){
    return _.reduce(function(memo, key){
      return _.assoc(memo, key, construct(key));
    }, {}, keys);
  }

  var c = defs(command, ["pipe", "find", "take", "skip", "last", "query", "load", "save", "cast", "toggle", "tag", "untag", "assert", "retract", "select", "deselect", "add", "destroy", "undo", "redo", "flush", "peek"]),
      e = defs(event, ["found", "took", "skipped", "lasted", "queried", "loaded", "saved", "casted", "toggled", "tagged", "untagged", "asserted", "retracted", "selected", "deselected", "added", "destroyed", "undone", "redone", "flushed", "peeked"]);

  function handleExisting(event){
    return function handle(self, command, next){
      var e = Object.assign(event(), command, {type: event().type});
      //var id = _.get(command, "id");
      //if (_.apply(_.everyPred, _.contains(self.buffer, _), id)) {
        $.raise(self.provider, e);
      //}
      next(command);
    }
  }

  function FindHandler(provider){
    this.provider = provider;
  }

  var findHandler = _.constructs(FindHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, effect(command, "found"));
      next(command);
    }

    return _.doto(FindHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function FoundHandler(compose){
    this.compose = compose;
  }

  var foundHandler = _.constructs(FoundHandler);

  (function(){

    function handle(self, event, next){
      var args = _.get(event, "args");
      switch (_.count(args)) {
        case 1:
          var type = _.first(args);
          self.compose(t.filter(function(entity){
            return _.first(_.get(entity, "$type")) == type;
          }));
          break;

        case 2:
          var key = _.first(args), value = _.second(args);
          self.compose(t.filter(function(entity){
            return _.includes(_.get(entity, key), value);
          }));
          break;

      }
      next(event);
    }

    return _.doto(FoundHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function TakeHandler(provider){
    this.provider = provider;
  }

  var takeHandler = _.constructs(TakeHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, effect(command, "took"));
      next(command);
    }

    return _.doto(TakeHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function TookHandler(compose){
    this.compose = compose;
  }

  var tookHandler = _.constructs(TookHandler);

  (function(){

    function handle(self, event, next){
      self.compose(t.take(_.getIn(event, ["args", 0])));
      next(event);
    }

    return _.doto(TookHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SkipHandler(provider){
    this.provider = provider;
  }

  var skipHandler = _.constructs(SkipHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, effect(command, "skipped"));
      next(command);
    }

    return _.doto(SkipHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SkippedHandler(compose){
    this.compose = compose;
  }

  var skippedHandler = _.constructs(SkippedHandler);

  (function(){

    function handle(self, event, next){
      self.compose(t.drop(_.getIn(event, ["args", 0])));
      next(event);
    }

    return _.doto(SkippedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LastHandler(provider){
    this.provider = provider;
  }

  var lastHandler = _.constructs(LastHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, effect(command, "lasted"));
      next(command);
    }

    return _.doto(LastHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LastedHandler(compose){
    this.compose = compose;
  }

  var lastedHandler = _.constructs(LastedHandler);

  (function(){

    function handle(self, event, next){
      self.compose(t.last(_.getIn(event, ["args", 0])));
      next(event);
    }

    return _.doto(LastedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function PipeHandler(buffer, model, commandBus){
    this.buffer = buffer;
    this.model = model;
    this.commandBus = commandBus;
  }

  var pipeHandler = _.constructs(PipeHandler);

  (function(){

    function handle(self, command, next){
      var commands = _.get(command, "args");
      _.just(commands,
        _.map(_.assoc(_, "pipe-id",_.guid()), _),
        _.each($.dispatch(self.commandBus, _), _));
      next(command);
    }

    return _.doto(PipeHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LoadHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var loadHandler = _.constructs(LoadHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, e.loaded(_.get(command, "args")));
      next(command);
    }

    return _.doto(LoadHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LoadedHandler(buffer){
    this.buffer = buffer;
  }

  var loadedHandler = _.constructs(LoadedHandler);

  (function(){

    function handle(self, event, next){
      IBuffer.load(self.buffer, _.get(event, "args")); //TODO ITransientBuffer.load
      next(event);
    }

    return _.doto(LoadedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();


  function AddHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var addHandler = _.constructs(AddHandler);

  (function(){

    function handle(self, command, next){
      var id = _.get(command, "id") || _.guid(),
          args = _.get(command, "args");;
      $.raise(self.provider, e.added(args, {id: id}));
      next(command);
    }

    _.doto(AddHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function AddedHandler(model, buffer, commandBus){
    this.model = model;
    this.buffer = buffer;
    this.commandBus = commandBus;
  }

  var addedHandler = _.constructs(AddedHandler);

  (function(){

    function handle(self, event, next){
      var id = _.get(event, "id"),
          type = _.getIn(event, ["args", 0]),
          title = _.getIn(event, ["args", 1]);

      var added = IFactory.make(self.buffer, {id: _.str(id), $type: type});
      //TODO move default determination as attributes to the command where the event is computed
      //TODO expose `make` further down?
      var entity = _.reduce(function(memo, key){
          var fld = IKind.field(memo, key);
          return _.maybe(_.get(fld, "defaults"), function(defaults){
            return IField.aset(fld, memo, defaults);
          }) || memo;
        }, ITiddler.title(added, title), _.keys(added));

      _.swap(self.buffer, function(buffer){
        return IBuffer.add(buffer, [entity]);
      });

      //TODO create middleware which clears selections after certain actions, remove `model`
      _.just(self.model, _.deref, _.get(_, "selected"), _.toArray, c.deselect, $.dispatch(self.commandBus, _));
      $.dispatch(self.commandBus, c.select([], {id: [id]}));
      next(event);
    }

    _.doto(AddedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function ToggleHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var toggleHandler = _.constructs(ToggleHandler);

  (function(){

    _.doto(ToggleHandler,
      _.implement(IMiddleware, {handle: handleExisting(e.toggled)}));

  })();

  function ToggledHandler(buffer){
    this.buffer = buffer;
  }

  var toggledHandler = _.constructs(ToggledHandler);

  (function(){

    function handle(self, command, next){
      var id = _.get(command, "id"),
          key = _.getIn(command, ["args", 0]);
      _.swap(self.buffer, function(buffer){
        return IBuffer.edit(buffer, _.mapa(_.pipe(_.get(buffer, _), _.update(_, key, _.mapa(_.not, _))), id));
      });
      next(command);
    }

    _.doto(ToggledHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();


  function TagHandler(handler){
    this.handler = handler;
  }

  var tagHandler = _.constructs(TagHandler);

  (function(){

    function handle(self, command, next){
      var altered = _.just(command, alter(_, "assert"), _.update(_, "args", _.pipe(_.cons("tag", _), _.toArray)));
      $.handle(self.handler, altered, next);
      next(command);
    }

    _.doto(TagHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function UntagHandler(handler){
    this.handler = handler;
  }

  var untagHandler = _.constructs(UntagHandler);

  (function(){

    function handle(self, command, next){
      var altered =  _.just(command, alter(_, "retract"), _.update(_, "args", _.pipe(_.cons("tag", _), _.toArray)));
      $.handle(self.handler, altered, next);
      next(command);
    }

    _.doto(UntagHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function CastHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var castHandler = _.constructs(CastHandler);

  (function(){

    //it's unavoidable that attributes may not line up on a cast, so cast wisely.
    function handle(self, command, next){
      var prior = _.get(self.buffer, _.get(command, "id")),
          id = _.get(command, "id"),
          type = _.getIn(command, ["args", 0]);
      if (prior) {
        var entity = IFactory.make(self.buffer, Object.assign({}, prior.attrs, {$type: type})),
            title  = ITiddler.title(prior),
            text   = ITiddler.text(prior);
        if (title){
          entity = ITiddler.title(entity, title);
        }
        if (text){
          entity = ITiddler.text(entity, text);
        }
        _.swap(self.buffer, function(buffer){
          return IBuffer.edit(buffer, [entity]);
        });
        $.raise(self.provider, e.casted([id, type]));
      }
      next(command);
    }

    _.doto(CastHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SaveHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var saveHandler = _.constructs(SaveHandler);

  (function (){

    function handle(self, command){
      IPersistable.save(self.buffer)
      $.raise(self.provider, e.saved());
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
      $.dispatch(self.commandBus, c.flush());
      next(event);
    }

    return _.doto(SavedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function journalsCommand(able, event){

    function handle(self, command, next){
      if (able(self.buffer)){
        $.raise(self.provider, event);
      }
      next(command);
    }

    return _.does(
      _.implement(IMiddleware, {handle: handle}));

  }

  function journalsEvent(effect){

    function handle(self, event, next){
      effect(self.buffer);
      next(event);
    }

    return _.does(
      _.implement(IMiddleware, {handle: handle}));

  }


  function UndoHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var undoHandler = _.constructs(UndoHandler);

  _.doto(UndoHandler,
    journalsCommand(IRevertible.undoable, e.undone()));

  function UndoneHandler(buffer){
    this.buffer = buffer;
  }

  var undoneHandler = _.constructs(UndoneHandler);

  _.doto(UndoneHandler,
    journalsEvent(IRevertible.undo));

  function RedoHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var redoHandler = _.constructs(RedoHandler);

  _.doto(RedoHandler,
    journalsCommand(IRevertible.redoable, e.redone()));

  function RedoneHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var redoneHandler = _.constructs(RedoneHandler);

  _.doto(RedoneHandler,
    journalsEvent(IRevertible.redo));

  function FlushHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var flushHandler = _.constructs(FlushHandler);

  _.doto(FlushHandler,
    journalsCommand(_.constantly(true), e.flushed()));

  function FlushedHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var flushedHandler = _.constructs(FlushedHandler);

  _.doto(FlushedHandler,
    journalsEvent(IRevertible.flush));

  function AssertHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var assertHandler = _.constructs(AssertHandler);

  (function(){

    _.doto(AssertHandler,
      _.implement(IMiddleware, {handle: handleExisting(e.asserted)}));

  })();

  function AssertedHandler(buffer){
    this.buffer = buffer;
  }

  var assertedHandler = _.constructs(AssertedHandler);

  (function(){

    function handle(self, event, next){
      var key = _.getIn(event, ["args", 0]),
          value = _.getIn(event, ["args", 1]),
          id = _.get(event, "id");

      _.swap(self.buffer, function(buffer){
        return IBuffer.edit(buffer, _.mapa(function(id){
          return assert(_.get(buffer, id), key, value);
        }, id));
      });

      next(event);
    }

    _.doto(AssertedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

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

  function DestroyHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var destroyHandler = _.constructs(DestroyHandler);

  (function(){

    _.doto(DestroyHandler,
      _.implement(IMiddleware, {handle: handleExisting(e.destroyed)}));

  })();

  function DestroyedHandler(buffer){
    this.buffer = buffer;
  }

  var destroyedHandler = _.constructs(DestroyedHandler);

  (function(){

    function handle(self, event, next){
      var id = _.get(event, "id");
      _.swap(self.buffer, function(buffer){
        return IBuffer.destroy(buffer, _.mapa(_.get(buffer, _), id));
      });

      next(event);
    }

    _.doto(DestroyHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function RetractHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var retractHandler = _.constructs(RetractHandler);

  (function(){

    _.doto(RetractHandler,
      _.implement(IMiddleware, {handle: handleExisting(e.retracted)}));

  })();

  function RetractedHandler(buffer){
    this.buffer = buffer;
  }

  var retractedHandler = _.constructs(RetractedHandler);

  (function(){

    function handle(self, event, next){
      var key = _.getIn(event, ["args", 0]),
          value = _.getIn(event, ["args", 1]),
          id = _.get(event, "id");

      _.swap(self.buffer, function(buffer){
        return IBuffer.edit(buffer, _.mapa(function(id){
          var entity = _.get(buffer, id);
          return _.isSome(value) ? retract(entity, key, value) : retract(entity, key);
        }, id));
      });

      next(event);
    }

    _.doto(RetractedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function QueryHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var queryHandler = _.constructs(QueryHandler);

  (function(){

    function handle(self, command, next){
      return _.fmap(IQueryable.query(self.buffer, _.get(command, "plan")), function(entities){
        $.raise(self.provider, e.queried(entities));
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
      $.dispatch(self.commandBus, c.load(_.get(event, "args")));
      next(event);
    }

    return _.doto(QueriedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SelectHandler(buffer, provider){
    this.buffer = buffer;
    this.provider = provider;
  }

  var selectHandler = _.constructs(SelectHandler);

  (function(){

    function handle(self, command, next){
      var id = _.get(command, "id");
      var missing = _.detect(_.complement(_.contains(self.buffer, _)), id);
      if (!missing) {
        $.raise(self.provider, e.selected([], {id: id}));
      } else {
        throw new Error("Entity " + _.str(missing) + " was not present in buffer.");
      }
      next(command);
    }

    return _.doto(SelectHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SelectedHandler(model){
    this.model = model;
  }

  var selectedHandler = _.constructs(SelectedHandler);

  (function(){

    function handle(self, event, next){
      var id = _.get(event, "id");
      _.swap(self.model,
        _.update(_, "selected",
          _.apply(_.conj, _, id)));
      next(event);
    }

    return _.doto(SelectedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DeselectHandler(model, provider){
    this.model = model;
    this.provider = provider;
  }

  var deselectHandler = _.constructs(DeselectHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, effect(command, "deselected"));
      next(command);
    }

    return _.doto(DeselectHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DeselectedHandler(model){
    this.model = model;
  }

  var deselectedHandler = _.constructs(DeselectedHandler);

  (function(){

    function handle(self, event, next){
      var id = _.get(event, "id");
      _.swap(self.model,
        _.update(_, "selected",
          _.apply(_.disj, _, id))); //_.comp(_.toArray, _.remove(_.includes(id, _), _))
      next(event);
    }

    return _.doto(DeselectedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function PeekHandler(provider){
    this.provider = provider;
  }

  var peekHandler = _.constructs(PeekHandler);

  (function(){

    function handle(self, command, next){
      $.raise(self.provider, effect(command, "peeked"));
      next(command);
    }

    return _.doto(PeekHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function PeekedHandler(buffer, model){
    this.buffer = buffer;
    this.model = model;
  }

  var peekedHandler = _.constructs(PeekedHandler);

  (function(){
    function handle(self, event, next){
      _.just(self.model.state.selected, _.toArray, _.mapa(_.get(self.buffer, _), _), _.see("peeked"));
      next(event);
    }

    return _.doto(PeekedHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LockingMiddleware(bus, queued, handling){
    this.bus = bus;
    this.queued = queued;
    this.handling = handling;
  }

  function lockingMiddleware(bus){
    return new LockingMiddleware(bus, [], false);
  }

  (function(){

    function handle(self, message, next){
      next(message);
    }

    function handle(self, message, next){
      if (self.handling) {
        self.queued.push(message);
      } else {
        self.handling = true;
        next(message);
        self.handling = false;
        if (self.queued.length) {
          var queued = self.queued;
          self.queued = [];
          _.log("draining queued", queued);
          _.each($.dispatch(self.bus, _), queued);
        }
      }
    }

    return _.doto(LockingMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function SelectionMiddleware(model, pred){
    this.model = model;
    this.pred = pred;
  }

  var selectionMiddleware = _.constructs(SelectionMiddleware);

  (function(){

    function handle(self, message, next){
      if (!_.contains(message, "id") && self.pred(message)) {
        _.just(
          self.model,
          _.deref,
          _.get(_, "selected"), //a sequence!
          _.toArray,
          _.assoc(message, "id", _),
          next);
      } else {
        next(message);
      }
    }

    return _.doto(SelectionMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function FindMiddleware(model, buffer, pred, lastPipeId){
    this.model = model;
    this.buffer = buffer;
    this.pred = pred;
    this.lastPipeId = lastPipeId;
  }

  var findMiddleware = _.constructs(FindMiddleware);

  (function(){
    function handle(self, message, next){
      var pipeId = _.get(message, "pipe-id");

      if (_.notEq(pipeId, self.lastPipeId)) {
        _.swap(self.model, _.assoc(_, "find", null));
        _.log("cleared find cache!");
        self.lastPipeId = pipeId;
      }

      if (!_.contains(message, "id") && self.pred(message)) {
        var f = _.just(self.model, _.deref, _.get(_, "find"));
        if (f) {
          var id = _.just(self.buffer.workspace, //TODO demeter!
            _.deref,
            _.into([], _.comp(f, t.map(_.get(_, "id")), t.map(_.first)), _),
            _.assoc(message, "id", _),
            next);
          return;
        }
      }
      next(message);
    }

    return _.doto(FindMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function KeyedMiddleware(key, value){
    this.key = key;
    this.value = value;
  }

  var keyedMiddleware = _.constructs(KeyedMiddleware);

  (function(){
    function handle(self, message, next){
      _.just(message,
        _.assoc(_, self.key, self.value()),
        next);
    }

    return _.doto(KeyedMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function TeeMiddleware(effect){
    this.effect = effect;
  }

  var teeMiddleware = _.constructs(TeeMiddleware);

  (function(){

    function handle(self, message, next){
      self.effect(message);
      next(message);
    }

    return _.doto(TeeMiddleware,
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

  function handlerMiddleware2(handlers, identify){
    return handlerMiddleware3(handlers, identify);
  }

  function handlerMiddleware1(handlers){
    return handlerMiddleware2(handlers, IIdentifiable.identifier);
  }

  function handlerMiddleware0(){
    return handlerMiddleware1({});
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
      } else {
        next(message);
      }
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

    function make(self, attrs){
      return IFactory.make(self.repo, attrs);
    }

    function edit(self, entities){
      _.swap(self.workspace, function(workspace){
        return IBuffer.edit(workspace, entities);
      });
    }

    function lookup(self, id){
      return _.just(self.workspace, _.deref, _.get(_, id));
    }

    function contains(self, id){
      return _.just(self.workspace, _.deref, _.contains(_, id));
    }

    function load(self, entities){
      _.swap(self.workspace, function(workspace){
        return IBuffer.load(workspace, entities);
      });
    }

    function query(self, plan){
      return IQueryable.query(self.repo, plan);
    }

    function save(self){
      return IRepository.commit(self.repo, self.workspace); //TODO return outcome status?
    }

    _.doto(Buffer,
      _.forward("workspace", ISwap, IRevertible, IReduce),
      _.implement(IAssociative, {contains: contains}),
      _.implement(IPersistable, {save: save}),
      _.implement(IFactory, {make: make}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IBuffer, {load: load, edit: edit}), //TODO ITransientBuffer.load
      _.implement(IQueryable, {query: query}));

  })();

  //NOTE a view is capable of returning a seq of all possible `IView.interactions` each implementing `IIdentifiable` and `INamable`.
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
        commandBus = bus(),
        eventBus = bus(),
        emitter = $.subject();

    var entityDriven = _.comp(_.includes(["assert", "retract", "toggle", "destroy", "cast", "tag", "untag", "select", "deselect"], _), IIdentifiable.identifier);

    _.doto(commandBus,
      mut.conj(_,
        lockingMiddleware(commandBus),
        keyedMiddleware("command-id", _.generate(_.iterate(_.inc, 1))),
        findMiddleware(model, buffer, entityDriven),
        selectionMiddleware(model, entityDriven),
        teeMiddleware(_.see("command")),
        _.doto(handlerMiddleware(),
          mut.assoc(_, "pipe", pipeHandler(buffer, model, commandBus)),
          mut.assoc(_, "find", findHandler(events)),
          mut.assoc(_, "take", takeHandler(events)),
          mut.assoc(_, "skip", skipHandler(events)),
          mut.assoc(_, "last", lastHandler(events)),
          mut.assoc(_, "peek", peekHandler(events)),
          mut.assoc(_, "load", loadHandler(buffer, events)),
          mut.assoc(_, "add", addHandler(buffer, events)),
          mut.assoc(_, "save", saveHandler(buffer, events)),
          mut.assoc(_, "undo", undoHandler(buffer, events)),
          mut.assoc(_, "redo", redoHandler(buffer, events)),
          mut.assoc(_, "flush", flushHandler(buffer, events)),
          mut.assoc(_, "cast", castHandler(buffer, events)),
          mut.assoc(_, "tag", tagHandler(commandBus)),
          mut.assoc(_, "untag", untagHandler(commandBus)),
          mut.assoc(_, "toggle", toggleHandler(buffer, events)),
          mut.assoc(_, "assert", assertHandler(buffer, events)),
          mut.assoc(_, "retract", retractHandler(buffer, events)),
          mut.assoc(_, "destroy", destroyHandler(buffer, events)),
          mut.assoc(_, "query", queryHandler(buffer, events)),
          mut.assoc(_, "select", selectHandler(buffer, events)),
          mut.assoc(_, "deselect", deselectHandler(model, events))),
        drainEventsMiddleware(events, eventBus)));

    function compose(key, f){
      _.just(model, _.swap(_, _.update(_, key, function(g){
        return g ? _.comp(g, f) : f;
      })));
    }

    _.doto(eventBus,
      mut.conj(_,
        keyedMiddleware("event-id", _.generate(_.iterate(_.inc, 1))),
        teeMiddleware(_.see("event")),
        _.doto(handlerMiddleware(),
          mut.assoc(_, "peeked", peekedHandler(buffer, model)),
          mut.assoc(_, "found", foundHandler(_.partial(compose, "find"))),
          mut.assoc(_, "took", tookHandler(_.partial(compose, "find"))),
          mut.assoc(_, "skipped", skippedHandler(_.partial(compose, "find"))),
          mut.assoc(_, "lasted", lastedHandler(_.partial(compose, "find"))),
          mut.assoc(_, "loaded", loadedHandler(buffer)),
          mut.assoc(_, "added", addedHandler(model, buffer, commandBus)),
          mut.assoc(_, "saved", savedHandler(commandBus)),
          mut.assoc(_, "undone", undoneHandler(buffer)),
          mut.assoc(_, "redone", redoneHandler(buffer)),
          mut.assoc(_, "flushed", flushedHandler(buffer)),
          mut.assoc(_, "toggled", toggledHandler(buffer)),
          mut.assoc(_, "asserted", assertedHandler(buffer)),
          mut.assoc(_, "retracted", retractedHandler(buffer)),
          mut.assoc(_, "destroyed", destroyedHandler(buffer)),
          mut.assoc(_, "queried", queriedHandler(commandBus)),
          mut.assoc(_, "selected", selectedHandler(model)),
          mut.assoc(_, "deselected", deselectedHandler(model))),
        eventMiddleware(emitter)));

    return new Outline(buffer, model, commandBus, eventBus, emitter, options);
  }

  (function(){
    function render(self, el){ //TODO implement last
      _.log("render", self, el);
    }

    function dispatch(self, message){
      $.dispatch(self.commandBus, message);
    }

    function lookup(self, guid){ //TODO drop — for development purposes
      return _.get(self.buffer, guid);
    }

    function sub(self, observer){ //TODO provide separate set of external events (e.g. don't expose its internals)
      return $.sub(self.emitter, observer);
    }

    return _.doto(Outline,
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IDispatch, {dispatch: dispatch}),
      _.implement(ISubscribe, {sub: sub}),
      _.implement(IView, {render: render}));

  })();

  var ol = _.doto(
    outline(
      buffer(
        jsonResource("../data/outline.json", work),
        $.journal($.cell(indexedEntityWorkspace()))),
        {root: null}),
    $.sub(_,
      t.filter(function(e){
        return e.type === "loaded";
      }),
      function(e){
        _.each($.dispatch(ol, _), [
          c.pipe([
            c.find(["tiddler"]),
            c.last([5]),
            c.select(),
            c.peek()
          ]),
          c.select([], {id: [_.guid(0)]}),
          c.tag(["test"], {id: [_.guid(1)]}),
          c.tag(["cosmos"]),
          c.pipe([
            c.add(["tiddler", "Scooby"]),
            c.select(),
            c.tag(["sleuth"]),
            c.tag(["dog"]),
          ]),
          c.select([], {id: [_.guid(0), _.guid(1)]}),
          c.peek()
        ]);
      }),
    $.dispatch(_, c.query()));

  return _.just(protocols,
    _.reduce(_.merge, _,
      _.map(function(protocol){
        return _.reduce(function(memo, key){
          return _.assoc(memo, key, protocol[key]);
        }, {}, Object.keys(protocol));
      }, _.vals(protocols))),
    _.merge(_, {
      ol: ol,
      c: c,
      e: e,
      optional: optional,
      required: required,
      unlimited: unlimited,
      assertionStore: assertionStore,
      dirtyKeys: dirtyKeys,
      questions: questions,
      assertion: assertion,
      entityWorkspace: entityWorkspace,
      domain: domain,
      assert: assert,
      retract: retract,
      asserts: asserts
    }), _.impart(_, _.partly));

});

//# sourceURL=entities.js
