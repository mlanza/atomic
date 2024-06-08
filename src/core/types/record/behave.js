import {doto, overload, constructs, fold, multi, constantly, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {reduced} from "../reduced/construct.js";
import {is} from "../../protocols/imapentry/concrete.js";
import {map, mapcat, detect, concatenated} from "../lazy-seq.js";
import {maybe} from "../just/construct.js";
import {ITopic, ICloneable, ICoercible, IReducible, IKVReducible, IEquiv, IAssociative, ISeqable, ILookup, ICounted, IMap, ISeq, IEmptyableCollection} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {isObject} from "../object/concrete.js";
import {isArray} from "../array/concrete.js";
import {array} from "../array/construct.js";
import {includes} from "../object/protocols.js";
import * as p from "./protocols.js";
import behave from "../object/behave.js";

function seq(self){
  return p.seq(mapcat(function(key){
    return map(array(key, ?), p.asserts(self, key));
  }, p.keys(self)));
}

function equiv(self, other){
  return self.constructor === other?.constructor && p.count(self) === p.count(other) && p.reducekv(function(memo, key, value){
    return memo ? p.equiv(p.get(other, key), value) : reduced(memo);
  }, true, self);
}

export function construct(Type, attrs){
  return Object.assign(new Type(), attrs);
}

export function emptyable(Type){
  const empty = constantly(new Type());
  implement(IEmptyableCollection, {empty}, Type);
}

export function record(Type){
  function clone(self){
    return Object.assign(new Type(), self);
  }

  function asserts(self, key){
    return maybe(p.get(self, key), array);
  }

  const assert = p.assoc;

  function retract3(self, key, value){
    let copy = self;
    if (p.equiv(p.get(self, key), value)) {
      copy = p.clone(self);
      copy[key] = p.dissoc(self, key);
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
    behave,
    emptyable,
    keying(Type.name),
    implement(ICloneable, {clone}),
    implement(ITopic, {asserts, assert, retract}),
    implement(IEquiv, {equiv}),
    implement(IMap, {dissoc}),
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

export function multirecord(Type, {defaults, multiple} = {defaults: constantly([]), multiple: constantly(true)}){
  const make = record(Type);

  function asserts(self, key){
    return maybe(p.get(self, key), multiple(key) ? identity : array);
  }

  function assert(self, key, value){
    return p.assoc(self, key, multiple(key) ? p.conj(p.get(self, key, defaults(key)), value) : value);
  }

  function retract3(self, key, value){
    let copy = self;
    if (multiple(key)) {
      copy = p.clone(self);
      copy[key] = p.omit(p.get(self, key, defaults(key)), value);
    } else if (p.equiv(p.get(self, key), value)) {
      copy = p.clone(self);
      copy[key] = p.dissoc(self, key);
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
