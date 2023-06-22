import {doto, overload, constructs, fold, multi, constantly, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {reduced} from "../reduced/construct.js";
import {is} from "../../protocols/imapentry/concrete.js";
import {map, mapcat, detect, concatenated} from "../lazy-seq.js";
import {maybe} from "../just/construct.js";
import {ITopic, ICoercible, IReducible, IKVReducible, IEquiv, IAssociative, ISeqable, ILookup, ICounted, IMap, ISeq, IEmptyableCollection} from "../../protocols.js";
import * as p from "./protocols.js";
import {isObject} from "../object/concrete.js";
import {isArray} from "../array/concrete.js";
import {array} from "../array/construct.js";
import {includes} from "../object/protocols.js";

//TODO IHashable

function seq(self){
  return p.seq(mapcat(function(key){
    return map(array(key, ?), p.asserts(self, key));
  }, p.keys(self)));
}

function contains(self, key){
  return self.hasOwnProperty(key);
}

function lookup(self, key){
  return self[key];
}

function count(self){
  return p.count(keys(self));
}

function first(self){
  return p.first(seq(self));
}

function rest(self){
  return p.rest(seq(self));
}

function keys(self){
  return Object.keys(self);
}

function vals(self){
  return Object.values(self);
}

function assoc(self, key, value){
  const copy = p.clone(self);
  copy[key] = value;
  return copy;
}

function equiv(self, other){
  return p.count(self) === p.count(other) && reducekv(self, function(memo, key, value){
    return memo ? p.equiv(p.get(other, key), value) : reduced(memo);
  }, true);
}

function reduce(self, f, init){
  return p.reduce(function(memo, pair){
    return f(memo, pair);
  }, init, seq(self));
}

function reducekv(self, f, init){
  return reduce(self, function(memo, [key, value]){
    return f(memo, key, value);
  }, init);
}

export function construct(Type, attrs){
  return Object.assign(new Type(), attrs);
}

export function emptyable(Type){
  function empty(){
    return new Type();
  }
  implement(IEmptyableCollection, {empty}, Type);
}

function record(Type, defaults){
  function asserts(self, key){
    return maybe(p.get(self, key), array);
  }

  const assert = assoc;

  function retract3(self, key, value){
    let copy = self;
    if (p.equiv(p.get(self, key), value)) {
      copy = p.clone(self);
      copy[key] = dissoc(self, key);
    }
    return copy;
  }

  function dissoc(self, key){
    const copy = p.clone(self);
    delete copy[key];
    return includes(Object.keys(new Type()), key) ? p.coerce(copy, Object) : copy;
  }

  const retract = overload(null, null, p.dissoc, retract3);
  const make = constructs(Type);

  ICoercible.addMethod([Object, Type], make);
  ICoercible.addMethod([Type, Object], attrs => Object.assign({}, attrs));

  doto(Type,
    emptyable,
    implement(ITopic, {asserts, assert, retract}),
    implement(IReducible, {reduce}),
    implement(IKVReducible, {reducekv}),
    implement(IEquiv, {equiv}),
    implement(IAssociative, {assoc, contains}),
    implement(ILookup, {lookup}),
    implement(IMap, {dissoc, keys, vals}),
    implement(ISeq, {first, rest}),
    implement(ICounted, {count}),
    implement(ISeqable, {seq}));

  function from(init){
    if (isObject(init)) {
      return construct(Type, ?);
    } else if (isArray(init)) {
      return fold(function(memo, [key, value]){
        return p.assert(memo, key, value);
      }, construct(Type, {}), ?);
    }
    return make;
  }

  return multi(overload(null, from, constantly(make)));
}

function multirecord(Type, defaults, multiple){
  const make = record(Type, defaults);

  function asserts(self, key){
    return maybe(p.get(self, key), multiple(key) ? identity : array);
  }

  function assert(self, key, value){
    return assoc(self, key, multiple(key) ? p.conj(p.get(self, key, defaults(key)), value) : value);
  }

  function retract3(self, key, value){
    let copy = self;
    if (multiple(key)) {
      copy = p.clone(self);
      copy[key] = p.omit(p.get(self, key, defaults(key)), value);
    } else if (p.equiv(p.get(self, key), value)) {
      copy = p.clone(self);
      copy[key] = dissoc(self, key);
    }
    return copy;
  }

  function dissoc(self, key){
    const copy = p.clone(self);
    delete copy[key];
    return includes(Object.keys(new Type()), key) ? p.coerce(copy, Object) : copy;
  }

  const retract = overload(null, null, p.dissoc, retract3);

  doto(Type,
    implement(ITopic, {asserts, assert, retract}),
    implement(IMap, {dissoc}));

  return make;
}

export default function(Type, options = {defaults: constantly(null)}){
  return options.multiple ? multirecord(Type, options.defaults, options.multiple) : record(Type, options.defaults);
}
