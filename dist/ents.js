define(['atomic/core', 'atomic/dom', 'atomic/transients', 'atomic/reactives', 'atomic/validates', 'atomic/immutables', 'context'], function(_, dom, mut, $, vd, imm, context){

  //TODO implement faux repo (no actual datastore) of tasks using non-SharePoint entities
  //GOAL Factor the SharePoint out of SharePoint (e.g. design against abstractions that are platform agnostic)!
  //GOAL Develop a comprehensive entity management model that also works in a non-SharePoint context and when stable port to Atomic.
  //GOAL Use an "always validatable" approach.
  //GOAL Mind "tell, don't ask" eliminating protocols that query and expose internal information and rather aim to keep that information hidden.
  //TODO Create SharePointText with e-mail validation and test it.  How to communicate what SharePoint itself doesn't (e.g. that a certain field contains e-mail addresses and needs an appropriate regex)?
  //TODO Apply effects (destruction, modification, addition) to datastore.
  //TODO Allow a SharePoint(Multi)Value to render a control independent of an entity.
  //TODO Improve efficiency (with an index decorator?) of looking up an entity in a buffer by pk rather than guid.
  //TODO Use `query` to access internal indexes rather than another protocol.
  //TODO Consider use cases for `init` (e.g. creating new entities or resetting an existing field to factory defaults).
  //TODO Render a form that can be persisted thereby replacing `dynaform`.
  //TODO #FUTURE Optimize like effects (destruction, modification, addition) into aggregate effects before applying them.

  var IAssociative = _.IAssociative,
      ITransientAssociative = mut.ITransientAssociative,
      IMiddleware = $.IMiddleware,
      IDispatch = $.IDispatch,
      IEmptyableCollection = _.IEmptyableCollection,
      ICheckable = vd.ICheckable,
      ICollection = _.ICollection,
      ITransientCollection = mut.ITransientCollection,
      IReduce = _.IReduce,
      IAppendable = _.IAppendable,
      IPrependable = _.IPrependable,
      ISubscribe = _.ISubscribe,
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

  var emptyCard = card();

  function parseBoolean(val){
    return _.isBoolean(val) ? val : val == 1;
  }

  function parseCalculated(val){ //TODO test
    var type  = _.just(this.meta.SchemaXml, _.reFind(/ResultType="([^"]+)"/i, _), _.get(_, 1)),
        parse = _.get(parsers, type, _.identity);
    return _.maybe(val, _.blot, parse);
  }

  var parsers = {
    //"DateTime": dates.parseDateTime,
    "Boolean": parseBoolean,
    "Number": parseFloat,
    "Integer": parseInt,
    "Guid": _.guid
  }

  var IPossession = _.protocol({
    owner: null
  });

  var IEntitySelector = _.protocol({
    select: null,
    deselect: null
  });

  var IIntention = _.protocol({
    command: null //returns the serialization-friendly command object which upon execution is capable of realizing the intention
  });

  var IStore = _.protocol({
    commit: null
  });

  var IIdentifiable = _.protocol({
    identifier: null //machine-friendly identifier offering reasonable uniqueness within a context
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

  var IView = _.protocol({
    render: null
  });

  var IWorkspace = _.protocol({
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
    IView: IView,
    IMiddleware: IMiddleware,
    IWorkspace: IWorkspace
  }

  function Resource(url){
    this.url = url;
  }

  function resource(url){
    return new Resource(url);
  }

  (function(){

    function query(self, qs){
      return _.fmap(fetch(self.url + (qs || ""), {headers: {
        "Accept": "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose"
      }, credentials: "same-origin"}), function(resp){
        return resp.json();
      }, _.coalesce(_.getIn(_, ["d", "results"]), _.getIn(_, ["d"])));
    }

    _.doto(Resource,
      _.implement(IQueryable, {query: query}));

  })();


  function Resources(urls){
    this.urls = urls;
  }

  function resources(urls){
    return new Resources(urls);
  }

  (function(){

    function query(self, qs){
      function retrieve(urls){
        return _.fmap(fetch(_.first(urls) + (qs || ""), {
          headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose"
          },
          credentials: "same-origin"
        }), function(resp){
          return resp.json();
        }, _.coalesce(_.getIn(_, ["d", "results"]), _.getIn(_, ["d"])), function(items){
          return _.seq(_.rest(urls)) ? _.fmap(retrieve(_.rest(urls)), function(xs){
            return _.toArray(_.concat(items, xs));
          }) : items;
        });
      }
      return retrieve(self.urls);
    }

    _.doto(Resources,
      _.implement(IQueryable, {query: query}));

  })();


  var lists = resources([
    location.origin + "/_api/web/lists",
    context.webAbsoluteUrl + "/_api/web/lists"
  ]);

  var vbehave = (function(){

    function deref(self){
      return self.value;
    }

    function constraints(self){
      return self.field.constraints;
    }

    function fmap(self, f){
      return new self.constructor(f(self.value), self.field);
    }

    return _.does(
      _.implement(IFunctor, {fmap: fmap}),
      _.implement(IConstrained, {constraints: constraints}),
      _.implement(IDeref, {deref: deref}));

  })();

  var cbehave = (function(){

    //TODO init

    function reduce(self, xf, init){
      var memo = init,
          ys = self;
      while(ISeqable.seq(ys)){
        var y = _.deref(_.first(ys));
        memo = xf(memo, y);
        ys = _.rest(ys);
      }
      return memo;
    }

    function first(self){
      return ISeq.first(self.values);
    }

    function rest(self){
      return ISeq.rest(self.values);
    }

    function next(self){
      return INext.next(self.values);
    }

    function count(self){
      return ICounted.count(self.values);
    }

    function conj(self, value){
      return self.field.create(_.conj(_.deref(self), value));
    }

    function includes(self, value){
      return _.detect(_.eq(value, _), self.values);
    }

    function equiv(self, other){
      return self === other; //TODO self.constructor === other.constructor && _.every()
    }

    function nth(self, idx){
      return IIndexed.nth(self.values, idx);
    }

    function assoc(self, idx, value){
      return new self.constructor(IAssociative.assoc(self.values, idx, value), self.field.blank, self.field)
    }

    function contains(self, idx){
      return IAssociative.contains(self.values, idx);
    }

    function seq(self){
      return ISeqable.seq(self.values) ? self : null;
    }

    function empty(self){
      return new self.constructor(self.field.blank, self.field);
    }

    function cardinality(self){
      return card(self.field.meta.Required ? 1 : 0);
    }

    function deref(self){
      return _.mapa(_.deref, self.values);
    }

    function constraints(self){
      return vd.optional(self.field.meta.StaticName, vd.and(ICardinality.cardinality(self), _.maybe(self.field.constraints, vd.collOf)));  //TODO demeter?
    }

    return _.does(
      _.implement(IEmptyableCollection, {empty: empty}),
      _.implement(IConstrained, {constraints: constraints}),
      _.implement(ILookup, {lookup: nth}),
      _.implement(IAssociative, {assoc: assoc, contains: contains}),
      _.implement(IDeref, {deref: deref}),
      _.implement(ICounted, {count: count}),
      _.implement(IReduce, {reduce: reduce}),
      _.implement(ICardinality, {cardinality: cardinality}),
      _.implement(ISeq, {first: first, rest: rest}),
      _.implement(INext, {next: next}),
      _.implement(IEquiv, {equiv: equiv}),
      _.implement(IInclusive, {includes: includes}),
      _.implement(ICollection, {conj: conj}),
      _.implement(IIndexed, {nth: nth}),
      _.implement(ISeqable, {seq: seq}));

  })();

  function SharePointMultiValue(values, field){
    this.values = values;
    this.field = field;
  }

  var defaults = _.merge({
    parse: _.identity,
    qual: _.array
  }, _);

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

  function betweenConstraint(meta){
    return meta.MinimumValue ? vd.between(meta.MinimumValue, meta.MaximumValue) : null;
  }

  function emailConstraint(meta){
    return _.test(/e[-]?mail/i, meta.StaticName) ? ck.email : null;
  }

  function choiceConstraint(meta){
    return _.maybe(meta, _.getIn(_, ["Choices", "results"]), ck.choice);
  }

  function getConstraints(meta){
    return _.just(meta,
      _.juxt(emailConstraint, choiceConstraint, betweenConstraint),
      _.compact,
      _.seq,
      _.apply(vd.and, _),
      _.constructs(DerefCheck));
  }

  function multi(Type, opts){
    var options = defaults(opts);
    return function(meta){
      var path = options.qual(meta.StaticName);
      var field = new SharePointField(meta, Type, create, _.deref, create, [], path, getConstraints(meta));

      function create(values){
        return new SharePointMultiValue(_.mapa(function(value){
          return new Type(options.parse(value), field);
        }, values), field);
      }

      return field;
    }
  }

  function ConstrainedCollection(cardinality, max, constraints, values){
    this.cardinality = cardinality;
    this.max = max;
    this.constraints = constraints;
    this.values = values;
  }

  (function(){

    //TODO eliminate field for type

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

    function first(self){
      return ISeq.first(self.values);
    }

    function rest(self){
      return ISeq.rest(self.values);
    }

    var next = _.comp(seq, rest);

    function count(self){
      return ICounted.count(self.values);
    }

    function conj(self, value){
      var values = _.conj(self.values, value);
      return new self.constructor(self.cardinality, self.max, self.constraints, _.drop(_.max(ICounted.count(values) - self.max, 0), values));
    }

    function includes(self, value){
      return _.detect(_.eq(value, _), self.values);
    }

    function equiv(self, other){
      return self === other; //TODO self.constructor === other.constructor && _.every()
    }

    function nth(self, idx){
      return IIndexed.nth(self.values, idx);
    }

    function assoc(self, idx, value){
      return new self.constructor(self.cardinality, self.max, self.constraints, IAssociative.assoc(self.values, idx, value));
    }

    function contains(self, idx){
      return IAssociative.contains(self.values, idx);
    }

    function seq(self){
      return ISeqable.seq(self.values) ? self : null;
    }

    function empty(self){
      return new self.constructor(self.cardinality, self.max, self.constraints, IEmptyableCollection.empty(self.values));
    }

    function cardinality(self){
      return self.cardinality;
    }

    function deref(self){
      return self.values;
    }

    function constraints1(self){
      return vd.and(self.cardinality, _.maybe(self.constraints, vd.collOf));
    }

    function constraints2(self, constraints){
      return new self.constructor(self.cardinality, self.max, constraints, self.values);
    }

    var constraints = _.overload(null, constraints1, constraints2);

    _.doto(ConstrainedCollection,
      _.implement(IEmptyableCollection, {empty: empty}),
      _.implement(IConstrained, {constraints: constraints}),
      _.implement(ILookup, {lookup: nth}),
      _.implement(IAssociative, {assoc: assoc, contains: contains}),
      _.implement(IDeref, {deref: deref}),
      _.implement(ICounted, {count: count}),
      _.implement(IReduce, {reduce: reduce}),
      _.implement(ICardinality, {cardinality: cardinality}),
      _.implement(ISeq, {first: first, rest: rest}),
      _.implement(INext, {next: next}),
      _.implement(IEquiv, {equiv: equiv}),
      _.implement(IInclusive, {includes: includes}),
      _.implement(ICollection, {conj: conj}),
      _.implement(IIndexed, {nth: nth}),
      _.implement(ISeqable, {seq: seq}));

  })();

  var constrainedCollection = _.fnil(_.constructs(ConstrainedCollection), card(0, 1), 1, [], []),
      optional = constrainedCollection(card(0, 1), 1),
      required = constrainedCollection(card(1, 1), 1),
      unlimited = constrainedCollection(card(0, Infinity), Infinity);

  function SharePointValue(values, field){
    this.values = values;
    this.field = field;
  }

  _.each(cbehave, [
    SharePointMultiValue,
    SharePointValue
  ]);

  function uni(Type, opts){
    var options = defaults(opts);
    return function(meta){
      var path = options.qual(meta.StaticName);
      var field = new SharePointField(meta, Type, cast, _.comp(_.first, _.deref), create, [], path, getConstraints(meta));

      function cast(value){
        return create(_.isSome(value) ? [value] : []);
      }

      function create(values){
        return new SharePointValue(_.mapa(function(value){
          return new Type(options.parse(value), field);
        }, _.drop(_.max(ICounted.count(values) - 1, 0), values)), field);
      }

      return field;
    }
  }

  function SharePointField(meta, type, cast, uncast, create, blank, path, constraints){
    this.meta = meta;
    this.type = type;
    this.cast = cast;
    this.uncast = uncast;
    this.create = create;
    this.blank = blank;
    this.path = path;
    this.constraints = constraints;
  }

  (function(){

    function aget(self, entity){
      return self.cast(_.getIn(entity.attrs, self.path));
    }

    function aset(self, entity, values){
      if (self.meta.ReadOnlyField) {
        throw new Error("Cannot set readonly field '" + self.meta.StaticName + "'.");
      }
      //TODO handle dissoc if no values
      return new entity.constructor(entity.list, _.assocIn(entity.attrs, self.path, self.uncast(values)));
    }

    function init(self){
      return _.maybe(self.meta.DefaultValue, _.blot, self.cast);
    }

    function cardinality(self){ //TODO does not perhaps belong here but on SharePointValue/SharePointMultiValue.
      return card(self.meta.Required ? 1 : 0, 1);
    }

    function title(self){
      return self.meta.Title;
    }

    function constraints(self){
      return self.constraints;
    }

    _.doto(SharePointField,
      _.implement(ISubject, {title: title}),
      _.implement(IField, {aget: aget, aset: aset, init: init}),
      _.implement(IConstrained, {constraints: constraints}),
      _.implement(ICardinality, {cardinality: cardinality}));

  })();

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

  var field = (function(){

    //TODO create the `items` function responsible for returning entities of a given type (e.g. SharePointListItem)

    function pk(key){
      return [key + "Id"];
    }

    function pks(key){
      return [key + "Id", "results"];
    }

    function vals(key){
      return [key, "results"];
    }

    function SharePointText(value, field){
      this.value = value;
      this.field = field;
    }

    function SharePointNote(value, field){
      this.value = value;
      this.field = field;
    }

    function SharePointGuid(value, field){
      this.value = value;
      this.field = field;
    }

    function SharePointURL(value, field){
      this.value = value;
      this.field = field;
    }

    function SharePointComputed(value, field){
      this.value = value;
      this.field = field;
    }

    function SharePointCalculated(value, field){
      this.value = value;
      this.field = field;
    }

    function SharePointBoolean(value, field){
      this.value = value;
      this.field = field;
    }

    function SharePointInteger(value, field){
      this.value = value;
      this.field = field;
    }

    function SharePointDateTime(value, field){
      this.value = value;
      this.field = field;
    }

    function SharePointChoice(value, field){
      this.value = value;
      this.field = field;
    }

    function SharePointLookup(value, field){
      this.value = value;
      this.field = field;
    }

    function SharePointUser(value, field){
      this.value = value;
      this.field = field;
    }

    _.each(vbehave, [
      SharePointText,
      SharePointNote,
      SharePointGuid,
      SharePointURL,
      SharePointComputed,
      SharePointCalculated,
      SharePointBoolean,
      SharePointInteger,
      SharePointDateTime,
      SharePointChoice,
      SharePointLookup,
      SharePointUser
    ]);

    var fields = {
      "Text": uni(SharePointText),
      "Note": uni(SharePointNote),
      "Guid": uni(SharePointGuid, {parse: _.guid}),
      "URL": uni(SharePointURL),
      "Computed": uni(SharePointComputed),
      "Calculated": uni(SharePointCalculated, {parse: parseCalculated}),
      "Boolean": uni(SharePointBoolean, {parse: parseBoolean}),
      "Integer": uni(SharePointInteger, {parse: parseInt}),
      "DateTime": uni(SharePointDateTime, {parse: _.identity}), //TODO dates.parseDateTime
      "Choice": uni(SharePointChoice),
      "MultiChoice": multi(SharePointChoice, {qual: vals}),
      "Lookup": uni(SharePointLookup, {qual: pk, parse: parseInt}),
      "LookupMulti": multi(SharePointLookup, {qual: pks, parse: parseInt}),
      "User": uni(SharePointUser, {qual: pk, parse: parseInt}),
      "UserMulti": multi(SharePointUser, {qual: pks, parse: parseInt})
    }

    return function field(meta){ //TODO on no meta return a virtual field
      var f = _.get(fields, meta.TypeAsString, fields.Text);
      return f(meta);
    }

  })();

  function fields(metas){
    return _.reduce(function(memo, meta){
      memo[meta.StaticName] = field(meta);
      return memo;
    }, {}, metas);
  }

  function SharePointList(meta, fields, title){
    this.meta = meta;
    this.fields = fields;
    this.title = title;
  }

  (function(){

    var make = spli;

    function query(self, qs){
      return _.fmap(IQueryable.query(resource(self.meta.__metadata.uri + "/items"), qs), _.mapa(_.partial(make, self), _));
    }

    function title(self){
      return self.meta.Title;
    }

    function identifier(self){
      return self.meta.ListItemEntityTypeFullName;
    }

    function field(self, key){
      return self.fields[key];
    }

    function keys(self){
      return _.keys(self.fields);
    }

    function commit(self, txn){  //TODO implement, how to determine success if a command has no return value? callback?
      _.log('commit', self, txn);
    }

    _.doto(SharePointList,
      _.implement(IKind, {field: field}),
      _.implement(ISubject, {title: title}),
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IMap, {keys: keys}),
      _.implement(IQueryable, {query: query}),
      _.implement(IFactory, {make: make}),
      _.implement(IStore, {commit: commit}));

  })();

  var Item = (function(){

    function Item(bin, attrs){
      this.bin = bin;
      this.attrs = attrs;
    }

    function identifier(self){
      return IKind.field(self, "ContentType").meta.Scope;
    }

    function eid(self){
      return self.attrs.id;
    }

    function title(self){
      return _.get(self, self.bin.title, null);
    }

    function field(self, key){
      return IKind.field(self.bin, key);
    }

    function kind(self){
      return self.bin.identifier;
    }

    //RULE expose attribute universally as a set of values.
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
      return _.keys(self.bin);
    }

    return _.doto(Item,
      _.implement(IMultiDictionary, {}),
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IEntity, {eid: eid}),
      _.implement(ISubject, {title: title}),
      _.implement(IMap, {keys: keys, dissoc: dissoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IAssociative, {assoc: assoc, contains: contains}),
      _.implement(IKind, {field: field, kind: kind}));

  })();

  var ReadOnlyBinField = (function(){

    function ReadOnlyBinField(field){
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

    return _.doto(ReadOnlyBinField,
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IField, {aget: aget, aset: aset, init: init}));

  })();

  var readOnlyBinField = _.constructs(ReadOnlyBinField);

  var DefaultedBinField = (function(){

    function DefaultedBinField(field, init){
      this.field = field;
      this.init = init;
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

    return _.doto(DefaultedBinField,
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IField, {aget: aget, aset: aset, init: init}));

  })();

  var defaultedBinField = _.fnil(_.constructs(DefaultedBinField), null, _.array);

  var BinField = (function(){

    function BinField(key, emptyColl){
      this.key = key;
      this.emptyColl = emptyColl;
    }

    function aget(self, entity){
      return _.into(self.emptyColl, _.array(_.get(entity.attrs, self.key)));
    }

    function aset(self, entity, values){
      return new entity.constructor(entity.bin, _.assoc(entity.attrs, self.key, _.last(_.into(self.emptyColl, values))));
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
      return new entity.constructor(entity.bin, _.assoc(entity.attrs, self.key, _.deref(_.into(self.emptyColl, values))));
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

  var LabeledBinField = (function(){

    function LabeledBinField(label, field){
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

    return _.doto(LabeledBinField,
      _.implement(ISubject, {title: title}),
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IField, {aget: aget, aset: aset, init: init}));

  })();

  var labeledBinField = _.constructs(LabeledBinField);

  var Bin = (function(){

    function Bin(fields, items, title, identifier){
      this.fields = fields;
      this.items = items;
      this.title = title;
      this.identifier = identifier;
    }

    function make(self, attrs){
      return attrs ? new Item(self, attrs) : _.reduce(function(memo, key){
        var fld = field(self, key);
        return IField.aset(fld, memo, IField.init(fld));
      }, new Item(self, {}), _.keys(self.fields));
    }

    function title(self){
      return self.title;
    }

    function identifier(self){
      return self.identifier;
    }

    function field(self, key){
      return _.get(self.fields, key);
    }

    function query(self, plan){
      return Promise.resolve(self.items); //TODO no plan!
    }

    function keys(self){
      return _.keys(self.fields);
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

  var bin = _.constructs(Bin);

  var tasks = (function(){

    return _.doto(new Bin({
      "id": labeledBinField("ID", defaultedBinField(binField("id", required), _.comp(_.array, _.guid))),
      "summary": labeledBinField("Summary", binField("summary", required)),
      "priority": labeledBinField("Priority", defaultedBinField(binField("priority", optional), _.constantly(["C"]))),
      "detail": labeledBinField("Detail", binField("detail", optional)),
      "due": labeledBinField("Due Date", binField("due", optional)),
      "assignee": labeledBinField("Assignee", binField("assignee", optional)),
      "subtasks": labeledBinField("Subtasks", multiBinField("subtasks"))
    }, [], "Tasks", "tasks"), function(bin){

      _.each(function(attrs){
        bin.items.push(attrs);
      }, _.map(function(attrs){
        return IFactory.make(bin, attrs);
      }, [{
        id: _.guid("a"),
        summary: "Build backyard patio",
        subtasks: [_.guid("b"), _.guid("c")]
      },{
        id: _.guid("b"),
        summary: "Choose 3 potential materials and price them"
      },{
        id: _.guid("c"),
        summary: "Get contractor quote"
      }]));

    });

  })();

  function Domain(repos){
    this.repos = repos;
  }

  var _domain = new Domain({});
  var domain0 = _.constantly(_domain);

  function domain1(repos){
    return _.reduce(_.conj, _domain, repos);
  }

  var domain = _.overload(domain0, domain1);

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
      return IFactory.make(_.get(self.repos, _.get(options, "$type")), _.dissoc(options, "$type"));
    }

    function conj(self, repo){
      return new Domain(_.assoc(self.repos, IIdentifiable.identifier(repo), repo));
    }

    function resolve(self, refs){ //TODO implement
    }

    _.doto(Domain,
      _.implement(IResolver, {resolve: resolve}),
      _.implement(ICollection, {conj: conj}),
      _.implement(IEmptyableCollection, {empty: domain0}),
      _.implement(IPossession, {owner: owner}),
      _.implement(IFactory, {make: make}),
      _.implement(IQueryable, {query: query}),
      _.implement(IStore, {commit: commit}));

  })();

  function SharePointListItem(list, attrs){
    this.list = list;
    this.attrs = attrs;
  }

  function spli(list, attrs){
    return new SharePointListItem(list, _.merge({__metadata: {type: IIdentifiable.identifier(list)}, GUID: _.str(attrs.guid || _.guid())}, attrs));
  }

  (function(){

    function identifier(self){
      return IKind.field(self, "ContentType").meta.Scope;
    }

    function eid(self){
      return _.maybe(self, _.get(_, "GUID"), _.first, _.deref);
    }

    function title(self){
      return _.get(self, self.list.title, null);
    }

    function field(self, key){
      return IKind.field(self.list, key);
    }

    function kind(self){
      return self.attrs.__metadata.type;
    }

    //RULE expose attribute universally as a set of values.
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
      return _.keys(self.list);
    }

    _.doto(SharePointListItem,
      _.implement(IMultiDictionary, {}),
      _.implement(IIdentifiable, {identifier: identifier}),
      _.implement(IEntity, {eid: eid}),
      _.implement(ISubject, {title: title}),
      _.implement(IMap, {keys: keys, dissoc: dissoc}),
      _.implement(ILookup, {lookup: lookup}),
      _.implement(IAssociative, {assoc: assoc, contains: contains}),
      _.implement(IKind, {field: field, kind: kind}));

  })()

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
        return _.eq(before, after) ? null : modification(before, after);
      } else if (before) {
        return destruction(before);
      } else if (after) {
        return addition(after);
      } else {
        return null;
      }
    }

    function commands(self){
      return _.just(self.changed,
        _.keys,
        _.map(function(id){
          return changed(_.get(self.loaded, id), _.get(self.changed, id));
        }, _),
        _.compact);
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

    //RULE querying and filtering are inherently different as filters process all items and don't utilize indexes for performance

    _.doto(EntityCatalog,
      _.implement(IResolver, {resolve: resolve}),
      _.implement(IIndexed, {nth: nth}),
      _.implement(IEntity, {eid: eid}),
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

  function entityCatalog(loaded, changed, touched){
    return new EntityCatalog(_.guid(), loaded, changed, touched);
  }

  var _buffer = entityCatalog({}, {});

  function buffer(){
    return _buffer;
  }

  function TypedEntityCatalog(buffer, types){
    this.buffer = buffer;
    this.types = types;
  }

  function typedCatalog2(buffer, types){
    return new TypedEntityCatalog(buffer, types);
  }

  function typedCatalog1(buffer){
    return typedCatalog2(buffer, {});
  }

  function typedCatalog0(){
    return typedCatalog1(buffer());
  }

  var typedCatalog = _.overload(typedCatalog0, typedCatalog1, typedCatalog2);

  (function(){

    function query(self, options){
      return _.maybe(_.get(self.types, _.get(options, "$type")), IQueryable.query);
    }

    function load(self, entities){
      return typedCatalog(IWorkspace.load(self.buffer, entities), _.reducekv(function(memo, key, value){
        return _.update(memo, key, function(b){
          return IWorkspace.load(b || buffer(), value);
        });
      }, self.types, _.groupBy(function(entity){
        return IKind.kind(entity);
      }, entities)));
    }

    function add(self, entities){
      return typedCatalog(IWorkspace.add(self.buffer, entities), _.reducekv(function(memo, key, value){
        return _.update(memo, key, function(b){
          return IWorkspace.add(b || buffer(), value);
        });
      }, self.types,  _.groupBy(function(entity){
        return IKind.kind(entity);
      }, entities)));
    }

    function edit(self, entities){
      return typedCatalog(IWorkspace.edit(self.buffer, entities), _.reducekv(function(memo, key, value){
        return _.update(memo, key, function(b){
          return IWorkspace.edit(b || buffer(), value);
        });
      }, self.types, _.groupBy(function(entity){
        return entity.attrs.__metadata.type;
      }, entities)));
    }

    function destroy(self, entities){
      return typedCatalog(IWorkspace.destroy(self.buffer, entities), _.reducekv(function(memo, key, value){
        return _.update(memo, key, function(b){
          return IWorkspace.destroy(b || buffer(), value);
        });
      }, self.types, _.groupBy(function(entity){
        return entity.attrs.__metadata.type;
      }, entities)));
    }

    function dirty(self, entity){
      return IWorkspace.dirty(self.buffer, entity);
    }

    function changes(self){
      return IWorkspace.changes(self.buffer);
    }

    function includes(self, entity){
      return IInclusive.includes(self.buffer, entity);
    }

    function first(self){
      return ISeq.first(self.buffer);
    }

    function rest(self){
      return ISeq.rest(self.buffer);
    }

    function next(self){
      return INext.next(self.buffer);
    }

    function seq(self){
      return ISeqable.seq(self.buffer);
    }

    function lookup(self, guid){
      return ILookup.lookup(self.buffer, guid);
    }

    function reduce(self, xf, init){
      return IReduce.reduce(self.buffer, xf, init);
    }

    function dissoc(self, guid){
    }

    function keys(self){
      return IMap.keys(self.buffer);
    }

    function count(self){
      return ICount.count(self.buffer);
    }

    function vals(self){
      return IMap.vals(self.buffer);
    }

    function contains(self, guid){
      return IAssociative.contains(self.buffer, guid);
    }

    function eid(self){
      return IEntity.eid(self.buffer);
    }

    function commands(self){
      return ITransaction.commands(self.buffer);
    }

    function resolve(self, refs){
      return _.mapa(function(ref){
        var buffer = IQueryable.query(self, {$type: ref.field.meta.List.ListItemEntityTypeFullName}); //TODO demeter
        return _.detect(function(entity){
          return entity.attrs.Id === ref.value;
        }, buffer);
      }, refs);
    }

    _.doto(TypedEntityCatalog,
      _.implement(IEntity, {eid: eid}),
      _.implement(IResolver, {resolve: resolve}),
      _.implement(IQueryable, {query: query}),
      _.implement(ITransaction, {commands: commands}),
      _.implement(IWorkspace, {dirty: dirty, load: load, add: add, edit: edit, destroy: destroy, changes: changes}),
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

  function list(identifier){
    return _.fmap(IQueryable.query(ents.lists, ""), function(lsts){
      var meta = _.detect(_.matches(_, {ListItemEntityTypeFullName: identifier}), lsts),
          ilists = _.index(_.get(_, "Id"), _.identity, lsts);
      return _.fmap(IQueryable.query(resource(meta.__metadata.uri), "/fields"), _.mapa(function(fld){
        return fld.LookupList ? _.merge(fld, {List: _.get(ilists, _.replace(fld.LookupList, /[{}]/g, ""))}) : fld;
      }, _), fields, function(fields){
        return new SharePointList(meta, fields, "Title");
      });
    });
  }

  function add(options){
    return function(buffer){
      var id = seed();
      var item = ents.make(options.$domain, _.merge({ID: id, Id: id}, options));
      return ents.add(buffer, _.cons(item));
    }
  }

  function edit(options){
    return function(buffer){
      var items = ents.query(buffer, {$type: options.$type});
      return ents.edit(buffer,
        _.just(items,
          _.nth(_, options.idx),
          options.effect,
          _.cons));
    }
  }

  function destroy(options){
    return function(buffer){
      var items = ents.query(buffer, {$type: options.$type});
      return ents.destroy(buffer, _.cons(_.nth(items, options.idx)))
    }
  }

  function Bus(middlewares){
    this.middlewares = middlewares;
  }

  var bus1 = _.constructs(Bus);
  var bus = _.overload(_.comp(bus1, _.array), bus1);

  (function(){

    function conj(self, middleware){
      self.middlewares = _.conj(self.middlewares, middleware);
    }

    function dispatch(self, message){
      var f = _.reduce(function(memo, middleware){
        return $.handle(middleware, _, memo);
      }, _.noop, _.reverse(self.middlewares));
      f(message);
    }

    return _.doto(Bus,
      _.implement(ITransientCollection, {conj: conj}),
      _.implement(IDispatch, {dispatch: dispatch}));

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

  function LoadHandler(subject, provider){
    this.subject = subject;
    this.provider = provider;
  }

  var loadHandler = _.constructs(LoadHandler);

  (function(){

    function handle(self, command, next){
      ents.load(self.subject, command.entities);
      $.raise(self.provider, loadedEvent(command.entities));
      return next(command);
    }

    return _.doto(LoadHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function NullHandler(){
  }

  var nullHandler = new NullHandler();

  (function(){

    function handle(self, message, next){
      return next(message);
    }

    return _.doto(NullHandler,
      _.implement(IMiddleware, {handle: handle}));

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

  function QueryHandler(subject, provider){
    this.subject = subject;
    this.provider = provider;
  }

  var queryHandler = _.constructs(QueryHandler);

  (function(){

    function handle(self, command, next){
      return _.fmap(ents.query(self.subject, command.plan), function(entities){
        $.raise(self.provider, queriedEvent(entities));
        return next(command);
      });
    }

    return _.doto(QueryHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function QueriedHandler(subject, commandBus){
    this.subject = subject;
    this.commandBus = commandBus;
  }

  var queriedHandler = _.constructs(QueriedHandler);

  (function(){

    function handle(self, event, next){
      $.dispatch(self.commandBus, loadCommand(event.entities));
      return next(event);
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

  function SelectHandler(subject, provider){
    this.subject = subject;
    this.provider = provider;
  }

  var selectHandler = _.constructs(SelectHandler);

  (function(){

    function handle(self, command, next){
      ents.select(self.subject, command.id);
      $.raise(self.provider, selectedEvent(command.id));
      return next(command);
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

  function DeselectHandler(subject, provider){
    this.subject = subject;
    this.provider = provider;
  }

  var deselectHandler = _.constructs(DeselectHandler);

  (function(){

    function handle(self, command, next){
      ents.deselect(self.subject, command.id);
      $.raise(self.provider, deselectedEvent(command.id));
      return next(command);
    }

    return _.doto(DeselectHandler,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function DeselectedHandler(subject){
    this.subject = subject;
  }

  function LockingMiddleware(){
    this.wip = null;
  }

  var lockingMiddleware = _.constructs(LockingMiddleware);

  (function(){

    function handle(self, message, next){
      return (self.wip = _.fmap(Promise.resolve(self.wip), function(result){
        return next(message);
      }));
    }

    return _.doto(LockingMiddleware,
      _.implement(IMiddleware, {handle: handle}));

  })();

  function LoggerMiddleware(label){
    this.label = label;
  }

  var loggerMiddleware = _.constructs(LoggerMiddleware);

  (function(){

    function handle(self, message, next){
      _.log(self.label, message);
      return next(message);
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
      var result = next(command);
      _.each($.dispatch(self.eventBus, _), $.release(self.provider));
      return result;
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
      return next(event);
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
    return handlerMiddleware2(identify, nullHandler);
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
      var handler = _.get(self.handlers, self.identify(message), self.fallback),
          result  = $.handle(handler, message);
      next(message);
      return result;
    }

    return _.doto(HandlerMiddleware,
      _.implement(ITransientAssociative, {assoc: assoc}),
      _.implement(IMiddleware, {handle: handle}));

  })();

  //TODO add `expanded` model state to track which entities are open.
  //TODO a component is an aggregate root that fully manages its dependencies and avoids coordinating subcomponents.
  //NOTE the reusable part of the view would potentially involve making the full render and patch operations pure.
  //NOTE the beauty of React is that view functions are pure, return a representation of the dom, and can be composed.  This approach emphasizes custom and optimized diffing/patching based on before/after snapshot of the model.  Once in an effectful context, it becomes hard to benefit from the reuse of pure commands (commands as queries).
  //NOTE a concern with delegating to subcomponents was managing their creation/destruction
  //NOTE assign guid as `data-key` and realize that the same entity could appear in multiple places of an outline.
  //NOTE a view is capable of returning a seq of all possible `IView.interactions` each implementing `IIdentifiable` and `ISubject`.
  //NOTE an interaction is a persistent, validatable object with field schema.  It will be flagged as command or query which will help with processing esp. pipelining.  When successfully validated it has all that it needs to be handled by the handler.  That it can be introspected allows for the UI to help will completing them.
  function Outline(domain, $catalog, $model, $cbus, $ebus, options){
    this.domain = domain;
    this.$catalog = $catalog;
    this.$model = $model;
    this.$cbus = $cbus;
    this.$ebus = $ebus;
    this.options = options;
  }

  function outline($domain, $catalog, options){ //e.g. options -> {root: guid}
    var $model = $.cell({selected: options.selected || imm.set()}),
        $ebus = bus(),
        $cbus = bus(),
        $events = $.events(),
        $outline = new Outline($domain, $catalog, $model, $cbus, $ebus, options);

    _.doto($ebus,
      mut.conj(_,
        loggerMiddleware("event"),
        _.doto(handlerMiddleware(),
          mut.assoc(_, "queried", queriedHandler($outline, $cbus)))));

    _.doto($cbus,
      mut.conj(_,
        loggerMiddleware("command"),
        lockingMiddleware(),
        _.doto(handlerMiddleware(),
          mut.assoc(_, "load", loadHandler($outline, $events)),
          mut.assoc(_, "query", queryHandler($outline, $events)),
          mut.assoc(_, "select", selectHandler($outline, $events)),
          mut.assoc(_, "deselect", deselectHandler($outline, $events))),
        drainEventsMiddleware($events, $ebus)));

    return $outline;
  }

  //RULE it must be possible to interact with a component even if it never gets mounted.
  (function(){
    //RULE a component delegates events once on mount and avoids having to continually add/remove listeners.
    function render(self, el){
      _.log("render", self, el);
      //TODO implement
    }

    function load(self, entities){
      _.swap(self.$catalog, ents.load(_, entities));
    }

    function query(self, plan){ //NOTE cmd because it eventually (in `load`) mutates state
      return ents.query(self.domain, plan);
    }

    //TODO commands must return a promise when the outcome of an async opertion is needed.
    function select(self, guid){
      //currently implemented as an event because it is accepted outright
      //TODO implement command validation/rejection model
      _.swap(self.$model,
        _.update(_, "selected",
          _.conj(_, _.str(guid))));
    }

    function deselect(self, guid){
      _.swap(self.$model,
        _.update(_, "selected",
          _.disj(_, _.str(guid))));
    }

    function dispatch(self, command){
      IDispatch.dispatch(self.$cbus, command);
    }

    return _.doto(Outline,
      _.implement(IDispatch, {dispatch: dispatch}),
      _.implement(IQueryable, {query: query}),
      _.implement(IWorkspace, {load: load}),
      _.implement(IEntitySelector, {select: select, deselect: deselect}),
      _.implement(IView, {render: render}));

  })();

  var configs = {
    a: {
      lists: [
        "SP.Data.ThreeMemberPanelAssignmentsListItem",
        "SP.Data.UserInfoItem"
      ],
      ops: function($domain){
        return _.pipe(
          destroy({$type: "SP.Data.ThreeMemberPanelAssignmentsListItem", idx: 2}),
          destroy({$type: "SP.Data.ThreeMemberPanelAssignmentsListItem", idx: 3}),
          edit({$type: "SP.Data.ThreeMemberPanelAssignmentsListItem", idx: 1, effect: ents.assert(_, "Case_x0020_Number", "Foo")}),
          edit({$type: "SP.Data.ThreeMemberPanelAssignmentsListItem", idx: 2, effect: _.pipe(ents.assert(_, "Title", "Bar"), ents.assert(_, "Panel_x0020_Members", 99), ents.assert(_, "Panel_x0020_Chair", 100))}),
          add({$type: "SP.Data.ThreeMemberPanelAssignmentsListItem", $domain: $domain}),
          add({$type: "SP.Data.ThreeMemberPanelAssignmentsListItem", $domain: $domain}));
      }
    },
    b: {
      lists: [
        "SP.Data.TasksListItem",
        "SP.Data.UserInfoItem"
      ],
      ops: function($domain){
        return add({$type: "SP.Data.TasksListItem", $domain: $domain, Title: "Buy milk"});
      }
    }
  }

  function run0(){
    return run1(configs[GetUrlKeyValue("usecase") || "b"]);
  }

  function run1(options){
    _.fmap(Promise.all(_.mapa(ents.list, options.lists)), ents.domain, function(domain){

      var $ents  = $.cell(ents.typedCatalog()),
          $items = $.map(ents.query(_, {$type: _.first(options.lists)}), $ents);

      _.fmap(Promise.all([
        ents.query(domain, {$type: _.first(options.lists), $top: 5}),
        ents.query(domain, {$type: "SP.Data.UserInfoItem", $top: 10000})
      ]), _.spread(concat), function(xs){
        _.swap($ents, //RULE each mutation should be as comprehensive as possible to minimize the number needed
          _.pipe(
            ents.load(_, xs), options.ops(domain)));
        _.just($ents, _.deref, ents.changes, _.see("txn"), ents.commit(domain, _));
      });

      $.sub($ents, _.see("$ents"));
      $.sub($items, _.see("$items"));

      return {$domain: domain, $ents: $ents, $items: $items};

    }, _.see("exported"), function(exported){
      Object.assign(window, exported);
    });
  }

  var run = _.overload(run0, run1);

  var ents = _.just({
    run: run,
    list: list,
    lists: lists,
    add: add,
    edit: edit,
    destroy: destroy,
    optional: optional,
    required: required,
    unlimited: unlimited,
    loadCommand: loadCommand,
    queryCommand: queryCommand,
    selectCommand: selectCommand,
    deselectCommand: deselectCommand,
    resource: resource,
    resources: resources,
    entityCatalog: entityCatalog,
    typedCatalog: typedCatalog,
    domain: domain,
    assert: assert,
    retract: retract,
    asserts: asserts
  }, _.merge(_, protocols), _.reduce(_.merge, _, _.map(function(protocol){
    return _.reduce(function(memo, key){
      return _.assoc(memo, key, protocol[key]);
    }, {}, Object.keys(protocol));
  }, _.vals(protocols))), _.impart(_, _.partly));

  var domain = ents.domain([tasks]),
      $catalog = $.cell(ents.typedCatalog());

  _.each(function(el){
    var $outline = outline(domain, $catalog, {root: _.guid("a")});
    ents.render($outline, el);
    _.each($.dispatch($outline, _), [
      queryCommand({$type: "tasks"}),
      selectCommand(_.guid("a"))
    ]);
    Object.assign(window, {$outline: $outline});
  }, dom.sel("#outline"));

  return ents;

});

//# sourceURL=ents.js