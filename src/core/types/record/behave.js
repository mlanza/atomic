import {doto, overload, constructs, fold, chain, multi, constantly, identity} from "../../core.js";
import {implement} from "../protocol.js";
import {reduced} from "../reduced/construct.js";
import {is} from "../../protocols/imapentry/concrete.js";
import {addMethod} from "../multimethod/concrete.js";
import {map, mapa, mapcat, detect, concatenated} from "../lazy-seq.js";
import {maybe} from "../just/construct.js";
import {ITopic, ICloneable, IReducible, IKVReducible, IEquiv, IAssociative, ISeqable, ILookup, ICounted, IMap, ISeq, IEmptyableCollection} from "../../protocols.js";
import {keying} from "../../protocols/imapentry/concrete.js";
import {isObject} from "../object/concrete.js";
import {isArray} from "../array/concrete.js";
import {array} from "../array/construct.js";
import {includes} from "../object/protocols.js";
import {coerce} from "../../coerce.js";
import * as p from "./protocols.js";
import behave from "../object/behave.js";

function assert1(self){
  return mapcat(p.assert(self, ?), p.keys(self));
}

function seq(self){
  return p.seq(assert1(self));
}

function equiv(self, other){
  if ((self == null && other != null) || (self != null && other == null)) {
    return false;
  }
  return self.constructor === other.constructor && p.count(self) === p.count(other) && p.reducekv(function(memo, key, value){
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

  function assert2(self, key){
    return maybe(p.get(self, key), array, fold(function(memo, value){
      return p.conj(memo, [key, value]);
    }, [], ?));
  }

  const assert = overload(null, assert1, assert2, p.assoc);

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
    return includes(Object.keys(new Type()), key) ? coerce(copy, Object) : copy;
  }

  const retract = overload(null, null, p.dissoc, retract3);
  const make = constructs(Type);

  addMethod(coerce, [Object, Type], make);
  addMethod(coerce, [Type, Object], attrs => Object.assign({}, attrs));

  doto(Type,
    behave,
    emptyable,
    keying(Type.name),
    implement(ICloneable, {clone}),
    implement(ITopic, {assert, retract}),
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

  function assert2(self, key){
    return maybe(p.get(self, key), multiple(key) ? identity : array, fold(function(memo, value){
      return p.conj(memo, [key, value]);
    }, [], ?));
  }

  function assert3(self, key, value){
    return p.assoc(self, key, multiple(key) ? p.conj(p.get(self, key, defaults(key)), value) : value);
  }

  const assert = overload(null, assert1, assert2, assert3);

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
    return includes(Object.keys(new Type()), key) ? coerce(copy, Object) : copy;
  }

  const retract = overload(null, null, p.dissoc, retract3);

  doto(Type,
    implement(ITopic, {assert, retract}),
    implement(IMap, {dissoc}));

  return make;
}
